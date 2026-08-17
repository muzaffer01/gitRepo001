import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import ProductDetails from './ProductDetails'
import Cart from './Cart'
import { CartProvider } from '../context/CartContext'
import { products } from '../data/products'

function renderDetailsPage(route = `/products/${products[0].id}`) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <CartProvider>
        <Routes>
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>,
  )
}

describe('ProductDetails', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the product name, price, and description', () => {
    renderDetailsPage()
    const product = products[0]
    expect(
      screen.getByRole('heading', { name: product.name }),
    ).toBeInTheDocument()
    expect(screen.getByText(`$${product.price.toFixed(2)}`)).toBeInTheDocument()
    expect(screen.getByText(product.description)).toBeInTheDocument()
  })

  it('shows a not-found message for an unknown product id', () => {
    renderDetailsPage('/products/99999')
    expect(screen.getByText(/product not found/i)).toBeInTheDocument()
  })

  it('adds the product to the cart and shows a confirmation', async () => {
    const user = userEvent.setup()
    renderDetailsPage()

    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(await screen.findByText(/added to cart/i)).toBeInTheDocument()
  })

  it('buy now adds the item to the cart and navigates to /cart', async () => {
    const user = userEvent.setup()
    renderDetailsPage()

    await user.click(screen.getByRole('button', { name: /buy now/i }))

    expect(await screen.findByRole('heading', { name: /shopping cart/i })).toBeInTheDocument()
    expect(screen.getByText(products[0].name)).toBeInTheDocument()
  })

  it('respects the selected quantity when adding to cart', async () => {
    const user = userEvent.setup()
    renderDetailsPage()

    await user.selectOptions(screen.getByLabelText(/quantity/i), '3')
    await user.click(screen.getByRole('button', { name: /buy now/i }))

    const cartItem = await screen.findByTestId(`cart-item-${products[0].id}`)
    expect(cartItem).toHaveTextContent(
      `$${(products[0].price * 3).toFixed(2)}`,
    )
  })
})
