const express = require('express');
const db = require('../db/database');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

function generateBookingId() {
  const prefix = 'KMCH';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${date}-${rand}`;
}

// POST /api/appointments — Book appointment
router.post('/', auth, requireRole('patient'), (req, res) => {
  const { doctor_id, appointment_date, time_slot, notes } = req.body;
  if (!doctor_id || !appointment_date || !time_slot) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Conflict detection — no double booking same slot
  const conflict = db.prepare(`
    SELECT id FROM appointments
    WHERE doctor_id = ? AND appointment_date = ? AND time_slot = ?
    AND status NOT IN ('cancelled', 'rejected')
  `).get(doctor_id, appointment_date, time_slot);

  if (conflict) return res.status(409).json({ error: 'This slot is already booked. Please choose another slot.' });

  // Prevent same patient double booking same doctor same day
  const patientConflict = db.prepare(`
    SELECT id FROM appointments
    WHERE patient_id = ? AND doctor_id = ? AND appointment_date = ?
    AND status NOT IN ('cancelled', 'rejected')
  `).get(req.user.id, doctor_id, appointment_date);
  if (patientConflict) return res.status(409).json({ error: 'You already have an appointment with this doctor on this date.' });

  const doctor = db.prepare('SELECT * FROM doctors WHERE id = ?').get(doctor_id);
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

  const bookingId = generateBookingId();
  const result = db.prepare(`
    INSERT INTO appointments (booking_id, patient_id, doctor_id, department_id, appointment_date, time_slot, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
  `).run(bookingId, req.user.id, doctor_id, doctor.department_id, appointment_date, time_slot, notes || null);

  const appointment = db.prepare(`
    SELECT a.*, u.name as patient_name, d.name as doctor_name, dept.name as department_name
    FROM appointments a
    JOIN users u ON u.id = a.patient_id
    JOIN doctors d ON d.id = a.doctor_id
    JOIN departments dept ON dept.id = a.department_id
    WHERE a.id = ?
  `).get(result.lastInsertRowid);

  // Create notification for doctor
  const doctorUser = db.prepare('SELECT user_id FROM doctors WHERE id = ?').get(doctor_id);
  if (doctorUser) {
    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type, appointment_id)
      VALUES (?, ?, ?, 'appointment', ?)
    `).run(
      doctorUser.user_id,
      'New Appointment Booked',
      `Patient: ${req.user.name}\nDate: ${appointment_date}\nTime: ${time_slot}\nDept: ${appointment.department_name}`,
      appointment.id
    );
  }

  // Create confirmation notification for patient
  db.prepare(`
    INSERT INTO notifications (user_id, title, message, type, appointment_id)
    VALUES (?, ?, ?, 'success', ?)
  `).run(
    req.user.id,
    'Appointment Booked Successfully',
    `Your appointment with ${doctor.name} on ${appointment_date} at ${time_slot} has been booked. Booking ID: ${bookingId}`,
    appointment.id
  );

  // Emit socket event to doctor's room
  const io = req.app.get('io');
  if (io && doctorUser) {
    io.to(`user_${doctorUser.user_id}`).emit('newAppointment', {
      appointment,
      message: `New appointment from ${req.user.name}`,
    });
  }

  res.status(201).json({ appointment, bookingId });
});

// GET /api/appointments — Get appointments (scoped by role)
router.get('/', auth, (req, res) => {
  let query = `
    SELECT a.*, 
      u.name as patient_name, u.email as patient_email, u.phone as patient_phone,
      d.name as doctor_name, d.specialization, d.initials as doctor_initials,
      dept.name as department_name, dept.color as department_color
    FROM appointments a
    JOIN users u ON u.id = a.patient_id
    JOIN doctors d ON d.id = a.doctor_id
    JOIN departments dept ON dept.id = a.department_id
    WHERE 1=1
  `;
  const params = [];

  if (req.user.role === 'patient') {
    query += ' AND a.patient_id = ?'; params.push(req.user.id);
  } else if (req.user.role === 'doctor') {
    const doc = db.prepare('SELECT id FROM doctors WHERE user_id = ?').get(req.user.id);
    if (!doc) return res.json([]);
    query += ' AND a.doctor_id = ?'; params.push(doc.id);
  }
  // admin sees all
  if (req.query.status) { query += ' AND a.status = ?'; params.push(req.query.status); }
  if (req.query.date) { query += ' AND a.appointment_date = ?'; params.push(req.query.date); }

  query += ' ORDER BY a.appointment_date DESC, a.time_slot DESC';
  const appointments = db.prepare(query).all(...params);
  res.json(appointments);
});

// GET /api/appointments/:id
router.get('/:id', auth, (req, res) => {
  const apt = db.prepare(`
    SELECT a.*, 
      u.name as patient_name, u.email as patient_email,
      d.name as doctor_name, d.location, d.initials as doctor_initials,
      dept.name as department_name
    FROM appointments a
    JOIN users u ON u.id = a.patient_id
    JOIN doctors d ON d.id = a.doctor_id
    JOIN departments dept ON dept.id = a.department_id
    WHERE a.id = ? OR a.booking_id = ?
  `).get(req.params.id, req.params.id);
  if (!apt) return res.status(404).json({ error: 'Appointment not found' });
  res.json(apt);
});

// PUT /api/appointments/:id/status
router.put('/:id/status', auth, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['confirmed', 'completed', 'cancelled', 'rejected'];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const apt = db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id);
  if (!apt) return res.status(404).json({ error: 'Appointment not found' });

  db.prepare('UPDATE appointments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, apt.id);

  // Notify patient of status change
  const statusMsg = {
    confirmed: 'Your appointment has been confirmed by the doctor.',
    rejected: 'Your appointment has been rejected by the doctor. Please book a different slot.',
    completed: 'Your appointment has been marked as completed.',
    cancelled: 'Your appointment has been cancelled.',
  };

  db.prepare(`INSERT INTO notifications (user_id, title, message, type, appointment_id) VALUES (?, ?, ?, ?, ?)`).run(
    apt.patient_id,
    `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    statusMsg[status],
    status === 'confirmed' ? 'success' : status === 'rejected' ? 'error' : 'info',
    apt.id
  );

  // Emit socket event to patient
  const io = req.app.get('io');
  if (io) {
    io.to(`user_${apt.patient_id}`).emit('appointmentStatusChanged', { appointmentId: apt.id, status, message: statusMsg[status] });
  }

  res.json({ message: 'Appointment status updated', status });
});

module.exports = router;
