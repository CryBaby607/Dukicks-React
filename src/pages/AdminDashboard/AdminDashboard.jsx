import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faSignOutAlt, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../context/AuthContext'
import { formatPrice } from '../../utils/formatters'
import './AdminDashboard.css'

function AdminDashboard() {
  const { user, logout } = useAuth()
  
  // Estado inicial con productos de ejemplo
  const [products, setProducts] = useState([
    {
      id: 1,
      brand: 'Nike',
      model: 'Air Max 270',
      category: 'Hombre',
      price: 3299,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      description: 'Diseño revolucionario con amortiguación Air Max visible.'
    },
    {
      id: 2,
      brand: 'Adidas',
      model: 'Ultraboost 22',
      category: 'Hombre',
      price: 2899,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      description: 'Tecnología Boost para máxima comodidad.'
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    category: 'Hombre',
    price: '',
    image: '',
    description: ''
  })

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de cerrar sesión?')) {
      logout()
      window.location.href = '/login'
    }
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setFormData({
      brand: '',
      model: '',
      category: 'Hombre',
      price: '',
      image: '',
      description: ''
    })
    setIsModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setFormData({
      brand: product.brand,
      model: product.model,
      category: product.category,
      price: product.price.toString(),
      image: product.image,
      description: product.description
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = () => {
    // Validaciones
    if (!formData.brand || !formData.model || !formData.price) {
      alert('Por favor completa los campos obligatorios')
      return
    }

    const price = parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      alert('Por favor ingresa un precio válido')
      return
    }

    if (editingProduct) {
      // Editar producto existente
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id
          ? {
              ...p,
              brand: formData.brand,
              model: formData.model,
              category: formData.category,
              price: price,
              image: formData.image || p.image,
              description: formData.description
            }
          : p
      ))
      alert('Producto actualizado exitosamente')
    } else {
      // Crear nuevo producto
      const newProduct = {
        id: Date.now(),
        brand: formData.brand,
        model: formData.model,
        category: formData.category,
        price: price,
        image: formData.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
        description: formData.description
      }
      setProducts(prev => [...prev, newProduct])
      alert('Producto agregado exitosamente')
    }

    closeModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== id))
      alert('Producto eliminado exitosamente')
    }
  }

  return (
    <div className="admin-dashboard">
      
      {/* Header */}
      <header className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <div className="admin-title-section">
              <h1 className="admin-title">Panel de Administración</h1>
              <p className="admin-subtitle">Gestiona tus productos</p>
            </div>

            <div className="admin-user-info">
              <div className="user-avatar">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="user-details">
                <p className="user-name">{user?.name || 'Administrador'}</p>
                <p className="user-role">{user?.role || 'Admin'}</p>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="admin-content">
        <div className="container">
          
          {/* Actions */}
          <div className="admin-actions">
            <div className="admin-stats">
              <div className="stat-card">
                <span className="stat-value">{products.length}</span>
                <span className="stat-label">Productos</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">
                  {products.filter(p => p.category === 'Hombre').length}
                </span>
                <span className="stat-label">Hombre</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">
                  {products.filter(p => p.category === 'Mujer').length}
                </span>
                <span className="stat-label">Mujer</span>
              </div>
            </div>

            <button onClick={openAddModal} className="btn-add-product">
              <FontAwesomeIcon icon={faPlus} />
              <span>Agregar Producto</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="products-table-container">
            {products.length > 0 ? (
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td className="product-image-cell">
                        <img 
                          src={product.image} 
                          alt={product.model}
                          className="product-thumbnail"
                        />
                      </td>
                      <td className="product-name-cell">{product.brand}</td>
                      <td>{product.model}</td>
                      <td>{product.category}</td>
                      <td className="product-price-cell">
                        {formatPrice(product.price)}
                      </td>
                      <td>
                        <div className="product-actions">
                          <button 
                            onClick={() => openEditModal(product)}
                            className="btn-action btn-edit"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                            <span>Editar</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="btn-action btn-delete"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📦</div>
                <h3 className="empty-state-title">No hay productos</h3>
                <p className="empty-state-text">
                  Agrega tu primer producto para comenzar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button onClick={closeModal} className="btn-close-modal">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="modal-body">
              <div className="product-form">
                
                <div className="form-group">
                  <label className="form-label">Marca *</label>
                  <input
                    type="text"
                    name="brand"
                    className="form-input"
                    placeholder="Nike, Adidas, etc."
                    value={formData.brand}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Modelo *</label>
                  <input
                    type="text"
                    name="model"
                    className="form-input"
                    placeholder="Air Max 270"
                    value={formData.model}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Categoría</label>
                  <select
                    name="category"
                    className="form-input"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Gorras">Gorras</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Precio (MXN) *</label>
                  <input
                    type="number"
                    name="price"
                    className="form-input"
                    placeholder="2999"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">URL de Imagen</label>
                  <input
                    type="url"
                    name="image"
                    className="form-input"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={formData.image}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <textarea
                    name="description"
                    className="form-input"
                    placeholder="Descripción del producto..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={closeModal} className="btn-cancel">
                Cancelar
              </button>
              <button onClick={handleSubmit} className="btn-save">
                {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard