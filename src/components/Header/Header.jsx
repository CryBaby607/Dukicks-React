import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '../../context/CartContext'
import SearchBar from '../SearchBar/SearchBar'

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
    <header className="bg-primary border-b border-dark-gray sticky top-0 z-sticky shadow-md">
      <div className="container">
        <div className="flex items-center justify-between py-md">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center no-underline transition-opacity duration-base hover:opacity-80 hover:no-underline"
            >
              <span className="font-title text-2xl font-bold -tracking-[0.5px]">
                <span className="text-white">DU</span>
                <span className="text-accent">KICKS</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav
            className={`
              md:flex md:items-center md:gap-xl md:flex-1 md:justify-center
              fixed md:static top-0 ${isMenuOpen ? 'right-0' : '-right-full'}
              w-full md:w-auto max-w-[350px] md:max-w-none h-screen md:h-auto
              bg-primary flex-col md:flex-row gap-0 md:gap-xl
              justify-start md:justify-center pt-20 md:pt-0
              transition-[right] duration-base overflow-y-auto md:overflow-visible
              z-[1049] md:z-auto
            `}
          >
            <ul className="flex flex-col md:flex-row list-none gap-0 md:gap-xl m-0 p-0 w-full md:w-auto">
              <li className="border-b md:border-b-0 border-dark-gray">
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="
                    font-text text-base font-semibold text-white no-underline
                    relative transition-colors duration-base
                    block md:inline-block p-md md:p-0
                    hover:text-accent hover:bg-white/10 md:hover:bg-transparent
                    after:content-[''] after:absolute after:bottom-0 md:after:bottom-[-6px]
                    after:left-0 after:w-0 after:h-[3px] after:bg-accent
                    after:transition-[width] after:duration-base after:rounded-sm
                    hover:after:w-full
                  "
                >
                  Inicio
                </Link>
              </li>
              <li className="border-b md:border-b-0 border-dark-gray">
                <Link
                  to="/hombre"
                  onClick={closeMenu}
                  className="
                    font-text text-base font-semibold text-white no-underline
                    relative transition-colors duration-base
                    block md:inline-block p-md md:p-0
                    hover:text-accent hover:bg-white/10 md:hover:bg-transparent
                    after:content-[''] after:absolute after:bottom-0 md:after:bottom-[-6px]
                    after:left-0 after:w-0 after:h-[3px] after:bg-accent
                    after:transition-[width] after:duration-base after:rounded-sm
                    hover:after:w-full
                  "
                >
                  Hombre
                </Link>
              </li>
              <li className="border-b md:border-b-0 border-dark-gray">
                <Link
                  to="/mujer"
                  onClick={closeMenu}
                  className="
                    font-text text-base font-semibold text-white no-underline
                    relative transition-colors duration-base
                    block md:inline-block p-md md:p-0
                    hover:text-accent hover:bg-white/10 md:hover:bg-transparent
                    after:content-[''] after:absolute after:bottom-0 md:after:bottom-[-6px]
                    after:left-0 after:w-0 after:h-[3px] after:bg-accent
                    after:transition-[width] after:duration-base after:rounded-sm
                    hover:after:w-full
                  "
                >
                  Mujer
                </Link>
              </li>
              <li>
                <Link
                  to="/gorras"
                  onClick={closeMenu}
                  className="
                    font-text text-base font-semibold text-white no-underline
                    relative transition-colors duration-base
                    block md:inline-block p-md md:p-0
                    hover:text-accent hover:bg-white/10 md:hover:bg-transparent
                    after:content-[''] after:absolute after:bottom-0 md:after:bottom-[-6px]
                    after:left-0 after:w-0 after:h-[3px] after:bg-accent
                    after:transition-[width] after:duration-base after:rounded-sm
                    hover:after:w-full
                  "
                >
                  Gorras
                </Link>
              </li>
            </ul>
          </nav>

          {/* Search Bar */}
          <SearchBar />

          {/* Header Controls */}
          <div className="flex items-center gap-lg flex-shrink-0">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="
                bg-transparent border-none cursor-pointer text-lg text-white
                p-sm flex items-center justify-center transition-all duration-base
                rounded-md hover:text-accent hover:bg-white/10 active:scale-95
                relative hover:no-underline
              "
              aria-label="Carrito de compras"
              onClick={closeMenu}
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              {itemCount > 0 && (
                <span className="
                  absolute -top-2 -right-2 bg-secondary text-white
                  text-xs font-bold w-5 h-5 rounded-full
                  flex items-center justify-center border-2 border-white
                ">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Hamburger Menu */}
            <button
              className={`
                md:hidden flex flex-col gap-[5px] bg-transparent border-none
                cursor-pointer p-sm ml-md
              `}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <span
                className={`
                  w-[25px] h-[3px] bg-white rounded-sm transition-all duration-base block
                  ${isMenuOpen ? 'rotate-45 translate-x-[10px] translate-y-[10px]' : ''}
                `}
              />
              <span
                className={`
                  w-[25px] h-[3px] bg-white rounded-sm transition-all duration-base block
                  ${isMenuOpen ? 'opacity-0' : ''}
                `}
              />
              <span
                className={`
                  w-[25px] h-[3px] bg-white rounded-sm transition-all duration-base block
                  ${isMenuOpen ? '-rotate-45 translate-x-2 -translate-y-2' : ''}
                `}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header