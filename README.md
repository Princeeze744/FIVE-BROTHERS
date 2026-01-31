# Five Brothers Appliances CRM

Customer Relationship Management system for tracking appliance sales and follow-ups.

## Features

- 📊 Dashboard with real-time stats
- 👥 Customer management (CRUD)
- 📱 SMS messaging via Twilio
- ⭐ Review tracking (Google, Yelp, Facebook)
- 📝 Message templates
- 👤 User management (Admin/Staff roles)
- 📧 3-stage follow-up system (Day 1 → 7 → 21)

## Tech Stack

- **Frontend:** Next.js 15, React, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **Auth:** NextAuth.js
- **SMS:** Twilio

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in values
3. Install dependencies: `npm install`
4. Push database schema: `npx prisma db push`
5. Seed the database: `npx prisma db seed`
6. Run development server: `npm run dev`

## Default Login

- Email: admin@fivebrothers.com
- Password: Admin@123

## License

Private - Five Brothers Appliances