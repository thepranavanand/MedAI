"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Video, Phone } from "lucide-react"
import { BookingModal } from "./booking-modal"
import { useState } from "react"

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

interface DoctorCardProps {
  doctor: Doctor
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{doctor.name}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {doctor.location}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Specialty</span>
            <Badge variant="secondary">{doctor.specialty}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Experience</span>
            <span className="text-sm text-muted-foreground">{doctor.experience}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Consultation Fee</span>
            <span className="text-sm font-semibold text-primary">{doctor.consultationFee}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="text-sm">
              {doctor.videoConsultation ? "Video Consultation Available" : "Video Consultation Not Available"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="text-sm">
              {doctor.available ? "Available for Appointments" : "Not Available"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium">Expertise</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {doctor.expertise.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm font-medium">Languages</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {doctor.languages.map((language) => (
                <Badge key={language} variant="outline" className="text-xs">
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Button 
          onClick={() => setIsBookingModalOpen(true)}
          className="w-full"
          disabled={!doctor.available}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book Appointment
        </Button>
      </CardContent>

      <BookingModal
        doctor={doctor}
        open={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </Card>
  )
}