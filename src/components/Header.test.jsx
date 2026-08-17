import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import Header from './Header'
import { renderWithProviders } from '../test/testUtils'

const STORAGE_KEY = 'sample-shop-cart'

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows a cart count of 0 when the cart is empty', () => {
    render(renderWithProviders(<Header />))
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
  })

  it('shows the total item count across all cart lines', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { id: 1, name: 'A', price: 1, image: '', quantity: 2 },
        { id: 2, name: 'B', price: 1, image: '', quantity: 3 },
      ]),
    )
    render(renderWithProviders(<Header />))
    expect(screen.getByTestId('cart-count')).toHaveTextContent('5')
  })
})
