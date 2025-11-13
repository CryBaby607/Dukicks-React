import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faShoppingCart, 
  faCheck,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { useCart } from '../../context/CartContext'
import { getAllProducts } from '../../utils/productService'
import { formatPrice } from '../../utils/formatters'
import './ProductDetail.css'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar producto al montar o cambiar ID
  useEffect(() => {
    loadProduct()
  }, [id, navigate])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const allProducts = await getAllProducts()
      const found = allProducts.find(p => p.id === id)
      
      if (!found) {
        setError('Producto no encontrado')
        setTimeout(() => navigate('/'), 2000)
        return
      }
      
      setProduct(found)
      setSelectedImage(0)
      setSelectedSize(null)
      setQuantity(1)
    } catch (err) {
      console.error('Error al cargar producto:', err)
      setError('Error al cargar el producto')
      setTimeout(() => navigate('/'), 2000)
    } finally {
      setLoading(false)
    }
  }

  // Scroll to top al cargar
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <FontAwesomeIcon 
              icon={faSpinner} 
              spin 
              style={{ fontSize: '48px', color: '#3a86ff', marginBottom: '20px', display: 'block' }}
            />
            <p style={{ fontSize: '18px', color: '#6c757d' }}>Cargando producto...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="product-detail-loading">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '18px', color: '#ef4444', marginBottom: '20px' }}>
              {error || 'Producto no encontrado'}
            </p>
            <p style={{ fontSize: '14px', color: '#6c757d' }}>Redirigiendo...</p>
          </div>
        </div>
      </div>
    )
  }

  // Calcular precio final con descuento
  const getPriceWithDiscount = (product) => {
    if (!product.discount || product.discount === 0) return product.price
    return Math.round(product.price * (1 - product.discount / 100))
  }

  const finalPrice = getPriceWithDiscount(product)

  // Preparar imágenes
  const images = Array.isArray(product.images) 
    ? product.images 
    : (product.image ? [product.image] : [])

  const productName = product.brand 
    ? `${product.brand} ${product.model}` 
    : product.name

  // Handlers
  const handleAddToCart = () => {
    // Validar talla si el producto tiene tallas
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Por favor selecciona una talla')
      return
    }

    // Agregar al carrito
    addToCart({
      id: product.id,
      name: productName,
      price: finalPrice,
      image: images[0] || 'https://via.placeholder.com/300',
      category: product.category,
      size: selectedSize,
      quantity: quantity
    })

    // Mostrar mensaje de éxito
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="product-detail">
      <div className="container">
        
        {/* Contenido principal */}
        <div className="detail-wrapper">
          
          {/* Galería de imágenes */}
          <div className="detail-gallery">
            {/* Imagen principal */}
            <div className="gallery-main">
              {product.discount > 0 && (
                <span className="detail-badge detail-badge--discount">
                  -{product.discount}%
                </span>
              )}
              {product.isNew && (
                <span className="detail-badge detail-badge--new">NUEVO</span>
              )}
              <img 
                src={images[selectedImage] || 'https://via.placeholder.com/600'} 
                alt={`${productName} - Vista ${selectedImage + 1}`}
                className="gallery-main-image"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="gallery-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`Ver imagen ${index + 1}`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="detail-info">
            
            {/* Categoría */}
            <span className="detail-category">{product.category}</span>

            {/* Nombre */}
            <h1 className="detail-title">
              {product.brand && <span className="detail-brand">{product.brand}</span>}
              {product.model && <span className="detail-model">{product.model}</span>}
              {!product.brand && !product.model && product.name}
            </h1>

            {/* Precios */}
            <div className="detail-prices">
              {product.discount > 0 ? (
                <>
                  <span className="detail-price detail-price--original">
                    {formatPrice(product.price)}
                  </span>
                  <span className="detail-price detail-price--final">
                    {formatPrice(finalPrice)}
                  </span>
                  <span className="detail-savings">
                    Ahorras {formatPrice(product.price - finalPrice)}
                  </span>
                </>
              ) : (
                <span className="detail-price detail-price--final">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Descripción */}
            {product.description && (
              <div className="detail-description">
                <h3>Descripción</h3>
                <p>{product.description}</p>
              </div>
            )}

            {/* Selector de talla */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="detail-sizes">
                <h3>Selecciona tu talla</h3>
                <div className="sizes-grid">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cantidad */}
            <div className="detail-quantity">
              <h3>Cantidad</h3>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="quantity-input"
                  aria-label="Cantidad"
                />
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 99}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="detail-actions">
              <button
                className="btn btn-primary btn-add-cart"
                onClick={handleAddToCart}
                disabled={product.inStock === false}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                <span>
                  {product.inStock === false 
                    ? 'Agotado' 
                    : 'Agregar al Carrito'}
                </span>
              </button>

              <Link to="/cart" className="btn btn-secondary">
                Ver Carrito
              </Link>
            </div>

            {/* Mensaje de éxito */}
            {showSuccessMessage && (
              <div className="success-message">
                <FontAwesomeIcon icon={faCheck} />
                <span>¡Producto agregado al carrito!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail