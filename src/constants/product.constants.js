export const PRODUCT_CATEGORIES = {
  HOMBRE: 'Hombre',
  MUJER: 'Mujer',
  GORRAS: 'Gorras'
}

export const PRODUCT_TYPES = {
  TENIS: 'Tenis',
  GORRA: 'Gorra'
}

export const SIZES = {
  [PRODUCT_CATEGORIES.HOMBRE]: [
    25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5,
    29, 29.5, 30, 30.5, 31, 31.5, 32
  ],
  [PRODUCT_CATEGORIES.MUJER]: [
    23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5,
    27, 27.5, 28, 28.5, 29
  ],
  [PRODUCT_CATEGORIES.GORRAS]: ['Única']
}

export const CATEGORY_LABELS = {
  [PRODUCT_CATEGORIES.HOMBRE]: 'Calzado para Hombre',
  [PRODUCT_CATEGORIES.MUJER]: 'Calzado para Mujer',
  [PRODUCT_CATEGORIES.GORRAS]: 'Gorras'
}