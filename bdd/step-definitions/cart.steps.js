import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { addProductToCart, findProductByName } from '../support/helpers.js'

Given('I have added {string} to my cart', async function (name) {
  await addProductToCart(this.page, this.baseUrl, name)
})

When('I set the quantity to {string}', async function (quantity) {
  await this.page.getByLabel('Qty').selectOption(quantity)
})

When('I remove the item', async function () {
  await this.page.getByRole('button', { name: 'Remove' }).click()
})

When('I click the header cart link', async function () {
  await this.page.getByTestId('cart-link').click()
})

Then('the cart line for {string} should total {string}', async function (name, total) {
  const product = findProductByName(name)
  await expect(this.page.getByTestId(`cart-item-${product.id}`)).toContainText(total)
})

Then('the subtotal should be {string}', async function (amount) {
  await expect(this.page.getByText('Subtotal:')).toContainText(amount)
})
