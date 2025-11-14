import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  // Estado del carrito - inicializar desde localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('dukicks_cart')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error al cargar carrito del localStorage:', error)
      return []
    }
  })

  // Guardar en localStorage cuando cambia el carrito
  useEffect(() => {
    try {
      localStorage.setItem('dukicks_cart', JSON.stringify(cartItems))
    } catch (error) {
      console.error('Error al guardar carrito en localStorage:', error)
    }
  }, [cartItems])

  // Agregar producto al carrito
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find(item => 
        item.id === product.id && item.size === product.size
      )
      
      if (existing) {
        return prevItems.map(item =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: Math.min(item.quantity + (product.quantity || 1), 99) }
            : item
        )
      }
      
      return [...prevItems, { ...product, quantity: product.quantity || 1 }]
    })
  }

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, size, quantity) => {
    if (quantity < 1 || quantity > 99) return
    
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    )
  }

  // Eliminar producto del carrito
  const removeFromCart = (productId, size) => {
    setCartItems((prevItems) =>
      prevItems.filter(item => !(item.id === productId && item.size === size))
    )
  }

  // Vaciar carrito completo
  const clearCart = () => setCartItems([])

  // CÁLCULOS DERIVADOS
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.price * item.quantity)
  }, 0)

  const total = subtotal  // Sin impuestos/envío en este modelo

  const itemCount = cartItems.reduce((acc, item) => {
    return acc + item.quantity
  }, 0)

  const isEmpty = cartItems.length === 0

  const value = {
    cartItems,
    isEmpty,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    total,
    itemCount,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}