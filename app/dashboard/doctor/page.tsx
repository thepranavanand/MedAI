"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  Clock,
  Calendar as CalendarIcon,
  Video,
  Activity,
  ClipboardList,
  Search,
  BarChart,
  User,
} from "lucide-react"
import { DoctorStats } from "@/components/dashboard/doctor-stats"
import { PatientQueue } from "@/components/dashboard/patient-queue"
import { AppointmentList } from "@/components/dashboard/appointment-list"
import { Appointment } from "@/types/appointment"

export default function DoctorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [searchTerm, setSearchTerm] = useState("")

  // Redirect non-doctors
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "DOCTOR") {
      router.push("/dashboard")
    }
  }, [session, status, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/appointments')
        if (!response.ok) {
          throw new Error('Failed to fetch appointments')
        }
        const data = await response.json()
        setAppointments(data.appointments || [])
      } catch (error) {
        setError('Failed to load appointments')
      } finally {
        setLoading(false)
      }
    }

    if (status === "loading") {
      return
    }

    if (session?.user) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [session, status])

  const handleForceRefresh = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/appointments')
      if (!response.ok) {
        throw new Error('Failed to fetch appointments')
      }
      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (error) {
      setError('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
        <div className="text-center py-8">
          <p>Loading session...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
        <div className="text-center py-8">
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={handleForceRefresh}>Try Again</Button>
        </div>
      </div>
    )
  }

  // Filter appointments
  const upcomingAppointments = appointments.filter(apt => apt.status !== "COMPLETED")
  const completedAppointments = appointments.filter(apt => apt.status === "COMPLETED")

  // Get unique patients and filter by search term
  const uniquePatients = appointments.reduce((acc, appointment) => {
    const patientId = appointment.patient.user.id
    const patientName = appointment.patient.user.name
    const existingPatient = acc.find(p => p.id === patientId)
    
    if (!existingPatient) {
      acc.push({
        id: patientId,
        name: patientName,
        lastVisit: appointment.slot.date,
        status: appointment.status
      })
    } else {
      // Update last visit if this appointment is more recent
      const currentDate = new Date(appointment.slot.date)
      const existingDate = new Date(existingPatient.lastVisit)
      if (currentDate > existingDate) {
        existingPatient.lastVisit = appointment.slot.date
        existingPatient.status = appointment.status
      }
    }
    return acc
  }, [] as Array<{id: string, name: string, lastVisit: string, status: string}>)

  const filteredPatients = uniquePatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          {session && (
            <p className="text-muted-foreground">Welcome back, {session.user.name}!</p>
          )}
        </div>
        <Button onClick={handleForceRefresh} variant="outline">
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DoctorStats appointments={appointments} />
          <div className="grid gap-6 md:grid-cols-4">
            <div className="md:col-span-3">
              <PatientQueue appointments={upcomingAppointments} />
            </div>
            <div className="md:col-span-1">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
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
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          
                          // Only highlight future appointments that are not completed
                          if (date < today) return false
                          
                          return upcomingAppointments.some(appointment => {
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
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Patient Management</CardTitle>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search patients..." 
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.length === 0 ? (
                      <TableRow key="no-patients">
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          {searchTerm ? "No patients found matching your search" : "No patients yet"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPatients.map((patient, index) => (
                        <TableRow key={`${patient.id}-${patient.name}-${index}`}>
                          <TableCell className="font-medium">
                            {patient.name}
                          </TableCell>
                          <TableCell>
                            {new Date(patient.lastVisit).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge>{patient.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentList appointments={appointments} />
        </TabsContent>

      </Tabs>
    </div>
  )
}