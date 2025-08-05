import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '../auth/[...nextauth]/route'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let appointments = []

    if (session.user.role === 'PATIENT') {
      appointments = await prisma.appointment.findMany({
        where: {
          patientId: session.user.patient?.id
        },
        include: {
          doctor: {
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
    } else if (session.user.role === 'DOCTOR') {
      appointments = await prisma.appointment.findMany({
        where: {
          doctorId: session.user.doctor?.id
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
    }

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error('Appointments API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.patient?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { doctorId, slotId, type } = body

    const appointment = await prisma.appointment.create({
      data: {
        doctorId,
        patientId: session.user.patient.id,
        slotId,
        type,
      },
      include: {
        doctor: {
          include: { user: true }
        },
        slot: true
      }
    })

    await prisma.timeSlot.update({
      where: { id: slotId },
      data: { isBooked: true }
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Book appointment error:', error)
    return NextResponse.json(
      { error: 'Failed to book appointment' },
      { status: 500 }
    )
  }
} 