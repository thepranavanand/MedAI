export interface Doctor {
  id: string
  name: string
  specialty: string
  experience: string
  location: string
  address: string
  expertise: string[]
  languages: string[]
  consultationFee: string
  available: boolean
  videoConsultation: boolean
  image: string
}