import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../context/CartContext'

export function renderWithProviders(ui, { route = '/' } = {}) {
  return (
    <MemoryRouter initialEntries={[route]}>
      <CartProvider>{ui}</CartProvider>
    </MemoryRouter>
  )
}
