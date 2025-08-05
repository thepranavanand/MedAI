"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Heart, Weight, Droplet } from "lucide-react"

export function HealthMetrics() {
  const metrics = [
    {
      title: "Blood Pressure",
      value: "120/80",
      icon: Activity,
      description: "Normal",
    },
    {
      title: "Heart Rate",
      value: "72 bpm",
      icon: Heart,
      description: "Resting",
    },
    {
      title: "Weight",
      value: "68 kg",
      icon: Weight,
      description: "Stable",
    },
    {
      title: "Blood Sugar",
      value: "95 mg/dL",
      icon: Droplet,
      description: "Fasting",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}