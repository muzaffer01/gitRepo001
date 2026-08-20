# Runbook: SampleShop — Build, Test, Publish, Document

**Purpose:** This runbook captures the full requirements, goals, decisions, and step-by-step
procedure used to build the SampleShop project, so it can be recreated or repeated
end-to-end in **auto mode** (no clarifying questions, no permission prompts) on request,
without needing to re-derive scope from scratch.

**Note:** This entire project — app, tests, GitHub integration, and documentation — was
created using the **Claude agent running in Windows Terminal** (Claude Code CLI on
Windows 11), not a browser-based or IDE-embedded agent. The environment-setup steps in
section 3 (winget installs, PowerShell PATH-refresh quirk, etc.) are specific to that
Windows Terminal context and should be re-evaluated if this runbook is ever executed
from a different agent/OS environment.

**Last updated:** 2026-08-17

---

## 1. Original Requirements (verbatim intent)

Build a web application like Amazon, with three pages for now:
- List Page for product
- Details page for product
- Cart Page

**Goals:**
1. Build the web application
2. Test the web application
3. Store all code locally
4. Integrate with the user's Git account and push the code to GitHub
5. Create documents in Google Drive: Test Plan, Test Cases, Test Run Reports, Product
   Requirements Document, Technical Design Document
6. (Added later) Also commit those same documents into the Git repo (`docs/` folder)
7. (Added later) Maintain this runbook itself in both Google Drive and the Git repo,
   kept up to date, for future auto-mode recreation
8. (Added later) Add Playwright for automated end-to-end browser testing, alongside the
   existing Vitest/RTL unit tests
9. (Added later) Add a separate Cucumber-based BDD test suite (Given/When/Then
   Gherkin, driven by Playwright), covering the same behaviors as the existing
   ("TDD"-labeled) unit suite and the E2E suite — full parity, not a subset — after
   the user asked whether the existing tests were TDD or BDD style

**Target locations (fixed by the user for this project):**
- Local repo: `C:\Users\muzzu\Desktop\Muz_AI_Projects_win\SampleAppDesktop001` (moved 2026-08-20 from `C:\Users\muzzu\Desktop\SampleAppDesktop001`, to sit alongside the other projects)
- GitHub repo: `https://github.com/muzaffer01/gitRepo001`
- Google Drive folder: `https://drive.google.com/drive/u/1/folders/108gl4b5UcMhemqvyYJ9eH_NRdKhSBFfs`
  ("Sample001 Project", Drive folder ID `108gl4b5UcMhemqvyYJ9eH_NRdKhSBFfs`)

If re-running this for a **new** project, ask the user (or reuse prior answers) for
equivalent values, then substitute throughout.

## 2. User Preferences / Operating Mode (apply automatically)

- **Auto mode by default once confirmed once.** The user explicitly said: "treat this as
  a test environment, continue using this environment, and do not touch any other
  folders or files, run auto mode until the goals are met" and later "Dont ask me more
  questions, go in auto mode and do what is the best approach." Once a user gives this
  kind of standing instruction in a session, stop asking clarifying/confirmation
  questions for the remainder of that build — just proceed and report status/results.
- **Permission dialogs are the harness's, not mine.** The user was confused by Claude
  Code's built-in tool-approval prompts ("Do you want to proceed? 1. Yes 2. No"). These
  come from the CLI's permission mode, not from me asking questions. If this comes up
  again, briefly explain that shift+tab cycles to auto-accept mode, then continue.
  Don't over-explain it repeatedly.
- **Stay scoped.** Only touch the specific local path, GitHub repo, and Drive folder the
  user named. Don't wander into other folders/files even in "auto mode."
- **Tech stack decided once, reusable as default:** React + Vite, react-router-dom for
  routing, React Context + localStorage for cart-like state, Vitest + React Testing
  Library for unit/component tests, Playwright for end-to-end tests, mock local
  JSON/JS data (no backend) — the core stack was chosen via `AskUserQuestion` at the
  start of this project; Playwright was added later when the user asked "was Playwright
  used for testing?" and then explicitly requested it be added for E2E coverage. Offer
  this full stack as the recommended default again for similar "build a small
  e-commerce-style app" requests, but still ask once per new project unless the user
  says to skip asking.
- **Interactive logins cannot be automated end-to-end.** GitHub OAuth device-flow
  authorization pages actively reject automated/scripted clicks (`access_denied`) —
  don't keep retrying browser automation on that final "Authorize" click after ~1 failed
  attempt. Get the device code, open the page, fill the code, then explicitly hand the
  final click back to the user and wait.
