# Requirements Traceability Matrix (RTM)
## SampleShop — Phase 1

**Author:** Muzaffer
**Date:** 2026-08-20
**Related:** [PRD](PRD.md), [Test Cases — TDD](TestCases-TDD.md), [Test Cases — BDD](TestCases-BDD.md), [Test Run Report](TestRunReport.md), [Defect Summary Report](DefectSummaryReport.md)
**Note:** Created using the Claude agent running in Windows Terminal (Claude Code CLI
on Windows 11).

Maps every functional and non-functional requirement in the PRD forward to the test
case(s) that verify it, in both the TDD and BDD suites, and back to any defect it's
linked to. Built by cross-referencing `PRD.md` §6–7 against `TestCases-TDD.md` and
`TestCases-BDD.md` — not backfilled from memory — so gaps below are real, not
oversights in this document.

**Status legend:** ✅ Passing (automated) · 🟡 Manual only (no automated case) · ❌ Failing (open defect) · ⚠️ Not covered (no test case at all)

---

## 1. Functional Requirements

| Req ID | Requirement | User Story | TDD Cases | BDD Cases | Status | Defect |
|--------|-------------|------------|-----------|-----------|--------|--------|
| FR-1 | Display all products in a responsive grid | US-1 | TC-01, TC-E2E-01 | TC-BDD-01 | ✅ | — |
| FR-2 | Text search filters products by name | US-2 | TC-02, TC-E2E-02 | TC-BDD-02 | ✅ | — |
| FR-3 | Category dropdown filters the grid | US-3 | TC-03, TC-E2E-03 | TC-BDD-03 | ✅ | — |
| FR-4 | Empty state message when no products match | — | TC-04, TC-E2E-04 | TC-BDD-04 | ✅ | — |
| FR-5 | Each product card links to its Details page | US-4 | TC-05 | TC-BDD-05 | ✅ | — |
| FR-6 | Details page shows image, name, rating, review count, price, description, stock | US-4 | TC-06, TC-E2E-06 | TC-BDD-09 | ✅ | — |
| FR-7 | Quantity selector capped at `min(10, stock)` | US-5 | TC-FAIL-01 | — | ❌ | [DEF-001](Defect-001-CartQuantityExceedsStock.md) (open) — cap verified on the Product Details page but **not enforced on the Cart page** once an item is added |
| FR-8 | "Add to Cart" adds quantity + shows confirmation | US-5 | TC-08, TC-E2E-08 | TC-BDD-11 | ✅ | — |
| FR-9 | "Buy Now" adds item and navigates to Cart | US-6 | TC-09, TC-10, TC-E2E-09, TC-E2E-10 | TC-BDD-12, TC-BDD-13 | ✅ | — |
| FR-10 | "Add to Cart"/"Buy Now" disabled when out of stock | — | TC-M02 (manual) | — | 🟡 | — |
| FR-11 | Unknown product id shows "Product not found" | — | TC-07, TC-E2E-07 | TC-BDD-10 | ✅ | — |
| FR-12 | Cart lists every item (image, name, price, quantity, line total) | US-8 | TC-12 | TC-BDD-15 | ✅ | — |
| FR-13 | Changing line quantity updates line total + subtotal live | US-9 | TC-13, TC-E2E-12 | TC-BDD-16 | ✅ | — |
| FR-14 | Removing a line item works | US-10 | TC-14, TC-E2E-13 | TC-BDD-17 | ✅ | — |
| FR-15 | Cart subtotal displayed (sum of line totals) | US-8 | TC-12 (covered together with FR-12) | TC-BDD-15 | ✅ | — |
| FR-16 | Empty cart state with link back to product list | — | TC-11, TC-E2E-11 | TC-BDD-14 | ✅ | — |
| FR-17 | "Proceed to Checkout" button present (visual only, Phase 1) | — | — | — | ⚠️ | — (button exists in `Cart.jsx`; no test case asserts its presence — genuine documentation gap, not a product defect since Phase 1 explicitly scopes checkout out) |
| FR-18 | Header shows logo/home link + live cart item-count badge | US-7 | TC-15, TC-16, TC-E2E-05 | TC-BDD-07, TC-BDD-20, TC-BDD-21 | ✅ | — |
| FR-19 | Cart persists via localStorage across reloads | US-11 | TC-M03 (manual), TC-E2E-14 | TC-BDD-18 | ✅ | — |

## 2. Non-Functional Requirements

| Req ID | Requirement | TDD Cases | BDD Cases | Status | Defect |
|--------|-------------|-----------|-----------|--------|--------|
| NFR-1 | Client-side SPA (React + Vite) | TC-M05 (build) | — | ✅ | — (architectural constraint, verified by the app existing and building, not a discrete behavior test) |
| NFR-2 | Responsive down to ~360px width | TC-M06 (manual) | TC-BDD-08 | ✅ | [DEF-002](Defect-002-MobileControlsOverflow.md) (fixed) — this requirement was the one that caught the regression |
| NFR-3 | Core user flows covered by automated tests | Self-satisfied — see full TC-01–16 / TC-E2E-01–15 sets | Self-satisfied — see full TC-BDD-01–21 set | ✅ | — |
| NFR-4 | No external network calls required | — | — | ⚠️ | — (true by construction — `src/data/products.js` is static mock data with no fetch/XHR anywhere in `src/` — but there is no automated test asserting zero network calls) |

## 3. Coverage Summary

| Metric | Count |
|--------|-------|
| Total requirements (FR + NFR) | 23 |
| Fully passing (automated, both TDD and/or BDD) | 18 |
| Manual-only (no automated case) | 2 (FR-10, part of FR-19/NFR-2's manual predecessor cases, though both now also have automated E2E/BDD coverage) |
| Failing — open defect | 1 (FR-7 → DEF-001) |
| Not covered by any test case | 2 (FR-17, NFR-4) |
| Requirements that led directly to a filed defect | 2 (FR-7 → DEF-001, NFR-2 → DEF-002) |

**Reading the gaps:** FR-7 is the one requirement currently **not met** by the shipped
code (Cart page doesn't enforce the stock cap that Product Details does) — see
[DEF-001](Defect-001-CartQuantityExceedsStock.md), still open. FR-17 and NFR-4 are
coverage gaps in the test suite rather than product defects (the button exists and no
network code exists; neither is asserted by name). NFR-2 is the one requirement that
already caught and led to a fixed defect ([DEF-002](Defect-002-MobileControlsOverflow.md)) — direct evidence the BDD layer catches things the TDD/E2E layers didn't.
