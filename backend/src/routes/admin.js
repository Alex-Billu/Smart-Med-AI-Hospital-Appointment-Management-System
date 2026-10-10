const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/database');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Protect all admin routes
router.use(auth, requireRole('admin'));

// GET /api/admin/stats — Dashboard high level metrics
router.get('/stats', (req, res) => {
  try {
    const totalPatients = db.prepare(`SELECT COUNT(*) as count FROM users WHERE role = 'patient'`).get().count;
    const totalDoctors = db.prepare(`SELECT COUNT(*) as count FROM doctors`).get().count;
    const totalAppointments = db.prepare(`SELECT COUNT(*) as count FROM appointments`).get().count;
    
    const todayAppointments = db.prepare(`
      SELECT COUNT(*) as count FROM appointments 
      WHERE appointment_date = DATE('now')
    `).get().count;

    const statusCounts = db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM appointments 
      GROUP BY status
    `).all();

    const recentAppointments = db.prepare(`
      SELECT a.*, p.name as patient_name, p.email as patient_email, d.name as doctor_name, dep.name as department_name
      FROM appointments a
      JOIN users p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN departments dep ON d.department_id = dep.id
      ORDER BY a.created_at DESC
      LIMIT 10
    `).all();

    res.json({
      stats: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        todayAppointments
      },
      statusBreakdown: statusCounts,
      recentAppointments
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// GET /api/admin/doctors — List all doctors with details
router.get('/doctors', (req, res) => {
  try {
    const doctors = db.prepare(`
      SELECT d.*, u.email, u.phone, dep.name as department_name
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      JOIN departments dep ON d.department_id = dep.id
      ORDER BY d.name ASC
    `).all();

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// POST /api/admin/doctors — Add a new doctor
router.post('/doctors', async (req, res) => {
  const { name, email, password, phone, department_id, specialization, qualification, experience_years, consultation_fee, available_days, start_time, end_time, bio } = req.body;

  try {
    const existing = db.prepare(`SELECT id FROM users WHERE email = ?`).get(email);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password || 'doctor123', 10);

    const insertUser = db.prepare(`
      INSERT INTO users (name, email, password, phone, role) 
      VALUES (?, ?, ?, ?, 'doctor')
    `);
    
    const insertDoctor = db.prepare(`
      INSERT INTO doctors (user_id, department_id, name, specialization, qualification, experience_years, consultation_fee, available_days, start_time, end_time, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    db.transaction(() => {
      const userResult = insertUser.run(name, email, hashedPassword, phone || '', 'doctor');
      insertDoctor.run(
        userResult.lastInsertRowid,
        department_id,
        name,
        specialization || 'General Specialist',
        qualification || 'MBBS',
        experience_years || 5,
        consultation_fee || 500,
        available_days || 'Mon,Tue,Wed,Thu,Fri',
        start_time || '09:00',
        end_time || '17:00',
        bio || ''
      );
    })();

    res.status(201).json({ message: 'Doctor added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add doctor' });
  }
});

// GET /api/admin/patients — List all patients
router.get('/patients', (req, res) => {
  try {
    const patients = db.prepare(`
      SELECT id, name, email, phone, created_at,
      (SELECT COUNT(*) FROM appointments WHERE patient_id = users.id) as total_appointments
      FROM users 
      WHERE role = 'patient'
      ORDER BY created_at DESC
    `).all();

    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

module.exports = router;
