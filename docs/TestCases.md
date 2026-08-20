# Test Cases
## SampleShop — Phase 1

**Author:** Muzaffer
**Date:** 2026-08-17
**Related:** Test Plan
**Note:** Created using the Claude agent running in Windows Terminal (Claude Code CLI
on Windows 11).

Automated cases are implemented in the corresponding `*.test.jsx` file and executed via
`npm run test`. Manual cases are executed by hand against `npm run dev`.

**TDD vs. BDD:** the sections below labeled "Automated" (TC-01–TC-16) and "Automated
(E2E)" (TC-E2E-*) are informally called "the TDD tests" in this project to distinguish
them from the "BDD Cases" section further down, which covers the **same** behaviors
using Given/When/Then Gherkin scenarios (Cucumber + Playwright, `npm run test:bdd`).
Neither suite is strictly test-driven (tests were written after the implementation in
both cases) — "TDD" here just labels the imperative `describe`/`it`/`test`-style suite
as opposed to the declarative BDD one, matching how the user referred to them.

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

## BDD Cases (Cucumber + Gherkin, real browser)

Run via `npm run test:bdd`. Written as Given/When/Then scenarios in
`bdd/features/*.feature`, implemented by step definitions in `bdd/step-definitions/`,
driven by Playwright against a real Chromium browser. Deliberately covers the same
behaviors as the "TDD" (TC-01–16) and E2E (TC-E2E-*) cases above — full parity, not a
subset — per the requirement that all test cases be covered in both styles. The only
exceptions are TC-M02 (needs mock data edited to a zero-stock product) and TC-M05
(build verification isn't a UI behavior) — same gaps that exist in the E2E layer.

Each scenario below is quoted verbatim from its `.feature` file (not paraphrased), so
this document and the executable specs can never drift apart silently.

### `product-list.feature`

Background for every scenario in this file: `Given I am on the product list page`.

| ID | Parallels | Scenario (Given/When/Then) |
|----|-----------|------------------------------|
| TC-BDD-01 | TC-01 / TC-E2E-01 | **Shows the full product catalog**<br>`Then I should see 8 product cards`<br>`And I should see the product "Wireless Noise-Cancelling Headphones"`<br>`And I should see the product "Bestselling Mystery Novel (Paperback)"` |
| TC-BDD-02 | TC-02 / TC-E2E-02 | **Searching filters products by name**<br>`When I search for "Yoga Mat"`<br>`Then I should see the product "Yoga Mat with Carrying Strap"`<br>`And I should not see the product "Wireless Noise-Cancelling Headphones"` |
| TC-BDD-03 | TC-03 / TC-E2E-03 | **Filtering by category shows only matching products**<br>`When I filter by category "Books"`<br>`Then I should see the product "Bestselling Mystery Novel (Paperback)"`<br>`And I should not see the product "Ceramic Non-Stick Frying Pan, 10-inch"` |
| TC-BDD-04 | TC-04 / TC-E2E-04 | **Empty search shows no products found**<br>`When I search for "nonexistent-product-xyz"`<br>`Then I should see the message "No products found."` |
| TC-BDD-05 | TC-05 | **Product card links to its details page**<br>`Then the product card for "Wireless Noise-Cancelling Headphones" should link to "/products/1"` |
| TC-BDD-06 | TC-M01 | **Combined search and category filter narrows results**<br>`When I filter by category "Electronics"`<br>`And I search for "keyboard"`<br>`Then I should see the product "Mechanical Keyboard, RGB Backlit"`<br>`And I should not see the product "Wireless Noise-Cancelling Headphones"` |
| TC-BDD-07 | TC-E2E-05 | **Cart badge starts at zero**<br>`Then the cart badge should read "0"` |
| TC-BDD-08 | TC-M06 | **Layout reflows without horizontal overflow on a mobile viewport**<br>`When I resize the viewport to mobile width`<br>`Then the page should not scroll horizontally` |

### `product-details.feature`

| ID | Parallels | Scenario (Given/When/Then) |
|----|-----------|------------------------------|
| TC-BDD-09 | TC-06 / TC-E2E-06 | **Viewing a product shows its full details**<br>`Given I am on the product details page for "Wireless Noise-Cancelling Headphones"`<br>`Then I should see the heading "Wireless Noise-Cancelling Headphones"`<br>`And I should see the price "$89.99"`<br>`And I should see the text "In stock"` |
| TC-BDD-10 | TC-07 / TC-E2E-07 | **Visiting an unknown product shows a not-found message**<br>`Given I am on the product details page for an unknown product`<br>`Then I should see the message "Product not found."` |
| TC-BDD-11 | TC-08 / TC-E2E-08 | **Adding to cart shows a confirmation message**<br>`Given I am on the product details page for "Wireless Noise-Cancelling Headphones"`<br>`When I click "Add to Cart"`<br>`Then I should see the message "Added to cart!"`<br>`And the cart badge should read "1"` |
| TC-BDD-12 | TC-09 / TC-E2E-09 | **Buying now navigates straight to the cart**<br>`Given I am on the product details page for "Wireless Noise-Cancelling Headphones"`<br>`When I click "Buy Now"`<br>`Then I should be on the cart page`<br>`And I should see the product "Wireless Noise-Cancelling Headphones"` |
| TC-BDD-13 | TC-10 / TC-E2E-10 | **The selected quantity is respected when buying now**<br>`Given I am on the product details page for "Wireless Noise-Cancelling Headphones"`<br>`When I select quantity "3"`<br>`And I click "Buy Now"`<br>`Then the cart line for "Wireless Noise-Cancelling Headphones" should total "$269.97"` |

### `cart.feature`

| ID | Parallels | Scenario (Given/When/Then) |
|----|-----------|------------------------------|
| TC-BDD-14 | TC-11 / TC-E2E-11 | **An empty cart shows a message to continue shopping**<br>`Given I am on the cart page`<br>`Then I should see the message "Your cart is empty"`<br>`And I should see a "Continue shopping" link` |
| TC-BDD-15 | TC-12 | **The cart lists items with the correct subtotal**<br>`Given I have added "Wireless Noise-Cancelling Headphones" to my cart`<br>`When I am on the cart page`<br>`Then I should see the product "Wireless Noise-Cancelling Headphones"`<br>`And the subtotal should be "$89.99"` |
| TC-BDD-16 | TC-13 / TC-E2E-12 | **Updating an item's quantity recalculates totals**<br>`Given I have added "Wireless Noise-Cancelling Headphones" to my cart`<br>`And I am on the cart page`<br>`When I set the quantity to "2"`<br>`Then the cart line for "Wireless Noise-Cancelling Headphones" should total "$179.98"`<br>`And the subtotal should be "$179.98"` |
| TC-BDD-17 | TC-14 / TC-E2E-13 | **Removing the only item empties the cart**<br>`Given I have added "Wireless Noise-Cancelling Headphones" to my cart`<br>`And I am on the cart page`<br>`When I remove the item`<br>`Then I should see the message "Your cart is empty"`<br>`And the cart badge should read "0"` |
| TC-BDD-18 | TC-M03 / TC-E2E-14 | **The cart persists after a page reload**<br>`Given I have added "Wireless Noise-Cancelling Headphones" to my cart`<br>`And I am on the cart page`<br>`When I reload the page`<br>`Then I should see the product "Wireless Noise-Cancelling Headphones"`<br>`And the subtotal should be "$89.99"` |
| TC-BDD-19 | TC-M04 / TC-E2E-15 | **A full shopping journey completes via header navigation**<br>`Given I am on the product list page`<br>`When I open the product "Mechanical Keyboard, RGB Backlit"`<br>`And I click "Add to Cart"`<br>`And I click the header cart link`<br>`Then I should be on the cart page`<br>`And I should see the product "Mechanical Keyboard, RGB Backlit"` |

### `header.feature`

| ID | Parallels | Scenario (Given/When/Then) |
|----|-----------|------------------------------|
| TC-BDD-20 | TC-15 | **The cart badge shows zero when the cart is empty**<br>`Given I am on the product list page`<br>`Then the cart badge should read "0"` |
| TC-BDD-21 | TC-16 | **The cart badge reflects the total quantity across multiple items**<br>`Given I have added "Wireless Noise-Cancelling Headphones" to my cart`<br>`And I have added "Stainless Steel Insulated Water Bottle" to my cart`<br>`When I am on the product list page`<br>`Then the cart badge should read "2"` |

**TC-BDD-08 result note:** this scenario initially **failed** on its first run —
genuinely, not staged — revealing [DEF-002](Defect-002-MobileControlsOverflow.md), a
real responsive-layout bug that TC-M06 had previously only marked as "not verified."
It was fixed immediately (see the defect report) and now passes. See Test Run Report
section 2c for the original failure output.

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

**Totals:** 16 automated unit/component ("TDD") cases + 15 automated end-to-end cases +
21 automated BDD (Cucumber/Gherkin) cases, all passing (all mapped to committed test
files), 6 manual/exploratory cases for coverage not practical to automate (TC-M02 and
TC-M05 remain the only two not covered by any automated layer), 1 known-failing case
tracking an open defect (DEF-001), 1 defect found and fixed via the BDD suite
(DEF-002).
