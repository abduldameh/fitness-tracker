import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      background: '#1a1a1a',
      borderBottom: '1px solid #2a2a2a',
      padding: '0 24px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/dashboard" style={{ fontSize: '20px', fontWeight: '700', color: '#a78bfa' }}>
        💪 FitTrack
      </Link>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/dashboard" style={{ color: '#aaa', fontSize: '14px' }}>Dashboard</Link>
          <Link to="/workouts" style={{ color: '#aaa', fontSize: '14px' }}>Workouts</Link>
          <Link to="/calories" style={{ color: '#aaa', fontSize: '14px' }}>Calories</Link>
          <span style={{ color: '#666', fontSize: '14px' }}>Hey, {user.username}</span>
          <button onClick={handleLogout} style={{
            background: 'none',
            border: '1px solid #333',
            color: '#aaa',
            padding: '6px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px'
          }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}