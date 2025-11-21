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

// Función para subir imagen a Cloudinary
const uploadImageToCloudinary = async (imageFile) => {
  try {
    // Validaciones de seguridad
    if (!imageFile.type.startsWith('image/')) {
      throw new Error('Solo se permiten archivos de imagen');
    }
    
    if (imageFile.size > 5 * 1024 * 1024) {
      throw new Error('La imagen no debe superar 5MB');
    }

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Error al subir imagen a Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error);
    throw new Error('No se pudo subir la imagen: ' + error.message);
  }
};

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

export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      console.warn(`Producto con ID ${productId} no encontrado`)
      return null
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    }
  } catch (error) {
    console.error('Error al obtener producto:', error)
    throw error
  }
}

export const createProduct = async (productData) => {
  try {
    let imageUrl = productData.image;
    
    // Si hay un archivo de imagen, subirlo a Cloudinary
    if (productData.imageFile) {
      imageUrl = await uploadImageToCloudinary(productData.imageFile);
    }
    
    // Si no hay imagen, usar una por defecto
    if (!imageUrl) {
      imageUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop';
    }

    const productWithTimestamp = {
      brand: productData.brand,
      model: productData.model,
      category: productData.category,
      price: productData.price,
      discount: productData.discount || 0,
      description: productData.description,
      image: imageUrl,
      images: [imageUrl],
      sizes: productData.sizes,
      isNew: productData.isNew || false,
      isFeatured: productData.isFeatured || false,
      type: productData.type || 'Tenis',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productWithTimestamp);
    return { id: docRef.id, ...productWithTimestamp };
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
}

export const updateProduct = async (productId, productData) => {
  try {
    let imageUrl = productData.image;
    
    // Si hay un archivo de imagen nuevo, subirlo a Cloudinary
    if (productData.imageFile) {
      imageUrl = await uploadImageToCloudinary(productData.imageFile);
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
    };

    // Solo actualizar imagen si hay una nueva
    if (imageUrl && productData.imageFile) {
      updateData.image = imageUrl;
      updateData.images = [imageUrl];
    }

    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, updateData);
    return { id: productId, ...updateData };
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
}

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