- **Verify manually, not just automated tests.** For UI work, actually run the dev
  server and click through the app with browser automation before calling it done —
  this user cares about real verification, not just green test output.
- **Author fields must say "Muzaffer", never "Claude."** Any document with an
  Author/Found-by field should credit the user by name from the first draft.
- **Proactively install missing tools and drive requests to full completion.** Don't
  stop at "here's what's missing" — install it, then carry the task through build,
  test, local storage, GitHub, and documentation without waiting for step-by-step
  permission once auto mode is in effect. Confirmed by the user as the right approach.
- **"TDD" vs "BDD" is a real distinction this user cares about.** When asked whether
  tests were TDD or BDD, give an honest answer: test-after (not test-driven) with
  describe/it-style naming is neither strictly TDD nor BDD. If asked to add a BDD
  suite, it means genuine Gherkin (`Given/When/Then` `.feature` files run by
  Cucumber or similar), not just renaming existing tests. When asked to "ensure all
  test cases are covered in both," build real parity — map every case in one suite to
  an equivalent scenario in the other — rather than a token subset.
- **A newly-built test layer that finds a real bug should get fixed, not just
  reported.** Contrast with the deliberate `demo-failing-test` workflow (which leaves
  its defect open on purpose): if a *new, non-staged* test scenario built for genuine
  coverage fails, treat that as a real defect — fix it, verify all suites are green
  again, and write it up (status: Fixed) rather than leaving red tests in the repo.

## 3. Prerequisites / Environment Setup

Check first; only install what's missing (idempotent):

```powershell
node -v; npm -v; git --version; gh --version
```

If any are missing (this machine had **none** installed initially), install via winget:

```powershell
winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements --silent
winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements --silent
winget install -e --id GitHub.cli --accept-package-agreements --accept-source-agreements --silent
```

**Important Windows/PowerShell quirk:** each PowerShell tool call in this harness may be
a fresh process that doesn't see a newly-updated PATH. Prepend this to every command
that needs node/npm/git/gh after a fresh install, for the rest of the session:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

Also set git identity once if unset:

```powershell
git config --global user.name "<github-username>"
git config --global user.email "<user-email>"
git config --global init.defaultBranch main
```

## 4. Procedure

### 4.1 Scaffold the app
```powershell
Set-Location "<local-repo-path>"
npm create vite@latest . -- --template react -y
npm install
npm install react-router-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```
Remove unused Vite scaffold defaults (`src/App.css`, `src/assets/`), update
`index.html` `<title>`.

### 4.2 Build the app structure
- `src/data/` — mock data module + lookup helper
- `src/context/` — Context provider for shared state (e.g. cart), backed by
  `localStorage`, with a `useX()` hook
- `src/components/` — shared UI (header/nav with live state badge, item card)
- `src/pages/` — one component per route (List, Details, Cart-equivalents)
- `src/App.jsx` — route definitions; shared header outside `<Routes>`
- `src/main.jsx` — wraps `App` in `BrowserRouter` + the context provider(s)
- Per-component/page CSS files, no CSS framework dependency

### 4.3 Configure and write tests
- `vite.config.js`: add a `test` block — `environment: 'jsdom'`,
  `setupFiles: ['./src/test/setup.js']`, `globals: true`
- `src/test/setup.js`: `import '@testing-library/jest-dom/vitest'`
- `src/test/testUtils.jsx`: a `renderWithProviders(ui, { route })` helper wrapping
  `MemoryRouter` + the context provider(s)
- `package.json` scripts: add `"test": "vitest run"`, `"test:watch": "vitest"`
- Write one `*.test.jsx` per page/component using Vitest + React Testing Library +
  `@testing-library/user-event`, testing real user interactions (typing, selecting,
  clicking) rather than internal functions. Seed `localStorage` directly in tests that
  need pre-populated state instead of driving multi-step UI setup.

### 4.4 Verify
```powershell
npm run test     # all tests must pass
npm run build    # production build must complete with 0 errors
npm run dev       # start dev server (run_in_background)
```
Then use Chrome browser automation (`claude-in-chrome` skill) to manually click through
every page and the core flows (add to cart, update quantity, remove, navigation, reload
persistence) before considering the build "tested." Note any manual case that couldn't
be verified (e.g. viewport resize not visually confirmed in automation) honestly in the
Test Run Report rather than claiming it passed.

