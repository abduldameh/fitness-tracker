require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const calorieRoutes = require('./routes/calories');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware — runs on every request
app.use(cors());                        // allow frontend to call us
app.use(express.json());                // parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/calories', calorieRoutes);

// Health check — useful for deployment
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});