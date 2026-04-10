import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function Dashboard() {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [todayCalories, setTodayCalories] = useState({ totals: { calories: 0, protein: 0 } })

  useEffect(() => {
    api.get('/workouts').then(res => setWorkouts(res.data))
    const today = new Date().toISOString().split('T')[0]
    api.get(`/calories?date=${today}`).then(res => setTodayCalories(res.data))
  }, [])

  // Build chart data from last 7 workouts
  const chartData = {
    labels: workouts.slice(0, 7).reverse().map(w => w.exercise_name.slice(0, 8)),
    datasets: [{
      label: 'Weight (lbs)',
      data: workouts.slice(0, 7).reverse().map(w => w.weight),
      borderColor: '#7c3aed',
      backgroundColor: '#7c3aed33',
      tension: 0.3,
      fill: true,
    }]
  }

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#666' }, grid: { color: '#1f1f1f' } },
      y: { ticks: { color: '#666' }, grid: { color: '#1f1f1f' } }
    }
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>Hey, {user.username} 👋</h1>
      <p style={{ color: '#666', marginBottom: '32px', fontSize: '14px' }}>Here's your fitness overview</p>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total workouts', value: workouts.length, color: '#a78bfa' },
          { label: 'Calories today', value: todayCalories.totals.calories, color: '#fbbf24' },
          { label: 'Protein today', value: `${Math.round(todayCalories.totals.protein)}g`, color: '#34d399' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px' }}>
            <p style={{ fontSize: '32px', fontWeight: '700', color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {workouts.length > 1 && (
        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Recent weight lifted</h2>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Link to="/workouts" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px', display: 'block' }}>
          <p style={{ fontSize: '24px', marginBottom: '8px' }}>🏋️</p>
          <p style={{ fontWeight: '600' }}>Log a workout</p>
          <p style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>Track sets, reps, and weight</p>
        </Link>
        <Link to="/calories" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px', display: 'block' }}>
          <p style={{ fontSize: '24px', marginBottom: '8px' }}>🥗</p>
          <p style={{ fontWeight: '600' }}>Log a meal</p>
          <p style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>Track calories and macros</p>
        </Link>
      </div>
    </div>
  )
}