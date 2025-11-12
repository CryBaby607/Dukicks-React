import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Cargar usuario del localStorage al montar
  useEffect(() => {
    const savedUser = localStorage.getItem('dukicks_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error al parsear usuario:', error)
        localStorage.removeItem('dukicks_user')
      }
    }
    setLoading(false)
  }, [])

  // Login simulado
  const login = async (email, password) => {
    // Credenciales simuladas
    const ADMIN_EMAIL = 'admin@dukicks.com'
    const ADMIN_PASSWORD = '123456'

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          const userData = {
            id: '1',
            email: ADMIN_EMAIL,
            name: 'Administrador',
            role: 'admin'
          }
          setUser(userData)
          localStorage.setItem('dukicks_user', JSON.stringify(userData))
          resolve(userData)
        } else {
          reject(new Error('Credenciales incorrectas'))
        }
      }, 800) // Simular delay de red
    })
  }

  // Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('dukicks_user')
  }

  // Verificar si está autenticado
  const isAuthenticated = () => !!user

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}