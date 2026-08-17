import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import Cart from './Cart'
import { products } from '../data/products'
import { renderWithProviders } from '../test/testUtils'

const STORAGE_KEY = 'sample-shop-cart'

function seedCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

describe('Cart', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows an empty cart message when there are no items', () => {
    render(renderWithProviders(<Cart />))
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
  })

  it('lists items already in the cart with correct subtotal', () => {
    const [p1, p2] = products
    seedCart([
      { id: p1.id, name: p1.name, price: p1.price, image: p1.image, quantity: 2 },
      { id: p2.id, name: p2.name, price: p2.price, image: p2.image, quantity: 1 },
    ])

    render(renderWithProviders(<Cart />))

    expect(screen.getByText(p1.name)).toBeInTheDocument()
    expect(screen.getByText(p2.name)).toBeInTheDocument()

    const expectedSubtotal = p1.price * 2 + p2.price * 1
    expect(
      screen.getByText(`$${expectedSubtotal.toFixed(2)}`),
    ).toBeInTheDocument()
  })

  it('updates the line total when quantity changes', async () => {
    const user = userEvent.setup()
    const [p1] = products
    seedCart([
      { id: p1.id, name: p1.name, price: p1.price, image: p1.image, quantity: 1 },
    ])

    render(renderWithProviders(<Cart />))

    await user.selectOptions(screen.getByLabelText(/qty/i), '4')

    const cartItem = screen.getByTestId(`cart-item-${p1.id}`)
    expect(cartItem).toHaveTextContent(`$${(p1.price * 4).toFixed(2)}`)
  })

  it('removes an item from the cart', async () => {
    const user = userEvent.setup()
    const [p1] = products
    seedCart([
      { id: p1.id, name: p1.name, price: p1.price, image: p1.image, quantity: 1 },
    ])

    render(renderWithProviders(<Cart />))
    await user.click(screen.getByRole('button', { name: /remove/i }))

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
  })
})
