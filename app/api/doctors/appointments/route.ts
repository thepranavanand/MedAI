import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get('doctorId')
    const userId = searchParams.get('userId')

    let finalDoctorId = doctorId

    if (!doctorId && userId) {
      const doctor = await prisma.doctor.findFirst({
        where: { userId: userId }
      })
      
      if (doctor) {
        finalDoctorId = doctor.id
      } else {
        return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
      }
    }

    if (!finalDoctorId) {
      return NextResponse.json({ error: 'Doctor ID required' }, { status: 400 })
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: finalDoctorId
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        slot: true
      },
      orderBy: {
        slot: {
          date: 'asc'
        }
      }
    })

    return NextResponse.json({ appointments })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { appointmentId, status, notes } = body

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status,
        notes: notes || null
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        slot: true
      }
    })

    return NextResponse.json({ appointment: updatedAppointment })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
} 