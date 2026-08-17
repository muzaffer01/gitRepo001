import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('navigating from the list shows full product details', async ({ page }) => {
  await page.getByTestId('product-card-1').click()

  await expect(page).toHaveURL(/\/products\/1$/)
  await expect(
    page.getByRole('heading', { name: 'Wireless Noise-Cancelling Headphones' }),
  ).toBeVisible()
  await expect(page.getByText('$89.99')).toBeVisible()
  await expect(page.getByText(/In stock/)).toBeVisible()
})

test('shows a not-found message for an unknown product id', async ({ page }) => {
  await page.goto('/products/99999')

  await expect(page.getByText('Product not found.')).toBeVisible()
})

test('adding to cart shows a confirmation and updates the header badge', async ({
  page,
}) => {
  await page.goto('/products/1')

  await page.getByRole('button', { name: 'Add to Cart' }).click()

  await expect(page.getByText('Added to cart!')).toBeVisible()
  await expect(page.getByTestId('cart-count')).toHaveText('1')
})

test('buy now adds the item and navigates straight to the cart', async ({ page }) => {
  await page.goto('/products/1')

  await page.getByRole('button', { name: 'Buy Now' }).click()

  await expect(page).toHaveURL(/\/cart$/)
  await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible()
  await expect(page.getByText('Wireless Noise-Cancelling Headphones')).toBeVisible()
})

test('respects the selected quantity when buying now', async ({ page }) => {
  await page.goto('/products/1')

  await page.getByLabel('Quantity').selectOption('3')
  await page.getByRole('button', { name: 'Buy Now' }).click()

  await expect(page.getByTestId('cart-item-1')).toContainText('$269.97')
})
