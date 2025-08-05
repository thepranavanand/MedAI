"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  CalendarIcon,
  Clock,
  MapPin,
  Video,
  X,
  CheckCircle
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"

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
  completedBy?: string
}

export default function AppointmentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showError, setShowError] = useState(true)
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Redirect doctors to their dashboard
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "DOCTOR") {
      router.push("/dashboard/doctor")
    }
  }, [session, status, router])

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/appointments')
        if (!response.ok) {
          throw new Error('Failed to fetch appointments')
        }
        const data = await response.json()
        setAppointments(data.appointments || [])
      } catch (error) {
        setError('Failed to fetch appointments')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchAppointments()
    } else {
      setLoading(false)
    }
  }, [session])

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'CANCELLED' }),
      })

      if (!response.ok) {
        throw new Error('Failed to cancel appointment')
      }

      // Refresh appointments
      const updatedResponse = await fetch('/api/appointments')
      const updatedData = await updatedResponse.json()
      setAppointments(updatedData.appointments || [])
    } catch (error) {
      // Handle error silently in production
    }
  }

  const handleMarkCompleted = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'COMPLETED' }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark appointment as completed')
      }

      // Refresh appointments
      const updatedResponse = await fetch('/api/appointments')
      const updatedData = await updatedResponse.json()
      setAppointments(updatedData.appointments || [])
    } catch (error) {
      // Handle error silently in production
    }
  }

  const dismissError = () => {
    setShowError(false)
    setError(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Appointments</h1>
        <div className="text-center py-8">
          <p>Loading appointments...</p>
        </div>
      </div>
    )
  }

  // Filter appointments
  const upcomingAppointments = appointments.filter(apt => apt.status !== "COMPLETED")
  const completedAppointments = appointments.filter(apt => apt.status === "COMPLETED")

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

      {error && showError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-start">
          <div className="flex-1">
            {error}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={dismissError}
            className="ml-2 h-6 w-6 p-0 text-red-700 hover:text-red-900 hover:bg-red-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {session && (
        <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          <p>Welcome back, {session.user.name}!</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-6">
              <div className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <Card className="p-6">
                    <div className="text-center py-8">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
                      <p className="text-muted-foreground mb-4">
                        You don't have any upcoming appointments
                      </p>
                      <Button asChild>
                        <a href="/doctors">Find Doctors</a>
                      </Button>
                    </div>
                  </Card>
                ) : (
                  upcomingAppointments.map((appointment) => (
                    <Card key={appointment.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{appointment.doctor.user.name}</h3>
                          <p className="text-muted-foreground">{appointment.doctor.specialty}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-4 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(appointment.slot.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.slot.time}</span>
                        </div>
                        {appointment.type === "video" ? (
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            <span>Video Consultation</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{appointment.doctor.address}</span>
                          </div>
                        )}
                      </div>

                      {appointment.symptoms && (
                        <div className="mb-4 p-3 bg-blue-50 rounded">
                          <p className="text-sm font-medium text-blue-800">Symptoms:</p>
                          <p className="text-sm text-blue-700">{appointment.symptoms}</p>
                        </div>
                      )}

                      <div className="flex gap-4">
                        {appointment.type === "video" && (
                          <div className="flex-1 p-3 bg-blue-50 rounded border border-blue-200">
                            <p className="text-sm text-blue-800">
                              <strong>Video Consultation:</strong> You'll receive an email from the doctor with the meeting link (Zoom/Google Meet) at your convenience.
                            </p>
                          </div>
                        )}
                      </div>

                      {appointment.status === "SCHEDULED" && (
                        <div className="mt-4">
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleMarkCompleted(appointment.id)}
                          >
                            Mark as Completed
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <div className="space-y-4">
                {completedAppointments.length === 0 ? (
                  <Card className="p-6">
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No completed appointments</h3>
                      <p className="text-muted-foreground">
                        You don't have any completed appointments yet
                      </p>
                    </div>
                  </Card>
                ) : (
                  completedAppointments.map((appointment) => (
                    <Card key={appointment.id} className="p-6 border-green-200 bg-green-50">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{appointment.doctor.user.name}</h3>
                          <p className="text-muted-foreground">{appointment.doctor.specialty}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Completed
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(appointment.slot.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.slot.time}</span>
                        </div>
                        {appointment.type === "video" ? (
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            <span>Video Consultation</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{appointment.doctor.address}</span>
                          </div>
                        )}
                      </div>

                      {appointment.symptoms && (
                        <div className="mb-4 p-3 bg-blue-50 rounded">
                          <p className="text-sm font-medium text-blue-800">Symptoms:</p>
                          <p className="text-sm text-blue-700">{appointment.symptoms}</p>
                        </div>
                      )}

                      <div className="mt-4 p-3 bg-green-100 rounded border border-green-200">
                        <p className="text-sm text-green-800">
                          <strong>Appointment Completed</strong>
                          {appointment.completedBy && (
                            <span> - Marked as completed by {appointment.completedBy === 'PATIENT' ? 'you' : 'doctor'}</span>
                          )}
                        </p>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-1">
          <Card className="h-fit mt-12 border-b-0">
            <CardContent className="flex justify-center pt-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}