import { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../config/firebase'

const AdminContext = createContext()

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Monitorear cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Verificar si es admin (puedes usar claims personalizados en producción)
        setAdminUser(currentUser)
      } else {
        setAdminUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Login para admin
  const login = async (email, password) => {
    try {
      setError(null)
      const result = await signInWithEmailAndPassword(auth, email, password)
      setAdminUser(result.user)
      return result.user
    } catch (error) {
      const errorMessage = handleFirebaseError(error.code)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Logout
  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
      setAdminUser(null)
    } catch (error) {
      const errorMessage = handleFirebaseError(error.code)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Verificar si hay admin autenticado
  const isAdminAuthenticated = () => !!adminUser

  // Manejador de errores de Firebase
  const handleFirebaseError = (code) => {
    const errors = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/user-disabled': 'Usuario deshabilitado',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/weak-password': 'La contraseña es muy débil (mínimo 6 caracteres)',
      'auth/email-already-in-use': 'El correo ya está registrado',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/invalid-credential': 'Credenciales inválidas'
    }
    return errors[code] || 'Error de autenticación. Intenta de nuevo.'
  }

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