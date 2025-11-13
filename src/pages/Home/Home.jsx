import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedProducts } from '../../utils/productService'
import ProductCard from '../../components/ProductCard/ProductCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import './Home.css'

function Home() {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [error, setError] = useState(null)

  // Cargar productos destacados al montar
  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      setLoadingProducts(true)
      setError(null)
      const products = await getFeaturedProducts()
      setFeaturedProducts(products)
    } catch (err) {
      console.error('Error cargando productos destacados:', err)
      setError('Error al cargar los productos')
    } finally {
      setLoadingProducts(false)
    }
  }

  // Datos de categorías
  const categories = [
    {
      id: 1,
      name: 'Hombre',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=400&fit=crop',
      link: '/hombre'
    },
    {
      id: 2,
      name: 'Mujer',
      image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=400&fit=crop',
      link: '/mujer'
    },
    {
      id: 3,
      name: 'Gorras',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=400&fit=crop',
      link: '/gorras'
    }
  ]

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (newsletterEmail) {
      console.log('Email suscrito:', newsletterEmail)
      alert('¡Gracias por suscribirte a nuestro newsletter!')
      setNewsletterEmail('')
    }
  }

  return (
    <div className="home">
      
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <h1 className="hero-title">Bienvenido a DUKICKS</h1>
              <p className="hero-description">
                Encuentra tu estilo perfecto con las mejores marcas del mercado.
              </p>
              <div className="hero-actions">
                <Link to="/hombre" className="btn btn-primary">
                  Ver Colección
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTOS DESTACADOS ===== */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Productos Destacados</h2>
          </div>
          {/* Products Grid */}
          {!loadingProducts && !error && (
            <div className="products-grid">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="featured"
                    showCategory={true}
                  />
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                  <p style={{ fontSize: '18px', color: '#6c757d' }}>
                    No hay productos destacados disponibles
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===== CATEGORÍAS ===== */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Compra por Categoría</h2>
          </div>

          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                to={category.link}
                key={category.id}
                className="category-card"
                aria-label={`Ver productos de ${category.name}`}
              >
                <div className="category-image-wrapper">
                  <img
                    src={category.image}
                    alt={`Categoría ${category.name}`}
                    className="category-image"
                    loading="lazy"
                  />
                  <div className="category-overlay"></div>
                </div>
                <h3 className="category-name">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT US ===== */}
      <section className="about-us">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>
                Más que una tienda, una <span className="highlight">comunidad</span>
              </h2>
              <p>
                En DUKICKS no solo vendemos tenis y gorras, creamos conexiones.
                Desde 2013, hemos sido el punto de encuentro para los amantes de la cultura urbana y el streetwear.
              </p>
              <p>
                Nuestra pasión por la moda urbana nos impulsa a buscar constantemente las piezas más exclusivas
                y las colaboraciones más esperadas, siempre manteniendo la autenticidad que nos caracteriza.
              </p>

              <div className="stats">
                <div className="stat-item">
                  <span className="stat-number">10+</span>
                  <span className="stat-label">Años de Experiencia</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50K+</span>
                  <span className="stat-label">Clientes Satisfechos</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">200+</span>
                  <span className="stat-label">Marcas Exclusivas</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Soporte al Cliente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2 className="newsletter-title">Únete a la comunidad DUKICKS</h2>
              <p className="newsletter-description">
                Suscríbete y recibe ofertas exclusivas, lanzamientos anticipados y contenido especial directo en tu inbox.
              </p>
            </div>
            
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="newsletter-input"
                  aria-label="Correo electrónico para newsletter"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="newsletter-btn"
                  aria-label="Suscribirse al newsletter"
                >
                  Suscribirme
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home