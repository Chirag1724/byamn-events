# Byamn Events

> **Summer Web Development Internship 2026 — Full Stack Project**

A production-ready **Event Registration & Management System** inspired by platforms like [Luma](https://lu.ma). Hosts can create and manage events, view attendee registrations, and export attendee lists as CSV. Attendees can browse events, register (creating an account in the process), log in, and cancel registrations — all without admin involvement.

**Live Demo:** [byamn-events.vercel.app](https://byamn-events.vercel.app/) &nbsp;|&nbsp; **Repository:** [github.com/Chirag1724/byamn-events](https://github.com/Chirag1724/byamn-events)

---

## Features

### Host
- Sign up and log in securely via **NextAuth.js**
- Create events with title, description, date, time, location, optional capacity, and registration cutoff
- Protected dashboard — view all registrations (**Name + Email only** — passwords never exposed)
- Manually close or delete events
- Export attendee list as **CSV** (Name + Email)
- Registration count shown per event

### Attendee
- Browse all public events — no login required
- Register for an event by providing Name, Email, and Password (account created on the spot)
- Log in to view all registered events
- Cancel a registration from the "My Events" page

### Bonus Features Implemented
- Duplicate registration prevention (same email cannot register twice per event)
- Auto-close registration when event capacity is reached
- Registration cutoff date/time enforcement
- Live attendee count on public event pages
- Search / filter attendees in the host dashboard
- Responsive and polished dark-mode UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router) |
| Frontend Library | **React 19** |
| Language | **TypeScript 5** — zero `any` types |
| Styling | **Tailwind CSS v4** + **Radix UI** (shadcn/ui) |
| Database | **MongoDB** + Mongoose |
| Authentication | **NextAuth.js v5** (hosts) + **jose JWT** (attendees) |
| Validation | **Zod** + React Hook Form |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Host & attendee login/register pages
│   ├── (host)/          # Protected host dashboard + event management
│   ├── (attendee)/      # Protected attendee "My Events" page
│   ├── (public)/        # Public event browse + event detail pages
│   └── api/             # REST API routes
├── components/          # Reusable UI components
├── models/              # Mongoose schemas (Host, Attendee, Event, Registration)
├── services/            # Business logic layer
├── validators/          # Zod validation schemas
├── types/               # TypeScript types
└── lib/                 # DB connection, auth config, utilities
```

---

## Getting Started (Local Development)

### Prerequisites
- **Node.js** v18+
- **MongoDB** — local instance OR [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier

### 1. Clone the repository

```bash
git clone https://github.com/Chirag1724/byamn-events.git
cd byamn-events
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values:

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/byamn-events

# NextAuth.js v5 secret — generate with: openssl rand -base64 32
AUTH_SECRET=your_auth_secret_here

# Custom JWT secret for attendee sessions — generate with: openssl rand -base64 32
JWT_SECRET=your_jwt_secret_here
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

**Live URL:** [https://byamn-events.vercel.app/](https://byamn-events.vercel.app/)

Deployed on **Vercel** with **MongoDB Atlas** (free tier). To deploy your own instance:

1. Fork the [repository](https://github.com/Chirag1724/byamn-events)
2. Import the repo at [vercel.com](https://vercel.com)
3. Add the three environment variables (`MONGODB_URI`, `AUTH_SECRET`, `JWT_SECRET`) in the Vercel dashboard
4. Deploy — Vercel auto-detects Next.js

---

## Security Notes

- Attendee and host passwords are **hashed with bcrypt** — never stored in plain text
- Passwords are **never returned** by any API endpoint or included in CSV exports
- The host dashboard only shows **Name + Email** of attendees
- Host routes are protected by NextAuth.js session; attendee routes are protected by a signed JWT cookie

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | TypeScript type check |
