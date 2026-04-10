const express = require('express');
const db = require('../db/database');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

// GET /api/calories?date=2025-04-10 — get logs for a specific day
router.get('/', (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];

  const logs = db.prepare(
    `SELECT * FROM food_logs 
     WHERE user_id = ? AND DATE(logged_at) = ?
     ORDER BY logged_at DESC`
  ).all(req.user.id, date);

  // Calculate totals for the day
  const totals = logs.reduce((acc, log) => ({
    calories: acc.calories + log.calories,
    protein: acc.protein + (log.protein || 0),
    carbs: acc.carbs + (log.carbs || 0),
    fat: acc.fat + (log.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  res.json({ logs, totals });
});

// POST /api/calories
router.post('/', (req, res) => {
  const { food_name, calories, protein, carbs, fat } = req.body;

  if (!food_name || !calories) {
    return res.status(400).json({ error: 'Food name and calories required' });
  }

  const result = db.prepare(
    `INSERT INTO food_logs (user_id, food_name, calories, protein, carbs, fat)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(req.user.id, food_name, calories, protein || 0, carbs || 0, fat || 0);

  const newLog = db.prepare('SELECT * FROM food_logs WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newLog);
});

// DELETE /api/calories/:id
router.delete('/:id', (req, res) => {
  const log = db.prepare(
    'SELECT * FROM food_logs WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id);

  if (!log) return res.status(404).json({ error: 'Log not found' });

  db.prepare('DELETE FROM food_logs WHERE id = ?').run(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;