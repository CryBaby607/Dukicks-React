export const generateWhatsAppMessage = (cartItems, total) => {
  if (!cartItems || cartItems.length === 0) {
    return ''
  }

  let message = '*🛍️ PEDIDO DUKICKS*\n\n'
  
  cartItems.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`
    message += `   Talla: ${item.size || 'N/A'}\n`
    message += `   Cantidad: ${item.quantity}\n`
    message += `   Precio: $${item.price.toLocaleString()}\n`
    message += `   Subtotal: $${(item.price * item.quantity).toLocaleString()}\n\n`
  })

  message += `━━━━━━━━━━━━━━━━\n`
  message += `*TOTAL: $${total.toLocaleString()} MXN*\n\n`
  message += `_Gracias por tu preferencia_ 🙌`

  return encodeURIComponent(message)
}

export const generateWhatsAppURL = (phoneNumber, cartItems, total) => {
  const message = generateWhatsAppMessage(cartItems, total)
  const cleanPhone = phoneNumber.replace(/\D/g, '') 
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  if (isMobile) {
    return `whatsapp://send?phone=${cleanPhone}&text=${message}`
  } else {
    return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${message}`
  }
}

export const sendOrderViaWhatsApp = (phoneNumber, cartItems, total) => {
  const url = generateWhatsAppURL(phoneNumber, cartItems, total)
  window.open(url, '_blank')
}

export const validatePhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('52'))
}

export const formatPhoneForWhatsApp = (phone) => {
  let cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    cleaned = '52' + cleaned
  }
  
  return cleaned
}