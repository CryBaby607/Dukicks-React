export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const validateImageFile = (file) => {
  if (!file) return 'No se ha seleccionado ningún archivo.';
  if (!file.type.startsWith('image/')) {
    return 'Solo se permiten archivos de imagen';
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `La imagen no debe superar ${MAX_FILE_SIZE_MB}MB`;
  }
  return null;
};
