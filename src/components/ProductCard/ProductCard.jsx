import { Link } from 'react-router-dom'
import { formatPrice, getFinalPrice } from '../../utils/formatters'
import './ProductCard.css'

function ProductCard({ 
  product, 
  variant = 'default',
  showCategory = true
}) {

  const finalPrice = getFinalPrice(product)
    
  const productName = product.brand 
    ? `${product.brand} ${product.model}` 
    : product.name
    
  const productImage = Array.isArray(product.images) 
    ? product.images[0] 
    : product.image

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <article className={`product-card product-card--${variant}`}>
        
        {/* BADGES DE ESTADO */}
        {(product.discount > 0 || product.isNew) && (
          <div className="product-card__badges">
            {product.discount > 0 && (
              <span className="badge badge--discount">-{product.discount}%</span>
            )}
            {product.isNew && (
              <span className="badge badge--new">NUEVO</span>
            )}
          </div>
        )}

        {/* IMAGEN */}
        <div className="product-card__image-wrapper">
          <img
            src={productImage}
            alt={productName}
            className="product-card__image"
            loading="lazy"
          />
        </div>

        {/* INFORMACIÓN DEL PRODUCTO */}
        <div className="product-card__info">
          {showCategory && product.category && (
            <span className="product-card__category">{product.category}</span>
          )}

          <div className="product-card__header">
            <h3 className="product-card__name">
              {product.brand && (
                <span className="product-card__brand">{product.brand}</span>
              )}
              {product.model && (
                <span className="product-card__model">{product.model}</span>
              )}
              {!product.brand && !product.model && product.name}
            </h3>
          </div>

          {variant === 'featured' && product.description && (
            <p className="product-card__description">
              {product.description.substring(0, 80)}...
            </p>
          )}

          {/* PRECIOS */}
          <div className="product-card__prices">
            {product.discount > 0 ? (
              <>
                <span className="product-card__price product-card__price--original">
                  {formatPrice(product.price)}
                </span>
                <span className="product-card__price product-card__price--final">
                  {formatPrice(finalPrice)}
                </span>
              </>
            ) : (
              <span className="product-card__price product-card__price--final">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link> 
  )
}

export default ProductCard