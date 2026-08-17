# Product Requirements Document (PRD)
## SampleShop — Phase 1 (Product List, Product Details, Cart)

**Author:** Muzaffer
**Date:** 2026-08-17
**Status:** Draft — Phase 1

---

## 1. Overview

SampleShop is a simplified, Amazon-style e-commerce web application. Phase 1 delivers the
core shopping browse-and-cart experience: a product catalog, product detail pages, and a
shopping cart. There is no checkout, payment, authentication, or backend persistence in
this phase.

## 2. Goals

- Let a shopper browse a catalog of products.
- Let a shopper view full details of a single product.
- Let a shopper add products to a cart, adjust quantities, and remove items.
- Persist cart contents across page reloads (single browser/device).

## 3. Non-Goals (Phase 1)

- User accounts / authentication
- Checkout, payment processing, order history
- Real backend / database (product data is local mock data)
- Multi-currency, tax, or shipping calculation
- Product reviews submission (display of static rating/review count only)

## 4. Target Users

Prospective shoppers evaluating the storefront experience; internal stakeholders reviewing
a functional prototype.

## 5. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|---------------|------------|
| US-1 | Shopper | See a list of all available products | I can browse what's for sale |
| US-2 | Shopper | Search products by name | I can quickly find a specific item |
| US-3 | Shopper | Filter products by category | I can narrow down browsing to a category I care about |
| US-4 | Shopper | Click a product to see its full details | I can learn more before buying |
| US-5 | Shopper | Choose a quantity and add a product to my cart | I can build up an order |
| US-6 | Shopper | Click "Buy Now" on a product | I can go straight to my cart with that item added |
| US-7 | Shopper | See how many items are in my cart at all times | I know my cart status while browsing |
| US-8 | Shopper | View my cart with all items, quantities, and a subtotal | I can review my order before checkout |
| US-9 | Shopper | Change the quantity of an item in my cart | I can adjust my order |
| US-10 | Shopper | Remove an item from my cart | I can correct mistakes |
| US-11 | Shopper | Have my cart persist if I reload the page | I don't lose my selections |

## 6. Functional Requirements

### 6.1 Product List Page (`/`)
- FR-1: Display all products in a responsive grid (image, name, star rating, review count, price).
- FR-2: Provide a text search box that filters products by name (case-insensitive, live filter).
- FR-3: Provide a category dropdown (including "All") that filters the grid.
- FR-4: Show an empty state message when no products match the current filters.
- FR-5: Each product card links to that product's Details page.

### 6.2 Product Details Page (`/products/:id`)
- FR-6: Display product image, name, rating, review count, price, description, and stock status.
- FR-7: Provide a quantity selector, capped at the lesser of 10 or available stock.
- FR-8: "Add to Cart" adds the selected quantity to the cart and shows a confirmation message.
- FR-9: "Buy Now" adds the item to the cart and navigates directly to the Cart page.
- FR-10: Both actions are disabled when the product is out of stock.
- FR-11: Requesting an unknown product id shows a "Product not found" message with a link back to the list.

### 6.3 Cart Page (`/cart`)
- FR-12: List every item in the cart with image, name, unit price, quantity control, and line total.
- FR-13: Allow changing quantity per line item (updates line total and subtotal live).
- FR-14: Allow removing a line item entirely.
- FR-15: Display the cart subtotal (sum of line totals).
- FR-16: Show an "empty cart" state with a link back to the product list when there are no items.
- FR-17: Provide a "Proceed to Checkout" button (visual only in Phase 1 — no checkout flow yet).

### 6.4 Global
- FR-18: A persistent header shows the site logo/home link and a cart icon with a live item count badge.
- FR-19: Cart state persists in the browser (localStorage) across page reloads.

## 7. Non-Functional Requirements

- NFR-1: Application must be a client-side single-page app (React + Vite).
- NFR-2: Must be responsive down to mobile widths (~360px).
- NFR-3: Core user flows must be covered by automated tests (unit/component level).
- NFR-4: No external network calls required to run the app (all data local/mocked).

## 8. Success Metrics (Phase 1, prototype-level)

- All 3 pages implemented and navigable.
- Automated test suite passes with no failures.
- Production build completes without errors.

## 9. Open Questions / Future Phases

- Real backend + database for products and inventory.
- User accounts, order history, checkout/payment.
- Product reviews (write), wishlists, recommendations.
