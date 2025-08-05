import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name, role } = body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        ...(role === 'PATIENT' && {
          patient: { create: {} }
        }),
        ...(role === 'DOCTOR' && {
          doctor: {
            create: {
              specialty: body.specialty || '',
              experience: body.experience || '',
              location: body.location || '',
              expertise: body.expertise || [],
              languages: body.languages || [],
              consultationFee: body.consultationFee || '',
            }
          }
        })
      },
      include: {
        patient: true,
        doctor: true
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    )
  }
}