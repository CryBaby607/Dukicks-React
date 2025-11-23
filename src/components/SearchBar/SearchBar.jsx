import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faTimes } from '@fortawesome/free-solid-svg-icons'
import { getAllProducts } from '../../services/product'
import { searchProductsWithRelevance } from '../../utils/search'
import { useDebounce } from '../../hooks/useDebounce'
import { getProductImage, getProductName } from '../../utils/imageUtils'
import './SearchBar.css'

function SearchBar() {
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const [productsLoaded, setProductsLoaded] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
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
    loadAllProducts()
  }, [])

  useEffect(() => {
    if (debouncedSearchTerm.trim().length === 0) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    if (!productsLoaded) {
      setIsOpen(false)
      return
    }

    const results = searchProductsWithRelevance(allProducts, debouncedSearchTerm)
    setSuggestions(results.slice(0, 8))
    setIsOpen(results.length > 0)
  }, [debouncedSearchTerm, allProducts, productsLoaded])

  const handleExpand = useCallback(() => {
    setIsExpanded(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 200)
  }, [])

  const handleCollapse = useCallback(() => {
    setIsExpanded(false)
    setSearchTerm('')
    setSuggestions([])
    setIsOpen(false)
  }, [])

  const handleSelectProduct = useCallback((productId) => {
    navigate(`/product/${productId}`)
    handleCollapse()
  }, [navigate, handleCollapse])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
      handleCollapse()
    }
  }

  useEffect(() => {
    if (!isExpanded) return

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        handleCollapse()
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCollapse()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isExpanded, handleCollapse])

  return (
    <div 
      ref={searchRef}
      className={`search-bar ${isExpanded ? 'search-bar--expanded' : ''}`}
    >
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
              onChange={(e) => setSearchTerm(e.target.value)}
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

          {isOpen && suggestions.length > 0 && (
            <div className="search-bar__suggestions" id="search-suggestions">
              <ul className="search-bar__list">
                {suggestions.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      className="search-bar__suggestion-item"
                      onClick={() => handleSelectProduct(product.id)}
                      aria-label={`Ver ${getProductName(product)}`}
                    >
                      <img 
                        src={getProductImage(product)}
                        alt={getProductName(product)}
                        className="search-bar__suggestion-image"
                        loading="lazy"
                      />
                      <div className="search-bar__suggestion-content">
                        <span className="search-bar__suggestion-name">
                          {getProductName(product)}
                        </span>
                        <span className="search-bar__suggestion-category">
                          {product.category}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

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