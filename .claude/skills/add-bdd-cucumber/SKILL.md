---
name: add-bdd-cucumber
description: Add a Cucumber.js BDD test suite (Given/When/Then Gherkin, driven by Playwright) alongside an existing unit/E2E suite, with full case parity across all layers. Use when explicitly asked for BDD tests, Cucumber, Gherkin, or to ensure test cases are covered in both TDD and BDD style.
---

# Add a Cucumber BDD Test Suite

Adds a genuine BDD layer — real `.feature` files with Given/When/Then scenarios, not
just renamed existing tests — driven by Playwright against a real browser, alongside
(not replacing) the existing unit and E2E suites.

Only add this when explicitly asked — don't assume BDD is wanted just because a unit
or E2E suite already exists. If asked whether existing tests are "TDD or BDD," answer
honestly first (see Notes below) rather than silently converting anything.

## Steps

1. Install:
   ```powershell
   npm install -D @cucumber/cucumber
   ```
   (Playwright must already be installed — `add-playwright-e2e` — since Cucumber has
   no browser driver of its own; `@playwright/test`'s exported `chromium` launcher is
   reused directly, no separate browser download needed.)
2. Create `cucumber.cjs` at the project root (CommonJS even in an ESM project —
   cucumber-js loads it directly, so `.cjs` is safe and simplest):
   ```js
   module.exports = {
     default: {
       paths: ['bdd/features/**/*.feature'],
       import: ['bdd/support/**/*.js', 'bdd/step-definitions/**/*.js'],
       format: ['summary', 'progress'],
     },
   }
   ```
3. Build `bdd/support/`:
   - `devServer.js` — reuse an already-running dev server or spawn one. **Check
     readiness with a real `fetch()` request**, not a raw TCP socket pinned to
     `127.0.0.1` — Vite can bind to `::1` on some machines, and a naive IPv4-only
     check will falsely report the server as down and spawn a duplicate.
   - `world.js` — a custom Cucumber `World` subclass holding `page`/`browser`, so
     step definitions access `this.page` uniformly.
   - `hooks.js` — `BeforeAll`/`AfterAll` for browser + dev server lifecycle;
     `Before`/`After` for a fresh browser context + page per scenario, with
     `localStorage` cleared.
   - `helpers.js` — composite actions (e.g. "add product X to cart") built on the
     app's own data module (import product data directly rather than hardcoding
     names/ids a second time) so lookups stay accurate as the catalog changes.
4. Write one `.feature` file per page/flow under `bdd/features/`, **named to match
   the existing E2E spec files** (`product-list.feature` alongside
   `product-list.spec.js`, etc.) so the two suites' file names correspond. Each
   scenario: `Given` a starting state, `When` an action, `Then` an expected outcome —
   plain language, no framework internals in the prose.
5. Implement matching step definitions in `bdd/step-definitions/`, using Playwright
   locators (`getByRole`, `getByLabel`, `getByTestId`, `getByPlaceholder`) exactly as
   the E2E suite does.
6. **Full parity, not a subset.** If asked to ensure all test cases are covered in
   both styles, map every existing unit/E2E case to an equivalent BDD scenario —
   write these into their own **`TestCases-BDD.md`** document (never merged into the
   TDD one), with a cross-reference table (BDD ID ↔ existing TC/E2E ID) so gaps are
   visible. The only legitimate exceptions are cases that aren't real UI
   behaviors (e.g. a build-verification case) or that require data not present in the
   current catalog.
7. Add `"test:bdd": "cucumber-js"` to `package.json` scripts. Run it and capture
   output:
   ```powershell
   npm run test:bdd 2>&1 | Tee-Object -FilePath "logs\test-run-bdd-cucumber-<date>.log"
   ```
8. **Treat any failure as real**, not a fluke — a newly-built scenario failing means
   either the step definition is wrong (fix the test) or it just found an actual bug
   (fix the app). Don't leave a red scenario in the suite; this isn't the deliberate
   `demo-failing-test` workflow. If it's a real bug, fix it, then re-run unit + E2E +
   BDD + build to confirm nothing regressed, and write it up as a normal defect
   report (status: Fixed) alongside the BDD Test Run Report section.
9. Update documentation (see `publish-project-docs`): TDD's tech stack + testing
   strategy (three layers now), Test Plan's test levels + exit criteria,
   `TestCases-BDD.md` with the full scenario list and parity mapping, and a BDD
   results section in the Test Run Report (include the pre-fix failure output if a
   real bug was found, for the record).

## Notes

- "TDD" here is used loosely for the existing imperative `describe`/`it`-style suite,
  to distinguish it from BDD — neither suite is actually test-driven (tests written
  after the implementation in both cases). Say so plainly if asked.
- Building genuine coverage (rather than copying assertions from the E2E suite
  verbatim) sometimes exercises something no other layer actually checked — e.g. a
  real browser viewport resize — which can surface real, previously-unverified bugs.
  That's a feature of doing this properly, not a problem with the approach.

See `bdd/features/*.feature`, `bdd/step-definitions/*.js`, `bdd/support/*.js`,
`cucumber.cjs`, and `docs/TestCases-BDD.md` in this repo for a complete worked example
(21 scenarios across 4 feature files, full parity with the existing 16 unit + 15 E2E
cases in `docs/TestCases-TDD.md`, and one real defect — DEF-002 — found and fixed
while building it).
