import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.doctor?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      specialty,
      experience,
      location,
      address,
      expertise,
      languages,
      consultationFee,
      available,
      videoConsultation,
    } = body

    const updatedDoctor = await prisma.doctor.update({
      where: { id: session.user.doctor.id },
      data: {
        specialty,
        experience,
        location,
        address,
        expertise: Array.isArray(expertise) ? expertise : [expertise],
        languages: Array.isArray(languages) ? languages : [languages],
        consultationFee,
        available: available,
        videoConsultation: videoConsultation,
      },
    })

    return NextResponse.json({ doctor: updatedDoctor })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.doctor?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: session.user.doctor.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    return NextResponse.json({ doctor })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
} 