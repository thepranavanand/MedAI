"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from "@/components/ui/card"

const data = [
  { name: 'Jan', patients: 65 },
  { name: 'Feb', patients: 59 },
  { name: 'Mar', patients: 80 },
  { name: 'Apr', patients: 81 },
  { name: 'May', patients: 56 },
  { name: 'Jun', patients: 55 },
  { name: 'Jul', patients: 40 },
]
export function AnalyticsChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="patients" stroke="hsl(var(--primary))" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}