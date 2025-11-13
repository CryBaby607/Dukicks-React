import { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword 
} from 'firebase/auth'
import { auth } from '../config/firebase'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Monitorear cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Login con Firebase
  const login = async (email, password) => {
    try {
      setError(null)
      const result = await signInWithEmailAndPassword(auth, email, password)
      setUser(result.user)
      return result.user
    } catch (error) {
      const errorMessage = handleFirebaseError(error.code)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Registrar nuevo usuario (opcional)
  const register = async (email, password) => {
    try {
      setError(null)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      setUser(result.user)
      return result.user
    } catch (error) {
      const errorMessage = handleFirebaseError(error.code)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Logout con Firebase
  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
      setUser(null)
    } catch (error) {
      const errorMessage = handleFirebaseError(error.code)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Verificar si está autenticado
  const isAuthenticated = () => !!user

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
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    setError
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