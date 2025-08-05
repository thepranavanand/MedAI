"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { bookAppointment } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface BookingModalProps {
  doctor: {
    id: number
    name: string
    specialty: string
    videoConsultation?: boolean
  }
  open: boolean
  onClose: () => void
}

export function BookingModal({ doctor, open, onClose }: BookingModalProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("")
  const [type, setType] = useState<"video" | "in-person">("video")
  const [symptoms, setSymptoms] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleBooking = async () => {
    if (!date || !time) {
      toast({
        title: "Please select date and time",
        variant: "destructive",
      })
      return
    }

    if (!symptoms.trim()) {
      toast({
        title: "Please describe your symptoms",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await bookAppointment({
        doctorId: doctor.id.toString(),
        date: date.toISOString(),
        time,
        type,
        symptoms: symptoms.trim()
      })
      toast({
        title: "Appointment booked successfully",
        description: `Your appointment with ${doctor.name} is confirmed`,
      })
      onClose()
    } catch (error) {
      toast({
        title: "Failed to book appointment",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
          <DialogDescription>
            Select your preferred date, time, and appointment type to book your consultation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              disabled={(date) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                return date < today
              }}
              fromDate={new Date()}
            />
          </div>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="09:00">9:00 AM</SelectItem>
              <SelectItem value="10:00">10:00 AM</SelectItem>
              <SelectItem value="11:00">11:00 AM</SelectItem>
              <SelectItem value="14:00">2:00 PM</SelectItem>
              <SelectItem value="15:00">3:00 PM</SelectItem>
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={(value: "video" | "in-person") => setType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select appointment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem 
                value="video" 
                disabled={doctor.videoConsultation === false}
              >
                Video Consultation {doctor.videoConsultation === false && "(Not Available)"}
              </SelectItem>
              <SelectItem value="in-person">In-Person Visit</SelectItem>
            </SelectContent>
          </Select>
          <div className="grid gap-2">
            <label htmlFor="symptoms" className="text-sm font-medium">
              Describe your symptoms
            </label>
            <textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Please describe your symptoms or reason for visit..."
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Button onClick={handleBooking} disabled={isLoading}>
            {isLoading ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}