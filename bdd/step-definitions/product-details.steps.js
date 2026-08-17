import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { gotoProductDetails } from '../support/helpers.js'

Given('I am on the product details page for {string}', async function (name) {
  await gotoProductDetails(this.page, this.baseUrl, name)
})

Given('I am on the product details page for an unknown product', async function () {
  await this.page.goto(`${this.baseUrl}/products/99999`)
})

Then('I should see the heading {string}', async function (heading) {
  await expect(this.page.getByRole('heading', { name: heading })).toBeVisible()
})

Then('I should see the price {string}', async function (price) {
  await expect(this.page.getByText(price)).toBeVisible()
})

Then('I should see the text {string}', async function (text) {
  await expect(this.page.getByText(new RegExp(text))).toBeVisible()
})

When('I select quantity {string}', async function (quantity) {
  await this.page.getByLabel('Quantity').selectOption(quantity)
})
