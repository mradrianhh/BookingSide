# Quick Start Guide - RIB Safari Booking POC

## 🎉 Your POC is Ready!

The booking website is fully built and ready to run with Podman. Here's what we've created:

## 📦 What's Included

### Pages & Components
- ✅ **Homepage** (`/`) - Company info, features, and booking calendar
- ✅ **About Page** (`/about`) - Company story, tours, and features
- ✅ **Chat Dialog** - Contact form with phone/email display
- ✅ **Booking Calendar** - Interactive calendar with booking form

### Backend & Database
- ✅ **API Routes**:
  - `POST /api/bookings` - Create bookings
  - `GET /api/bookings` - Retrieve bookings
  - `POST /api/contact` - Send contact form emails
- ✅ **PostgreSQL Database** - Bookings table with customer info
- ✅ **Email Service** - Nodemailer + Gmail SMTP integration

### Deployment
- ✅ **Podman Compose** - Orchestrates Next.js + PostgreSQL
- ✅ **Dockerfile** - Containerized Next.js app
- ✅ **.env.local** - Environment configuration template

## 🚀 How to Run Locally with Podman

### Step 1: Set Up Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your device)
3. Copy the 16-character password

### Step 2: Configure Environment
```bash
cd booking-web
cp .env.local.example .env.local
```

Edit `.env.local` and replace:
```
GMAIL_APP_PASSWORD=your_16_char_password_here
```

### Step 3: Run with Podman
```bash
podman-compose up
```

The app will:
- Start PostgreSQL (port 5432)
- Run migrations automatically
- Start Next.js (port 3000)

For rootless Podman:
```bash
podman-compose --podman-args "--userns=keep-id" up
```

### Step 4: Access the App
- Open http://localhost:3000
- Try the booking calendar
- Click the chat button to test the contact form
- Visit http://localhost:3000/about

## 📊 Project Structure

```
booking-web/
├── src/
│   ├── app/
│   │   ├── api/bookings/route.ts      # Booking endpoints
│   │   ├── api/contact/route.ts       # Contact endpoint
│   │   ├── about/page.tsx             # About page
│   │   ├── layout.tsx                 # Navigation & layout
│   │   └── page.tsx                   # Homepage
│   ├── components/
│   │   ├── BookingCalendar.tsx        # Calendar + form
│   │   └── ChatDialog.tsx             # Contact dialog
│   └── lib/
│       ├── db.ts                      # PostgreSQL connection
│       └── email.ts                   # Nodemailer setup
├── public/migrations/
│   └── 001_create_bookings_table.sql  # Database schema
├── podman-compose.yml                 # Podman config
├── Dockerfile                          # Next.js container
└── .env.local                         # Environment variables
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 + React + TypeScript + TailwindCSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL 16 |
| Email | Nodemailer + Gmail SMTP |
| Containerization | Podman + Podman Compose |

## 📝 Database Schema

The `bookings` table stores:
- `customer_name` - Guest name
- `customer_email` - Guest email
- `customer_phone` - Guest phone
- `booking_date` - Tour date/time
- `participants` - Number of people
- `notes` - Special requests
- `created_at`, `updated_at` - Timestamps

## 🔄 How It Works

1. **User books a tour**: Fills calendar form → POST to `/api/bookings`
2. **Booking saved**: Data stored in PostgreSQL
3. **Confirmation sent**: Nodemailer sends email to customer
4. **Contact form**: Customer submits form → POST to `/api/contact`
5. **Email received**: Message sent to hansen.adrian.hardy@gmail.com with reply-to customer's email

## ⚙️ Features

- **Interactive Calendar**: Click dates to select booking date
- **Form Validation**: Required fields checked on both client & server
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on desktop and mobile
- **Professional UI**: TailwindCSS styling with blue theme
- **Email Notifications**: Auto-confirmation + support requests

## 🎯 Next Steps (Not Yet Implemented)

To move toward production, add:
- [ ] Admin dashboard to view/manage bookings
- [ ] Availability management (limit bookings per day)
- [ ] Payment integration (Stripe, PayPal)
- [ ] User authentication
- [ ] Email templates
- [ ] SMS notifications
- [ ] Booking cancellation/rescheduling
- [ ] Multi-language support
- [ ] Analytics & reporting

## 📧 Email Configuration

### Booking Confirmation
- Sent to: Customer email
- From: hansen.adrian.hardy@gmail.com
- Contains: Booking date & participant count

### Contact Form
- Sent to: hansen.adrian.hardy@gmail.com
- Reply-to: Customer email
- Contains: Customer message with name & email

## 🔐 Security Notes

- Never commit `.env.local` (already in .gitignore)
- Use app passwords, not your Google password
- In production: Use environment variables from secrets manager
- Add rate limiting & CSRF protection before production

## 📞 Quick Reference

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Homepage with booking calendar |
| http://localhost:3000/about | Company info & tours |
| http://localhost:3000/api/bookings | API endpoints |
| http://localhost:3000/api/contact | Contact form API |

---

**You're all set!** The POC is complete and ready to run with Podman. Just add your Gmail app password and you're good to go! 🎉
