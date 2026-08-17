# Defect Report — DEF-002

## Product List search/category controls caused horizontal overflow at mobile width

**Status:** Fixed
**Severity:** Low
**Priority:** Low
**Found:** 2026-08-17, via the new BDD (Cucumber) scenario "Layout reflows without
horizontal overflow on a mobile viewport"
**Found by:** Muzaffer
**Agent:** Claude agent running in Windows Terminal (Claude Code CLI)
**Related:** Test Cases TC-M06 / TC-BDD-08, Test Run Report section 2c

---

## Summary

The Product List page's search box and category dropdown were laid out in a
non-wrapping flex row (`.product-list-page__controls`). At narrow viewport widths
(tested at 375px), the row didn't shrink or wrap, causing the page to scroll
horizontally — a real responsive-layout regression that the original Phase 1 Test
Run Report had flagged as **NOT VERIFIED** (browser resize wasn't confirmed visually
in that session's automation) rather than confirmed working.

## Steps to Reproduce (before fix)

1. Open the Product List page (`/`).
2. Resize the viewport to 375×800 (or any width below ~400px).
3. Observe the page scrolls horizontally.

**Expected:** No horizontal scroll at any supported width down to ~360px (per PRD
NFR-2).
**Actual (before fix):** Horizontal overflow present.

## Root Cause

`src/pages/ProductList.css`, `.product-list-page__controls` was `display: flex`
without `flex-wrap`, and its search `<input>` (`.product-list-page__search`) used
`flex: 1` without `min-width: 0`. Flex items default to `min-width: auto`, which for
a text input is based on its intrinsic content size — so the input refused to shrink
below that width, and the row (input + select + gap) exceeded the viewport width
with nowhere to wrap to.

## Fix

In `src/pages/ProductList.css`:
- Added `flex-wrap: wrap` to `.product-list-page__controls` so the search box and
  category dropdown can stack on narrow viewports instead of forcing overflow.
- Added `min-width: 0` (and `box-sizing: border-box`) to
  `.product-list-page__search` so the input can actually shrink to fit available
  space before wrapping is needed.

## Verification

- New BDD scenario `bdd/features/product-list.feature` → "Layout reflows without
  horizontal overflow on a mobile viewport" — now passes (was the only failing
  scenario in the initial BDD run of 21).
- Re-ran the full suite after the fix: BDD 21/21, unit 16/16, E2E 15/15, production
  build clean.

## Evidence

- The pre-fix failing run (20/21 scenarios passed, this one failed with
  `AssertionError: expected true to be false`, i.e. overflow was detected) is quoted
  verbatim in Test Run Report section 2c.
- `logs/test-run-bdd-cucumber-2026-08-17.log` holds the **post-fix** passing run
  (21/21) — the log file was recaptured after the fix, so it reflects current state
  rather than the original failure.
- Fix: CSS change to `src/pages/ProductList.css` (see "Fix" above).

## Contrast with DEF-001

Unlike [DEF-001](Defect-001-CartQuantityExceedsStock.md) (left open intentionally as
a failure-workflow demonstration), DEF-002 was a genuine defect surfaced while
building real test coverage — not a staged scenario — so it was fixed immediately
rather than left open.
