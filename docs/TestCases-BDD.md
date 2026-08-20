# Test Cases — BDD (Cucumber / Gherkin)
## SampleShop — Phase 1

**Author:** Muzaffer
**Date:** 2026-08-17
**Related:** Test Plan, [Test Cases — TDD](TestCases-TDD.md) (same behaviors, imperative unit/E2E/manual format)
**Note:** Created using the Claude agent running in Windows Terminal (Claude Code CLI
on Windows 11).

Run via `npm run test:bdd`. Written as Given/When/Then scenarios in
`bdd/features/*.feature`, implemented by step definitions in `bdd/step-definitions/`,
driven by Playwright against a real Chromium browser. Deliberately covers the **same**
behaviors as the unit/component and end-to-end cases in the companion
[Test Cases — TDD](TestCases-TDD.md) document — full parity, not a subset — per the
requirement that all test cases be covered in both styles. The only exceptions are
TC-M02 (needs mock data edited to a zero-stock product) and TC-M05 (build verification
isn't a UI behavior) — same gaps that exist in the E2E layer.

Each scenario below is quoted verbatim from its `.feature` file (not paraphrased), so
this document and the executable specs can never drift apart silently.

---

## `product-list.feature`

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

## `product-details.feature`

| ID | Parallels | Scenario (Given/When/Then) |
|----|-----------|------------------------------|
| TC-BDD-09 | TC-06 / TC-E2E-06 | **Viewing a product shows its full details**<br>`Given I am on the product details page for "Wireless Noise-Cancelling Headphones"`<br>`Then I should see the heading "Wireless Noise-Cancelling Headphones"`<br>`And I should see the price "$89.99"`<br>`And I should see the text "In stock"` |
| TC-BDD-10 | TC-07 / TC-E2E-07 | **Visiting an unknown product shows a not-found message**<br>`Given I am on the product details page for an unknown product`<br>`Then I should see the message "Product not found."` |
| TC-BDD-11 | TC-08 / TC-E2E-08 | **Adding to cart shows a confirmation message**<br>`Given I am on the product details page for "Wireless Noise-Cancelling Headphones"`<br>`When I click "Add to Cart"`<br>`Then I should see the message "Added to cart!"`<br>`And the cart badge should read "1"` |
| TC-BDD-12 | TC-09 / TC-E2E-09 | **Buying now navigates straight to the cart**<br>`Given I am on the product details page for "Wireless Noise-Cancelling Headphones"`<br>`When I click "Buy Now"`<br>`Then I should be on the cart page`<br>`And I should see the product "Wireless Noise-Cancelling Headphones"` |
| TC-BDD-13 | TC-10 / TC-E2E-10 | **The selected quantity is respected when buying now**<br>`Given I am on the product details page for "Wireless Noise-Cancelling Headphones"`<br>`When I select quantity "3"`<br>`And I click "Buy Now"`<br>`Then the cart line for "Wireless Noise-Cancelling Headphones" should total "$269.97"` |

## `cart.feature`

| ID | Parallels | Scenario (Given/When/Then) |
|----|-----------|------------------------------|
| TC-BDD-14 | TC-11 / TC-E2E-11 | **An empty cart shows a message to continue shopping**<br>`Given I am on the cart page`<br>`Then I should see the message "Your cart is empty"`<br>`And I should see a "Continue shopping" link` |
| TC-BDD-15 | TC-12 | **The cart lists items with the correct subtotal**<br>`Given I have added "Wireless Noise-Cancelling Headphones" to my cart`<br>`When I am on the cart page`<br>`Then I should see the product "Wireless Noise-Cancelling Headphones"`<br>`And the subtotal should be "$89.99"` |
| TC-BDD-16 | TC-13 / TC-E2E-12 | **Updating an item's quantity recalculates totals**<br>`Given I have added "Wireless Noise-Cancelling Headphones" to my cart`<br>`And I am on the cart page`<br>`When I set the quantity to "2"`<br>`Then the cart line for "Wireless Noise-Cancelling Headphones" should total "$179.98"`<br>`And the subtotal should be "$179.98"` |
| TC-BDD-17 | TC-14 / TC-E2E-13 | **Removing the only item empties the cart**<br>`Given I have added "Wireless Noise-Cancelling Headphones" to my cart`<br>`And I am on the cart page`<br>`When I remove the item`<br>`Then I should see the message "Your cart is empty"`<br>`And the cart badge should read "0"` |
| TC-BDD-18 | TC-M03 / TC-E2E-14 | **The cart persists after a page reload**<br>`Given I have added "Wireless Noise-Cancelling Headphones" to my cart`<br>`And I am on the cart page`<br>`When I reload the page`<br>`Then I should see the product "Wireless Noise-Cancelling Headphones"`<br>`And the subtotal should be "$89.99"` |
| TC-BDD-19 | TC-M04 / TC-E2E-15 | **A full shopping journey completes via header navigation**<br>`Given I am on the product list page`<br>`When I open the product "Mechanical Keyboard, RGB Backlit"`<br>`And I click "Add to Cart"`<br>`And I click the header cart link`<br>`Then I should be on the cart page`<br>`And I should see the product "Mechanical Keyboard, RGB Backlit"` |

## `header.feature`

| ID | Parallels | Scenario (Given/When/Then) |
|----|-----------|------------------------------|
| TC-BDD-20 | TC-15 | **The cart badge shows zero when the cart is empty**<br>`Given I am on the product list page`<br>`Then the cart badge should read "0"` |
| TC-BDD-21 | TC-16 | **The cart badge reflects the total quantity across multiple items**<br>`Given I have added "Wireless Noise-Cancelling Headphones" to my cart`<br>`And I have added "Stainless Steel Insulated Water Bottle" to my cart`<br>`When I am on the product list page`<br>`Then the cart badge should read "2"` |

**TC-BDD-08 result note:** this scenario initially **failed** on its first run —
genuinely, not staged — revealing [DEF-002](Defect-002-MobileControlsOverflow.md), a
real responsive-layout bug that TC-M06 had previously only marked as "not verified."
It was fixed immediately (see the defect report) and now passes. See Test Run Report
section 2c for the original failure output.

---

**Totals:** 21 automated BDD (Cucumber/Gherkin) cases across 4 feature files, all
passing (verified via `npm run test:bdd`: 2 hooks, 21 scenarios, 121 steps, all passed).
Full parity with the TDD/E2E cases in [Test Cases — TDD](TestCases-TDD.md) except
TC-M02 and TC-M05, which aren't practical to express as UI-driven Gherkin scenarios. 1
defect found and fixed via this suite (DEF-002).
