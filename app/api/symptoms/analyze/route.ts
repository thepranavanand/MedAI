import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function analyzeWithGemini(symptoms: string): Promise<any> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured')
    }
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a medical symptom analyzer. Analyze the following symptoms and provide a structured response in JSON format. 

IMPORTANT: The symptoms may be in any language (English, Hindi, Urdu, etc.). Common translations:
- "pet dard" = stomachache/abdominal pain
- "sar dard" = headache
- "chest pain" = chest pain
- "breathing problem" = respiratory issues

Symptoms: ${symptoms}

Please provide a JSON response with the following structure:
{
  "isEmergency": boolean,
  "emergencyDetails": string (if emergency, otherwise null),
  "analysis": string (detailed analysis with bullet points, each point on a new line starting with "•"),
  "specialties": string[] (recommended medical specialties)
}

Important:
- If symptoms suggest a medical emergency (chest pain, severe bleeding, difficulty breathing, etc.), set isEmergency to true
- Provide a detailed analysis with bullet points (each point on a new line starting with "•") and in the analysis, do not ask the user for more information, and in the last point, suggest the most relevant medical specialization based on the symptoms.
- Recommend 2-3 relevant medical specialties
- Respond ONLY with valid JSON, no additional text`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const responseText = data.candidates[0].content.parts[0].text

    let jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/)
    if (!jsonMatch) {
      jsonMatch = responseText.match(/```\s*([\s\S]*?)\s*```/)
    }

    let jsonString = jsonMatch ? jsonMatch[1] : responseText

    try {
      const parsed = JSON.parse(jsonString)
      
      if (typeof parsed.isEmergency !== 'boolean' || 
          typeof parsed.analysis !== 'string' || 
          !Array.isArray(parsed.specialties)) {
        throw new Error('Invalid response structure')
      }
      
      return parsed
    } catch (parseError) {
      throw new Error('Failed to parse AI response')
    }
  } catch (error) {
    throw error
  }
}

async function analyzeWithFallback(symptoms: string): Promise<any> {
  const emergencyKeywords = ['chest pain', 'heart attack', 'stroke', 'severe bleeding', 'difficulty breathing', 'unconscious', 'seizure', 'cant breathe', 'breathing problem']
  
  const lowerSymptoms = symptoms.toLowerCase()
  const isEmergency = emergencyKeywords.some(keyword => lowerSymptoms.includes(keyword))
  
  let recommendedSpecialties = ['General Medicine']
  let analysis = `• Based on your symptoms: "${symptoms}"\n• This is a preliminary analysis using our local system\n• Please consult with a healthcare professional for proper diagnosis`
  
  if (lowerSymptoms.includes('heart') || lowerSymptoms.includes('chest')) {
    recommendedSpecialties = ['Cardiology']
    analysis = `• Based on your symptoms: "${symptoms}"\n• Chest pain can indicate various conditions from mild to serious\n• Possible causes include heart disease, acid reflux, muscle strain, anxiety\n• The severity, duration, and associated symptoms are crucial for diagnosis\n• Please consult with a healthcare professional immediately`
  } else if (lowerSymptoms.includes('head') || lowerSymptoms.includes('brain') || lowerSymptoms.includes('dard') || lowerSymptoms.includes('sar')) {
    recommendedSpecialties = ['Neurology']
    analysis = `• Based on your symptoms: "${symptoms}"\n• Headaches can range from mild to severe and have various causes\n• Possible causes include tension headaches, migraines, sinus infections, dehydration, eye strain\n• The severity, location, duration, and associated symptoms are crucial for diagnosis\n• Please consult with a healthcare professional for proper diagnosis`
  } else if (lowerSymptoms.includes('stomach') || lowerSymptoms.includes('digestive') || lowerSymptoms.includes('pet') || lowerSymptoms.includes('abdomen')) {
    recommendedSpecialties = ['Gastroenterology']
    analysis = `• Based on your symptoms: "${symptoms}"\n• Abdominal pain can indicate various digestive system issues\n• Possible causes include gastritis, ulcers, IBS, food poisoning, appendicitis\n• The location, severity, duration, and associated symptoms are crucial for diagnosis\n• Please consult with a healthcare professional for proper diagnosis`
  } else if (lowerSymptoms.includes('breathing') || lowerSymptoms.includes('lung') || lowerSymptoms.includes('respiratory') || lowerSymptoms.includes('breathe') || lowerSymptoms.includes('cant breathe')) {
    recommendedSpecialties = ['Pulmonology']
    analysis = `• Based on your symptoms: "${symptoms}"\n• Breathing problems can indicate various respiratory conditions\n• Possible causes include asthma, bronchitis, pneumonia, anxiety, allergies, COPD\n• The severity, duration, and associated symptoms are crucial for diagnosis\n• If severe, please seek immediate medical attention\n• Please consult with a healthcare professional for proper diagnosis`
  } else if (lowerSymptoms.includes('skin') || lowerSymptoms.includes('rash')) {
    recommendedSpecialties = ['Dermatology']
    analysis = `• Based on your symptoms: "${symptoms}"\n• Skin conditions can range from mild irritation to serious infections\n• Possible causes include allergies, infections, autoimmune conditions, contact dermatitis\n• The appearance, location, duration, and associated symptoms are crucial for diagnosis\n• Please consult with a healthcare professional for proper diagnosis`
  } else if (lowerSymptoms.includes('bone') || lowerSymptoms.includes('joint') || lowerSymptoms.includes('muscle')) {
    recommendedSpecialties = ['Orthopedics']
    analysis = `• Based on your symptoms: "${symptoms}"\n• Joint and muscle pain can indicate various musculoskeletal conditions\n• Possible causes include arthritis, injury, overuse, inflammation, nerve compression\n• The location, severity, duration, and associated symptoms are crucial for diagnosis\n• Please consult with a healthcare professional for proper diagnosis`
  }

  return {
    isEmergency,
    emergencyDetails: isEmergency ? 'Please seek immediate medical attention' : null,
    analysis: analysis,
    specialties: recommendedSpecialties,
    isFallback: true
  }
}

async function analyzeWithGPT(symptoms: string): Promise<any> {
  try {
    const result = await analyzeWithGemini(symptoms)
    return result
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('limit')) {
        return await analyzeWithFallback(symptoms)
      }
    }
    
    return await analyzeWithFallback(symptoms)
  }
}

async function fetchDoctorsBySpecialties(specialties: string[]): Promise<any[]> {
  try {
    const doctors = await prisma.doctor.findMany()

    const doctorsWithUsers = await Promise.all(
      doctors.map(async (doctor) => {
        try {
          const user = await prisma.user.findUnique({
            where: { id: doctor.userId },
            select: {
              name: true,
              email: true
            }
          })
          
          return {
            ...doctor,
            user
          }
        } catch (error) {
          return {
            ...doctor,
            user: null
          }
        }
      })
    )
    
    const validDoctors = doctorsWithUsers.filter(doctor => 
      doctor.user !== null && 
      doctor.user.name && 
      doctor.user.email
    )

    const formattedDoctors = validDoctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.user!.name,
      specialty: doctor.specialty || 'General Medicine',
      experience: doctor.experience || 'Not specified',
      location: doctor.location || 'Not specified',
      address: doctor.address || 'Not specified',
      expertise: doctor.expertise && doctor.expertise.length > 0 ? doctor.expertise : ['General Practice'],
      languages: doctor.languages && doctor.languages.length > 0 ? doctor.languages : ['English'],
      consultationFee: doctor.consultationFee || 'Contact for pricing',
      available: doctor.available,
      videoConsultation: doctor.videoConsultation,
      image: doctor.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200',
    }))

    const matchedDoctors = formattedDoctors.filter((doctor) => 
      specialties.some((specialty: string) => 
        doctor.specialty.toLowerCase() === specialty.toLowerCase()
      )
    )
    
    if (matchedDoctors.length === 0) {
      return formattedDoctors.slice(0, 3)
    }
    
    return matchedDoctors.slice(0, 3)
  } catch (error) {
    return []
  }
}

export async function GET() {
  return NextResponse.json({ message: 'API route is working' })
}

export async function POST(request: Request) {
  try {
    const { symptoms } = await request.json()

    if (!symptoms) {
      return NextResponse.json(
        { error: 'Symptoms are required' },
        { status: 400 }
      )
    }

    const analysis = await analyzeWithGPT(symptoms)

    try {
      const matchedDoctors = await fetchDoctorsBySpecialties(analysis.specialties)
      
      const finalResponse = {
        isEmergency: analysis.isEmergency,
        emergencyDetails: analysis.emergencyDetails,
        analysis: analysis.analysis,
        specialties: analysis.specialties,
        doctors: matchedDoctors
      }
      return NextResponse.json(finalResponse)
    } catch (doctorsError) {
      const fallbackResponse = {
        isEmergency: analysis.isEmergency,
        emergencyDetails: analysis.emergencyDetails,
        analysis: analysis.analysis,
        specialties: analysis.specialties,
        doctors: []
      }
      return NextResponse.json(fallbackResponse)
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to analyze symptoms. Please try again later.' },
      { status: 500 }
    )
  }
} 