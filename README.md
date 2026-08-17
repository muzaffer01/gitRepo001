# SampleShop

A small Amazon-style e-commerce web app built with React + Vite. Includes three pages:

- **Product List** (`/`) — browse all products, search by name, filter by category
- **Product Details** (`/products/:id`) — view product info, choose quantity, add to cart, or buy now
- **Cart** (`/cart`) — review items, update quantities, remove items, see subtotal

Product data is local mock data (`src/data/products.js`). Cart state is managed via React Context and persisted to `localStorage`.

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build
npm run test      # run the test suite (Vitest + React Testing Library)
npm run test:watch
```

## Tech stack

- React 19 + React Router
- Vite
- Vitest + React Testing Library for tests

## Project structure

```
src/
  components/   Header, ProductCard
  context/      CartContext (cart state + localStorage)
  data/         mock product catalog
  pages/        ProductList, ProductDetails, Cart
  test/         test setup + shared render helper
```
