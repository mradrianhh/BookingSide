# RIB Safari Booking System

A complete booking system for Arctic RIB safari adventures with a customer-facing website and admin dashboard. Built with Next.js, React, TypeScript, TailwindCSS, and PostgreSQL running on Podman.

## 🎯 System Overview

This is a two-application system:
- **Booking Website** (Port 3000) - Customer-facing booking interface
- **Admin Dashboard** (Port 3001) - Staff management of availability and bookings
- **Shared Database** - Single PostgreSQL instance for both apps

## 🚀 Quick Start

### Prerequisites
- Podman & podman-compose
- Gmail account with app password (for email confirmations)

### Run Everything

```bash
cd BookingSide

# Start all services (database + booking website + admin dashboard)
podman-compose up -d

# Services available at:
# - Booking: http://localhost:3000
# - Admin:   http://localhost:3001
# - DB:      localhost:5432

# View logs
podman-compose logs -f

# Stop everything
podman-compose down
```

## 📚 Documentation

- **[booking-web/README.md](./booking-web/README.md)** - Booking website docs
- **[booking-adminweb/README.md](./booking-adminweb/README.md)** - Admin dashboard docs
- **[booking-web/SETUP_INSTRUCTIONS.md](./booking-web/SETUP_INSTRUCTIONS.md)** - Detailed setup guide

## ✨ Features

### Booking Website (booking-web)
✅ Interactive booking calendar  
✅ Customer booking form  
✅ Email confirmation system  
✅ About page  
✅ Contact dialog  
✅ Arctic-themed design  

### Admin Dashboard (booking-adminweb)
✅ Calendar-based slot management  
✅ Add/remove time slots  
✅ View bookings by date  
✅ Booking count per date  
✅ Same Arctic theme  

### Shared Features
✅ PostgreSQL database  
✅ Podman containerization  
✅ Next.js 16 + React 19  
✅ TypeScript  
✅ TailwindCSS v4  
✅ Auto-migrations on startup  

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 19.2.4 + TypeScript |
| Framework | Next.js 16.2.1 |
| Styling | TailwindCSS v4 |
| Database | PostgreSQL 16 Alpine |
| Backend | Next.js API Routes |
| Email | Nodemailer (Gmail SMTP) |
| Containerization | Podman + Compose |

## 📁 Project Structure

```
BookingSide/
├── docker-compose.yml              # Root orchestration
│
├── booking-web/                    # Customer website
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── layout.tsx         # Nav + footer
│   │   │   ├── about/page.tsx     # About page
│   │   │   └── api/
│   │   │       ├── bookings/      # Booking endpoints
│   │   │       └── contact/       # Contact endpoints
│   │   ├── components/
│   │   │   ├── BookingCalendar.tsx
│   │   │   └── ChatDialog.tsx
│   │   └── lib/
│   │       ├── db.ts
│   │       └── email.ts
│   ├── public/migrations/
│   │   └── 001_create_bookings_table.sql
│   ├── docker-compose.yml
│   ├── .env.local
│   └── package.json
│
├── booking-adminweb/               # Admin dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Admin dashboard
│   │   │   └── api/
│   │   │       ├── slots/         # Slot management
│   │   │       └── bookings/      # View bookings
│   │   ├── components/
│   │   │   └── AdminCalendar.tsx
│   │   └── lib/
│   │       └── db.ts
│   ├── public/migrations/
│   │   └── 002_create_available_slots_table.sql
│   ├── .env.local
│   └── package.json
│
└── README.md (this file)
```

## 🔧 Configuration

### Booking Website (.env.local)
```
DATABASE_URL=postgresql://booking_user:booking_password@postgres:5432/booking_db
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
NEXT_PUBLIC_APP_NAME=RIB Safari Booking
```

### Admin Dashboard (.env.local)
```
DATABASE_URL=postgresql://booking_user:booking_password@postgres:5432/booking_db
NEXT_PUBLIC_APP_NAME=RIB Safari Admin
```

## 🗄️ Database Schema

### bookings
- id, customer_name, customer_email, customer_phone
- booking_date, participants, notes
- created_at, updated_at

### available_slots
- id, slot_date, start_time, end_time
- created_at, updated_at

## 📧 Email Setup

To enable booking confirmations:

1. Enable 2FA on Gmail: https://myaccount.google.com
2. Generate app password: https://myaccount.google.com/apppasswords
3. Add to booking-web/.env.local:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-password
   ```

## 🎨 Design Theme

**Arctic Ocean Inspired**
- Dark slate backgrounds (slate-900)
- Cyan accents (cyan-400)
- Blue highlights (blue-500)
- Teal accents (teal-400)
- Light text on dark (white, slate-200)
- Gradient overlays

## 🚀 Development Workflow

### Option 1: Full Docker Stack (Recommended)
```bash
cd BookingSide
podman-compose up -d
# Edit files, changes hot-reload in containers
```

### Option 2: Local Development
```bash
# Terminal 1: Database only
cd booking-web
podman-compose -f docker-compose-db.yml up

# Terminal 2: Booking website
cd booking-web
npm install
npm run dev

# Terminal 3: Admin dashboard
cd booking-adminweb
npm install
npm run dev
```

## 🐛 Troubleshooting

### Services won't start
```bash
podman rm -f booking_web booking_admin booking_postgres
podman network rm booking_network
podman volume rm bookingside_postgres_data
podman-compose up -d
```

### Check service health
```bash
podman-compose ps
podman-compose logs postgres   # Database logs
podman-compose logs web        # Website logs
podman-compose logs admin      # Admin logs
```

### Ports already in use
Change ports in docker-compose.yml or kill the blocking process:
```bash
lsof -i :3000   # Find process on port 3000
kill <PID>
```

## 📖 API Endpoints

### Booking Website
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List all bookings
- `POST /api/contact` - Send contact message

### Admin Dashboard
- `GET /api/slots` - List available slots
- `POST /api/slots` - Create slot
- `DELETE /api/slots?id=X` - Delete slot
- `GET /api/bookings` - List bookings

## 🎯 Next Steps

1. ✅ Configure Gmail app password
2. ✅ Run `podman-compose up -d` from root
3. ✅ Test booking at http://localhost:3000
4. ✅ Test admin at http://localhost:3001
5. 🚀 Deploy to production (future enhancement)

---

**Arctic Explorer RIB Safari** - Your adventure awaits! 🧊⛵

