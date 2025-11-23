import { useCart } from '../../context/CartContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { formatPrice } from '../../utils/formatters'
import { sendOrderViaWhatsApp } from '../../services/whatsapp'
import { APP_CONFIG } from '../../constants/app'
import './Cart.css'

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, total, itemCount } = useCart()

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) {
      alert('Tu carrito está vacío')
      return
    }

    sendOrderViaWhatsApp(APP_CONFIG.BUSINESS_PHONE, cartItems, total)
  }

  const handleQuantityChange = (productId, size, newQuantity) => {
    const quantity = parseInt(newQuantity, 10)
    if (quantity > 0 && quantity <= 99) {
      updateQuantity(productId, size, quantity)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <div className="empty-content">
              <h1 className="empty-title">Tu carrito está vacío</h1>
              <p className="empty-description">
                Agrega productos para comenzar tu compra
              </p>
              <a href="/" className="btn btn-primary">
                Explorar Productos
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Carrito de Compras</h1>
        
        <div className="cart-wrapper">
          <section className="cart-items-section">
            <div className="cart-items-header">
              <span className="header-products">Productos</span>
              <span>Precio</span>
              <span>Cantidad</span>
              <span>Subtotal</span>
              <span></span>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => (
                <article key={`${item.id}-${item.size}`} className="cart-item">
                  <div className="item-image-wrapper">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-image"
                    />
                  </div>

                  <div className="item-info">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-category">{item.category}</p>
                    {item.size && (
                      <p className="item-size">Talla: {item.size}</p>
                    )}
                  </div>

                  <div className="item-price">
                    <span className="price-label">Precio</span>
                    <span className="price-value">{formatPrice(item.price)}</span>
                  </div>

                  <div className="item-quantity">
                    <label htmlFor={`quantity-${item.id}-${item.size}`} className="quantity-label">
                      Cantidad
                    </label>
                    <input
                      id={`quantity-${item.id}-${item.size}`}
                      type="number"
                      min="1"
                      max="99"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, item.size, e.target.value)}
                      className="quantity-input"
                      aria-label={`Cantidad de ${item.name}`}
                    />
                  </div>

                  <div className="item-subtotal">
                    <span className="subtotal-label">Subtotal</span>
                    <span className="subtotal-value">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="btn-remove"
                    aria-label={`Eliminar ${item.name} del carrito`}
                    title="Eliminar producto"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </article>
              ))}
            </div>
          </section>

          <aside className="cart-summary">
            <div className="summary-card">
              <h2 className="summary-title">Resumen</h2>

              <div className="summary-row">
                <span className="summary-label">Productos ({itemCount})</span>
                <span className="summary-value">{formatPrice(subtotal)}</span>
              </div>

              <div className="summary-row summary-total">
                <span className="summary-label">Total</span>
                <span className="summary-value total-value">
                  {formatPrice(total)}
                </span>
              </div>

              <button 
                className="btn btn-primary btn-checkout btn-whatsapp"
                onClick={handleWhatsAppCheckout}
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                Realizar Pedido por WhatsApp
              </button>

              <a href="/" className="btn btn-continue">
                Seguir Comprando
              </a>

              <p className="whatsapp-note">
                Al hacer clic, se abrirá WhatsApp con tu pedido
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Cart