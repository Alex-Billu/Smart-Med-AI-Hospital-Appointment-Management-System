const express = require('express');
const db = require('../db/database');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Helper: generate time slots between start and end
function generateSlots(start, end, durationMins) {
  const slots = [];
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let current = sh * 60 + sm;
  const endMin = eh * 60 + em;
  while (current + durationMins <= endMin) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    const h12 = h % 12 || 12;
    const ampm = h >= 12 ? 'PM' : 'AM';
    slots.push(`${h12}:${m.toString().padStart(2, '0')} ${ampm}`);
    current += durationMins;
  }
  return slots;
}

// GET /api/doctors
router.get('/', (req, res) => {
  const { department_id, department, search } = req.query;
  let query = `
    SELECT d.*, dept.name as department_name, dept.color as department_color
    FROM doctors d
    JOIN departments dept ON dept.id = d.department_id
    WHERE d.is_active = 1
  `;
  const params = [];
  if (department_id) { query += ' AND d.department_id = ?'; params.push(department_id); }
  if (department) { query += ' AND dept.name = ?'; params.push(department); }
  if (search) { query += ' AND (d.name LIKE ? OR d.specialization LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  query += ' ORDER BY d.rating DESC, d.experience DESC';
  const doctors = db.prepare(query).all(...params);
  res.json(doctors);
});

// GET /api/doctors/:id
router.get('/:id', (req, res) => {
  const doctor = db.prepare(`
    SELECT d.*, dept.name as department_name, dept.color as department_color
    FROM doctors d
    JOIN departments dept ON dept.id = d.department_id
    WHERE d.id = ?
  `).get(req.params.id);
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

  const schedules = db.prepare('SELECT * FROM schedules WHERE doctor_id = ? AND is_active = 1').all(doctor.id);
  doctor.schedules = schedules;
  res.json(doctor);
});

// GET /api/doctors/:id/slots?date=YYYY-MM-DD
router.get('/:id/slots', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Date is required' });

  const dateObj = new Date(date);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

  const schedule = db.prepare('SELECT * FROM schedules WHERE doctor_id = ? AND day_of_week = ? AND is_active = 1').get(req.params.id, dayName);
  if (!schedule) return res.json({ available: false, slots: [], message: `Doctor is not available on ${dayName}` });

  // Check leave
  const onLeave = db.prepare('SELECT id FROM leave_dates WHERE doctor_id = ? AND leave_date = ?').get(req.params.id, date);
  if (onLeave) return res.json({ available: false, slots: [], message: 'Doctor is on leave on this date' });

  // Generate all slots
  const allSlots = generateSlots(schedule.start_time, schedule.end_time, schedule.slot_duration);

  // Get booked slots
  const bookedSlots = db.prepare(`
    SELECT time_slot FROM appointments
    WHERE doctor_id = ? AND appointment_date = ? AND status NOT IN ('cancelled', 'rejected')
  `).all(req.params.id, date).map(r => r.time_slot);

  const slots = allSlots.map(slot => ({
    time: slot,
    available: !bookedSlots.includes(slot),
  }));

  res.json({ available: true, slots, dayName });
});

// PUT /api/doctors/:id/availability — update schedule
router.put('/:id/availability', auth, requireRole('doctor', 'admin'), (req, res) => {
  const { schedules } = req.body;
  if (!schedules) return res.status(400).json({ error: 'Schedules required' });

  db.prepare('DELETE FROM schedules WHERE doctor_id = ?').run(req.params.id);
  const insert = db.prepare('INSERT INTO schedules (doctor_id, day_of_week, start_time, end_time, slot_duration) VALUES (?, ?, ?, ?, ?)');
  schedules.forEach(s => insert.run(req.params.id, s.day_of_week, s.start_time, s.end_time, s.slot_duration || 30));

  res.json({ message: 'Availability updated' });
});

// POST /api/doctors/:id/leave — block leave date
router.post('/:id/leave', auth, requireRole('doctor', 'admin'), (req, res) => {
  const { date, reason } = req.body;
  db.prepare('INSERT INTO leave_dates (doctor_id, leave_date, reason) VALUES (?, ?, ?)').run(req.params.id, date, reason || null);
  res.json({ message: 'Leave date blocked' });
});

module.exports = router;
