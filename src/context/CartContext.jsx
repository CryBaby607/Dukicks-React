import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('dukicks_cart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch (error) {
      console.error('Error al leer del localStorage:', error)
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('dukicks_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.size === product.size
      )

      if (existingIndex >= 0) {
        const newItems = [...prevItems]
        newItems[existingIndex].quantity += product.quantity
        return newItems
      } else {
        return [...prevItems, product]
      }
    })
  }

  const removeFromCart = (productId, size) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === productId && item.size === size))
    )
  }

  const updateQuantity = (productId, size, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId && item.size === size) {
          return { ...item, quantity: newQuantity }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const itemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }, [cartItems])

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [cartItems])

  const total = subtotal

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    total
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }
  return context
}