import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  const patient1 = await prisma.user.upsert({
    where: { email: 'harry.potter@hogwarts.edu' },
    update: {},
    create: {
      email: 'harry.potter@hogwarts.edu',
      password: await bcrypt.hash('password123', 10),
      name: 'Harry Potter',
      role: 'PATIENT',
      patient: {
        create: {
          phoneNumber: '+1-555-0123'
        }
      }
    }
  })

  const doctor1 = await prisma.user.upsert({
    where: { email: 'dr.hermione@hogwarts.edu' },
    update: {},
    create: {
      email: 'dr.hermione@hogwarts.edu',
      password: await bcrypt.hash('password123', 10),
      name: 'Dr. Hermione Granger',
      role: 'DOCTOR',
      doctor: {
        create: {
          specialty: 'Cardiology',
          experience: '15 years',
          location: 'Hogwarts School of Witchcraft and Wizardry',
          address: 'Great Hall, Hogwarts Castle, Scotland',
          expertise: ['Heart Disease', 'Hypertension', 'Cardiac Surgery'],
          languages: ['English', 'Ancient Runes'],
          consultationFee: '$200',
          available: true,
          videoConsultation: true,
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvdgKpwWFIGKD80J-LfgKsmMDA3GauSktd1A&s'
        }
      }
    }
  })

  const doctor2 = await prisma.user.upsert({
    where: { email: 'dr.sirius@grimmauld.edu' },
    update: {},
    create: {
      email: 'dr.sirius@grimmauld.edu',
      password: await bcrypt.hash('password123', 10),
      name: 'Dr. Sirius Black',
      role: 'DOCTOR',
      doctor: {
        create: {
          specialty: 'Neurology',
          experience: '12 years',
          location: 'Grimmauld Place',
          address: '12 Grimmauld Place, London, England',
          expertise: ['Stroke', 'Epilepsy', 'Multiple Sclerosis'],
          languages: ['English', 'French'],
          consultationFee: '$250',
          available: true,
          videoConsultation: true,
          image: 'https://static.wikia.nocookie.net/harrypotter/images/b/bc/OOTP_promo_front_closeup_Sirius_Black.jpg/revision/latest/scale-to-width-down/1000?cb=20150918055024'
        }
      }
    }
  })

  const doctor3 = await prisma.user.upsert({
    where: { email: 'dr.remus@hogsmeade.edu' },
    update: {},
    create: {
      email: 'dr.remus@hogsmeade.edu',
      password: await bcrypt.hash('password123', 10),
      name: 'Dr. Remus Lupin',
      role: 'DOCTOR',
      doctor: {
        create: {
          specialty: 'Gastroenterology',
          experience: '10 years',
          location: 'Hogsmeade Village',
          address: 'The Three Broomsticks, Hogsmeade, Scotland',
          expertise: ['IBS', 'Crohn\'s Disease', 'Digestive Health'],
          languages: ['English', 'Latin'],
          consultationFee: '$180',
          available: true,
          videoConsultation: true,
          image: 'https://static.wikia.nocookie.net/harrypotter/images/e/e2/Remus_Lupin_Deathly_Hallows_promo_image.jpg/revision/latest/scale-to-width-down/1000?cb=20161119235913'
        }
      }
    }
  })

  const doctor4 = await prisma.user.upsert({
    where: { email: 'dr.albus@diagon.edu' },
    update: {},
    create: {
      email: 'dr.albus@diagon.edu',
      password: await bcrypt.hash('password123', 10),
      name: 'Dr. Albus Dumbledore',
      role: 'DOCTOR',
      doctor: {
        create: {
          specialty: 'Pulmonology',
          experience: '20 years',
          location: 'Diagon Alley',
          address: 'Gringotts Bank, Diagon Alley, London',
          expertise: ['Asthma', 'COPD', 'Sleep Disorders'],
          languages: ['English', 'Mermish'],
          consultationFee: '$190',
          available: true,
          videoConsultation: true,
          image: 'https://static.wikia.nocookie.net/harrypotter/images/e/ee/Albus_Dumbledore_before_presenting_the_Goblet_of_Fire.jpg/revision/latest/thumbnail-down/width/200/height/200?cb=20150813052839'
        }
      }
    }
  })

  const doctor5 = await prisma.user.upsert({
    where: { email: 'dr.minerva@beauxbatons.edu' },
    update: {},
    create: {
      email: 'dr.minerva@beauxbatons.edu',
      password: await bcrypt.hash('password123', 10),
      name: 'Dr. Minerva McGonagall',
      role: 'DOCTOR',
      doctor: {
        create: {
          specialty: 'Dermatology',
          experience: '8 years',
          location: 'Beauxbatons Academy',
          address: 'Beauxbatons Academy of Magic, France',
          expertise: ['Acne', 'Eczema', 'Skin Cancer'],
          languages: ['English', 'French'],
          consultationFee: '$160',
          available: true,
          videoConsultation: true,
          image: 'https://static.wikia.nocookie.net/harrypotter/images/6/65/ProfessorMcGonagall-HBP.jpg/revision/latest?cb=20100612114856'
        }
      }
    }
  })

  const doctor6 = await prisma.user.upsert({
    where: { email: 'dr.severus@durmstrang.edu' },
    update: {},
    create: {
      email: 'dr.severus@durmstrang.edu',
      password: await bcrypt.hash('password123', 10),
      name: 'Dr. Severus Snape',
      role: 'DOCTOR',
      doctor: {
        create: {
          specialty: 'Orthopedics',
          experience: '18 years',
          location: 'Durmstrang Institute',
          address: 'Durmstrang Institute, Northern Europe',
          expertise: ['Sports Injuries', 'Joint Replacement', 'Fractures'],
          languages: ['English', 'German'],
          consultationFee: '$220',
          available: true,
          videoConsultation: true,
          image: 'https://static.wikia.nocookie.net/harrypotter/images/8/88/Snape_Teaching_Potions.png/revision/latest/scale-to-width-down/1000?cb=20110319032339'
        }
      }
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('📋 Sample Accounts Created:')
  console.log('👤 Patient: harry.potter@hogwarts.edu / password123')
  console.log('👨‍⚕️ Doctor: dr.hermione@hogwarts.edu / password123')
  console.log('👨‍⚕️ Doctor: dr.sirius@grimmauld.edu / password123')
  console.log('👨‍⚕️ Doctor: dr.remus@hogsmeade.edu / password123')
  console.log('👨‍⚕️ Doctor: dr.albus@diagon.edu / password123')
  console.log('👨‍⚕️ Doctor: dr.minerva@beauxbatons.edu / password123')
  console.log('👨‍⚕️ Doctor: dr.severus@durmstrang.edu / password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 