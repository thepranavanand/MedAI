"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DoctorCard } from "@/components/doctors/doctor-card"

interface Doctor {
  id: string
  name: string
  specialty: string
  experience: string
  rating: number
  location: string
  address: string
  meetLink: string
  expertise: string[]
  languages: string[]
  consultationFee: string
  available: boolean
  videoConsultation: boolean
  image: string
}

const specialties = [
  "All Specialties",
  "Cardiology",
  "Neurology",
  "Gastroenterology",
  "Pulmonology",
  "Dermatology",
  "Orthopedics",
  "ENT",
  "Endocrinology",
  "Ophthalmology",
  "Psychiatry"
]

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/doctors")
      if (response.ok) {
        const data = await response.json()
        setDoctors(data.doctors)
        setFilteredDoctors(data.doctors)
      } else {
        setError("Failed to fetch doctors")
      }
    } catch (error) {
      setError("Failed to fetch doctors")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    filterDoctors()
  }, [doctors, searchTerm, selectedSpecialty])

  const filterDoctors = () => {
    let filtered = doctors

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by specialty
    if (selectedSpecialty !== "All Specialties") {
      filtered = filtered.filter(doctor =>
        doctor.specialty === selectedSpecialty
      )
    }

    setFilteredDoctors(filtered)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Find Doctors</h1>
        <div className="text-center py-8">
          <p>Loading doctors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Find Doctors</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search doctors by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  )
}