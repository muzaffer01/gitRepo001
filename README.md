# SampleShop

> **Note:** This project was created using the **Claude agent running in Windows
> Terminal** (Claude Code CLI on Windows) — the entire build, test, GitHub, and
> documentation workflow was performed through that terminal-based agent session.

A small Amazon-style e-commerce web app built with React + Vite. Includes three pages:

- **Product List** (`/`) — browse all products, search by name, filter by category
- **Product Details** (`/products/:id`) — view product info, choose quantity, add to cart, or buy now
- **Cart** (`/cart`) — review items, update quantities, remove items, see subtotal

Product data is local mock data (`src/data/products.js`). Cart state is managed via React Context and persisted to `localStorage`.

## Getting started

```bash
npm install
npx playwright install chromium   # one-time, for E2E tests
npm run dev           # start the dev server
npm run build         # production build
npm run test          # unit/component tests (Vitest + React Testing Library)
npm run test:watch
npm run test:e2e      # end-to-end tests (Playwright, real Chromium browser)
npm run test:e2e:ui   # Playwright's interactive UI mode
```

## Tech stack

- React 19 + React Router
- Vite
- Vitest + React Testing Library for unit/component tests
- Playwright for end-to-end browser tests

## Project structure

```
src/
  components/   Header, ProductCard
  context/      CartContext (cart state + localStorage)
  data/         mock product catalog
  pages/        ProductList, ProductDetails, Cart
  test/         test setup + shared render helper
e2e/            Playwright end-to-end tests (real browser)
```
