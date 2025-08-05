import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database configuration missing' },
        { status: 500 }
      )
    }
    
    await prisma.$connect()
    
    const doctors = await prisma.doctor.findMany()

    const doctorsWithUsers = await Promise.all(
      doctors.map(async (doctor) => {
        try {
          const user = await prisma.user.findUnique({
            where: { id: doctor.userId },
            select: {
              name: true,
              email: true
            }
          })
          
          return {
            ...doctor,
            user
          }
        } catch (error) {
          return {
            ...doctor,
            user: null
          }
        }
      })
    )
    
    const validDoctors = doctorsWithUsers.filter(doctor => 
      doctor.user !== null && 
      doctor.user.name && 
      doctor.user.email
    )

    const formattedDoctors = validDoctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.user.name,
      specialty: doctor.specialty || 'General Medicine',
      experience: doctor.experience || 'Not specified',
      location: doctor.location || 'Not specified',
      address: doctor.address || 'Not specified',
      expertise: doctor.expertise && doctor.expertise.length > 0 ? doctor.expertise : ['General Practice'],
      languages: doctor.languages && doctor.languages.length > 0 ? doctor.languages : ['English'],
      consultationFee: doctor.consultationFee || 'Contact for pricing',
      available: doctor.available,
      videoConsultation: doctor.videoConsultation,
      image: doctor.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200',
    }))

    return NextResponse.json({ doctors: formattedDoctors })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('P1001')) {
        return NextResponse.json(
          { error: 'Database connection failed. Please check your database configuration.' },
          { status: 500 }
        )
      } else if (error.message.includes('P2024')) {
        return NextResponse.json(
          { error: 'Database operation timeout. Please try again.' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch doctors. Please try again later.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 