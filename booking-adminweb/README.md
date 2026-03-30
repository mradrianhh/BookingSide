# RIB Safari Booking - POC

A proof-of-concept booking website for a RIB safari company built with Next.js, PostgreSQL, and Podman.

## Features

- 📅 Interactive booking calendar
- 🏠 Homepage with company information
- ℹ️ About page with company details and tour offerings
- 💬 Chat dialog with contact form and phone/email display
- 📧 Email notifications for bookings and contact submissions
- 🗄️ PostgreSQL database for booking persistence
- 🐳 Podman for containerization (no daemon required)

## Setup

### 1. Gmail App Password

1. Enable 2FA on your Google account
2. Go to [Google Account Security](https://myaccount.google.com/security)
3. Generate an app password for Mail
4. Copy the 16-character password

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
GMAIL_USER=hansen.adrian.hardy@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
```

### 3. Run with Podman

```bash
podman-compose up
```

Or with rootless Podman:
```bash
podman-compose --podman-args "--userns=keep-id" up
```

Open http://localhost:3000

## Tech Stack

- Next.js 16 + React + TypeScript + TailwindCSS
- Next.js API Routes
- PostgreSQL 16
- Nodemailer + Gmail SMTP
- Podman & Podman Compose

## License

MIT
