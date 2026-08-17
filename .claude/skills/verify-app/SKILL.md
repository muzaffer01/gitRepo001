---
name: verify-app
description: Run the full verification pass on a web app - unit tests, production build, and a real manual browser smoke test via Chrome automation - before calling a build "tested." Use before reporting a build as complete.
---

# Verify App (Tests + Build + Manual Smoke Test)

Confirms a build actually works, not just that tests pass in isolation. Combines
automated checks with a real browser pass, since automated tests alone don't prove
the app renders and behaves correctly end to end.

## Steps

1. Automated checks:
   ```powershell
   npm run test      # unit/component suite - must be 0 failures
   npm run build     # production build - must complete with 0 errors
   npm run test:e2e  # if Playwright is set up (see add-playwright-e2e)
   ```
2. Start the dev server in the background:
   ```powershell
   npm run dev   # run_in_background: true
   ```
   Read its output to get the local URL (typically `http://localhost:5173/`).
3. Manually click through the app using Chrome browser automation (`claude-in-chrome`
   skill — load it if not already active): visit every page, exercise the core flows
   (e.g. add/update/remove from a cart, search/filter, navigation via header links,
   empty states), and confirm persistence survives a real page reload.
4. Be honest about anything that couldn't be verified this way (e.g. a browser resize
   that didn't visibly take effect in the automation session) — note it explicitly as
   **NOT VERIFIED** with the reason, rather than silently skipping it or claiming it
   passed.
5. Feed the results into a Test Run Report (see `publish-project-docs`): automated
   suite output (verbatim), build output, and a table of manual/E2E case results.

## Notes

- Close any Chrome tabs you opened once done (`tabs_close_mcp`), unless the user wants
  the window kept open.
- If the dev server was already running from an earlier step, no need to restart it —
  check for a listener on the expected port first.

See `docs/TestRunReport.md` in this repo for a complete example combining unit,
E2E, build, and manual results into one report.