**End-to-end tests (Playwright)** — add this alongside the unit/component suite by
default going forward (it closes the gap that manual-only browser verification leaves):
```powershell
npm install -D @playwright/test
npx playwright install chromium
```
Add `playwright.config.js` with a `webServer` block that runs `npm run dev` and waits on
`http://localhost:5173`, and an `e2e/` folder with one `*.spec.js` per page/flow, mirroring
the unit test files but driving a real browser (`page.goto`, `page.getByRole`, etc.).
Add `"test:e2e": "playwright test"` and `"test:e2e:ui": "playwright test --ui"` to
`package.json` scripts. `.gitignore` needs `/test-results/`, `/playwright-report/`,
`/blob-report/`, `/playwright/.cache/`. Run `npm run test:e2e` and capture the output the
same way as the unit suite; add an E2E section to the Test Run Report and an
"End-to-End Cases" table to Test Cases.

**BDD tests (Cucumber + Playwright)** — add when the user explicitly asks for BDD
coverage (don't assume it's wanted just because E2E exists):
```powershell
npm install -D @cucumber/cucumber
```
Create `cucumber.cjs` (CommonJS config file even in an ESM project — cucumber-js
loads it directly) pointing `paths` at `bdd/features/**/*.feature` and `import` at
`bdd/support/**/*.js` + `bdd/step-definitions/**/*.js`. Under `bdd/support/`: a
`devServer.js` that reuses an already-running dev server or spawns one (readiness
check via a real `fetch()` request, not a raw socket pinned to `127.0.0.1` — Vite can
bind to `::1` and a naive check will miss it); a `world.js` defining a custom
Cucumber World holding `page`/`browser`; `hooks.js` wiring `BeforeAll`/`AfterAll`
(browser + dev server lifecycle) and `Before`/`After` (fresh browser context + page
per scenario, `localStorage` cleared); a `helpers.js` with composite actions (e.g.
"add product X to cart") built on the app's own data module so product names map to
real ids rather than being hardcoded twice. Write one `.feature` file per page/flow
(same names as the E2E specs — `product-list.feature`, `product-details.feature`,
`cart.feature`, plus any cross-cutting one like `header.feature`) with Given/When/Then
scenarios, and matching step definitions in `bdd/step-definitions/`. Add
`"test:bdd": "cucumber-js"` to `package.json` scripts.

If the user asks to ensure full parity between suites, map every existing unit/E2E
case to an equivalent BDD scenario (a cross-reference table in Test Cases works well)
rather than writing a token handful. Run it (`npm run test:bdd`), capture output to
`logs/`, and treat any failure as real unless the scenario is a known intentional
demo — fix real bugs immediately, then re-run everything (unit, E2E, BDD, build) to
confirm nothing regressed before writing up results.

### 4.5 Git init, commit, push
```powershell
Set-Location "<local-repo-path>"
git init
git add -A
git commit -m "Initial commit: <app name> with <pages> pages"
git remote add origin https://github.com/<user>/<repo>.git
```

**GitHub auth (cannot be fully automated — human click required):**
```powershell
gh auth login --hostname github.com --git-protocol https --web
```
Read the background output for the one-time code, e.g. `XXXX-XXXX`. Use
`claude-in-chrome` to:
1. Navigate to `https://github.com/login/device`
2. Click "Continue" on the account-selection screen (this step alone is fine to
   automate)
3. Type the one-time code into the 8 boxes
4. Click the green "Continue" button (fine to automate)
5. **Stop there.** Tell the user the code is entered and ask them to personally click
   the final "Authorize github" button — GitHub's bot-detection returns `access_denied`
   if that click is scripted.
6. Poll `gh auth status` (e.g. via `ScheduleWakeup`, ~60–120s) until authenticated, or
   wait for the background task-notification that the `gh auth login` process exited.

Once authenticated:
```powershell
gh auth setup-git
git push -u origin main
```
Verify with `gh repo view <owner>/<repo> --json name,url,pushedAt` and/or a browser
screenshot of the repo page.

### 4.6 Write and publish documentation

Produce these documents (adapt names/content to the actual project):
1. **Product Requirements Document (PRD)** — overview, goals, non-goals, user stories,
   functional/non-functional requirements, success metrics, open questions
2. **Technical Design Document (TDD)** — architecture, tech stack + rationale, project
   structure, data model, state management, routing, key component behaviors, testing
   strategy, build/deploy, known limitations
3. **Test Plan** — objective, scope (in/out), test levels & approach, environment, entry
   / exit criteria, deliverables, risks, schedule
