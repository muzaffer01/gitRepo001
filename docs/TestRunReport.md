# Test Run Report
## SampleShop — Phase 1

**Author:** Muzaffer
**Date executed:** 2026-08-17
**Environment:** Windows 11, Node.js v24.19.0, Vitest v4.1.10, Vite v8.2.1
**Agent:** Claude agent running in Windows Terminal (Claude Code CLI)
**Repo:** `C:\Users\muzzu\Desktop\SampleAppDesktop001`

---

## 1. Summary

| Metric | Result |
|--------|--------|
| Automated unit/component test files | 4 / 4 passed |
| Automated unit/component test cases | 16 / 16 passed |
| Automated end-to-end test files | 3 / 3 passed |
| Automated end-to-end test cases | 15 / 15 passed |
| Automated BDD feature files | 4 / 4 passed |
| Automated BDD scenarios | 21 / 21 passed (1 genuine failure found + fixed first run — see 2c) |
| Production build | Passed (0 errors) |
| Manual smoke test | Passed (see below) |
| Overall result | **PASS** |

## 2. Automated Test Results (`npm run test`)

```
 RUN  v4.1.10 C:/Users/muzzu/Desktop/SampleAppDesktop001

 Test Files  4 passed (4)
      Tests  16 passed (16)
   Start at  13:49:47
   Duration  2.28s (transform 224ms, setup 589ms, import 620ms, tests 1.70s, environment 3.44s)
```

| Test file | Cases | Result |
|-----------|-------|--------|
| `src/pages/ProductList.test.jsx` | TC-01 – TC-05 (5) | PASS |
| `src/pages/ProductDetails.test.jsx` | TC-06 – TC-10 (5) | PASS |
| `src/pages/Cart.test.jsx` | TC-11 – TC-14 (4) | PASS |
| `src/components/Header.test.jsx` | TC-15 – TC-16 (2) | PASS |

No failures, no skipped tests.

## 2b. End-to-End Test Results (`npm run test:e2e`)

```
Running 15 tests using 4 workers

  ok  1-15  ... (all 15 specs)

  15 passed (8.3s)
```

| Test file | Cases | Result |
|-----------|-------|--------|
| `e2e/product-list.spec.js` | TC-E2E-01 – TC-E2E-05 (5) | PASS |
| `e2e/product-details.spec.js` | TC-E2E-06 – TC-E2E-10 (5) | PASS |
| `e2e/cart.spec.js` | TC-E2E-11 – TC-E2E-15 (5) | PASS |

Run against a real Chromium browser (Playwright-managed) driving a real `npm run dev`
server on `http://localhost:5173`. Full raw output:
`logs/test-run-e2e-playwright-2026-08-17.log`.

## 2c. BDD Test Results (`npm run test:bdd`)

**First run** (before the fix below) — 20/21 scenarios passed, 1 genuine failure:

```
........................................................................................................................F..

Failed scenarios:
  1) Layout reflows without horizontal overflow on a mobile viewport # bdd\features\product-list.feature:40
       Then the page should not scroll horizontally # bdd\step-definitions\product-list.steps.js:35
           Error: expect(received).toBe(expected) // Object.is equality

           Expected: false
           Received: true

21 scenarios (20 passed, 1 failed)
121 steps (120 passed, 1 failed)
```

This was a **real, previously-unverified defect** ([DEF-002](Defect-002-MobileControlsOverflow.md))
— not staged — surfaced precisely because this BDD scenario finally automates what
TC-M06 could only mark "NOT VERIFIED" (see section 4). Fixed immediately in
`src/pages/ProductList.css` (added `flex-wrap` to the controls row and `min-width: 0`
to the search input, so they shrink/wrap instead of overflowing).

**Re-run after the fix** — all 21 pass:

```
...........................................................................................................................

2 hooks (2 passed)
21 scenarios (21 passed)
121 steps (121 passed)
0m 7.192s (0m 7.142s executing your code)
```

| Feature file | Cases | Result |
|-----------|-------|--------|
| `bdd/features/product-list.feature` | TC-BDD-01 – TC-BDD-08 (8) | PASS |
| `bdd/features/product-details.feature` | TC-BDD-09 – TC-BDD-13 (5) | PASS |
| `bdd/features/cart.feature` | TC-BDD-14 – TC-BDD-19 (6) | PASS |
| `bdd/features/header.feature` | TC-BDD-20 – TC-BDD-21 (2) | PASS |

