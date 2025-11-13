import { useState, useMemo, useEffect } from 'react'
import { getProductsByCategory } from '../../utils/productService'
import { sortProducts, getSortOptions } from '../../utils/sorting'
import { getUniqueBrands, applyFilters } from '../../utils/filters'
import ProductCard from '../../components/ProductCard/ProductCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import './Category.css'

function CategoryPage({ category }) {
  const [selectedBrand, setSelectedBrand] = useState('Todas')
  const [sortBy, setSortBy] = useState('newest')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar productos de la categoría
  useEffect(() => {
    loadCategoryProducts()
  }, [category])

  const loadCategoryProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProductsByCategory(category)
      setProducts(data)
    } catch (err) {
      console.error('Error al cargar productos:', err)
      setError('Error al cargar productos de esta categoría')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Obtener marcas únicas (memoizado)
  const brandsInCategory = useMemo(
    () => getUniqueBrands(products, true),
    [products]
  )

  // Aplicar filtros (memoizado)
  const filteredProducts = useMemo(() => {
    return applyFilters(products, { brand: selectedBrand })
  }, [products, selectedBrand])

  // Aplicar ordenamiento (memoizado)
  const sortedProducts = useMemo(() => {
    return sortProducts(filteredProducts, sortBy)
  }, [filteredProducts, sortBy])

  if (loading) {
    return (
      <div className="category-page">
        <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <FontAwesomeIcon 
              icon={faSpinner} 
              spin 
              style={{ fontSize: '48px', color: '#3a86ff', marginBottom: '20px', display: 'block' }}
            />
            <p style={{ fontSize: '18px', color: '#6c757d' }}>Cargando productos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="category-page">
        <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '18px', color: '#ef4444' }}>{error}</p>
            <button 
              onClick={loadCategoryProducts}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#3a86ff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="category-page">
      <div className="container">
        <div className="category-wrapper">
          
          {/* ===== SIDEBAR: FILTROS ===== */}
          <aside className="category-sidebar">
            
            {/* Filtro de Marca */}
            <div className="filter-section">
              <h3 className="filter-title">Marcas</h3>
              <div className="filter-brands">
                {brandsInCategory.map(brand => (
                  <button
                    key={brand}
                    className={`brand-btn ${selectedBrand === brand ? 'active' : ''}`}
                    onClick={() => setSelectedBrand(brand)}
                    aria-pressed={selectedBrand === brand}
                  >
                    {brand}
                    <span className="brand-count">
                      ({brand === 'Todas'
                        ? products.length
                        : products.filter(p => p.brand === brand).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ordenamiento */}
            <div className="filter-section">
              <h3 className="filter-title">Ordenar Por</h3>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Ordenar productos"
              >
                {getSortOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {/* ===== CONTENIDO PRINCIPAL ===== */}
          <section className="category-content">
            
            {/* Info de productos */}
            <div className="products-info">
              <p className="products-count">
                Mostrando {sortedProducts.length} de {products.length} productos
              </p>
            </div>

            {/* ===== GRID DE PRODUCTOS ===== */}
            <div className="category-products-grid">
              {sortedProducts.length > 0 ? (
                sortedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="default"
                    showCategory={false}
                  />
                ))
              ) : (
                <div className="no-products">
                  <p>No hay productos disponibles con los filtros seleccionados</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage