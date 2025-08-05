import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      patient?: {
        id: string
        userId: string
        phoneNumber?: string
      }
      doctor?: {
        id: string
        userId: string
        specialty: string
        experience: string
        rating: number
        location: string
        address: string
        meetLink?: string
        expertise: string[]
        languages: string[]
        consultationFee: string
        available: boolean
        videoConsultation: boolean
        image?: string
      }
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    patient?: {
      id: string
      userId: string
      phoneNumber?: string
    }
    doctor?: {
      id: string
      userId: string
      specialty: string
      experience: string
      rating: number
      location: string
      address: string
      meetLink?: string
      expertise: string[]
      languages: string[]
      consultationFee: string
      available: boolean
      videoConsultation: boolean
      image?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    patient?: {
      id: string
      userId: string
      phoneNumber?: string
    }
    doctor?: {
      id: string
      userId: string
      specialty: string
      experience: string
      rating: number
      location: string
      address: string
      meetLink?: string
      expertise: string[]
      languages: string[]
      consultationFee: string
      available: boolean
      videoConsultation: boolean
      image?: string
    }
  }
}