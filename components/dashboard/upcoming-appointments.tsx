"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Video, MapPin } from "lucide-react"

export function UpcomingAppointments() {
  const appointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      date: "2024-04-15",
      time: "10:00 AM",
      type: "Video Consultation",
      isVideo: true,
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      date: "2024-04-16",
      time: "2:30 PM",
      type: "In-Person Visit",
      location: "123 Medical Center, NY",
      isVideo: false,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">{appointment.doctor}</p>
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  {appointment.isVideo ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                  <span>
                    {appointment.isVideo
                      ? "Video Consultation"
                      : appointment.location}
                  </span>
                </div>
              </div>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}