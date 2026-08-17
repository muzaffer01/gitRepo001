import { Link } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="product-card"
      data-testid={`product-card-${product.id}`}
    >
      <img className="product-card__image" src={product.image} alt={product.name} />
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__rating">
          {'★'.repeat(Math.round(product.rating))}
          <span className="product-card__review-count">
            ({product.reviewCount})
          </span>
        </p>
        <p className="product-card__price">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  )
}
