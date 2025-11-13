import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faTimes } from '@fortawesome/free-solid-svg-icons'
import { getAllProducts } from '../../utils/productService'
import { searchProductsWithRelevance } from '../../utils/search'
import './SearchBar.css'

function SearchBar() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [productsLoaded, setProductsLoaded] = useState(false)

  // Cargar todos los productos al montar
  useEffect(() => {
    loadAllProducts()
  }, [])

  const loadAllProducts = async () => {
    try {
      const products = await getAllProducts()
      setAllProducts(products)
      setProductsLoaded(true)
    } catch (error) {
      console.error('Error al cargar productos:', error)
      setProductsLoaded(true)
    }
  }

  // Actualizar sugerencias con debounce
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value)

    if (debounceTimer) clearTimeout(debounceTimer)

    if (value.trim().length === 0) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    if (!productsLoaded) {
      setIsOpen(false)
      return
    }

    const timer = setTimeout(() => {
      const results = searchProductsWithRelevance(allProducts, value)
      setSuggestions(results.slice(0, 8))
      setIsOpen(true)
    }, 200)

    setDebounceTimer(timer)
  }, [debounceTimer, allProducts, productsLoaded])

  // Limpiar búsqueda
  const handleClear = useCallback(() => {
    setSearchTerm('')
    setSuggestions([])
    setIsOpen(false)
  }, [])

  // Navegar a detalle del producto
  const handleSelectProduct = (productId) => {
    navigate(`/product/${productId}`)
    handleClear()
  }

  // Realizar búsqueda general
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
      setIsOpen(false)
    }
  }

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
    }
  }, [debounceTimer])

  // Cerrar sugerencias al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-bar')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const productName = (product) => {
    return product.brand 
      ? `${product.brand} ${product.model}` 
      : product.name
  }

  const productImage = (product) => {
    return Array.isArray(product.images) 
      ? product.images[0]
      : product.image
  }

  return (
    <form className="search-bar" onSubmit={handleSearchSubmit}>
      <div className="search-bar__wrapper">
        <div className="search-bar__input-wrapper">
          <FontAwesomeIcon 
            icon={faMagnifyingGlass} 
            className="search-bar__icon"
            aria-hidden="true"
          />
          
          <input
            type="text"
            className="search-bar__input"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchTerm && setIsOpen(true)}
            aria-label="Buscar productos"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-expanded={isOpen}
          />

          {searchTerm && (
            <button
              onClick={handleClear}
              className="search-bar__clear"
              aria-label="Limpiar búsqueda"
              type="button"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>

        {/* Sugerencias desplegables */}
        {isOpen && suggestions.length > 0 && (
          <div className="search-bar__suggestions" id="search-suggestions">
            <ul className="search-bar__list">
              {suggestions.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    className="search-bar__suggestion-item"
                    onClick={() => handleSelectProduct(product.id)}
                    aria-label={`Ver ${productName(product)}`}
                  >
                    <img 
                      src={productImage(product)}
                      alt={productName(product)}
                      className="search-bar__suggestion-image"
                      loading="lazy"
                    />
                    <div className="search-bar__suggestion-content">
                      <span className="search-bar__suggestion-name">
                        {productName(product)}
                      </span>
                      <span className="search-bar__suggestion-category">
                        {product.category}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            
            {searchTerm && (
              <div className="search-bar__footer">
                <button
                  type="submit"
                  className="search-bar__see-all"
                  aria-label={`Ver todos los resultados de "${searchTerm}"`}
                >
                  Ver todos los resultados ({suggestions.length}+)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mensaje cuando no hay resultados */}
        {isOpen && searchTerm && suggestions.length === 0 && productsLoaded && (
          <div className="search-bar__no-results">
            <p>No encontramos productos para "{searchTerm}"</p>
          </div>
        )}
      </div>
    </form>
  )
}

export default SearchBar