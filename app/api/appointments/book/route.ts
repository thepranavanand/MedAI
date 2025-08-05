import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.patient?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { doctorId, date, time, type, symptoms } = body

    // Validate required fields
    if (!doctorId || !date || !time || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get doctor details
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    })

    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      )
    }

    // Check if doctor is available for appointments
    if (!doctor.available) {
      return NextResponse.json(
        { error: 'Doctor is not available for appointments' },
        { status: 400 }
      )
    }

    // Check if video consultation is requested but not available
    if (type === 'video' && !doctor.videoConsultation) {
      return NextResponse.json(
        { error: 'Video consultation is not available with this doctor' },
        { status: 400 }
      )
    }

    // Create or find time slot
    const appointmentDate = new Date(date)
    const timeSlot = await prisma.timeSlot.upsert({
      where: {
        doctorId_date_time: {
          doctorId,
          date: appointmentDate,
          time
        }
      },
      update: {},
      create: {
        doctorId,
        date: appointmentDate,
        time,
        isBooked: false
      }
    })

    // Check if slot is already booked
    if (timeSlot.isBooked) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 400 }
      )
    }

    // Create appointment and mark slot as booked
    const appointment = await prisma.$transaction([
      prisma.appointment.create({
        data: {
          patientId: session.user.patient.id,
          doctorId,
          slotId: timeSlot.id,
          type,
          symptoms: symptoms || 'General consultation',
          status: 'SCHEDULED'
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
        }
      }),
      prisma.timeSlot.update({
        where: { id: timeSlot.id },
        data: { isBooked: true }
      })
    ])

    return NextResponse.json({
      message: 'Appointment booked successfully',
      appointment: appointment[0]
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to book appointment' },
      { status: 500 }
    )
  }
} 