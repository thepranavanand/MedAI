import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      password,
      role,
      specialty,
      experience,
      location,
      address,
      expertise,
      languages,
      consultationFee,
    } = body

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        ...(role === 'PATIENT' && {
          patient: {
            create: {
              phoneNumber: ''
            }
          }
        }),
        ...(role === 'DOCTOR' && {
          doctor: {
            create: {
              specialty,
              experience,
              location,
              address,
              expertise: Array.isArray(expertise) ? expertise : [expertise],
              languages: Array.isArray(languages) ? languages : [languages],
              consultationFee,
              available: true,
              videoConsultation: true,
              image: `https://thumbs.dreamstime.com/b/cute-cartoon-robot-d-render-blue-gradient-background-futuristic-design-friendly-ai-assistant-white-light-colors-big-expressive-367414791.jpg?w=992`
            }
          }
        })
      },
      include: {
        patient: role === 'PATIENT',
        doctor: role === 'DOCTOR'
      }
    })

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
} 