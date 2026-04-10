const express = require('express');
const db = require('../db/database');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// All workout routes require a valid JWT
router.use(requireAuth);

// GET /api/workouts — get all workouts for logged-in user
router.get('/', (req, res) => {
  const workouts = db.prepare(
    'SELECT * FROM workouts WHERE user_id = ? ORDER BY logged_at DESC'
  ).all(req.user.id);

  res.json(workouts);
});

// POST /api/workouts — log a new workout
router.post('/', (req, res) => {
  const { exercise_name, sets, reps, weight, notes } = req.body;

  if (!exercise_name || !sets || !reps || !weight) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const result = db.prepare(
    `INSERT INTO workouts (user_id, exercise_name, sets, reps, weight, notes)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(req.user.id, exercise_name, sets, reps, weight, notes || null);

  const newWorkout = db.prepare('SELECT * FROM workouts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newWorkout);
});

// DELETE /api/workouts/:id
router.delete('/:id', (req, res) => {
  // Make sure the workout belongs to this user before deleting
  const workout = db.prepare(
    'SELECT * FROM workouts WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id);

  if (!workout) {
    return res.status(404).json({ error: 'Workout not found' });
  }

  db.prepare('DELETE FROM workouts WHERE id = ?').run(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;