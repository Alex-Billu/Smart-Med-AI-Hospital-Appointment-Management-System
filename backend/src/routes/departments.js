const express = require('express');
const db = require('../db/database');
const router = express.Router();

// GET /api/departments
router.get('/', (req, res) => {
  const departments = db.prepare(`
    SELECT d.*, 
      COUNT(DISTINCT doc.id) as doctor_count
    FROM departments d
    LEFT JOIN doctors doc ON doc.department_id = d.id AND doc.is_active = 1
    GROUP BY d.id
    ORDER BY d.name
  `).all();
  res.json(departments);
});

// GET /api/departments/:id
router.get('/:id', (req, res) => {
  const dept = db.prepare('SELECT * FROM departments WHERE id = ?').get(req.params.id);
  if (!dept) return res.status(404).json({ error: 'Department not found' });
  res.json(dept);
});

module.exports = router;
