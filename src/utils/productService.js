import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore'
import { db } from '../config/firebase'

const PRODUCTS_COLLECTION = 'products'

/**
 * Obtener todos los productos
 */
export const getAllProducts = async () => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error al obtener productos:', error)
    throw error
  }
}

/**
 * Obtener un producto por ID
 */
export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId)
    const docSnap = await getDocs(query(collection(db, PRODUCTS_COLLECTION)))
    
    return docSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .find(p => p.id === productId) || null
  } catch (error) {
    console.error('Error al obtener producto:', error)
    throw error
  }
}

/**
 * Crear un nuevo producto
 */
export const createProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return { id: docRef.id, ...productData }
  } catch (error) {
    console.error('Error al crear producto:', error)
    throw error
  }
}

/**
 * Actualizar un producto existente
 */
export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId)
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date()
    })
    return { id: productId, ...productData }
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    throw error
  }
}

/**
 * Eliminar un producto
 */
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId)
    await deleteDoc(productRef)
    return true
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    throw error
  }
}

/**
 * Obtener productos por categoría
 */
export const getProductsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error)
    throw error
  }
}

/**
 * Obtener productos destacados
 */
export const getFeaturedProducts = async () => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('isFeatured', '==', true)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).slice(0, 4)
  } catch (error) {
    console.error('Error al obtener productos destacados:', error)
    throw error
  }
}

/**
 * Obtener productos nuevos
 */
export const getNewProducts = async () => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('isNew', '==', true)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error al obtener productos nuevos:', error)
    throw error
  }
}

/**
 * Buscar productos
 */
export const searchProducts = async (query_text) => {
  try {
    const allProducts = await getAllProducts()
    const lowerQuery = query_text.toLowerCase()
    
    return allProducts.filter(p =>
      p.brand?.toLowerCase().includes(lowerQuery) ||
      p.model?.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery)
    )
  } catch (error) {
    console.error('Error al buscar productos:', error)
    throw error
  }
}