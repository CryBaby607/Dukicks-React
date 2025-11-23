import { validateImageFile } from '../helpers/validation' //

export const uploadImageToCloudinary = async (imageFile) => {
  try {
    const validationError = validateImageFile(imageFile)
    if (validationError) {
      throw new Error(validationError)
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