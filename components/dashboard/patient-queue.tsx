"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Video, Clock, Mail } from "lucide-react"

interface Appointment {
  id: string
  patient: {
    user: {
      name: string
      email: string
    }
  }
  doctor: {
    user: {
      name: string
    }
    specialty: string
    address: string
    meetLink: string
  }
  slot: {
    date: string
    time: string
  }
  type: string
  status: string
  symptoms: string
}

interface PatientQueueProps {
  appointments: Appointment[]
}

export function PatientQueue({ appointments }: PatientQueueProps) {
  // Filter out completed appointments and sort by date and time
  const sortedAppointments = appointments
    .filter(appointment => appointment.status !== "COMPLETED")
    .sort((a, b) => {
      const dateA = new Date(a.slot.date + ' ' + a.slot.time)
      const dateB = new Date(b.slot.date + ' ' + b.slot.time)
      return dateA.getTime() - dateB.getTime()
    })

  const handleEmailClick = (patientEmail: string) => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(patientEmail)}`
    window.open(gmailUrl, '_blank')
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getWaitTime = (appointmentDate: string, appointmentTime: string) => {
    const now = new Date()
    const appointmentDateTime = new Date(appointmentDate + ' ' + appointmentTime)
    
    const diffMs = appointmentDateTime.getTime() - now.getTime()
    const diffMins = Math.round(diffMs / (1000 * 60))
    
    if (diffMins < 0) return "Overdue"
    if (diffMins < 60) return `${diffMins} mins`
    const diffHours = Math.floor(diffMins / 60)
    return `${diffHours} hr ${diffMins % 60} mins`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {sortedAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <p>No appointments scheduled</p>
              </div>
            ) : (
              sortedAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{appointment.patient.user.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {formatDate(appointment.slot.date)} at {formatTime(appointment.slot.time)}
                      {appointment.type === "video" && (
                        <>
                          <span>•</span>
                          <Video className="h-4 w-4" />
                          Video Consult
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge
                        variant={
                          appointment.status === "COMPLETED"
                            ? "default"
                            : appointment.status === "SCHEDULED"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEmailClick(appointment.patient.user.email)}
                      className="flex items-center gap-1"
                    >
                      <Mail className="h-3 w-3" />
                      Email
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}