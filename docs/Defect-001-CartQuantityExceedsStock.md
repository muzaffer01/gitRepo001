# Defect Report — DEF-001

## Cart quantity selector allows selecting more than the item's available stock

**Status:** Open
**Severity:** Medium
**Priority:** Medium
**Found:** 2026-08-17, via demo test scenario TC-FAIL-01
**Found by:** Muzaffer, while authoring a deliberate failure-workflow demonstration
**Related:** [[Test Cases]] TC-FAIL-01, [[Test Run Report — Failure Demo (TC-FAIL-01)]]

---

## Summary

On the Cart page, the quantity `<select>` for each line item always offers exactly
10 options (1 through 10), regardless of how much stock the product actually has.
Nothing in the cart data model or UI enforces a stock ceiling once an item is in the
cart, so a shopper can increase a cart line's quantity past what's actually available.

## Steps to Reproduce

1. Add any product to the cart from its Product Details page (e.g. quantity 1).
2. Go to `/cart`.
3. Open the quantity dropdown for that line item.

**Expected:** The dropdown offers at most `min(availableStock, 10)` options.
**Actual:** The dropdown always offers exactly 10 options (1–10), independent of the
product's real stock.

## Root Cause

Two contributing gaps, both in the current codebase:

1. **Data model gap** — `src/context/CartContext.jsx`'s `addToCart` builds each cart
   line item as `{ id, name, price, image, quantity }`. The product's `stock` value
   (available on the `Product` object in `src/data/products.js`) is never copied onto
   the cart item, so the Cart page has no stock figure to check against.
2. **UI gap** — `src/pages/Cart.jsx` line 41 hardcodes the quantity options:
   ```jsx
   {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
     <option key={n} value={n}>{n}</option>
   ))}
   ```
   This never references stock at all, unlike the Product Details page's quantity
   selector (`src/pages/ProductDetails.jsx`), which correctly caps at
   `Math.min(product.stock, 10)`.

Every product in the current mock catalog (`src/data/products.js`) happens to have
stock ≥ 10, so this gap is invisible in the current UI with real catalog data — it
only becomes visible with a low-stock item (see reproduction test, which uses a
synthetic 3-unit-stock item).

## Impact

Low real-world impact today (no product is low-stock enough to expose it visually),
but it's a genuine latent bug: once any product's stock drops below 10 (or a future
checkout flow validates against stock), a shopper could select — and appear to
successfully add — more units than actually exist.

## Suggested Fix

1. Include `stock` on the cart item when `addToCart` first creates the line
   (`CartContext.jsx`), or look it up live via `getProductById(item.id)` when
   rendering the Cart page.
2. In `Cart.jsx`, generate the quantity options the same way `ProductDetails.jsx`
   already does: `Array.from({ length: Math.min(stock, 10) }, (_, i) => i + 1)`.
3. Add a regression test asserting the cart quantity selector never exceeds the
   item's stock (see `demo/Cart.stockLimit.test.jsx` — currently excluded from the
   main suite; promote it into `src/pages/Cart.test.jsx` once the fix lands, and
   remove the synthetic low-stock workaround in favor of a real low-stock mock
   product if one is added to the catalog).

## Evidence

- Failing test: `demo/Cart.stockLimit.test.jsx` (TC-FAIL-01)
- Captured failure log: `logs/test-run-TC-FAIL-01-2026-08-17.log`
- Full failure-run report: `docs/TestRunReport-FailureDemo-TC-FAIL-01.md`

## Not Yet Fixed

This defect is being tracked but has **not** been fixed as of this report — it was
intentionally left in place to produce the failure-workflow demonstration requested.
Fixing it is out of scope for that demonstration; see "Suggested Fix" above for the
follow-up.
