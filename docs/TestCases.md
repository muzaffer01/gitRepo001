# Test Cases
## SampleShop — Phase 1

**Author:** Muzaffer
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

## End-to-End Cases (Playwright, real browser)

Run via `npm run test:e2e`. These exercise the same core flows as the manual cases
above (TC-M01–TC-M04), but automated against a real Chromium browser and a real dev
server, so they replace the need to re-run those manual cases by hand each time.

| ID | Title | Steps | Expected Result | Type | Source |
|----|-------|-------|------------------|------|--------|
| TC-E2E-01 | Shows the full product catalog | Load `/` in a real browser | All 8 products visible; 8 product cards present | Automated (E2E) | `e2e/product-list.spec.js` |
| TC-E2E-02 | Filters products by search text | Type "Yoga Mat" into search | Only the Yoga Mat is visible | Automated (E2E) | `e2e/product-list.spec.js` |
| TC-E2E-03 | Filters products by category | Select "Books" | Only Books-category products visible | Automated (E2E) | `e2e/product-list.spec.js` |
| TC-E2E-04 | Empty search state | Search a nonsense term | "No products found." shown | Automated (E2E) | `e2e/product-list.spec.js` |
| TC-E2E-05 | Cart badge starts at 0 | Load `/` fresh | Header cart badge reads "0" | Automated (E2E) | `e2e/product-list.spec.js` |
| TC-E2E-06 | Navigating from list shows full details | Click a product card | URL is `/products/1`; name, price, stock shown | Automated (E2E) | `e2e/product-details.spec.js` |
| TC-E2E-07 | Not-found message for unknown id | Visit `/products/99999` | "Product not found." shown | Automated (E2E) | `e2e/product-details.spec.js` |
| TC-E2E-08 | Add to cart shows confirmation + badge update | Click "Add to Cart" | "Added to cart!" shown; badge reads "1" | Automated (E2E) | `e2e/product-details.spec.js` |
| TC-E2E-09 | Buy Now navigates to cart | Click "Buy Now" | URL is `/cart`; item visible | Automated (E2E) | `e2e/product-details.spec.js` |
| TC-E2E-10 | Quantity respected on Buy Now | Select qty 3, click "Buy Now" | Cart line total is unit price × 3 | Automated (E2E) | `e2e/product-details.spec.js` |
| TC-E2E-11 | Empty cart message | Visit `/cart` with no items | "Your cart is empty" + "Continue shopping" link shown | Automated (E2E) | `e2e/cart.spec.js` |
| TC-E2E-12 | Quantity update recalculates totals | Change qty selector to 2 | Line total and subtotal both update | Automated (E2E) | `e2e/cart.spec.js` |
| TC-E2E-13 | Remove item empties cart | Click "Remove" on the only item | Empty-cart state shown; badge reads "0" | Automated (E2E) | `e2e/cart.spec.js` |
| TC-E2E-14 | Cart persists across reload | Add item, reload page | Item and subtotal still shown after reload | Automated (E2E) | `e2e/cart.spec.js` |
| TC-E2E-15 | Full journey via header nav | Browse → details → add to cart → click header cart link | Lands on `/cart` with the correct item shown | Automated (E2E) | `e2e/cart.spec.js` |

## Known-Failing / Defect-Tracking Cases

These cases document a real, currently-unfixed defect (see
[Defect-001](Defect-001-CartQuantityExceedsStock.md)). They are intentionally excluded
from the main `npm run test` run so CI stays green — see `vite.demo.config.js` and
[Test Run Report — Failure Demo](TestRunReport-FailureDemo-TC-FAIL-01.md) for the
captured failing run.

| ID | Title | Steps | Expected Result | Actual Result | Type | Source |
|----|-------|-------|------------------|----------------|------|--------|
| TC-FAIL-01 | Cart quantity selector respects item stock | Seed cart with a low-stock item (e.g. stock: 3), open `/cart`, inspect the quantity dropdown's options | Dropdown offers at most `min(stock, 10)` options (3, in this case) | **FAIL** — dropdown always offers exactly 10 options (1–10) regardless of stock | Automated (demo) | `demo/Cart.stockLimit.test.jsx` |

---

**Totals:** 16 automated unit/component cases + 15 automated end-to-end cases, all
passing (all mapped to committed test files), 6 manual/exploratory cases for coverage
not practical to automate in Phase 1 (primarily visual layout at this point, since E2E
now covers reload persistence and navigation), 1 known-failing case tracking an open
defect (DEF-001).
