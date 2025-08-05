"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

interface Doctor {
  id: string
  name: string
  specialty: string
  experience: string
  location: string
  address: string
  expertise: string[]
  languages: string[]
  consultationFee: string
  available: boolean
  videoConsultation: boolean
  image: string
}

interface DoctorProfileFormProps {
  doctor: Doctor
  onUpdateSuccess?: (updatedDoctor: Doctor) => void
}

export function DoctorProfileForm({ doctor, onUpdateSuccess }: DoctorProfileFormProps) {
  const [formData, setFormData] = useState({
    specialty: '',
    experience: '',
    location: '',
    address: '',
    expertise: [] as string[],
    languages: [] as string[],
    consultationFee: '',
    available: true,
    videoConsultation: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (doctor) {
      setFormData({
        specialty: doctor.specialty || '',
        experience: doctor.experience || '',
        location: doctor.location || '',
        address: doctor.address || '',
        expertise: doctor.expertise || [],
        languages: doctor.languages || [],
        consultationFee: doctor.consultationFee || '',
        available: doctor.available ?? true,
        videoConsultation: doctor.videoConsultation ?? true,
      })
    }
  }, [doctor])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/doctors/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const result = await response.json()
      setSuccess('Profile updated successfully!')
      
      if (onUpdateSuccess) {
        onUpdateSuccess(result.doctor)
      }
    } catch (error) {
      setError('Failed to update profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleArrayInput = (field: 'expertise' | 'languages', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item)
    setFormData(prev => ({
      ...prev,
      [field]: items
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input
                id="specialty"
                value={formData.specialty}
                onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                placeholder="e.g., Cardiology"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="e.g., 10 years"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., New York, NY"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultationFee">Consultation Fee</Label>
              <Input
                id="consultationFee"
                value={formData.consultationFee}
                onChange={(e) => setFormData(prev => ({ ...prev, consultationFee: e.target.value }))}
                placeholder="e.g., $150"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Full address"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expertise">Expertise (comma-separated)</Label>
              <Input
                id="expertise"
                value={formData.expertise.join(', ')}
                onChange={(e) => handleArrayInput('expertise', e.target.value)}
                placeholder="e.g., Heart Disease, Hypertension"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">Languages (comma-separated)</Label>
              <Input
                id="languages"
                value={formData.languages.join(', ')}
                onChange={(e) => handleArrayInput('languages', e.target.value)}
                placeholder="e.g., English, Spanish"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="videoConsultation">Video Consultation</Label>
              <p className="text-sm text-muted-foreground">
                Allow patients to book video consultations
              </p>
            </div>
            <Switch
              id="videoConsultation"
              checked={formData.videoConsultation}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, videoConsultation: checked }))}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 