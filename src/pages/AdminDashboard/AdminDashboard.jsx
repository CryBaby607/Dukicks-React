import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faSignOutAlt, 
  faTimes,
  faBoxOpen,
  faSpinner,
  faImage,
  faX
} from '@fortawesome/free-solid-svg-icons'
import { useAdmin } from '../../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../../utils/productService'
import { formatPrice } from '../../utils/formatters'
import './AdminDashboard.css'

const SIZES_BY_CATEGORY = {
  Hombre: [
    25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5,
    29, 29.5, 30, 30.5, 31, 31.5, 32
  ],
  Mujer: [
    23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5,
    27, 27.5, 28, 28.5, 29
  ],
  Gorras: ['Única']
}

function AdminDashboard() {
  const { adminUser, logout } = useAdmin()
  const navigate = useNavigate()
  
  const [products, setProducts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    category: 'Hombre',
    price: '',
    discount: '0',
    description: '',
    imageFile: null,
    isNew: false,
    isFeatured: false,
    sizes: []
  })

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showUserMenu])

  const loadProducts = async () => {
    try {
      setLoading(true)
      console.log('🔄 Cargando productos desde Firebase...')
      const allProducts = await getAllProducts()
      console.log('✅ Productos cargados:', allProducts)
      setProducts(allProducts)
    } catch (error) {
      console.error('Error al cargar productos:', error)
      alert('Error al cargar productos: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de cerrar sesión?')) {
      logout()
      navigate('/login', { replace: true })
    }
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setFormData({
      brand: '',
      model: '',
      category: 'Hombre',
      price: '',
      discount: '0',
      description: '',
      imageFile: null,
      isNew: false,
      isFeatured: false,
      sizes: []
    })
    setImagePreview(null)
    setErrors({})
    setIsModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setFormData({
      brand: product.brand,
      model: product.model,
      category: product.category,
      price: product.price.toString(),
      discount: (product.discount || 0).toString(),
      description: product.description,
      imageFile: null,
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false,
      sizes: Array.isArray(product.sizes) ? product.sizes : []
    })
    setImagePreview(product.image || product.images?.[0] || null)
    setErrors({})
    setIsModalOpen(true)
  }

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
      imageFile: null,
      isNew: false,
      isFeatured: false,
      sizes: []
    })
    setImagePreview(null)
    setErrors({})
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData(prev => {
      let updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }

      if (name === "category" && value === "Gorras") {
        updated.sizes = ['Única']
      }

      if (name === "category" && value !== "Gorras" && prev.category === "Gorras") {
        updated.sizes = []
      }

      return updated
    })

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        image: 'Por favor selecciona un archivo de imagen válido'
      }))
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        image: 'El archivo no debe superar 5MB'
      }))
      return
    }

    // Leer archivo y crear preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setImagePreview(event.target.result)
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }))
      setErrors(prev => ({
        ...prev,
        image: ''
      }))
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    setFormData(prev => ({
      ...prev,
      imageFile: null
    }))
  }

  const handleSizeToggle = (size) => {
    setFormData(prev => {
      const isSelected = prev.sizes.includes(size)
      
      if (isSelected) {
        return {
          ...prev,
          sizes: prev.sizes.filter(s => s !== size)
        }
      } else {
        return {
          ...prev,
          sizes: [...prev.sizes, size]
        }
      }
    })

    if (errors.sizes) {
      setErrors(prev => ({
        ...prev,
        sizes: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.brand.trim()) newErrors.brand = 'La marca es requerida'
    if (!formData.model.trim()) newErrors.model = 'El modelo es requerido'

    if (!formData.price) {
      newErrors.price = 'El precio es requerido'
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Ingresa un precio válido (mayor a 0)'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }

    if (formData.sizes.length === 0) {
      newErrors.sizes = 'Selecciona al menos una talla'
    }

    if (formData.discount !== '') {
      const discount = parseFloat(formData.discount)
      if (discount < 0 || discount > 100) {
        newErrors.discount = 'El descuento debe ser entre 0 y 100'
      }
    }

    // Validar imagen
    if (!editingProduct && !formData.imageFile) {
      newErrors.image = 'Debes subir una imagen'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setSaving(true)

    try {
      const price = parseFloat(formData.price)
      const discount = formData.discount ? parseFloat(formData.discount) : 0

      // PREPARAR DATOS DEL PRODUCTO
      const productData = {
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        category: formData.category,
        price: price,
        discount: discount,
        description: formData.description.trim(),
        isNew: formData.isNew,
        isFeatured: formData.isFeatured,
        sizes: formData.sizes,
        type: 'Tenis'
      }

      // SOLO SI HAY UNA IMAGEN NUEVA, PASAR EL ARCHIVO
      if (formData.imageFile) {
        productData.imageFile = formData.imageFile
      } else if (editingProduct && !formData.imageFile) {
        // Si estamos editando y no hay imagen nueva, mantener la existente
        productData.image = editingProduct.image
      }

      // LLAMAR AL SERVICIO
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
        alert('✓ Producto actualizado exitosamente')
      } else {
        await createProduct(productData)
        alert('✓ Producto agregado exitosamente')
      }

      await loadProducts()
      closeModal()
    } catch (error) {
      console.error('Error al guardar producto:', error)
      alert('Error al guardar producto: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

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

  const availableSizes = SIZES_BY_CATEGORY[formData.category] || []

  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <header className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <div className="admin-title-section">
              <h1 className="admin-title">Panel de Administración</h1>
            </div>
            <div className="admin-user-info">
              <div className="user-menu-container">
                <div 
                  className="user-avatar" 
                  onClick={toggleUserMenu}
                  role="button"
                  tabIndex={0}
                  aria-label="Menú de usuario"
                >
                  {adminUser?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <button 
                      onClick={handleLogout} 
                      className="dropdown-item"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="admin-content">
        <div className="container">
          {/* TABLA */}
          <div className="products-table-container">
            <div className="admin-actions">
              <h2 className="section-title">Gestión de Productos</h2>
              <button onClick={openAddModal} className="btn-add-product">
                <FontAwesomeIcon icon={faPlus} />
                <span>Agregar Producto</span>
              </button>
            </div>

            {loading ? (
              <div className="loading-container">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Cargando productos...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <FontAwesomeIcon icon={faBoxOpen} size="3x" />
                <h3>No hay productos</h3>
                <p>Comienza agregando tu primer producto</p>
                <button onClick={openAddModal} className="btn-add-product">
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Agregar Primer Producto</span>
                </button>
              </div>
            ) : (
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Descuento</th>
                    <th>Tallas</th>
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
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop'
                          }}
                        />
                      </td>
                      <td>{product.brand}</td>
                      <td>{product.model}</td>
                      <td>{product.category}</td>
                      <td>{formatPrice(product.price)}</td>
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
                        <div className="sizes-display">
                          {product.sizes && product.sizes.length > 0 ? (
                            product.sizes.slice(0, 3).map((size, index) => (
                              <span key={index} className="size-tag">
                                {size}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted">Sin tallas</span>
                          )}
                          {product.sizes && product.sizes.length > 3 && (
                            <span className="size-tag size-tag-more">
                              +{product.sizes.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="state-badges-container">
                          {product.isNew && (
                            <span className="state-badge state-badge-new">NUEVO</span>
                          )}
                          {product.isFeatured && (
                            <span className="state-badge state-badge-featured">DESTACADO</span>
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
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="btn-action btn-delete"
                            title="Eliminar producto"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
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

            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-body">
                <div className="product-form">

                  {/* UPLOAD DE IMAGEN */}
                  <div className="form-group">
                    <label className="form-label">Imagen del Producto *</label>
                    <div className="image-upload-container">
                      {imagePreview ? (
                        <div className="image-preview">
                          <img src={imagePreview} alt="Preview" />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="btn-remove-image"
                            title="Remover imagen"
                          >
                            <FontAwesomeIcon icon={faX} />
                          </button>
                        </div>
                      ) : (
                        <label className="image-upload-area">
                          <div className="upload-content">
                            <FontAwesomeIcon icon={faImage} className="upload-icon" />
                            <span className="upload-text">Haz clic para subir una imagen</span>
                            <small>o arrastra una aquí</small>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file-input"
                          />
                        </label>
                      )}
                    </div>
                    {errors.image && <span className="error-message">{errors.image}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Marca *</label>
                    <input
                      type="text"
                      name="brand"
                      className="form-input"
                      placeholder="Nike, Adidas..."
                      value={formData.brand}
                      onChange={handleInputChange}
                    />
                    {errors.brand && <span className="error-message">{errors.brand}</span>}
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
                    {errors.model && <span className="error-message">{errors.model}</span>}
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
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                    {errors.price && <span className="error-message">{errors.price}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Descuento (%)</label>
                    <input
                      type="number"
                      name="discount"
                      className="form-input"
                      value={formData.discount}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                    />
                    {errors.discount && <span className="error-message">{errors.discount}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tallas *</label>
                    <div className="sizes-selector">
                      {availableSizes.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={`size-button ${formData.sizes.includes(size) ? 'size-button-active' : ''}`}
                          disabled={formData.category === 'Gorras'}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {errors.sizes && <span className="error-message">{errors.sizes}</span>}
                    {formData.sizes.length > 0 && (
                      <div className="sizes-selected">
                        <small>Seleccionadas: {formData.sizes.join(', ')}</small>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Descripción *</label>
                    <textarea
                      name="description"
                      className="form-input"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                    />
                    {errors.description && <span className="error-message">{errors.description}</span>}
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
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
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                      />
                      <span>Marcar como DESTACADO</span>
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
                      <span>Guardando...</span>
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