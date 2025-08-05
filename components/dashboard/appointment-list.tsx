"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { Video, MapPin, Mail } from "lucide-react"

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

interface AppointmentListProps {
  appointments: Appointment[]
}

export function AppointmentList({ appointments }: AppointmentListProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState("all")

  const handleEmailClick = (patientEmail: string) => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(patientEmail)}`
    window.open(gmailUrl, '_blank')
  }

  const handleMarkCompleted = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "COMPLETED",
          completedBy: "DOCTOR",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to mark appointment as completed")
      }

      const data = await response.json()
      // Refresh the appointments list
      window.location.reload()
    } catch (error) {
      // Handle error silently in production
    }
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Filter appointments based on view
  const filteredAppointments = appointments.filter(appointment => {
    if (view === "all") return true
    if (view === "upcoming") return appointment.status === "SCHEDULED"
    if (view === "completed") return appointment.status === "COMPLETED"
    return true
  })

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Appointments</CardTitle>
              <Select value={view} onValueChange={setView}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Appointments</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No appointments found</p>
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{appointment.patient.user.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{formatDate(appointment.slot.date)} at {formatTime(appointment.slot.time)}</span>
                        {appointment.type === "video" ? (
                          <Badge variant="secondary">
                            <Video className="w-3 h-3 mr-1" />
                            Video
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <MapPin className="w-3 h-3 mr-1" />
                            In-Person
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Symptoms: {appointment.symptoms}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant={
                          appointment.status === "SCHEDULED"
                            ? "default"
                            : appointment.status === "COMPLETED"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {appointment.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEmailClick(appointment.patient.user.email)}
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Email
                        </Button>
                        {appointment.status === "SCHEDULED" && (
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleMarkCompleted(appointment.id)}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-4">
            <div className="w-full max-w-full overflow-hidden">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border w-full"
                modifiers={{
                  booked: (date) => {
                    return appointments.some(appointment => {
                      const appointmentDate = new Date(appointment.slot.date)
                      return appointmentDate.toDateString() === date.toDateString()
                    })
                  }
                }}
                modifiersStyles={{
                  booked: { backgroundColor: '#3b82f6', color: 'white' }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}