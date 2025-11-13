import { createContext, useContext, useState, useEffect } from 'react'
import { collection, doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  // Cargar carrito cuando el usuario se autentica o cambios
  useEffect(() => {
    if (user) {
      loadUserCart()
    } else {
      // Cargar carrito local si no hay usuario autenticado
      const savedCart = localStorage.getItem('dukicks_cart')
      setCartItems(savedCart ? JSON.parse(savedCart) : [])
    }
  }, [user])

  // Guardar carrito cuando cambia (solo si hay usuario)
  useEffect(() => {
    if (user && cartItems.length > 0) {
      saveUserCart(cartItems)
    } else if (!user) {
      // Guardar en localStorage si no hay usuario
      localStorage.setItem('dukicks_cart', JSON.stringify(cartItems))
    }
  }, [cartItems, user])

  // Cargar carrito de Firestore
  const loadUserCart = async () => {
    if (!user) return

    try {
      setLoading(true)
      const cartRef = doc(db, 'users', user.uid, 'cart', 'items')
      const cartSnap = await getDoc(cartRef)

      if (cartSnap.exists()) {
        setCartItems(cartSnap.data().items || [])
      } else {
        setCartItems([])
      }
    } catch (error) {
      console.error('Error al cargar carrito:', error)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  // Guardar carrito en Firestore
  const saveUserCart = async (items) => {
    if (!user) return

    try {
      const cartRef = doc(db, 'users', user.uid, 'cart', 'items')
      await setDoc(cartRef, {
        items,
        updatedAt: new Date(),
        userId: user.uid
      })
    } catch (error) {
      console.error('Error al guardar carrito:', error)
    }
  }

  // ACCIONES DEL CARRITO
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find(item => item.id === product.id)
      if (existing) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
            : item
        )
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1 || quantity > 99) return
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId))
  }

  const clearCart = () => setCartItems([])

  // CÁLCULOS DERIVADOS
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const total = subtotal
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const isEmpty = cartItems.length === 0

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isEmpty,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider')
  return context
}