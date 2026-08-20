---
name: demo-failing-test
description: Create a deliberately failing test scenario that demonstrates the full failure-reporting workflow, using a real (not fabricated) defect, without breaking the main test suite or build. Use when asked for a sample failing test scenario, a failure demo, or to exercise the defect-reporting process.
---

# Demonstrate a Failing Test Scenario

Produces a real failing test (not a contrived assertion), captures the failure as
evidence, and documents it as a defect — all while keeping the project's actual CI
signal (`npm run test`, `npm run build`) green.

## Steps

1. **Find a real gap**, don't fabricate one. Read the relevant source and look for a
   place where behavior doesn't match what the requirements/PRD imply — e.g. a UI
   control that doesn't enforce a constraint another similar control already does.
2. **Isolate the scenario from the main suite** so it can't accidentally regress CI:
   - Put the test outside the main test directory (e.g. a top-level `demo/` folder).
   - Give it its own test-runner config with an `include` scoped to that folder only
     (e.g. `vite.demo.config.js` for a Vitest project), separate from the main
     config's `include` (scoped to `src/**`).
3. **Write the test to encode the correct expected behavior**, with a comment
   explaining what's expected vs. what the current code actually does and why.
4. **Run it and capture the real output** as a log file — don't hand-write a fake
   failure message:
   ```powershell
   npx vitest run --config vite.demo.config.js 2>&1 | Tee-Object -FilePath "logs\test-run-<id>-<date>.log"
   ```
5. **Confirm the main suite and build are unaffected** immediately after:
   ```powershell
   npm run test
   npm run build
   ```
6. **Document it** (see `publish-project-docs`):
   - A Defect Report: status (Open), severity/priority, repro steps, root cause (cite
     exact file/line), impact, suggested fix, evidence (paths to the failing test and
     captured log).
   - A "Known-Failing / Defect-Tracking Cases" section in `TestCases-TDD.md` (this is
     an imperative demo test, not Gherkin), linking the defect.
   - A dedicated Test Run Report for the scenario, showing **FAIL**, with the captured
     log excerpt and an explicit note on why this doesn't affect the main suite/build.
7. Sync all of the above to git + Drive per `publish-project-docs`. Leave the defect
   **open** (don't fix it as part of this exercise) unless the user asks you to fix it
   too — the point is to demonstrate the reporting workflow, not to close the bug.

## Notes

- If `.gitignore` excludes a `logs/` directory by default, add a targeted negation
  (`!logs/`, `!logs/*.log`) so the captured evidence actually gets committed.

See `demo/Cart.stockLimit.test.jsx`, `vite.demo.config.js`,
`docs/Defect-001-CartQuantityExceedsStock.md`, and
`docs/TestRunReport-FailureDemo-TC-FAIL-01.md` in this repo for a complete worked
example (a real gap: the cart's quantity selector doesn't respect item stock).
