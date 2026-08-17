import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Header.css'

export default function Header() {
  const { itemCount } = useCart()

  return (
    <header className="site-header">
      <Link to="/" className="site-header__logo">
        SampleShop
      </Link>
      <nav className="site-header__nav">
        <Link to="/" className="site-header__link">
          All Products
        </Link>
        <Link to="/cart" className="site-header__link site-header__cart" data-testid="cart-link">
          Cart
          <span className="site-header__cart-count" data-testid="cart-count">
            {itemCount}
          </span>
        </Link>
      </nav>
    </header>
  )
}
