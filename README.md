# 🏥 KMCH SmartMed AI -- Hospital Appointment Management System


A full-stack, enterprise-grade Hospital Appointment Management Platform for **KMCH Hospital**, engineered with **Node.js, Express, SQLite, Socket.IO, Next.js 15, and Tailwind CSS**.


---

## 📐 System Architecture

```
HOSPITAL APPOINTMENT BOOKING/
├── backend/                  # Node.js + Express + SQLite + Socket.IO API
│   ├── src/
│   │   ├── db/              # SQLite database initialization & seed data
│   │   ├── middleware/      # JWT auth & role guards
│   │   ├── routes/          # Auth, Depts, Doctors, Appointments, Notifications, Admin
│   │   ├── socket/          # Socket.IO real-time event handlers
│   │   └── index.js         # Express server entry point
│   ├── database.sqlite      # SQLite database file
│   └── package.json
│
└── frontend/                 # Next.js 15 App Router Frontend
    ├── src/
    │   ├── app/             # Landing, Doctors, Login, Patient, Doctor, Admin pages
    │   ├── components/      # Glassmorphism Navbar, cards, layout
    │   ├── lib/             # Axios API client, Socket.IO client, Auth state
    │   └── types/           # TypeScript interfaces
    └── package.json
```

---

## ⚡ Quick Start

### 1. Start the Backend API (Port 4000)

```bash
cd backend
npm install
node src/db/seed.js   # Seeds departments, doctors & demo accounts
node src/index.js     # Starts server on http://localhost:4000
```

### 2. Start the Frontend (Port 3000)

```bash
cd frontend
npm install
npm run dev -- --webpack   # Starts Next.js on http://localhost:3000
```
---

## 🚀 Core Features & Portals

### 👤 Patient Module
- **Registration & Authentication**: Secure JWT login with email/phone credentials.
- **Department Selection**: Browse 8 medical departments (Cardiology, Neurology, Orthopedics, Pediatrics, etc.) with real-time doctor counts.
- **Doctor Directory & Filtering**: Filter by medical specialty, experience, rating, and consultation fees.
- **Real-Time Slot Picker**: Doctor schedules dynamically check booked slots in SQLite to prevent double-booking.
- **Digital Pass & QR Ticket**: Confirmed appointments generate digital passes with booking IDs (e.g. `KMCH-20260908-XXXX`).
- **Patient Dashboard & History**: Monitor health metrics and review upcoming/past appointments with cancellation capability.
  

### 🩺 Doctor Portal
- **Real-Time OPD Queue**: Live statistics of total, pending, confirmed, and completed consultations.
- **Instant Booking Alerts**: Real-time notifications pushed via Socket.IO whenever a patient registers a booking.
- **Status Management**: 1-click status updates (Accept/Confirm, Mark Completed, Cancel).

### 🛡️ Hospital Administration Portal
- **Operations Analytics**: Overview of total patients, active doctors, scheduled visits, and capacity metrics.
- **Status Breakdown**: Live counts of pending vs confirmed vs completed appointments.
- **Doctor & Shift Management**: Add new doctors, define consultation fees, and assign department shifts.

---

## 🔑 Demo Credentials

| Role | Email | Password | Direct Portal |
|---|---|---|---|
| **Patient** | `patient@kmch.com` | `patient123` | [Patient Dashboard](http://localhost:3000/patient/dashboard) |
| **Doctor** | `arun@kmch.com` | `doctor123` | [Doctor Dashboard](http://localhost:3000/doctor/dashboard) |
| **Admin** | `admin@kmch.com` | `admin@kmch123` | [Admin Portal](http://localhost:3000/admin) |

*(Quick 1-click login buttons are also available on the [Login Page](http://localhost:3000/login))*

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new patient | No |
| `POST` | `/api/auth/login` | Login user & receive JWT | No |
| `GET` | `/api/departments` | List all departments + doctor count | No |
| `GET` | `/api/doctors` | List doctors with optional search/filter | No |
| `GET` | `/api/doctors/:id` | Get single doctor details | No |
| `GET` | `/api/doctors/:id/slots` | Fetch real-time available time slots | No |
| `POST` | `/api/appointments` | Book appointment with conflict prevention | Yes (Patient) |
| `GET` | `/api/appointments/my-appointments` | Patient appointment history | Yes (Patient) |
| `GET` | `/api/appointments/doctor-appointments` | Doctor's assigned consultations | Yes (Doctor) |
| `PUT` | `/api/appointments/:id/status` | Update status (confirm, complete, cancel) | Yes (Doctor/Admin) |
| `PUT` | `/api/appointments/:id/cancel` | Cancel patient appointment | Yes (Patient) |
| `GET` | `/api/notifications` | User notifications & unread count | Yes |
| `GET` | `/api/admin/stats` | High-level hospital statistics | Yes (Admin) |
| `GET` | `/api/admin/doctors` | List all doctors for administration | Yes (Admin) |
| `POST` | `/api/admin/doctors` | Add new doctor & user credentials | Yes (Admin) |
