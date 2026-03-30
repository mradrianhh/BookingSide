# RIB Safari Booking POC - Setup Instructions

## Project Complete! ✅

Your RIB Safari booking POC is fully built and ready to run with Docker locally.

## Directory Structure

```
BookingSide/
└── booking-web/                           # Main Next.js application
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx                  # 🏠 Homepage
    │   │   ├── layout.tsx                # Navigation & layout
    │   │   ├── about/page.tsx            # ℹ️ About page
    │   │   ├── api/
    │   │   │   ├── bookings/route.ts     # 📅 Booking API
    │   │   │   └── contact/route.ts      # 💬 Contact API
    │   │   └── globals.css               # Styling
    │   ├── components/
    │   │   ├── BookingCalendar.tsx       # Calendar form
    │   │   └── ChatDialog.tsx            # Chat dialog
    │   └── lib/
    │       ├── db.ts                     # Database queries
    │       └── email.ts                  # Email service
    ├── public/migrations/
    │   └── 001_create_bookings_table.sql # Database schema
    ├── docker-compose.yml                 # 🐳 Docker setup
    ├── Dockerfile                         # Next.js container
    ├── .env.local.example                 # Config template
    ├── package.json                       # Dependencies
    ├── README.md                          # Full documentation
    └── QUICKSTART.md                      # Quick start guide
```

## What's Built

### Frontend (Next.js + React)
- ✅ **Homepage** - Beautiful landing page with booking calendar
- ✅ **About Page** - Company story, tours, and features
- ✅ **Booking Calendar** - Interactive month calendar with form
- ✅ **Chat Dialog** - Contact form with phone/email display
- ✅ **Navigation** - Header with links to Home and About
- ✅ **Responsive Design** - TailwindCSS styling (mobile-friendly)

### Backend (Node.js API Routes)
- ✅ **POST /api/bookings** - Accept and save bookings
- ✅ **GET /api/bookings** - Retrieve all bookings
- ✅ **POST /api/contact** - Handle contact form submissions

### Database (PostgreSQL)
- ✅ **bookings table** - Stores customer bookings
  - customer_name, customer_email, customer_phone
  - booking_date, participants, notes
  - created_at, updated_at timestamps

### Email Service (Nodemailer)
- ✅ **Booking confirmations** - Auto-sent to customers
- ✅ **Contact forms** - Sent to hansen.adrian.hardy@gmail.com

### Deployment
- ✅ **docker-compose.yml** - Orchestrates app + database
- ✅ **Dockerfile** - Containerizes Next.js app
- ✅ **Environment setup** - .env.local for secrets

## Getting Started

### Prerequisites
- Docker Desktop installed
- Gmail account with 2FA enabled

### Step 1: Get Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select Mail → Windows Computer
3. Copy the 16-character password

### Step 2: Configure Project
```bash
cd /Users/Adrian.Hardy.Hansen/Documents/Projects/BookingSide/booking-web

# Create .env.local from template
cp .env.local.example .env.local

# Edit .env.local and add your Gmail app password
# GMAIL_APP_PASSWORD=your_16_char_password_here
```

### Step 3: Run with Docker
```bash
docker-compose up
```

Wait for PostgreSQL to start (you'll see "database is ready to accept connections")

### Step 4: Access the Application
- **Homepage:** http://localhost:3000
- **About:** http://localhost:3000/about
- **Chat button:** Bottom-right corner of any page

## How to Use

### Make a Booking
1. Click on a date in the calendar
2. Fill in your details (name, email, phone)
3. Select number of participants
4. Add any special notes (optional)
5. Click "Confirm Booking"
6. You'll receive a confirmation email

### Contact Support
1. Click the chat button (bottom-right)
2. Fill in your details
3. Type your message
4. Click "Send Message"
5. Message sent to hansen.adrian.hardy@gmail.com
6. You'll receive replies at your email

## API Usage

### Create Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+1 555-0123",
    "bookingDate": "2024-04-15T10:00:00Z",
    "participants": 4,
    "notes": "Group booking"
  }'
```

### Get All Bookings
```bash
curl http://localhost:3000/api/bookings
```

### Send Contact Message
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "message": "I have a question about private charters..."
  }'
```

## Docker Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Reset database (warning: deletes all data)
docker-compose down -v

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f web
docker-compose logs -f postgres
```

## Troubleshooting

### Port Already in Use
If 3000 or 5432 is already in use, edit docker-compose.yml:
```yaml
services:
  web:
    ports:
      - "3001:3000"  # Change 3000 to 3001
  postgres:
    ports:
      - "5433:5432"  # Change 5432 to 5433
```

### Database Connection Failed
- Ensure PostgreSQL container is healthy: `docker-compose logs postgres`
- Wait a few seconds for database to initialize
- Check DATABASE_URL in .env.local

### Email Not Sending
- Verify GMAIL_APP_PASSWORD is correct (16 characters)
- Check that 2FA is enabled on Gmail account
- Check container logs: `docker-compose logs web`
- Verify GMAIL_USER is correct in .env.local

### Build Issues
```bash
# Clear Docker cache and rebuild
docker-compose down
docker system prune
docker-compose up --build
```

## Development Without Docker

If you want to run locally without Docker:

1. Install PostgreSQL locally
2. Create database: `createdb booking_db`
3. Update DATABASE_URL in .env.local: `postgresql://user:password@localhost:5432/booking_db`
4. Run migrations: `psql -d booking_db -f public/migrations/001_create_bookings_table.sql`
5. Start dev server: `npm run dev`

## Next Steps

Ready to move toward production?

1. **Deploy to Cloud** - Vercel (frontend) + Railway/Render (backend)
2. **Add Auth** - User accounts and admin panel
3. **Availability** - Limit bookings per day/time
4. **Payments** - Stripe integration for deposits
5. **Monitoring** - Error tracking and analytics
6. **Backups** - Automated PostgreSQL backups

## File Reference

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Homepage with hero section |
| `src/app/about/page.tsx` | About page with company info |
| `src/app/layout.tsx` | Root layout with navigation |
| `src/components/BookingCalendar.tsx` | Calendar + booking form |
| `src/components/ChatDialog.tsx` | Contact modal dialog |
| `src/lib/db.ts` | PostgreSQL connection & queries |
| `src/lib/email.ts` | Nodemailer configuration |
| `src/app/api/bookings/route.ts` | Booking endpoints |
| `src/app/api/contact/route.ts` | Contact form endpoint |
| `docker-compose.yml` | Docker service orchestration |
| `Dockerfile` | Next.js container image |
| `.env.local` | Environment variables |

## Tech Stack Summary

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Database:** PostgreSQL 16
- **ORM/Query:** Raw SQL with pg library
- **Email:** Nodemailer
- **Container:** Docker & Docker Compose
- **Server:** Node.js

## Support

For questions about specific files, check:
- `README.md` - Full documentation
- `QUICKSTART.md` - Quick reference guide
- Code comments in src/ files

---

**Your POC is ready to ship!** 🚀

Just add your Gmail app password to .env.local and run `docker-compose up`!
