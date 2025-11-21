import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '../../context/CartContext'
import SearchBar from '../SearchBar/SearchBar'
import './Header.css'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { itemCount } = useCart()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/" onClick={closeMenu}>
              <span className="logo-text">
                <span className="logo-du">DU</span>
                <span className="logo-kicks">KICKS</span>
              </span>
            </Link>
          </div>

          <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
            <ul className="nav-list">
              <li>
                <Link to="/" onClick={closeMenu}>
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/hombre" onClick={closeMenu}>
                  Hombre
                </Link>
              </li>
              <li>
                <Link to="/mujer" onClick={closeMenu}>
                  Mujer
                </Link>
              </li>
              <li>
                <Link to="/gorras" onClick={closeMenu}>
                  Gorras
                </Link>
              </li>
            </ul>
          </nav>

          <SearchBar />

          <div className="header-controls">
            <Link
              to="/cart"
              className="icon-btn cart-btn"
              aria-label="Shopping cart"
              onClick={closeMenu}
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              {itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
              )}
            </Link>

            <button
              className={`hamburger ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header