# Teknikoz University Backend

Backend API for Teknikoz University contact form and course brochure system.

## Project Overview

This backend handles two main workflows:
1. **Contact Form Submission** - Users can submit contact information to get in touch
2. **Course Brochure Request** - Users can request course brochures delivered via email

## Tech Stack

- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL)
- **Email Service:** Resend
- **File Storage:** Supabase Storage (for PDF brochures)
- **Validation:** Zod
- **Testing:** Jest & Supertest
- **API Documentation:** Swagger/OpenAPI

## Features

### Core Functionality
- Contact form submission with validation
- Course brochure request handling
- Email delivery with PDF attachments
- Rate limiting and spam protection
- Comprehensive error handling

### Available Courses
- PLM Windchill
- Siemens Teamcenter
- Cloud Solutions
- Web Development
- Data Science
- Mobile Development
- DevOps
- AI/Machine Learning
- Cybersecurity
- Cloud Computing

## API Endpoints

### Public Endpoints
- `POST /api/contacts` - Submit contact form
- `POST /api/brochure-request` - Request course brochure

### Admin Endpoints (Protected)
- `GET /api/contacts` - Get all contacts
- `GET /api/brochure-requests` - Get all brochure requests
- `POST /api/send-brochure` - Manual brochure sending

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Server Configuration
PORT=8080
FRONTEND_URL=http://localhost:3000

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key

# Admin Authentication (for protected endpoints)
ADMIN_SECRET=your_admin_secret
```

## Getting Started

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run in production mode
npm run start

# Run tests
npm test
```

## Database Schema

### Contacts Table
- id (UUID, primary key)
- name (text, required)
- email (text, required)
- phone (text, required)
- course_interest (text, required)
- message (text, optional)
- form_type ('contact' | 'brochure')
- created_at (timestamp)
- updated_at (timestamp)

### Brochure Requests Table
- id (UUID, primary key)
- contact_id (UUID, foreign key)
- course_type (text, required)
- brochure_name (text, required)
- email_sent (boolean, default false)
- email_sent_at (timestamp)
- created_at (timestamp)

## API Documentation

After starting the server, access the API documentation at:
```
http://localhost:8080/api-docs
```

## Project Structure

```
.
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Express middlewares
│   ├── repositories/     # Database interactions
│   ├── routes/           # API routes
│   ├── schemas/          # Validation schemas
│   ├── services/         # Business logic
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── docs/                 # Documentation
├── tables/               # SQL scripts
├── index.ts              # Application entry point
└── package.json
```

## Security Features

- Request validation with Zod
- Rate limiting to prevent spam
- CORS configuration
- Input sanitization
- Error handling without sensitive data exposure

## License

This project is licensed under the MIT License.