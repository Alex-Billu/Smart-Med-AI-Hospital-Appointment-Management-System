const express = require('express');
const db = require('../db/database');
const { auth } = require('../middleware/auth');
const router = express.Router();

// GET /api/notifications — Get all notifications for logged-in user
router.get('/', auth, (req, res) => {
  try {
    const notifications = db.prepare(`
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 50
    `).all(req.user.id);

    const unreadCount = db.prepare(`
      SELECT COUNT(*) as count FROM notifications 
      WHERE user_id = ? AND is_read = 0
    `).get(req.user.id);

    res.json({
      notifications,
      unread_count: unreadCount.count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PUT /api/notifications/:id/read — Mark notification as read
router.put('/:id/read', auth, (req, res) => {
  try {
    db.prepare(`
      UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?
    `).run(req.params.id, req.user.id);

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// PUT /api/notifications/read-all — Mark all as read
router.put('/read-all', auth, (req, res) => {
  try {
    db.prepare(`
      UPDATE notifications SET is_read = 1 WHERE user_id = ?
    `).run(req.user.id);

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

module.exports = router;
