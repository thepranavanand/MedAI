"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, Activity, ClipboardList } from "lucide-react"

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

interface DoctorStatsProps {
  appointments: Appointment[]
}

export function DoctorStats({ appointments }: DoctorStatsProps) {
  // Calculate real statistics from appointments
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todayAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.slot.date)
    return appointmentDate.toDateString() === today.toDateString()
  })

  const uniquePatients = new Set(appointments.map(appointment => appointment.patient.user.email)).size
  
  const completedAppointments = appointments.filter(appointment => appointment.status === "COMPLETED").length
  const totalAppointments = appointments.length
  const completionRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0

  const stats = [
    {
      title: "Total Patients",
      value: uniquePatients.toString(),
      icon: Users,
      change: "",
      description: "unique patients",
    },
    {
      title: "Today's Appointments",
      value: todayAppointments.length.toString(),
      icon: Clock,
      change: "",
      description: "scheduled for today",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: Activity,
      change: "",
      description: "appointments completed",
    },
    {
      title: "Total Appointments",
      value: totalAppointments.toString(),
      icon: ClipboardList,
      change: "",
      description: "all time",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}