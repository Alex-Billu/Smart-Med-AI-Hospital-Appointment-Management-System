const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const db = require('./db/database');
const setupSocket = require('./socket');

// Import routes
const authRoutes = require('./routes/auth');
const departmentRoutes = require('./routes/departments');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

const socketHelpers = setupSocket(io);
app.set('socketHelpers', socketHelpers);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'KMCH SmartMed AI Backend API is running' });
});

// Auto-seed check
try {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    console.log('Database empty, auto-seeding...');
    require('./db/seed');
  }
} catch (err) {
  console.log('Auto-seed error or skipped:', err.message);
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 KMCH Backend running on port ${PORT}`);
  console.log(`📡 Socket.io server ready`);
});
