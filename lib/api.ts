import { env } from "@/lib/env"

export interface Doctor {
  id: string
  name: string
  specialty: string
  experience: string
  location: string
  address: string
  meetLink: string
  expertise: string[]
  languages: string[]
  consultationFee: string
  available: boolean
  videoConsultation: boolean
  image: string
}

export async function analyzeSymptoms(symptoms: string): Promise<any> {
  try {
    const response = await fetch('/api/symptoms/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms }),
    })

    if (!response.ok) {
      throw new Error('Failed to analyze symptoms')
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw new Error("Failed to analyze symptoms. Please try again later.")
  }
}

export async function bookAppointment(appointmentData: any): Promise<any> {
  try {
    const response = await fetch('/api/appointments/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to book appointment')
    }

    return await response.json()
  } catch (error) {
    throw new Error("Failed to book appointment. Please try again later.")
  }
}