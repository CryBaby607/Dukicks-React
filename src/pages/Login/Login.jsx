import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faSpinner, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useAdmin } from '../../context/AdminContext'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const { login } = useAdmin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false })

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isPasswordValid = password.length >= 6
  const isFormValid = email && password && isEmailValid && isPasswordValid

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    if (!isEmailValid) {
      setError('Por favor ingresa un correo electrónico válido')
      return
    }

    if (!isPasswordValid) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      await login(email, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Intenta de nuevo.')
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="background-pattern"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          {/* Logo */}
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-du">DU</span>
              <span className="logo-kicks">KICKS</span>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            {/* Campo Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <div className={`input-wrapper ${touched.email && !isEmailValid && email ? 'error' : ''}`}>
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@dukicks.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  disabled={loading}
                />
              </div>
              {touched.email && !isEmailValid && email && (
                <span className="error-message">Por favor ingresa un correo válido</span>
              )}
            </div>

            {/* Campo Contraseña */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <div className={`input-wrapper ${touched.password && !isPasswordValid && password ? 'error' : ''}`}>
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {touched.password && !isPasswordValid && password && (
                <span className="error-message">La contraseña debe tener mínimo 6 caracteres</span>
              )}
            </div>

            <button
              type="submit"
              className="btn-login"
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="spinner" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login