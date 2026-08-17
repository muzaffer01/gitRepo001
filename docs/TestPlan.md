# Test Plan
## SampleShop — Phase 1

**Author:** Muzaffer
**Date:** 2026-08-17

---

## 1. Objective

Verify that the Product List, Product Details, and Cart pages of SampleShop meet the
functional requirements in the PRD, and that core cart behavior (add, update, remove,
persistence) works correctly.

## 2. Scope

### In Scope
- Product List page: rendering, search, category filter, empty state, navigation links
- Product Details page: rendering, quantity selection, add-to-cart, buy-now, not-found handling
- Cart page: rendering existing items, quantity updates, item removal, subtotal calculation, empty state
- Header cart badge count
- Cart persistence via localStorage
- Production build sanity (compiles without errors)

### Out of Scope (Phase 1)
- Checkout / payment flow (UI-only button, no backend)
- User authentication
- Cross-browser/device sync of cart
- Performance/load testing
- Accessibility audit beyond basic semantic markup (labels, roles)

## 3. Test Levels & Approach

| Level | Approach | Tooling |
|-------|----------|---------|
| Component/unit tests | Render each page/component in isolation (with real Router + CartProvider) and assert on user-visible behavior | Vitest + React Testing Library |
| Build verification | Run production build and confirm it completes without errors | `npm run build` (Vite) |
| Manual smoke test | Run dev server, click through all 3 pages and core flows | `npm run dev` + browser |

Automated tests simulate real user interaction (typing, selecting, clicking) via
`@testing-library/user-event` rather than calling internal functions directly, so they
exercise the same code paths a real user would.

## 4. Test Environment

- OS: Windows 11
- Node.js: v24.19.0
- Test runner: Vitest v4 with `jsdom` environment
- Local repo path: `C:\Users\muzzu\Desktop\SampleAppDesktop001`

## 5. Entry Criteria

- Application builds and runs locally (`npm run dev`) without console errors.
- All dependencies installed (`npm install` completed successfully).

## 6. Exit Criteria

- 100% of automated test cases pass.
- Production build (`npm run build`) completes with zero errors.
- Manual smoke test of all 3 pages and core flows (search, filter, add to cart, buy now,
  update quantity, remove, empty states) shows no defects.

## 7. Test Deliverables

- This Test Plan
- Test Cases document (detailed case-by-case coverage)
- Test Run Report (actual results of executing the automated suite)
- Automated test source files, checked into the repo under `src/**/*.test.jsx`

## 8. Risks / Assumptions

- Product data is static mock data; no tests target dynamic/backend failure modes since
  there is no backend in Phase 1.
- localStorage is assumed available (standard in all modern browsers); no fallback tested.
- Visual/CSS regression is not covered by automated tests — verified manually only.

## 9. Schedule

Single pass, executed as part of the initial build (2026-08-17). Re-run on every future
change via `npm run test` (recommended: wire into CI on push, not yet configured).
