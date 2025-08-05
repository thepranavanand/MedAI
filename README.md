# MedAI

A Next.js application for booking medical appointments with AI-powered symptom analysis using Google Gemini API.

## Features

- AI-powered symptom analysis with multilingual support
- Doctor appointment booking system
- Patient and doctor dashboards
- Real-time appointment management
- Multi-language symptom support (English, Hindi, Urdu)
- Emergency symptom detection
- Doctor specialty matching

## Tech Stack

- Next.js 15
- TypeScript
- Prisma (MongoDB)
- NextAuth.js
- Tailwind CSS
- Google Gemini AI API
- Radix UI Components

## Prerequisites

- Node.js 18+
- MongoDB database
- Google Gemini API key

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key
DATABASE_URL=your-mongodb-connection-string
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### Environment Variables Description

- `NEXT_PUBLIC_OPENAI_API_KEY`: OpenAI API key for AI features
- `GEMINI_API_KEY`: Google Gemini API key for symptom analysis
- `DATABASE_URL`: MongoDB connection string for database
- `NEXTAUTH_SECRET`: Secret key for NextAuth.js authentication
- `NEXTAUTH_URL`: Your application URL for authentication

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MedAI
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see above)

4. Set up the database:
```bash
npx prisma db push
```

5. Seed the database with sample data:
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Database Setup

The application uses MongoDB with Prisma as the ORM. The database schema includes:

- Users (patients and doctors)
- Appointments
- Time slots
- Doctor profiles

## Sample Data

The seed script creates sample accounts:

**Patient:**
- Email: harry.potter@hogwarts.edu
- Password: password123

**Doctors:**
- dr.hermione@hogwarts.edu (Cardiology)
- dr.sirius@grimmauld.edu (Neurology)
- dr.remus@hogsmeade.edu (Gastroenterology)
- dr.albus@diagon.edu (Pulmonology)
- dr.minerva@beauxbatons.edu (Dermatology)
- dr.severus@durmstrang.edu (Orthopedics)

## API Endpoints

- `/api/auth/*` - Authentication endpoints
- `/api/doctors` - Doctor listing and management
- `/api/symptoms/analyze` - AI symptom analysis
- `/api/appointments` - Appointment management
- `/api/doctors/profile` - Doctor profile management

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── doctors/           # Doctor listing pages
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   ├── doctors/           # Doctor-related components
│   ├── symptoms/          # Symptom analysis components
│   └── ui/               # UI components
├── lib/                  # Utility libraries
├── prisma/               # Database schema and migrations
└── types/                # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:seed` - Seed database with sample data

## Deployment

The application can be deployed to Vercel, Netlify, or any other Next.js-compatible hosting platform. Make sure to:

1. Set up environment variables in your hosting platform
2. Configure your MongoDB database
3. Set up the Google Gemini API key
4. Run database migrations

## License

This project is licensed under the MIT License. 