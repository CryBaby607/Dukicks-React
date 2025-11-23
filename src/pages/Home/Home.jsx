import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// ✅ CORRECCIÓN: Importar desde el nuevo servicio
import { getFeaturedProducts } from '../../services/product'
import ProductCard from '../../components/ProductCard/ProductCard'
import './Home.css'

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      const products = await getFeaturedProducts()
      setFeaturedProducts(products)
    } catch (error) {
      console.error("Error loading featured:", error)
    }
  }

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

  return (
    <div className="home">
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

      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Productos Destacados</h2>
          </div>
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
            ) : null}
          </div>
        </div>
      </section>

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
    </div>
  )
}

export default Home