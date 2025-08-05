"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Phone, Star, Video } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (session?.user?.role === 'DOCTOR') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome, Dr. {session.user.name}</h1>
          <p className="text-muted-foreground mb-6">Access your dashboard to manage appointments and patient care.</p>
          <Link href="/dashboard/doctor">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to DocRec</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your trusted platform for medical appointments and AI-powered symptom analysis
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/symptoms">
              <Button size="lg">Analyze Symptoms</Button>
            </Link>
            <Link href="/doctors">
              <Button variant="outline" size="lg">Find Doctors</Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                AI Symptom Analysis
              </CardTitle>
              <CardDescription>
                Get instant preliminary analysis of your symptoms using advanced AI technology
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Describe your symptoms in any language and receive intelligent recommendations for medical specialists.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Easy Booking
              </CardTitle>
              <CardDescription>
                Book appointments with qualified doctors in just a few clicks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Browse through verified doctors, check their availability, and schedule appointments instantly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Quality Care
              </CardTitle>
              <CardDescription>
                Connect with experienced healthcare professionals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All doctors are verified professionals with proper credentials and experience.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Featured Specialists</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Dr. Sarah Johnson", specialty: "Cardiology", rating: 4.9, location: "New York" },
              { name: "Dr. Michael Chen", specialty: "Neurology", rating: 4.8, location: "San Francisco" },
              { name: "Dr. Emily Rodriguez", specialty: "Gastroenterology", rating: 4.7, location: "Miami" },
              { name: "Dr. James Wilson", specialty: "Pulmonology", rating: 4.9, location: "Chicago" }
            ].map((doctor, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{doctor.specialty}</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{doctor.rating}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {doctor.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to DocRec</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your trusted platform for medical appointments and AI-powered symptom analysis
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">Sign In</Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              AI Symptom Analysis
            </CardTitle>
            <CardDescription>
              Get instant preliminary analysis of your symptoms using advanced AI technology
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Describe your symptoms in any language and receive intelligent recommendations for medical specialists.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Easy Booking
            </CardTitle>
            <CardDescription>
              Book appointments with qualified doctors in just a few clicks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Browse through verified doctors, check their availability, and schedule appointments instantly.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Quality Care
            </CardTitle>
            <CardDescription>
              Connect with experienced healthcare professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All doctors are verified professionals with proper credentials and experience.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">Featured Specialists</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Dr. Sarah Johnson", specialty: "Cardiology", rating: 4.9, location: "New York" },
            { name: "Dr. Michael Chen", specialty: "Neurology", rating: 4.8, location: "San Francisco" },
            { name: "Dr. Emily Rodriguez", specialty: "Gastroenterology", rating: 4.7, location: "Miami" },
            { name: "Dr. James Wilson", specialty: "Pulmonology", rating: 4.9, location: "Chicago" }
          ].map((doctor, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{doctor.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{doctor.specialty}</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{doctor.rating}</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {doctor.location}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}