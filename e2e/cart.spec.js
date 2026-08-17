import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('shows an empty cart message with no items', async ({ page }) => {
  await page.goto('/cart')

  await expect(page.getByText('Your cart is empty')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Continue shopping' })).toBeVisible()
})

test('updating quantity recalculates the line total and subtotal', async ({ page }) => {
  await page.goto('/products/1')
  await page.getByRole('button', { name: 'Buy Now' }).click()

  await page.getByLabel('Qty').selectOption('2')

  await expect(page.getByTestId('cart-item-1')).toContainText('$179.98')
  await expect(page.getByText('Subtotal:')).toContainText('$179.98')
})

test('removing the only item returns to the empty-cart state', async ({ page }) => {
  await page.goto('/products/1')
  await page.getByRole('button', { name: 'Buy Now' }).click()

  await page.getByRole('button', { name: 'Remove' }).click()

  await expect(page.getByText('Your cart is empty')).toBeVisible()
  await expect(page.getByTestId('cart-count')).toHaveText('0')
})

test('cart persists across a full page reload', async ({ page }) => {
  await page.goto('/products/1')
  await page.getByRole('button', { name: 'Buy Now' }).click()
  await expect(page.getByTestId('cart-item-1')).toBeVisible()

  await page.reload()

  await expect(page.getByTestId('cart-item-1')).toBeVisible()
  await expect(page.getByText('Subtotal:')).toContainText('$89.99')
})

test('full journey: browse -> details -> add to cart -> cart via header nav', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByTestId('product-card-3').click()
  await page.getByRole('button', { name: 'Add to Cart' }).click()
  await expect(page.getByText('Added to cart!')).toBeVisible()

  await page.getByTestId('cart-link').click()

  await expect(page).toHaveURL(/\/cart$/)
  await expect(page.getByText('Mechanical Keyboard, RGB Backlit')).toBeVisible()
})
