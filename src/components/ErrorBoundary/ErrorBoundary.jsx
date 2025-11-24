import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          padding: '2rem'
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '500px',
            backgroundColor: 'white',
            padding: '3rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <FontAwesomeIcon 
               icon={faExclamationTriangle} 
               style={{
                fontSize: '3rem',
                color: '#ef4444',
                marginBottom: '1rem'
              }}
            />
            <h1 style={{
              margin: '1rem 0',
              color: '#111111',
              fontSize: '1.875rem'
            }}>
              Algo salió mal
            </h1>
            <p style={{
              color: '#6c757d',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              Disculpa, ocurrió un error inesperado. Por favor, intenta recargar la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#3a86ff',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563EB'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3a86ff'}
            >
              Recargar Página
            </button>
            
            <p style={{
              marginTop: '1.5rem',
              fontSize: '0.875rem',
              color: '#9ca3af'
            }}>
              Si el problema persiste, contacta con soporte.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary