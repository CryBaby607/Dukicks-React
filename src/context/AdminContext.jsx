import { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { handleError } from '../services/errorService'

const AdminContext = createContext()

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setAdminUser(currentUser)
      } else {
        setAdminUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      const result = await signInWithEmailAndPassword(auth, email, password)
      setAdminUser(result.user)
      return result.user
    } catch (error) {
      const message = handleError(error, 'AdminLogin')
      setError(message)
      throw new Error(message)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
      setAdminUser(null)
    } catch (error) {
      const message = handleError(error, 'AdminLogout')
      setError(message)
      throw new Error(message)
    }
  }

  const isAdminAuthenticated = () => !!adminUser

  const value = {
    adminUser,
    loading,
    error,
    login,
    logout,
    isAdminAuthenticated,
    setError
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin debe usarse dentro de AdminProvider')
  }
  return context
}