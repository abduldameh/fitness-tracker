import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // On page load, check if user was already logged in
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    return token ? { token, username } : null
  })

  const login = (token, username) => {
    localStorage.setItem('token', token)
    localStorage.setItem('username', username)
    setUser({ token, username })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — instead of importing useContext + AuthContext everywhere,
// you just call useAuth()
export function useAuth() {
  return useContext(AuthContext)
}