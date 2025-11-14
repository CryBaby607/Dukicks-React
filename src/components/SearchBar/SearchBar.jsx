import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faTimes } from '@fortawesome/free-solid-svg-icons'
import { getAllProducts } from '../../utils/productService'
import { searchProductsWithRelevance } from '../../utils/search'
import './SearchBar.css'

function SearchBar() {
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const inputRef = useRef(null)
  
  // Estados
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [productsLoaded, setProductsLoaded] = useState(false)

  // Cargar productos al montar
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

  // Expandir SearchBar y enfocar input
  const handleExpand = useCallback(() => {
    setIsExpanded(true)
    // Pequeño delay para que la animación se complete antes de enfocar
    setTimeout(() => {
      inputRef.current?.focus()
    }, 200)
  }, [])

  // Contraer SearchBar
  const handleCollapse = useCallback(() => {
    setIsExpanded(false)
    setSearchTerm('')
    setSuggestions([])
    setIsOpen(false)
    if (debounceTimer) clearTimeout(debounceTimer)
  }, [debounceTimer])

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
      setIsOpen(results.length > 0)
    }, 200)

    setDebounceTimer(timer)
  }, [debounceTimer, allProducts, productsLoaded])

  // Navegar a detalle del producto
  const handleSelectProduct = useCallback((productId) => {
    navigate(`/product/${productId}`)
    handleCollapse()
  }, [navigate, handleCollapse])

  // Realizar búsqueda general
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
      handleCollapse()
    }
  }

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        if (isExpanded) {
          handleCollapse()
        }
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded, handleCollapse])

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        handleCollapse()
      }
    }

    if (isExpanded) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isExpanded, handleCollapse])

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
    }
  }, [debounceTimer])

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
    <div 
      ref={searchRef}
      className={`search-bar ${isExpanded ? 'search-bar--expanded' : ''}`}
    >
      {/* Botón de búsqueda (solo visible cuando está colapsado) */}
      {!isExpanded && (
        <button
          className="search-bar__toggle"
          onClick={handleExpand}
          aria-label="Abrir búsqueda"
          aria-expanded={isExpanded}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      )}

      {/* Formulario de búsqueda (visible cuando está expandido) */}
      {isExpanded && (
        <form 
          className="search-bar__form" 
          onSubmit={handleSearchSubmit}
        >
          <div className="search-bar__input-wrapper">
            <FontAwesomeIcon 
              icon={faMagnifyingGlass} 
              className="search-bar__icon"
              aria-hidden="true"
            />
            
            <input
              ref={inputRef}
              type="text"
              className="search-bar__input"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Buscar productos"
              aria-autocomplete="list"
              aria-controls="search-suggestions"
              aria-expanded={isOpen}
            />

            <button
              type="button"
              onClick={handleCollapse}
              className="search-bar__close"
              aria-label="Cerrar búsqueda"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
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
        </form>
      )}
    </div>
  )
}

export default SearchBar