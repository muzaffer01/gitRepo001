import { products } from '../../src/data/products.js'

export function findProductByName(name) {
  const product = products.find((p) => p.name === name)
  if (!product) throw new Error(`No product found in the catalog named "${name}"`)
  return product
}

export async function gotoProductDetails(page, baseUrl, name) {
  const product = findProductByName(name)
  await page.goto(`${baseUrl}/products/${product.id}`)
}

export async function addProductToCart(page, baseUrl, name, quantity = 1) {
  await gotoProductDetails(page, baseUrl, name)
  if (quantity !== 1) {
    await page.getByLabel('Quantity').selectOption(String(quantity))
  }
  await page.getByRole('button', { name: 'Add to Cart' }).click()
  await page.getByText('Added to cart!').waitFor()
}
