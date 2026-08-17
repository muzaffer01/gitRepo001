import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Cart.css'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <h1>Your cart is empty</h1>
        <Link to="/" className="cart-page__continue-link">
          Continue shopping
        </Link>
      </main>
    )
  }

  return (
    <main className="cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-page__layout">
        <ul className="cart-page__items">
          {items.map((item) => (
            <li key={item.id} className="cart-item" data-testid={`cart-item-${item.id}`}>
              <img className="cart-item__image" src={item.image} alt={item.name} />
              <div className="cart-item__details">
                <Link to={`/products/${item.id}`} className="cart-item__name">
                  {item.name}
                </Link>
                <p className="cart-item__price">${item.price.toFixed(2)}</p>
                <div className="cart-item__controls">
                  <label htmlFor={`qty-${item.id}`}>Qty</label>
                  <select
                    id={`qty-${item.id}`}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Number(e.target.value))
                    }
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <button
                    className="cart-item__remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="cart-item__line-total">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>

        <aside className="cart-page__summary">
          <p className="cart-page__subtotal">
            Subtotal: <strong>${subtotal.toFixed(2)}</strong>
          </p>
          <button className="cart-page__checkout">Proceed to Checkout</button>
          <Link to="/" className="cart-page__continue-link">
            Continue shopping
          </Link>
        </aside>
      </div>
    </main>
  )
}
