import { useState, useMemo, useEffect } from 'react'
// ✅ CORRECCIÓN: Importar desde el nuevo servicio
import { getProductsByCategory } from '../../services/product'
import { sortProducts, getSortOptions } from '../../utils/sorting'
import { getUniqueBrands, applyFilters } from '../../utils/filters'
import ProductCard from '../../components/ProductCard/ProductCard'
import './Category.css'

function CategoryPage({ category }) {
  const [selectedBrand, setSelectedBrand] = useState('Todas')
  const [sortBy, setSortBy] = useState('price-low')
  const [products, setProducts] = useState([])

  useEffect(() => {
    const loadCategoryProducts = async () => {
      try {
        const data = await getProductsByCategory(category)
        setProducts(data)
      } catch (err) {
        console.error('Error al cargar productos:', err)
        setProducts([])
      }
    }

    loadCategoryProducts()
  }, [category])

  const brandsInCategory = useMemo(
    () => getUniqueBrands(products, true),
    [products]
  )

  const filteredProducts = useMemo(() => {
    return applyFilters(products, { brand: selectedBrand })
  }, [products, selectedBrand])

  const sortedProducts = useMemo(() => {
    return sortProducts(filteredProducts, sortBy)
  }, [filteredProducts, sortBy])

  return (
    <div className="category-page">
      <div className="container">
        <div className="category-wrapper">
          <aside className="category-sidebar">
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

          <section className="category-content">
            <div className="products-info">
              <p className="products-count">
                Mostrando {sortedProducts.length} de {products.length} productos
              </p>
            </div>

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