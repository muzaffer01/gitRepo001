---
name: add-playwright-e2e
description: Add Playwright end-to-end browser tests to a Vite/React project alongside its existing Vitest unit suite, without breaking the unit suite or build. Use when asked to add E2E tests, browser tests, or "was Playwright used" style follow-ups.
---

# Add Playwright End-to-End Tests

Adds a real-browser E2E layer on top of an existing Vitest + React Testing Library
unit suite, isolated so `npm run test` and `npm run build` stay unaffected.

## Steps

1. Install:
   ```powershell
   npm install -D @playwright/test
   npx playwright install chromium
   ```
2. Create `playwright.config.js` at the project root with a `webServer` block that
   runs `npm run dev` and waits on the dev server URL (e.g. `http://localhost:5173`),
   `testDir: './e2e'`, and a `chromium` project using `devices['Desktop Chrome']`.
3. Create an `e2e/` folder with one `*.spec.js` per page/flow, mirroring the unit
   test files but driving a real browser: `page.goto()`, `page.getByRole()`,
   `page.getByLabel()`, `page.getByTestId()`, etc. Cover the same core flows as the
   unit suite (and any manual-only smoke-test cases) so they no longer rely solely on
   manual verification: browse/search/filter, per-item detail view, add/update/remove
   from cart-like state, empty states, reload persistence, and a full multi-page
   journey via header navigation.
4. Add scripts to `package.json`:
   ```json
   "test:e2e": "playwright test",
   "test:e2e:ui": "playwright test --ui"
   ```
5. Add to `.gitignore`:
   ```
   /test-results/
   /playwright-report/
   /blob-report/
   /playwright/.cache/
   ```
6. Run it and capture output:
   ```powershell
   npm run test:e2e 2>&1 | Tee-Object -FilePath "logs\test-run-e2e-playwright-<date>.log"
   ```
7. Re-confirm the unit suite and build are unaffected:
   ```powershell
   npm run test
   npm run build
   ```
8. Update documentation to reflect the new layer (see `publish-project-docs`):
   TDD's tech stack + testing strategy, Test Plan's test levels + exit criteria, an
   "End-to-End Cases" table in `TestCases-TDD.md` (E2E is imperative, not Gherkin, so
   it belongs in the TDD doc), and an E2E section in the Test Run Report.

## Reference

See `e2e/*.spec.js`, `playwright.config.js`, and `docs/TestRunReport.md` section 2b
in this repo for a complete worked example (15 E2E cases across 3 spec files).
