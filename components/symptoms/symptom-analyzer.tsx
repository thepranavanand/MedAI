"use client"

import { useState } from "react"
import { Loader2, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { analyzeSymptoms } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { DoctorCard } from "@/components/doctors/doctor-card"

interface Doctor {
  id: string
  name: string
  specialty: string
  experience: string
  rating?: number
  location: string
  address: string
  meetLink?: string
  expertise: string[]
  languages: string[]
  consultationFee: string
  available: boolean
  videoConsultation: boolean
  image: string
  nextAvailable?: string
}

export function SymptomAnalyzer() {
  const [symptoms, setSymptoms] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [isEmergency, setIsEmergency] = useState(false)
  const [emergencyDetails, setEmergencyDetails] = useState("")
  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([])
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    
    if (!symptoms.trim()) {
      toast({
        title: "Error",
        description: "Please enter your symptoms",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    
    try {
      const result = await analyzeSymptoms(symptoms)
      
      setIsEmergency(result.isEmergency)
      setEmergencyDetails(result.emergencyDetails)
      setAnalysis(result.analysis)
      setRecommendedDoctors(result.doctors || [])
      setResult(result)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze symptoms",
        variant: "destructive",
      })
      setAnalysis("")
      setIsEmergency(false)
      setEmergencyDetails("")
      setRecommendedDoctors([])
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Symptom Analyzer</CardTitle>
          <CardDescription>
            Describe your symptoms in detail and our AI will provide a preliminary analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <Textarea
              placeholder="Describe your symptoms here..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="min-h-[150px]"
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Analyzing..." : "Analyze Symptoms"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {isEmergency && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Emergency Medical Situation</AlertTitle>
              <AlertDescription className="mt-2">
                {emergencyDetails}
                <div className="mt-2 font-bold">
                  Please call emergency services (911) immediately or go to the nearest emergency room.
                </div>
              </AlertDescription>
            </Alert>
          )}

          {result?.isFallback && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Limited Analysis Mode</AlertTitle>
              <AlertDescription>
                Our AI service is currently experiencing high demand. This analysis uses our local system and may be less detailed than usual.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Analysis Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysis.split('\n').map((point, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="text-primary mt-1">•</div>
                    <div>{point.replace('•', '').trim()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {recommendedDoctors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommended Specialists</CardTitle>
                <CardDescription>Based on your symptoms, we recommend consulting these specialists</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {recommendedDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}