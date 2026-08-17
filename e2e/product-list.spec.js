import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('shows the full product catalog', async ({ page }) => {
  await expect(page.getByText('Wireless Noise-Cancelling Headphones')).toBeVisible()
  await expect(page.getByText('Bestselling Mystery Novel (Paperback)')).toBeVisible()
  await expect(page.locator('a[data-testid^="product-card-"]')).toHaveCount(8)
})

test('filters products by search text', async ({ page }) => {
  await page.getByPlaceholder('Search products...').fill('Yoga Mat')

  await expect(page.getByText('Yoga Mat with Carrying Strap')).toBeVisible()
  await expect(
    page.getByText('Wireless Noise-Cancelling Headphones'),
  ).not.toBeVisible()
})

test('filters products by category', async ({ page }) => {
  await page.getByLabel('Filter by category').selectOption('Books')

  await expect(page.getByText('Bestselling Mystery Novel (Paperback)')).toBeVisible()
  await expect(
    page.getByText('Ceramic Non-Stick Frying Pan, 10-inch'),
  ).not.toBeVisible()
})

test('shows an empty state when no products match', async ({ page }) => {
  await page.getByPlaceholder('Search products...').fill('nonexistent-product-xyz')

  await expect(page.getByText('No products found.')).toBeVisible()
})

test('cart badge starts at 0', async ({ page }) => {
  await expect(page.getByTestId('cart-count')).toHaveText('0')
})
