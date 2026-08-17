// TC-FAIL-01 — demonstrates a real, currently-unfixed defect:
// see docs/Defect-001-CartQuantityExceedsStock.md
//
// This file is intentionally excluded from `npm run test` (see vite.config.js
// `test.exclude`). Run it explicitly to reproduce:
//   npx vitest run demo/Cart.stockLimit.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Cart from '../src/pages/Cart'
import { products } from '../src/data/products'
import { renderWithProviders } from '../src/test/testUtils'

const STORAGE_KEY = 'sample-shop-cart'

describe('TC-FAIL-01: Cart quantity selector respects product stock', () => {
  it('does not offer a quantity greater than the item stock', () => {
    // Every product in the current mock catalog happens to have stock >= 10
    // (see src/data/products.js), so this scenario uses a low-stock item (3
    // units) to make the gap unambiguous, matching how a real low-stock product
    // would behave once one exists in the catalog.
    const lowStockProduct = { ...products[0], stock: 3 }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: lowStockProduct.id,
          name: lowStockProduct.name,
          price: lowStockProduct.price,
          image: lowStockProduct.image,
          quantity: 1,
          stock: lowStockProduct.stock,
        },
      ]),
    )

    render(renderWithProviders(<Cart />))

    const qtySelect = screen.getByLabelText(/qty/i)
    const optionValues = Array.from(qtySelect.options).map((o) => Number(o.value))
    const maxOfferedQuantity = Math.max(...optionValues)

    // EXPECTED (per PRD FR-13 intent — quantity changes should stay valid against
    // available stock): with only 3 units in stock, the dropdown should offer at
    // most 3.
    // ACTUAL (Cart.jsx line 41): always renders exactly 1-10 via
    // `Array.from({ length: 10 }, ...)`, ignoring stock entirely — so
    // maxOfferedQuantity is 10, not 3, and this assertion fails.
    expect(maxOfferedQuantity).toBeLessThanOrEqual(lowStockProduct.stock)
  })
})
