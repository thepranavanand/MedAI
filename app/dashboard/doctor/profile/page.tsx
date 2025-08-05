"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DoctorProfileForm } from "@/components/dashboard/doctor-profile-form"

export default function DoctorProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [freshDoctorData, setFreshDoctorData] = useState(null)

  const fetchFreshDoctorData = async () => {
    try {
      const response = await fetch('/api/doctors/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch doctor data')
      }
      const data = await response.json()
      setFreshDoctorData(data.doctor)
    } catch (error) {
      // Handle error silently in production
    }
  }

  useEffect(() => {
    fetchFreshDoctorData()
  }, [])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p>Please wait while we load your profile.</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your doctor profile and preferences</p>
      </div>

      {session.user.doctor ? (
        <DoctorProfileForm 
          doctor={freshDoctorData || session.user.doctor} 
          onUpdateSuccess={fetchFreshDoctorData}
        />
      ) : (
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Profile Not Found</h3>
          <p className="text-muted-foreground">
            Your doctor profile could not be loaded. Please try refreshing the page or contact support.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      )}
    </div>
  )
} 