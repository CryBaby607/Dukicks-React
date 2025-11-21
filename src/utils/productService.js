import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore'
import { db } from '../config/firebase'

const PRODUCTS_COLLECTION = 'products'

const uploadImageToCloudinary = async (imageFile) => {
  try {
    if (!imageFile.type.startsWith('image/')) {
      throw new Error('Solo se permiten archivos de imagen')
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      throw new Error('La imagen no debe superar 5MB')
    }

    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (!response.ok) {
      throw new Error('Error al subir imagen a Cloudinary')
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    throw new Error('No se pudo subir la imagen: ' + error.message)
  }
}

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
    throw error
  }
}

export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    return {
      id: docSnap.id,
      ...docSnap.data()
    }
  } catch (error) {
    throw error
  }
}

export const createProduct = async (productData) => {
  try {
    let imageUrl = null

    if (productData.imageFile) {
      imageUrl = await uploadImageToCloudinary(productData.imageFile)
    }

    if (!imageUrl) {
      imageUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop'
    }

    const productWithTimestamp = {
      brand: productData.brand,
      model: productData.model,
      category: productData.category,
      price: productData.price,
      discount: productData.discount || 0,
      description: productData.description,
      image: imageUrl,
      sizes: productData.sizes,
      isNew: productData.isNew || false,
      isFeatured: productData.isFeatured || false,
      type: productData.type || 'Tenis',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productWithTimestamp)

    return { id: docRef.id, ...productWithTimestamp }
  } catch (error) {
    throw error
  }
}

export const updateProduct = async (productId, productData) => {
  try {
    let imageUrl = productData.image

    if (productData.imageFile) {
      imageUrl = await uploadImageToCloudinary(productData.imageFile)
    }

    const updateData = {
      brand: productData.brand,
      model: productData.model,
      category: productData.category,
      price: productData.price,
      discount: productData.discount || 0,
      description: productData.description,
      sizes: productData.sizes,
      isNew: productData.isNew || false,
      isFeatured: productData.isFeatured || false,
      updatedAt: new Date()
    }

    if (imageUrl && productData.imageFile) {
      updateData.image = imageUrl
    } else if (productData.image && !productData.imageFile) {
      updateData.image = productData.image
    }

    const productRef = doc(db, PRODUCTS_COLLECTION, productId)
    await updateDoc(productRef, updateData)

    return { id: productId, ...updateData }
  } catch (error) {
    throw error
  }
}

export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId)
    await deleteDoc(productRef)
    return true
  } catch (error) {
    throw error
  }
}

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
    throw error
  }
}

export const getFeaturedProducts = async () => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('isFeatured', '==', true)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .slice(0, 4)
  } catch (error) {
    throw error
  }
}

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
    throw error
  }
}
