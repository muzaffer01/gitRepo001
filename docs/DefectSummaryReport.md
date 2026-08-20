# Defect Summary Report
## SampleShop — Phase 1

**Author:** Muzaffer
**Date:** 2026-08-20
**Related:** [RTM](RTM.md), [Test Cases — TDD](TestCases-TDD.md), [Test Cases — BDD](TestCases-BDD.md), [Test Run Report](TestRunReport.md)
**Note:** Created using the Claude agent running in Windows Terminal (Claude Code CLI
on Windows 11).

Roll-up view of every defect found during Phase 1 testing. Each row is a summary —
see the linked defect report for full repro steps, root cause, and fix details.

---

## 1. Summary

| Metric | Count |
|--------|-------|
| Total defects found | 2 |
| Open | 1 |
| Fixed | 1 |
| Severity: Medium | 1 |
| Severity: Low | 1 |
| Found via TDD-style demo test | 1 |
| Found via BDD (Cucumber) scenario | 1 |

## 2. Defect Register

| ID | Title | Status | Severity | Priority | Found Via | Requirement Violated | Report |
|----|-------|--------|----------|----------|-----------|----------------------|--------|
| DEF-001 | Cart quantity selector allows selecting more than the item's available stock | 🔴 Open | Medium | Medium | TC-FAIL-01 (deliberate TDD failure-demo scenario) | FR-7 | [Defect-001-CartQuantityExceedsStock.md](Defect-001-CartQuantityExceedsStock.md) |
| DEF-002 | Product List search/category controls caused horizontal overflow at mobile width | 🟢 Fixed | Low | Low | TC-BDD-08 (genuine BDD scenario, not staged) | NFR-2 | [Defect-002-MobileControlsOverflow.md](Defect-002-MobileControlsOverflow.md) |

## 3. Detail

### DEF-001 — Cart quantity selector allows selecting more than the item's available stock
- **Status:** Open (intentionally left unfixed — produced as part of the deliberate
  `demo-failing-test` failure-reporting-workflow exercise, not a real-user-facing
  incident found by accident)
- **Root cause:** `CartContext.jsx`'s `addToCart` never copies the product's `stock`
  value onto the cart line item, and `Cart.jsx`'s quantity `<select>` hardcodes 10
  options instead of capping at `Math.min(stock, 10)` the way `ProductDetails.jsx`
  already does correctly.
- **Impact today:** Low — every product in the current mock catalog has stock ≥ 10, so
  the gap is invisible with real catalog data; only exposed by the synthetic low-stock
  test fixture.
- **Suggested fix:** carry `stock` onto the cart item (or look it up live), then reuse
  `ProductDetails.jsx`'s `Math.min(stock, 10)` option-generation logic in `Cart.jsx`.
- **Evidence:** `demo/Cart.stockLimit.test.jsx` (TC-FAIL-01), `logs/test-run-TC-FAIL-01-2026-08-17.log`, [Test Run Report — Failure Demo](TestRunReport-FailureDemo-TC-FAIL-01.md).

### DEF-002 — Product List search/category controls caused horizontal overflow at mobile width
- **Status:** Fixed, same session it was found
- **Root cause:** `.product-list-page__controls` was a non-wrapping flex row, and the
  search `<input>` had no `min-width: 0`, so it couldn't shrink below its intrinsic
  content width — the row overflowed the viewport instead of wrapping.
- **Fix:** added `flex-wrap: wrap` to the controls row and `min-width: 0` +
  `box-sizing: border-box` to the search input, in `src/pages/ProductList.css`.
- **Verification:** the BDD scenario that caught it (`product-list.feature` →
  "Layout reflows without horizontal overflow on a mobile viewport", TC-BDD-08) now
  passes; full re-run after the fix was clean (unit 16/16, E2E 15/15, BDD 21/21, build
  clean).
- **Notable:** this requirement (NFR-2, responsive to ~360px) had previously only been
  marked "not verified" by manual testing (TC-M06) — the BDD layer was the first to
  actually automate and check it, and immediately found a real bug.

## 4. Observations

- Both defects were found through deliberate testing effort aimed at areas the prior
  suites hadn't actually exercised (a synthetic low-stock fixture for DEF-001, a real
  mobile-viewport resize for DEF-002) — neither was a fluke regression during unrelated
  work.
- The one **open** defect (DEF-001) is open by design, not by neglect: it exists to
  demonstrate the failure-reporting workflow (`demo-failing-test`) and is deliberately
  excluded from the main `npm run test` run (`vite.demo.config.js`) so CI stays green
  while the defect stays tracked and visible.
- No defects have been found in the BDD layer's core parity scenarios (TC-BDD-01–07,
  09–21) — DEF-002 was the only genuine BDD-discovered failure, and it's now fixed.
