"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Heart,
  Moon,
  Apple,
  Dumbbell,
  Footprints,
} from "lucide-react"

export function WellnessTracker() {
  const wellnessMetrics = [
    {
      title: "Daily Steps",
      current: 8500,
      goal: 10000,
      unit: "steps",
      icon: Footprints,
      progress: 85,
    },
    {
      title: "Exercise",
      current: 45,
      goal: 60,
      unit: "minutes",
      icon: Dumbbell,
      progress: 75,
    },
    {
      title: "Sleep",
      current: 7,
      goal: 8,
      unit: "hours",
      icon: Moon,
      progress: 87.5,
    },
    {
      title: "Nutrition",
      current: 1800,
      goal: 2000,
      unit: "kcal",
      icon: Apple,
      progress: 90,
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {wellnessMetrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2">
              <span className="text-2xl font-bold">
                {metric.current.toLocaleString()}
              </span>
              <span className="text-muted-foreground">
                / {metric.goal.toLocaleString()} {metric.unit}
              </span>
            </div>
            <Progress value={metric.progress} className="h-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}