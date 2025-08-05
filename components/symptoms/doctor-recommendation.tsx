"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, MapPin, Calendar, Languages } from "lucide-react"
import { useState } from "react"
import { BookingModal } from "@/components/doctors/booking-modal"
import { Doctor } from "@/lib/api"

interface DoctorRecommendationProps {
  doctor: Doctor
}

export function DoctorRecommendation({ doctor }: DoctorRecommendationProps) {
  const [showBooking, setShowBooking] = useState(false)

  return (
    <>
      <Card className="p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{doctor.name}</h3>
                <p className="text-muted-foreground">{doctor.specialty}</p>
              </div>
              {doctor.videoConsultation && (
                <Badge variant="secondary">
                  <Video className="w-3 h-3 mr-1" />
                  Video Available
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-muted-foreground">{doctor.experience}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm text-muted-foreground">{doctor.location}</span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{doctor.nextAvailable}</span>
              </div>
              <div className="flex items-center gap-1">
                <Languages className="w-4 h-4" />
                <span>{doctor.languages}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Expertise:</span> {doctor.expertise}
          </p>
        </div>
        <div className="flex gap-4 mt-4 items-center">
          <Button 
            className="flex-1" 
            onClick={() => setShowBooking(true)}
          >
            Book Appointment
          </Button>
          <div className="text-right">
            <div className="text-sm font-medium">{doctor.consultationFee}</div>
            <div className="text-xs text-muted-foreground">per visit</div>
          </div>
        </div>
      </Card>

      <BookingModal
        doctor={doctor}
        open={showBooking}
        onClose={() => setShowBooking(false)}
      />
    </>
  )
}