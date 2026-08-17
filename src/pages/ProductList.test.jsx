import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import ProductList from './ProductList'
import { products } from '../data/products'
import { renderWithProviders } from '../test/testUtils'

describe('ProductList', () => {
  it('renders every product from the catalog', () => {
    render(renderWithProviders(<ProductList />))
    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    })
  })

  it('filters products by search query', async () => {
    const user = userEvent.setup()
    render(renderWithProviders(<ProductList />))

    await user.type(
      screen.getByLabelText(/search products/i),
      'Yoga Mat',
    )

    expect(screen.getByText('Yoga Mat with Carrying Strap')).toBeInTheDocument()
    expect(
      screen.queryByText('Wireless Noise-Cancelling Headphones'),
    ).not.toBeInTheDocument()
  })

  it('filters products by category', async () => {
    const user = userEvent.setup()
    render(renderWithProviders(<ProductList />))

    await user.selectOptions(
      screen.getByLabelText(/filter by category/i),
      'Books',
    )

    expect(
      screen.getByText('Bestselling Mystery Novel (Paperback)'),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Ceramic Non-Stick Frying Pan, 10-inch'),
    ).not.toBeInTheDocument()
  })

  it('shows an empty state when no products match', async () => {
    const user = userEvent.setup()
    render(renderWithProviders(<ProductList />))

    await user.type(
      screen.getByLabelText(/search products/i),
      'nonexistent-product-xyz',
    )

    expect(screen.getByText(/no products found/i)).toBeInTheDocument()
  })

  it('links each product card to its details page', () => {
    render(renderWithProviders(<ProductList />))
    const link = screen.getByTestId(`product-card-${products[0].id}`)
    expect(link).toHaveAttribute('href', `/products/${products[0].id}`)
  })
})
