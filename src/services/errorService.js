export const handleError = (error, context = '') => {
  console.error(`Error en [${context}]:`, error)

  if (error.message && !error.code) {
    return error.message
  }

  const errorMap = {
    'auth/user-not-found': 'No encontramos una cuenta con este correo.',
    'auth/wrong-password': 'La contraseña es incorrecta.',
    'auth/invalid-email': 'El formato del correo electrónico no es válido.',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Por favor, espera unos minutos.',
    'auth/weak-password': 'La contraseña es muy débil (mínimo 6 caracteres).',
    'auth/email-already-in-use': 'Este correo electrónico ya está registrado.',
    'auth/operation-not-allowed': 'El inicio de sesión no está habilitado.',
    'auth/invalid-credential': 'Las credenciales han expirado o son inválidas.',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',

    'permission-denied': 'No tienes permisos para realizar esta acción.',
    'unavailable': 'El servicio no está disponible temporalmente.',

    'storage/unauthorized': 'No tienes permiso para subir imágenes.',
    'storage/canceled': 'La subida de la imagen fue cancelada.',
    'storage/unknown': 'Ocurrió un error desconocido al subir la imagen.'
  }

  return errorMap[error.code] || `Ocurrió un error inesperado (${error.code || 'Desconocido'}). Intenta de nuevo.`
}