4. **Test Cases** — one table per page/area, automated cases mapped to their test files
   (unit/component AND end-to-end), plus manual/exploratory cases for what automation
   doesn't practically cover
5. **Test Run Report** — actual results: automated suite output (both unit and E2E),
   build output, manual smoke test results (including anything **not verified**, with
   an honest note why), defects found (or none), coverage gaps/follow-ups, conclusion
6. **Defect reports** (as needed) — when a real bug is found (e.g. via a deliberate
   failure-demonstration exercise), document status, severity, repro steps, root cause,
   impact, suggested fix, and evidence (linked failing test + captured log)

All documents' "Author" (or "Found by") field must say **Muzaffer**, never "Claude."

**Store in two places, kept in sync:**
- `docs/` folder inside the git repo (committed and pushed) — plain Markdown
- The Google Drive project folder — as native Google Docs, one file per document, via
  `mcp__claude_ai_Google_Drive__create_file` with `contentMimeType: 'text/plain'` and
  `parentId` set to the Drive folder ID. Title convention: `<AppName> - <Document Name>`
  (e.g. `SampleShop - Product Requirements Document`).
- Before creating a Drive doc, `search_files` the target folder for an existing file
  with that title. If found, there is no direct "replace content" tool available in this
  toolset — recreate by creating the new version and using `trash_file` on the stale
  one (trash is recoverable, not permanent deletion), then create the replacement.
  Do this for EVERY doc whose source content changed, every time source docs are
  updated (e.g. after adding Playwright, after a defect report changed a report's
  content) — don't let Drive drift out of sync with the repo. **Also always update the
  same-named local file first** — write enriched content to the local `docs/*.md` file
  before or alongside writing it to Drive, never only to Drive, so the two never
  diverge (this was missed once during this project and had to be caught and fixed).

### 4.7 Report back
Summarize what was built, where it lives (local path, GitHub URL, Drive folder), test
results, and any open follow-ups — concisely, not a wall of text, unless the user asks
for detail.

## 5. Quick Reference — this project's actual values

| Item | Value |
|---|---|
| App name | SampleShop |
| Local path | `C:\Users\muzzu\Desktop\Muz_AI_Projects_win\SampleAppDesktop001` |
| GitHub repo | https://github.com/muzaffer01/gitRepo001 |
| GitHub account | muzaffer01 |
| Drive folder | "Sample001 Project" — `108gl4b5UcMhemqvyYJ9eH_NRdKhSBFfs` |
| Dev server | `npm run dev` → http://localhost:5173/ |
| Tech stack | React 19 + Vite, react-router-dom v7, Context + localStorage, Vitest + RTL (unit), Playwright (E2E), Cucumber.js + Playwright (BDD) |
| Pages | `/` (Product List), `/products/:id` (Product Details), `/cart` (Cart) |

## 6. Re-run Trigger

If the user says something like "recreate this," "do it again," "run the runbook," or
asks for a similar Amazon-style app in a new location, treat this document as the
default procedure: substitute new paths/URLs/names as given, skip questions already
answered here (tech stack, doc set, auto-mode expectations) unless the user indicates
they want something different this time, and follow sections 3–4.7 in order.

## 7. Reusable Skills

Each phase of this procedure is also captured as a standalone Claude Code Skill under
`.claude/skills/` in this repo, invocable directly (e.g. `/scaffold-react-app`) instead
of re-reading this whole document:

| Skill | Covers |
|---|---|
| `check-dev-environment` | Section 3 — verify/install Node, Git, GitHub CLI |
| `scaffold-react-app` | Sections 4.1–4.3 — scaffold app, structure, unit tests |
| `add-playwright-e2e` | Section 4.4 (E2E part) — add Playwright browser tests |
| `add-bdd-cucumber` | Section 4.4 (BDD part) — add a Cucumber/Gherkin BDD suite with full case parity |
| `verify-app` | Section 4.4 — run tests, build, manual browser smoke test |
| `publish-to-github` | Section 4.5 — git init/commit/push, GitHub auth handoff |
| `publish-project-docs` | Section 4.6 — write/sync PRD, TDD, Test Plan, Test Cases, Test Run Report to repo + Drive |
| `demo-failing-test` | Failure-demo workflow — real failing test, defect report, isolated from CI |

Each `SKILL.md` links back to the concrete files in this repo as a worked example.
A visual flow diagram of how these 8 skills connect (dependencies, what each one
produces, and the `demo-failing-test` bypass path) lives at `docs/SkillsFlow.md`
(renders natively on GitHub via Mermaid) and as an interactive Artifact linked from
that file.
