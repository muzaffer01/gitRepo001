import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

Given('I am on the product list page', async function () {
  await this.page.goto(this.baseUrl)
})

Given('I am on the cart page', async function () {
  await this.page.goto(`${this.baseUrl}/cart`)
})

Then('I should see the product {string}', async function (name) {
  await expect(this.page.getByText(name)).toBeVisible()
})

Then('I should not see the product {string}', async function (name) {
  await expect(this.page.getByText(name)).not.toBeVisible()
})

Then('I should see the message {string}', async function (message) {
  await expect(this.page.getByText(message)).toBeVisible()
})

Then('the cart badge should read {string}', async function (count) {
  await expect(this.page.getByTestId('cart-count')).toHaveText(count)
})

When('I click {string}', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click()
})

Then('I should be on the cart page', async function () {
  await expect(this.page).toHaveURL(/\/cart$/)
})

Then('I should see a {string} link', async function (linkText) {
  await expect(this.page.getByRole('link', { name: linkText })).toBeVisible()
})

When('I reload the page', async function () {
  await this.page.reload()
})
