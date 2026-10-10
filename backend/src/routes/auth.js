const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing required fields' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const hashed = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)').run(name, email, phone || null, hashed, 'patient');

  const user = db.prepare('SELECT id, name, email, phone, role FROM users WHERE id = ?').get(result.lastInsertRowid);
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, user });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  // If doctor, fetch doctor profile id
  let doctorId = null;
  if (user.role === 'doctor') {
    const doc = db.prepare('SELECT id FROM doctors WHERE user_id = ?').get(user.id);
    if (doc) doctorId = doc.id;
  }

  res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, doctorId } });
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').auth, (req, res) => {
  const user = db.prepare('SELECT id, name, email, phone, role FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// PUT /api/auth/profile — update name and phone
router.put('/profile', require('../middleware/auth').auth, (req, res) => {
  const { name, phone } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  db.prepare('UPDATE users SET name = ?, phone = ? WHERE id = ?')
    .run(name, phone || null, req.user.id);

  // Also update doctor name if role is doctor
  const updatedUser = db.prepare('SELECT id, name, email, phone, role FROM users WHERE id = ?').get(req.user.id);
  res.json(updatedUser);
});

module.exports = router;
