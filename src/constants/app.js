export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'DUKICKS',
  BUSINESS_PHONE: import.meta.env.VITE_WHATSAPP_NUMBER, 
  CURRENCY: 'MXN',
  LOCALE: 'es-MX'
}

export const WHATSAPP_LINKS = {
  MOBILE: 'whatsapp://send',
  WEB: 'https://web.whatsapp.com/send'
}