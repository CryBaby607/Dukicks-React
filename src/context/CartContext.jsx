import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('dukicks_cart')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error al cargar carrito del localStorage:', error)
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('dukicks_cart', JSON.stringify(cartItems))
    } catch (error) {
      console.error('Error al guardar carrito en localStorage:', error)
    }
  }, [cartItems])

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Buscar si ya existe el producto con la MISMA talla
      const existing = prevItems.find(item => 
        item.id === product.id && 
        item.size === product.size
      )
      
      if (existing) {
        // Si existe, actualizar cantidad
        return prevItems.map(item =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: Math.min(item.quantity + (product.quantity || 1), 99) }
            : item
        )
      }
      
      // Si no existe, agregar como nuevo item
      return [...prevItems, { ...product, quantity: product.quantity || 1 }]
    })
  }

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

  const removeFromCart = (productId, size) => {
    setCartItems((prevItems) =>
      prevItems.filter(item => !(item.id === productId && item.size === size))
    )
  }

  const clearCart = () => setCartItems([])

  const isInCart = (productId, size = null) => {
    if (size) {
      return cartItems.some(item => item.id === productId && item.size === size)
    }
    return cartItems.some(item => item.id === productId)
  }

  const getProductQuantity = (productId, size = null) => {
    if (size) {
      const item = cartItems.find(item => item.id === productId && item.size === size)
      return item ? item.quantity : 0
    }
    
    return cartItems
      .filter(item => item.id === productId)
      .reduce((acc, item) => acc + item.quantity, 0)
  }

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.price * item.quantity)
  }, 0)

  const total = subtotal 

  const itemCount = cartItems.reduce((acc, item) => {
    return acc + item.quantity
  }, 0)

  const isEmpty = cartItems.length === 0

  const uniqueItemCount = cartItems.length

  const value = {
    cartItems,
    isEmpty,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,              
    getProductQuantity,    
    subtotal,
    total,
    itemCount,
    uniqueItemCount,       
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