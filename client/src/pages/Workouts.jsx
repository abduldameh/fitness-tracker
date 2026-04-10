import { useState, useEffect } from 'react'
import api from '../api/axios'

const inputStyle = {
  background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px',
  padding: '10px 14px', color: '#f0f0f0', fontSize: '14px', outline: 'none', width: '100%'
}

export default function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [form, setForm] = useState({ exercise_name: '', sets: '', reps: '', weight: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/workouts').then(res => setWorkouts(res.data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/workouts', form)
      setWorkouts([res.data, ...workouts])
      setForm({ exercise_name: '', sets: '', reps: '', weight: '', notes: '' })
    } catch (err) {
      setError('Failed to log workout')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    await api.delete(`/workouts/${id}`)
    setWorkouts(workouts.filter(w => w.id !== id))
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Workout Log</h1>
      <p style={{ color: '#666', marginBottom: '32px', fontSize: '14px' }}>Track your exercises, sets, reps, and weight</p>

      {/* Log form */}
      <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Log a workout</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Exercise</label>
              <input style={inputStyle} placeholder="e.g. Bench Press" value={form.exercise_name} onChange={e => setForm({...form, exercise_name: e.target.value})} required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Sets</label>
              <input style={inputStyle} type="number" placeholder="3" value={form.sets} onChange={e => setForm({...form, sets: e.target.value})} required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Reps</label>
              <input style={inputStyle} type="number" placeholder="10" value={form.reps} onChange={e => setForm({...form, reps: e.target.value})} required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Weight (lbs)</label>
              <input style={inputStyle} type="number" placeholder="135" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} required />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Notes (optional)</label>
            <input style={inputStyle} placeholder="e.g. Felt strong today" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </div>
          {error && <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            {loading ? 'Logging...' : '+ Log Workout'}
          </button>
        </form>
      </div>

      {/* Workout history */}
      <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>History</h2>
      {workouts.length === 0 ? (
        <p style={{ color: '#444', fontSize: '14px' }}>No workouts logged yet. Add your first one above!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {workouts.map(w => (
            <div key={w.id} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '600', fontSize: '15px' }}>{w.exercise_name}</p>
                <p style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>
                  {w.sets} sets × {w.reps} reps @ {w.weight} lbs
                  {w.notes && <span style={{ color: '#555' }}> · {w.notes}</span>}
                </p>
                <p style={{ color: '#444', fontSize: '12px', marginTop: '4px' }}>{new Date(w.logged_at).toLocaleDateString()}</p>
              </div>
              <button onClick={() => handleDelete(w.id)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '18px', padding: '4px 8px' }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}