Run against a real Chromium browser (Playwright as the driver, Cucumber.js as the
scenario runner), reusing or auto-starting the same `npm run dev` server as the E2E
layer. Full raw (post-fix) output: `logs/test-run-bdd-cucumber-2026-08-17.log`.

## 3. Build Verification (`npm run build`)

```
vite v8.2.1 building client environment for production...
✓ 36 modules transformed.
dist/index.html                   0.39 kB │ gzip:  0.26 kB
dist/assets/index-B3XjBlHI.css    4.88 kB │ gzip:  1.30 kB
dist/assets/index-B_DUdHoB.js   238.52 kB │ gzip: 76.20 kB
✓ built in 236ms
```

Result: **PASS** — build completed with zero errors.

## 4. Manual Smoke Test Results

Executed against `npm run dev` (`http://localhost:5173`) using live browser interaction.

| ID | Case | Result | Notes |
|----|------|--------|-------|
| TC-M04 | Navigate `/` → product details → Cart via header | PASS | SPA navigation, no full reload; header cart badge updated live (0 → 1) |
| TC-08 (manual confirmation) | Add to Cart shows confirmation | PASS | "Added to cart!" message rendered; verified visually |
| TC-12 (manual confirmation) | Cart lists item with correct price/subtotal | PASS | Subtotal `$89.99` matched single-item price |
| TC-M03 | Cart persists across reload | PASS | Full navigation reload to `/cart` retained the cart item and subtotal |
| TC-14 (manual confirmation) | Remove item empties cart | PASS | "Your cart is empty" state shown after removing the only item |
| TC-M05 | Production build | PASS | See section 3 |
| TC-M06 | Responsive layout at mobile width | **NOW VERIFIED (via BDD)** | Originally not visually confirmed in this manual session (see history below); subsequently automated as TC-BDD-08 using Playwright's `setViewportSize`, which found a real overflow bug (DEF-002) and confirmed the fix. Superseded by automated coverage — see section 2c. |
| TC-M02 | Out-of-stock product state | **NOT RUN** | No product in the current mock catalog has `stock: 0`; would require temporarily editing mock data to exercise. Deferred — not a blocker for Phase 1 sign-off. |

## 5. Defects Found

None identified in the original Phase 1 sign-off run. Two defects surfaced later:

- **DEF-001** (Open) — found via a dedicated failure-demonstration exercise; see
  `docs/TestRunReport-FailureDemo-TC-FAIL-01.md` and
  `docs/Defect-001-CartQuantityExceedsStock.md`. Does not affect this report's PASS
  result — concerns a scenario outside this run's scope.
- **DEF-002** (Fixed) — found while building the BDD suite's mobile-layout scenario
  (TC-BDD-08, section 2c); fixed the same session. See
  `docs/Defect-002-MobileControlsOverflow.md`.

## 6. Coverage Gaps / Follow-ups

- TC-M02 (out-of-stock UI state) should be exercised once a real product can have zero
  stock (e.g. after cart/inventory logic exists, or by temporarily editing mock data).
  Still the only functional case with no automated coverage in any layer.
- TC-M05 (build verification) remains manual/CI-command-based by nature — not a UI
  behavior to automate further.
- No automated visual regression / accessibility testing is in place yet (out of scope
  for Phase 1 per Test Plan).
- DEF-001 (cart quantity selector doesn't respect stock) tracked separately, still
  open — see linked defect report.
- **Update (Playwright added):** navigation (TC-M04) and reload persistence (TC-M03)
  are now also covered by automated E2E cases (TC-E2E-15 and TC-E2E-14 respectively —
  see section 2b and `docs/TestCases.md`).
- **Update (BDD added):** TC-M06 (responsive layout) is now fully automated
  (TC-BDD-08) instead of relying on manual verification — and doing so caught and
  fixed a real bug (DEF-002). TC-M01, TC-M03, and TC-M04 are also now covered by BDD
  scenarios (TC-BDD-06, TC-BDD-18, TC-BDD-19). Of the original 6 manual-only cases,
  only TC-M02 and TC-M05 remain without automated coverage.

## 7. Conclusion

All in-scope automated test cases pass — 16/16 unit/component, 15/15 end-to-end, and
21/21 BDD — the production build is clean, and the core user flows (browse, view
details, add to cart, buy now, update/remove cart items, persistence, responsive
layout) were confirmed working via automated E2E and BDD tests plus live manual
testing. Building genuine BDD coverage surfaced and fixed one real defect (DEF-002)
that manual testing had missed. The application meets the Phase 1 exit criteria
defined in the Test Plan, with the follow-up items noted above for future
verification.
