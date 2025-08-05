"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { FileText, Activity, Pill, Calendar } from "lucide-react"

interface TimelineEvent {
  date: string
  type: 'appointment' | 'medication' | 'test' | 'diagnosis'
  title: string
  description: string
  status?: string
}

const timelineData: TimelineEvent[] = [
  {
    date: "2024-03-15",
    type: "appointment",
    title: "Cardiology Consultation",
    description: "Regular checkup with Dr. Johnson",
    status: "Completed",
  },
  {
    date: "2024-03-10",
    type: "test",
    title: "Blood Work Results",
    description: "Comprehensive metabolic panel",
    status: "Normal",
  },
  {
    date: "2024-03-05",
    type: "medication",
    title: "Prescription Update",
    description: "Started new blood pressure medication",
  },
  {
    date: "2024-02-28",
    type: "diagnosis",
    title: "Hypertension Assessment",
    description: "Diagnosed with mild hypertension",
  },
]

const getEventIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'appointment':
      return Calendar
    case 'medication':
      return Pill
    case 'test':
      return Activity
    case 'diagnosis':
      return FileText
    default:
      return FileText
  }
}

interface Props {
  detailed?: boolean
}

export function MedicalTimeline({ detailed = false }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className={detailed ? "h-[600px]" : "h-[300px]"}>
          <div className="space-y-8">
            {timelineData.map((event) => {
              const Icon = getEventIcon(event.type)
              return (
                <div key={`${event.date}-${event.title}`} className="flex gap-4">
                  <div className="mt-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {event.date}
                      </p>
                      {event.status && (
                        <Badge variant="secondary">{event.status}</Badge>
                      )}
                    </div>
                    <h3 className="font-medium leading-none mt-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.description}
                    </p>
                    {detailed && (
                      <Button variant="outline" size="sm" className="mt-2">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}