# Form Service

A Formspree alternative that allows users to create forms, receive submissions, and manage them through a web dashboard.

## Features

- User authentication via email magic links
- Form creation and management
- Public form submission endpoints
- Email notifications for form submissions
- Submission management dashboard

## Tech Stack

- **Frontend**: Next.js + Tailwind CSS + Clerk
- **Backend**: Node.js + TypeScript + Fastify
- **Database**: PostgreSQL
- **Queue**: Redis + BullMQ
- **Email**: SendGrid
- **Deployment**: Vercel (Frontend) + Railway (Backend)

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (provided via Docker)
- Redis (provided via Docker)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development environment:
   ```bash
   # Start PostgreSQL and Redis
   docker-compose up -d

   # Start the development servers
   npm run dev
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Fill in the required environment variables

## Project Structure

```
form-service/
├── frontend/          # Next.js frontend application
├── backend/           # Fastify backend API
└── shared/           # Shared TypeScript types and utilities
```

## Development

- Frontend runs on http://localhost:3000
- Backend API runs on http://localhost:4000
- PostgreSQL runs on localhost:5432
- Redis runs on localhost:6379

## License

MIT 