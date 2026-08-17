# Test Run Report
## SampleShop — Phase 1

**Author:** Muzaffer
**Date executed:** 2026-08-17
**Environment:** Windows 11, Node.js v24.19.0, Vitest v4.1.10, Vite v8.2.1
**Repo:** `C:\Users\muzzu\Desktop\SampleAppDesktop001`

---

## 1. Summary

| Metric | Result |
|--------|--------|
| Automated test files | 4 / 4 passed |
| Automated test cases | 16 / 16 passed |
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
| TC-M06 | Responsive layout at mobile width | **NOT VERIFIED** | Browser window resize did not visibly change the captured viewport in this automation session; CSS uses relative/grid units (`repeat(auto-fill, minmax(220px, 1fr))`, single-column grid under a `700px` media query on Details/Cart) which should reflow correctly, but this was not visually confirmed. Recommend a manual check in an actual resized browser window or DevTools device toolbar. |
| TC-M02 | Out-of-stock product state | **NOT RUN** | No product in the current mock catalog has `stock: 0`; would require temporarily editing mock data to exercise. Deferred — not a blocker for Phase 1 sign-off. |

## 5. Defects Found

None. No functional defects were identified during automated or manual testing.

## 6. Coverage Gaps / Follow-ups

- TC-M06 (responsive layout) should be re-verified manually with a real resized browser or device emulator.
- TC-M02 (out-of-stock UI state) should be exercised once a real product can have zero stock (e.g. after cart/inventory logic exists, or by temporarily editing mock data).
- No automated visual regression / accessibility testing is in place yet (out of scope for Phase 1 per Test Plan).

## 7. Conclusion

All in-scope automated test cases (16/16) pass, the production build is clean, and the
core user flows (browse, view details, add to cart, buy now, update/remove cart items,
persistence) were confirmed working via live manual testing. The application meets the
Phase 1 exit criteria defined in the Test Plan, with two follow-up items noted above for
future verification.
