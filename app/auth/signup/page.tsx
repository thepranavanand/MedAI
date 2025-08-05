"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value
    setSelectedRole(role)
    
    const phoneField = document.getElementById("phoneNumberField")
    const doctorFields = document.getElementById("doctorFields")
    
    if (role === "PATIENT") {
      phoneField?.classList.remove("hidden")
      doctorFields?.classList.add("hidden")
    } else if (role === "DOCTOR") {
      phoneField?.classList.add("hidden")
      doctorFields?.classList.remove("hidden")
    } else {
      phoneField?.classList.add("hidden")
      doctorFields?.classList.add("hidden")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string
    const role = formData.get("role") as string
    const phoneNumber = formData.get("phoneNumber") as string

    // Doctor-specific fields
    const specialty = formData.get("specialty") as string
    const experience = formData.get("experience") as string
    const location = formData.get("location") as string
    const address = formData.get("address") as string
    const consultationFee = formData.get("consultationFee") as string
    const languages = formData.get("languages") as string
    const expertise = formData.get("expertise") as string
    const videoConsultation = formData.get("videoConsultation") === "true"

    // Validate doctor fields
    if (role === "DOCTOR") {
      if (!specialty || !experience || !location || !address || !consultationFee || !languages || !expertise) {
        setError("Please fill in all required doctor fields")
        setLoading(false)
        return
      }
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password, 
          name, 
          role,
          phoneNumber: role === "PATIENT" ? phoneNumber : undefined,
          // Doctor fields
          specialty: role === "DOCTOR" ? specialty : undefined,
          experience: role === "DOCTOR" ? experience : undefined,
          location: role === "DOCTOR" ? location : undefined,
          address: role === "DOCTOR" ? address : undefined,
          consultationFee: role === "DOCTOR" ? consultationFee : undefined,
          languages: role === "DOCTOR" ? languages.split(",").map(l => l.trim()) : undefined,
          expertise: role === "DOCTOR" ? expertise.split(",").map(e => e.trim()) : undefined,
          videoConsultation: role === "DOCTOR" ? videoConsultation : undefined
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Signup failed")
      } else {
        // Store user data and redirect to login
        router.push("/auth/login?message=Account created successfully! Please sign in.")
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create your MedAI account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our medical platform as a patient or doctor
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your password (min 6 characters)"
            />
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              I am a
            </label>
            <select
              id="role"
              name="role"
              required
              onChange={handleRoleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select your role</option>
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
            </select>
          </div>
          
          {/* Patient-specific fields */}
          <div id="phoneNumberField" className="hidden">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Doctor-specific fields */}
          <div id="doctorFields" className="hidden space-y-4">
            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                Medical Specialty *
              </label>
              <select
                id="specialty"
                name="specialty"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select your specialty</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Gastroenterology">Gastroenterology</option>
                <option value="Pulmonology">Pulmonology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="ENT">ENT</option>
                <option value="Endocrinology">Endocrinology</option>
                <option value="Ophthalmology">Ophthalmology</option>
                <option value="Psychiatry">Psychiatry</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Years of Experience *
              </label>
              <input
                id="experience"
                name="experience"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., 10 years"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location (City, State) *
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., New York, NY"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Clinic Address *
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., 123 Medical Center, New York, NY 10001"
              />
            </div>

            <div>
              <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700">
                Consultation Fee *
              </label>
              <input
                id="consultationFee"
                name="consultationFee"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., $150"
              />
            </div>

            <div>
              <label htmlFor="languages" className="block text-sm font-medium text-gray-700">
                Languages Spoken *
              </label>
              <input
                id="languages"
                name="languages"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., English, Spanish, French"
              />
            </div>

            <div>
              <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
                Areas of Expertise *
              </label>
              <input
                id="expertise"
                name="expertise"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., Heart Disease, Hypertension, Cardiac Surgery"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Video Consultation Available
              </label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="videoConsultation"
                    value="true"
                    defaultChecked
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="videoConsultation"
                    value="false"
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}