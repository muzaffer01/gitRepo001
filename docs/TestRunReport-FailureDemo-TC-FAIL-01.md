# Test Run Report — Failure Demo (TC-FAIL-01)
## SampleShop

**Author:** Muzaffer
**Date executed:** 2026-08-17
**Environment:** Windows 11, Node.js v24.19.0, Vitest v4.1.10, Vite v8.2.1
**Purpose:** Deliberately demonstrate the full failure-reporting workflow (failing test
scenario → execution log → defect report → test run report) requested by the user,
using a real, previously-undetected defect rather than a fabricated failure.
**Repo:** `C:\Users\muzzu\Desktop\SampleAppDesktop001`

---

## 1. Summary

| Metric | Result |
|--------|--------|
| Scenario under test | TC-FAIL-01 — Cart quantity selector respects item stock |
| Test file | `demo/Cart.stockLimit.test.jsx` |
| Command | `npx vitest run --config vite.demo.config.js` |
| Result | **FAIL** (1 failed / 1 total) |
| Linked defect | [DEF-001](Defect-001-CartQuantityExceedsStock.md) |
| Impact on main suite (`npm run test`) | **None** — 16/16 still pass (this scenario is excluded from the default run; see section 4) |
| Impact on production build | **None** — `npm run build` still completes with 0 errors |

## 2. Scenario

**Given** a cart containing one line item for a product with only 3 units of stock,
**when** the shopper opens the Cart page and looks at that line's quantity dropdown,
**then** the dropdown should offer at most 3 selectable quantities (1, 2, 3) —
matching the product's real availability, the same way the Product Details page's
quantity selector already does.

## 3. Actual Result (captured log)

Raw output saved to `logs/test-run-TC-FAIL-01-2026-08-17.log`. Key excerpt:

```
 ❯ demo/Cart.stockLimit.test.jsx (1 test | 1 failed) 48ms
     × does not offer a quantity greater than the item stock 46ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo/Cart.stockLimit.test.jsx > TC-FAIL-01: Cart quantity selector respects
 product stock > does not offer a quantity greater than the item stock
AssertionError: expected 10 to be less than or equal to 3
 ❯ demo/Cart.stockLimit.test.jsx:49:32
     47|     // `Array.from({ length: 10 }, ...)`, ignoring stock entirely — so
     48|     // maxOfferedQuantity is 10, not 3, and this assertion fails.
     49|     expect(maxOfferedQuantity).toBeLessThanOrEqual(lowStockProduct.sto…
       |                                ^

 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  14:45:20
   Duration  1.34s
```

**Interpretation:** the cart rendered 10 quantity options when it should have
rendered at most 3, because `src/pages/Cart.jsx` hardcodes 10 options and never
consults the product's stock. See [DEF-001](Defect-001-CartQuantityExceedsStock.md)
for full root-cause analysis.

## 4. Why This Failure Doesn't Break the Main Build

This scenario lives in `demo/Cart.stockLimit.test.jsx`, outside `src/`, and is run
with a separate config (`vite.demo.config.js`) whose `include` pattern only matches
`demo/**`. The main `vite.config.js` used by `npm run test` and `npm run build`
scopes `include` to `src/**`, so it never picks up this file. This keeps the
project's real CI signal (`npm run test`) green and accurate — 16/16 passing — while
still preserving a reproducible, real failing scenario for defect tracking and this
report.

Confirmed immediately after this run:
```
npm run test   → Test Files 4 passed (4), Tests 16 passed (16)
npm run build  → built in 239ms, 0 errors
```

## 5. Defects Found

- **DEF-001** (Medium severity, Open): Cart quantity selector allows selecting more
  units than a product has in stock, because cart line items don't carry stock data
  and the Cart page's quantity dropdown is hardcoded to 1–10. Full details, root
  cause, and suggested fix in
  [Defect-001-CartQuantityExceedsStock.md](Defect-001-CartQuantityExceedsStock.md).

## 6. Artifacts

| Artifact | Location |
|---|---|
| Failing test source | `demo/Cart.stockLimit.test.jsx` |
| Demo-only Vitest config | `vite.demo.config.js` |
| Captured failure log | `logs/test-run-TC-FAIL-01-2026-08-17.log` |
| Main-suite confirmation log (unaffected) | `logs/test-run-main-suite-2026-08-17.log` |
| Defect report | `docs/Defect-001-CartQuantityExceedsStock.md` |
| Test case entry | `docs/TestCases.md` → "Known-Failing / Defect-Tracking Cases" → TC-FAIL-01 |

## 7. Conclusion

The failure-reporting workflow was exercised end-to-end against a genuine, previously
undocumented defect (not a fabricated/contrived failure): a test was written that
encodes the correct expected behavior, it failed for a real and explainable reason,
the failure was captured as a log, and the underlying defect was documented with root
cause and a suggested fix. The defect remains **open** — no code fix was applied as
part of this exercise, and the main test suite / production build are confirmed
unaffected.
