# Test Cases
## SampleShop — Phase 1

**Author:** Claude (on behalf of Muzaffer)
**Date:** 2026-08-17
**Related:** Test Plan

Automated cases are implemented in the corresponding `*.test.jsx` file and executed via
`npm run test`. Manual cases are executed by hand against `npm run dev`.

---

## Product List Page

| ID | Title | Steps | Expected Result | Type | Source |
|----|-------|-------|------------------|------|--------|
| TC-01 | Renders full catalog | Load `/` | All 8 mock products are visible by name | Automated | `ProductList.test.jsx` |
| TC-02 | Search filters by name | Type "Yoga Mat" into the search box | Only "Yoga Mat with Carrying Strap" is shown; unrelated products (e.g. headphones) are hidden | Automated | `ProductList.test.jsx` |
| TC-03 | Category filter | Select "Books" from the category dropdown | Only Books-category products shown (e.g. mystery novel); other categories hidden | Automated | `ProductList.test.jsx` |
| TC-04 | Empty search state | Type a nonsense query with no matches | "No products found." message is displayed | Automated | `ProductList.test.jsx` |
| TC-05 | Product card links to details | Inspect first product card's link target | `href` equals `/products/{id}` for that product | Automated | `ProductList.test.jsx` |
| TC-M01 | Combined search + category filter (manual) | Set category to "Electronics", then search "keyboard" | Only the mechanical keyboard is shown | Manual | Exploratory |

## Product Details Page

| ID | Title | Steps | Expected Result | Type | Source |
|----|-------|-------|------------------|------|--------|
| TC-06 | Renders product info | Navigate to `/products/1` | Product name (heading), price, and description are displayed | Automated | `ProductDetails.test.jsx` |
| TC-07 | Unknown product id | Navigate to `/products/99999` | "Product not found." message shown with link back to catalog | Automated | `ProductDetails.test.jsx` |
| TC-08 | Add to cart shows confirmation | Click "Add to Cart" on a product | "Added to cart!" confirmation message appears | Automated | `ProductDetails.test.jsx` |
| TC-09 | Buy Now navigates to cart | Click "Buy Now" | User is navigated to `/cart`; the "Shopping Cart" heading and the purchased product are visible | Automated | `ProductDetails.test.jsx` |
| TC-10 | Quantity respected on add | Select quantity "3", click "Buy Now" | Cart line total for that item equals unit price × 3 | Automated | `ProductDetails.test.jsx` |
| TC-M02 | Out-of-stock product (manual) | View a product with `stock: 0` (simulate by editing mock data) | "Add to Cart" and "Buy Now" buttons are disabled; "Out of stock" text shown | Manual | Exploratory |

## Cart Page

| ID | Title | Steps | Expected Result | Type | Source |
|----|-------|-------|------------------|------|--------|
| TC-11 | Empty cart state | Navigate to `/cart` with no items added | "Your cart is empty" message with a "Continue shopping" link is shown | Automated | `Cart.test.jsx` |
| TC-12 | Lists items with subtotal | Seed cart with 2 products at known quantities | Both product names appear; subtotal equals sum of (price × quantity) for all lines | Automated | `Cart.test.jsx` |
| TC-13 | Update quantity updates line total | Change an item's quantity selector to 4 | That line's total updates to unit price × 4 | Automated | `Cart.test.jsx` |
| TC-14 | Remove item | Click "Remove" on the only item in the cart | Cart returns to the empty-cart state | Automated | `Cart.test.jsx` |
| TC-M03 | Cart persists across reload (manual) | Add an item to the cart, reload the browser page | Cart still shows the previously added item and correct subtotal | Manual | Exploratory |

## Header / Global

| ID | Title | Steps | Expected Result | Type | Source |
|----|-------|-------|------------------|------|--------|
| TC-15 | Cart badge shows 0 when empty | Render header with no cart items | Cart count badge displays "0" | Automated | `Header.test.jsx` |
| TC-16 | Cart badge reflects total quantity | Seed cart with items totaling 5 units across 2 lines | Cart count badge displays "5" | Automated | `Header.test.jsx` |
| TC-M04 | Navigation between pages (manual) | From `/`, click a product, then click "SampleShop" logo, then click "Cart" | Each navigation loads the correct page without a full page reload (SPA routing) | Manual | Exploratory |

## Build / Environment

| ID | Title | Steps | Expected Result | Type | Source |
|----|-------|-------|------------------|------|--------|
| TC-M05 | Production build | Run `npm run build` | Build completes with 0 errors and emits `dist/index.html` + bundled assets | Manual | Build verification |
| TC-M06 | Responsive layout | Resize browser to ~360px width on all 3 pages | Layout reflows to a single column without horizontal overflow | Manual | Exploratory |

---

**Totals:** 16 automated cases (all mapped to committed test files), 6 manual/exploratory
cases for coverage not practical to automate in Phase 1 (visual layout, reload
persistence, build output).
