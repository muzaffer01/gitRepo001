import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { findProductByName } from '../support/helpers.js'

Then('I should see {int} product cards', async function (count) {
  await expect(this.page.locator('a[data-testid^="product-card-"]')).toHaveCount(count)
})

When('I search for {string}', async function (query) {
  await this.page.getByPlaceholder('Search products...').fill(query)
})

When('I filter by category {string}', async function (category) {
  await this.page.getByLabel('Filter by category').selectOption(category)
})

Then(
  'the product card for {string} should link to {string}',
  async function (name, path) {
    const product = findProductByName(name)
    const link = this.page.getByTestId(`product-card-${product.id}`)
    await expect(link).toHaveAttribute('href', path)
  },
)

When('I open the product {string}', async function (name) {
  const product = findProductByName(name)
  await this.page.getByTestId(`product-card-${product.id}`).click()
})

When('I resize the viewport to mobile width', async function () {
  await this.page.setViewportSize({ width: 375, height: 800 })
})

Then('the page should not scroll horizontally', async function () {
  const overflow = await this.page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  )
  expect(overflow).toBe(false)
})
