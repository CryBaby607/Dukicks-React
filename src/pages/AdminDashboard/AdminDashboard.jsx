import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faSignOutAlt, 
  faTimes,
  faBoxOpen,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../../utils/productService'
import { formatPrice } from '../../utils/formatters'
import './AdminDashboard.css'

function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const [products, setProducts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    category: 'Hombre',
    price: '',
    discount: '0',
    description: '',
    image: '',
    isNew: false,
    inStock: true,
    sizes: ''
  })

  // Cargar productos al montar
  useEffect(() => {
    loadProducts()
  }, [])

  // Cargar productos de Firestore
  const loadProducts = async () => {
    try {
      setLoading(true)
      const allProducts = await getAllProducts()
      setProducts(allProducts)
    } catch (error) {
      console.error('Error al cargar productos:', error)
      alert('Error al cargar productos: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Cerrar sesión
  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de cerrar sesión?')) {
      logout()
      navigate('/login', { replace: true })
    }
  }

  // Abrir modal para agregar
  const openAddModal = () => {
    setEditingProduct(null)
    setFormData({
      brand: '',
      model: '',
      category: 'Hombre',
      price: '',
      discount: '0',
      description: '',
      image: '',
      isNew: false,
      inStock: true,
      sizes: ''
    })
    setErrors({})
    setIsModalOpen(true)
  }

  // Abrir modal para editar
  const openEditModal = (product) => {
    setEditingProduct(product)
    setFormData({
      brand: product.brand,
      model: product.model,
      category: product.category,
      price: product.price.toString(),
      discount: (product.discount || 0).toString(),
      description: product.description,
      image: product.image || product.images?.[0] || '',
      isNew: product.isNew || false,
      inStock: product.inStock !== false,
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : ''
    })
    setErrors({})
    setIsModalOpen(true)
  }

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setFormData({
      brand: '',
      model: '',
      category: 'Hombre',
      price: '',
      discount: '0',
      description: '',
      image: '',
      isNew: false,
      inStock: true,
      sizes: ''
    })
    setErrors({})
  }

  // Manejar cambios en inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}

    if (!formData.brand.trim()) {
      newErrors.brand = 'La marca es requerida'
    }

    if (!formData.model.trim()) {
      newErrors.model = 'El modelo es requerido'
    }

    if (!formData.price) {
      newErrors.price = 'El precio es requerido'
    } else {
      const price = parseFloat(formData.price)
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Ingresa un precio válido (mayor a 0)'
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }

    if (formData.discount !== '') {
      const discount = parseFloat(formData.discount)
      if (isNaN(discount) || discount < 0 || discount > 100) {
        newErrors.discount = 'El descuento debe ser entre 0 y 100'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Parsear tallas
  const parseSizes = (sizesString) => {
    if (!sizesString.trim()) return []
    return sizesString
      .split(',')
      .map(s => s.trim())
      .filter(s => s)
      .map(s => isNaN(s) ? s : parseInt(s))
  }

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setSaving(true)

    try {
      const price = parseFloat(formData.price)
      const discount = formData.discount ? parseFloat(formData.discount) : 0

      const productData = {
        brand: formData.brand,
        model: formData.model,
        category: formData.category,
        price: price,
        discount: discount,
        image: formData.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
        images: [formData.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop'],
        description: formData.description,
        isNew: formData.isNew,
        inStock: formData.inStock,
        sizes: parseSizes(formData.sizes),
        type: 'Tenis',
        isFeatured: false
      }

      if (editingProduct) {
        // Actualizar producto
        await updateProduct(editingProduct.id, productData)
        alert('✓ Producto actualizado exitosamente')
      } else {
        // Crear nuevo producto
        await createProduct(productData)
        alert('✓ Producto agregado exitosamente')
      }

      // Recargar productos
      await loadProducts()
      closeModal()
    } catch (error) {
      console.error('Error al guardar producto:', error)
      alert('Error al guardar producto: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  // Eliminar producto
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await deleteProduct(id)
        alert('✓ Producto eliminado exitosamente')
        await loadProducts()
      } catch (error) {
        console.error('Error al eliminar producto:', error)
        alert('Error al eliminar producto: ' + error.message)
      }
    }
  }

  // Estadísticas
  const stats = {
    total: products.length,
    men: products.filter(p => p.category === 'Hombre').length,
    women: products.filter(p => p.category === 'Mujer').length,
    caps: products.filter(p => p.category === 'Gorras').length,
    withDiscount: products.filter(p => p.discount > 0).length
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <FontAwesomeIcon 
            icon={faSpinner} 
            spin 
            style={{ fontSize: '48px', color: '#3a86ff', marginBottom: '20px' }}
          />
          <p style={{ fontSize: '18px', color: '#6c757d' }}>Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      
      {/* ===== HEADER ===== */}
      <header className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <div className="admin-title-section">
              <h1 className="admin-title">Panel de Administración</h1>
              <p className="admin-subtitle">Gestiona tus productos en Firestore</p>
            </div>

            <div className="admin-user-info">
              <div className="user-avatar">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="user-details">
                <p className="user-name">{user?.email || 'Administrador'}</p>
                <p className="user-role">Admin</p>
              </div>
              <button onClick={handleLogout} className="btn-logout" aria-label="Cerrar sesión">
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== CONTENIDO ===== */}
      <div className="admin-content">
        <div className="container">
          
          {/* ===== ACCIONES Y ESTADÍSTICAS ===== */}
          <div className="admin-actions">
            <div className="admin-stats">
              <div className="stat-card">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Productos Total</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{stats.men}</span>
                <span className="stat-label">Hombre</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{stats.women}</span>
                <span className="stat-label">Mujer</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{stats.caps}</span>
                <span className="stat-label">Gorras</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{stats.withDiscount}</span>
                <span className="stat-label">Con Descuento</span>
              </div>
            </div>

            <button onClick={openAddModal} className="btn-add-product">
              <FontAwesomeIcon icon={faPlus} />
              <span>Agregar Producto</span>
            </button>
          </div>

          {/* ===== TABLA DE PRODUCTOS ===== */}
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
                    <th>Descuento</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td className="product-image-cell">
                        <img 
                          src={product.image || product.images?.[0]} 
                          alt={product.model}
                          className="product-thumbnail"
                          loading="lazy"
                        />
                      </td>
                      <td className="product-name-cell">{product.brand}</td>
                      <td>{product.model}</td>
                      <td>{product.category}</td>
                      <td className="product-price-cell">
                        {formatPrice(product.price)}
                      </td>
                      <td>
                        {product.discount > 0 ? (
                          <span className="state-badge state-badge-with-discount">
                            -{product.discount}%
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {product.isNew && (
                            <span className="state-badge state-badge-new">
                              NUEVO
                            </span>
                          )}
                          {product.inStock ? (
                            <span className="state-badge state-badge-in-stock">
                              En stock
                            </span>
                          ) : (
                            <span className="state-badge state-badge-out-of-stock">
                              Agotado
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="product-actions">
                          <button 
                            onClick={() => openEditModal(product)}
                            className="btn-action btn-edit"
                            title="Editar producto"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                            <span>Editar</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="btn-action btn-delete"
                            title="Eliminar producto"
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
                <div className="empty-state-icon">
                  <FontAwesomeIcon icon={faBoxOpen} />
                </div>
                <h3 className="empty-state-title">No hay productos</h3>
                <p className="empty-state-text">
                  Agrega tu primer producto haciendo clic en "Agregar Producto"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button onClick={closeModal} className="btn-close-modal" aria-label="Cerrar">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-body">
                <div className="product-form">
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="brand">Marca *</label>
                    <input
                      id="brand"
                      type="text"
                      name="brand"
                      className="form-input"
                      placeholder="Nike, Adidas, etc."
                      value={formData.brand}
                      onChange={handleInputChange}
                    />
                    {errors.brand && <span style={{ color: 'var(--error)', fontSize: 'var(--fs-xs)' }}>{errors.brand}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="model">Modelo *</label>
                    <input
                      id="model"
                      type="text"
                      name="model"
                      className="form-input"
                      placeholder="Air Max 270"
                      value={formData.model}
                      onChange={handleInputChange}
                    />
                    {errors.model && <span style={{ color: 'var(--error)', fontSize: 'var(--fs-xs)' }}>{errors.model}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="category">Categoría</label>
                    <select
                      id="category"
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
                    <label className="form-label" htmlFor="price">Precio (MXN) *</label>
                    <input
                      id="price"
                      type="number"
                      name="price"
                      className="form-input"
                      placeholder="2999"
                      min="0"
                      step="1"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                    {errors.price && <span style={{ color: 'var(--error)', fontSize: 'var(--fs-xs)' }}>{errors.price}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="discount">Descuento (%)</label>
                    <input
                      id="discount"
                      type="number"
                      name="discount"
                      className="form-input"
                      placeholder="10"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="image">URL de Imagen</label>
                    <input
                      id="image"
                      type="url"
                      name="image"
                      className="form-input"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      value={formData.image}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="sizes">Tallas (separadas por coma)</label>
                    <input
                      id="sizes"
                      type="text"
                      name="sizes"
                      className="form-input"
                      placeholder="36, 37, 38, 39, 40"
                      value={formData.sizes}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="description">Descripción *</label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-input"
                      placeholder="Describe tu producto aquí..."
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                    {errors.description && <span style={{ color: 'var(--error)', fontSize: 'var(--fs-xs)' }}>{errors.description}</span>}
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', margin: 0 }}>
                      <input
                        type="checkbox"
                        name="isNew"
                        checked={formData.isNew}
                        onChange={handleInputChange}
                      />
                      <span>Marcar como NUEVO</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', margin: 0 }}>
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={formData.inStock}
                        onChange={handleInputChange}
                      />
                      <span>Disponible en stock</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button"
                  onClick={closeModal} 
                  className="btn-cancel"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-save"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      Guardando...
                    </>
                  ) : (
                    editingProduct ? 'Guardar Cambios' : 'Crear Producto'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard