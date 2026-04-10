import { useState, useEffect } from 'react'
import api from '../api/axios'

const inputStyle = {
  background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px',
  padding: '10px 14px', color: '#f0f0f0', fontSize: '14px', outline: 'none', width: '100%'
}

export default function Calories() {
  const [data, setData] = useState({ logs: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } })
  const [form, setForm] = useState({ food_name: '', calories: '', protein: '', carbs: '', fat: '' })
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get(`/calories?date=${date}`).then(res => setData(res.data))
  }, [date])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/calories', form)
      const res = await api.get(`/calories?date=${date}`)
      setData(res.data)
      setForm({ food_name: '', calories: '', protein: '', carbs: '', fat: '' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    await api.delete(`/calories/${id}`)
    const res = await api.get(`/calories?date=${date}`)
    setData(res.data)
  }

  const { logs, totals } = data

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Calorie Tracker</h1>
      <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>Log your meals and track macros</p>

      {/* Date picker */}
      <div style={{ marginBottom: '24px' }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          style={{ ...inputStyle, width: 'auto' }} />
      </div>

      {/* Totals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {[
          { label: 'Calories', value: totals.calories, unit: 'kcal', color: '#a78bfa' },
          { label: 'Protein', value: Math.round(totals.protein), unit: 'g', color: '#34d399' },
          { label: 'Carbs', value: Math.round(totals.carbs), unit: 'g', color: '#fbbf24' },
          { label: 'Fat', value: Math.round(totals.fat), unit: 'g', color: '#f87171' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: '700', color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{stat.unit} {stat.label}</p>
          </div>
        ))}
      </div>

      {/* Log form */}
      <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Log a meal</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {[
              { key: 'food_name', label: 'Food', placeholder: 'e.g. Chicken breast', type: 'text' },
              { key: 'calories', label: 'Calories', placeholder: '250', type: 'number' },
              { key: 'protein', label: 'Protein (g)', placeholder: '30', type: 'number' },
              { key: 'carbs', label: 'Carbs (g)', placeholder: '0', type: 'number' },
              { key: 'fat', label: 'Fat (g)', placeholder: '5', type: 'number' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>{field.label}</label>
                <input style={inputStyle} type={field.type} placeholder={field.placeholder}
                  value={form[field.key]} onChange={e => setForm({...form, [field.key]: e.target.value})}
                  required={field.key === 'food_name' || field.key === 'calories'} />
              </div>
            ))}
          </div>
          <button type="submit" disabled={loading} style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            {loading ? 'Logging...' : '+ Log Meal'}
          </button>
        </form>
      </div>

      {/* Food log */}
      <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Today's log</h2>
      {logs.length === 0 ? (
        <p style={{ color: '#444', fontSize: '14px' }}>Nothing logged for this day yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {logs.map(log => (
            <div key={log.id} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '600', fontSize: '15px' }}>{log.food_name}</p>
                <p style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>
                  {log.calories} kcal
                  {log.protein > 0 && ` · ${log.protein}g protein`}
                  {log.carbs > 0 && ` · ${log.carbs}g carbs`}
                  {log.fat > 0 && ` · ${log.fat}g fat`}
                </p>
              </div>
              <button onClick={() => handleDelete(log.id)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '18px', padding: '4px 8px' }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}