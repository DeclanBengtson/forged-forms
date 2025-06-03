# Form Service

A lightweight Formspree alternative that allows users to create forms, receive submissions, and manage them through a web dashboard — all without writing backend code.

## ✨ Features

- User authentication via email magic links (Supabase Auth)
- Form creation and management via UI
- Public form submission endpoints (HTML/JS compatible)
- Email notifications on form submission (Postmark or SendGrid)
- Dashboard to view and manage submissions

## 🧱 Tech Stack

- **Fullstack App**: Next.js (Pages Router)
- **Styling**: Tailwind CSS
- **Auth**: Supabase Auth (magic links)
- **Database**: PostgreSQL (via Supabase)
- **Email**:  SendGrid
- **Hosting**: Vercel (Frontend + API routes)

## ⚙️ Prerequisites (Local Dev)

- Node.js 18+
- PostgreSQL 

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/form-service.git
   cd form-service
