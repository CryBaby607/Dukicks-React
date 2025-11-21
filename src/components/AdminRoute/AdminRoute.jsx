import { Navigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

function AdminRoute({ children }) {
  const { isAdminAuthenticated, loading } = useAdmin()

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa'
        }}
      >
        <p style={{ fontSize: '18px', color: '#6c757d' }}>Verificando acceso...</p>
      </div>
    )
  }

  if (!isAdminAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default AdminRoute