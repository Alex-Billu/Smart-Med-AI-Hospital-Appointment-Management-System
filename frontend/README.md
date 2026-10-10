# 🏥 KMCH SmartMed AI — Frontend

A state-of-the-art, responsive web application for the **KMCH Hospital Appointment Management System**. Built with Next.js 15, Tailwind CSS, Axios, and Socket.IO client.

---

## ✨ Features

- 🏥 **Center of Excellence & Departments** (`/departments`): Browse specialized departments with real-time doctor counts.
- 👨‍⚕️ **Doctor Directory & Filtering** (`/doctors`): Search by doctor name, medical specialty, department, and consultation fee.
- 📅 **Dynamic Slot Picker** (`/doctors/[id]`): Real-time doctor schedule with date selection and automatic conflict prevention.
- 🎫 **Digital Appointment Pass** (`/doctors/[id]/book`): Confirmed bookings generate unique `KMCH-YYYYMMDD-XXXX` IDs with scannable QR passes.
- 📊 **Patient Dashboard** (`/patient/dashboard`): Health metric monitors (Heart Rate, BP, Blood Sugar) and upcoming visits.
- 📜 **Appointment History** (`/patient/appointments`): Filter visits by status (`pending`, `confirmed`, `completed`, `cancelled`) with 1-click cancellation.
- 🩺 **Doctor Control Center** (`/doctor/dashboard`): Instant real-time alerts when patients book, plus 1-click status actions (Accept, Complete, Cancel).
- 🛡️ **Hospital Administration Portal** (`/admin`): High-level operations analytics, today's schedule counter, and doctor roster management (`/admin/doctors`).
- 🔔 **Live Notification Hub** (`/notifications`): Real-time Socket.IO alerts with unread counter badges.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS, Lucide Icons
- **HTTP Client**: Axios (with JWT interceptor)
- **Real-Time**: Socket.IO Client
- **Dates & Utility**: `date-fns`, `js-cookie`

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file (optional, defaults are preconfigured):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

### 3. Run Development Server
```bash
npm run dev -- --webpack
```

> **Note**: On systems without Turbopack native binary support, use `--webpack` as shown above.

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔑 Demo Logins

Test all portals instantly using the 1-Click Demo Buttons on [`/login`](http://localhost:3000/login):

| Role | Email | Password | Landing Page |
|---|---|---|---|
| **Patient** | `patient@kmch.com` | `patient123` | `/patient/dashboard` |
| **Doctor** | `arun@kmch.com` | `doctor123` | `/doctor/dashboard` |
| **Admin** | `admin@kmch.com` | `admin@kmch123` | `/admin` |
