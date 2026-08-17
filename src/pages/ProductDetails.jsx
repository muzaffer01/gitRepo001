import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../data/products'
import { useCart } from '../context/CartContext'
import './ProductDetails.css'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const product = getProductById(id)
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  if (!product) {
    return (
      <main className="product-details-page">
        <p>Product not found.</p>
        <Link to="/">Back to all products</Link>
      </main>
    )
  }

  function handleAddToCart() {
    addToCart(product, quantity)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  function handleBuyNow() {
    addToCart(product, quantity)
    navigate('/cart')
  }

  return (
    <main className="product-details-page">
      <Link to="/" className="product-details-page__back">
        &larr; Back to all products
      </Link>
      <div className="product-details-page__content">
        <img
          className="product-details-page__image"
          src={product.image}
          alt={product.name}
        />
        <div className="product-details-page__info">
          <h1 className="product-details-page__name">{product.name}</h1>
          <p className="product-details-page__rating">
            {'★'.repeat(Math.round(product.rating))}
            <span className="product-details-page__review-count">
              ({product.reviewCount} ratings)
            </span>
          </p>
          <p className="product-details-page__price">
            ${product.price.toFixed(2)}
          </p>
          <p className="product-details-page__description">
            {product.description}
          </p>
          <p className="product-details-page__stock">
            {product.stock > 0
              ? `In stock (${product.stock} available)`
              : 'Out of stock'}
          </p>

          <div className="product-details-page__purchase-box">
            <label htmlFor="quantity" className="product-details-page__quantity-label">
              Quantity
            </label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="product-details-page__quantity"
            >
              {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map(
                (n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ),
              )}
            </select>

            <button
              className="product-details-page__add-to-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
            <button
              className="product-details-page__buy-now"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>

            {justAdded && (
              <p className="product-details-page__confirmation" role="status">
                Added to cart!
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
