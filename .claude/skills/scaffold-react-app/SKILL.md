---
name: scaffold-react-app
description: Scaffold a new React + Vite single-page app with routing, a shared state context backed by localStorage, mock data, and a Vitest + React Testing Library unit test suite. Use when the user asks to build a small multi-page web app/prototype from scratch.
---

# Scaffold a React + Vite App

Builds the default tech stack used for small multi-page prototype apps (e.g. an
e-commerce-style app with a list/details/cart pattern), with unit tests from the start.

Run `check-dev-environment` first if tooling isn't confirmed installed.

## Default tech stack

- React 19 + Vite
- react-router-dom v7 for client-side routing
- React Context API + `localStorage` for any shared/global state (no Redux/Zustand
  needed at this scale)
- Plain CSS per component (no CSS framework dependency)
- Vitest + React Testing Library for unit/component tests
- Local mock data module (no backend) unless the user asked for a real API

Confirm this stack with the user via a quick choice (`AskUserQuestion`) once per new
project, unless they've already said to skip asking / use the same stack as before.

## Steps

1. Scaffold and install:
   ```powershell
   Set-Location "<local-repo-path>"
   npm create vite@latest . -- --template react -y
   npm install
   npm install react-router-dom
   npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
   ```
2. Remove unused Vite scaffold defaults (`src/App.css`, `src/assets/`), update
   `index.html`'s `<title>`.
3. Build the structure:
   - `src/data/` — mock data module + a lookup helper (e.g. `getXById`)
   - `src/context/` — a Context provider for shared state, backed by `localStorage`,
     exposing a `useX()` hook (init from storage on mount, write back via `useEffect`)
   - `src/components/` — shared UI (header/nav with any live state badge, list-item
     card)
   - `src/pages/` — one component per route
   - `src/App.jsx` — route definitions; shared header rendered outside `<Routes>` so
     it's visible on every page
   - `src/main.jsx` — wraps `App` in `BrowserRouter` + the context provider(s)
   - Per-component/page `.css` files
4. Configure and write tests:
   - `vite.config.js`: add a `test` block — `environment: 'jsdom'`,
     `setupFiles: ['./src/test/setup.js']`, `globals: true`
   - `src/test/setup.js`: `import '@testing-library/jest-dom/vitest'`
   - `src/test/testUtils.jsx`: a `renderWithProviders(ui, { route })` helper wrapping
     `MemoryRouter` + the context provider(s)
   - `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`
   - Write one `*.test.jsx` per page/component, using
     `@testing-library/user-event` to simulate real interaction (typing, selecting,
     clicking) rather than calling internal functions. Seed `localStorage` directly
     where a pre-populated state is needed instead of driving multi-step UI setup.

## Follow-up skills

- `add-playwright-e2e` — add end-to-end browser tests on top of the unit suite
- `verify-app` — run the full verification pass (tests, build, manual smoke test)
- `publish-to-github` — git init/commit/push
- `publish-project-docs` — write PRD/TDD/Test Plan/Test Cases (TDD+BDD)/Test Run Report

See `docs/TDD.md` in this repo for a worked example of the resulting architecture.
