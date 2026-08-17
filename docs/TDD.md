# Technical Design Document (TDD)
## SampleShop — Phase 1

**Author:** Muzaffer
**Date:** 2026-08-17
**Related:** Product Requirements Document (PRD) — Phase 1

---

## 1. Architecture Overview

SampleShop is a client-only single-page application (SPA). There is no backend server in
Phase 1 — product data is bundled as a static JS module, and cart state lives in the
browser (React Context + localStorage).

```
Browser
 └─ React SPA (Vite build)
     ├─ React Router (client-side routing)
     ├─ CartContext (global cart state, backed by localStorage)
     └─ Pages: ProductList, ProductDetails, Cart
```

## 2. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| UI framework | React 19 | Component model fits page-based structure; wide ecosystem |
| Build tool | Vite | Fast dev server + build, minimal config |
| Routing | react-router-dom v7 | Standard client-side routing for SPAs |
| State | React Context API | Cart state is small and global; no need for Redux/Zustand at this scale |
| Persistence | Browser localStorage | Simplest option that survives page reloads without a backend |
| Styling | Plain CSS per component | No CSS framework dependency; keeps bundle small |
| Testing | Vitest + React Testing Library | Fast, Vite-native test runner; RTL encourages testing user-visible behavior |

## 3. Project Structure

```
src/
  components/
    Header.jsx / .css        Top nav bar with cart badge
    ProductCard.jsx / .css   Product grid tile
  context/
    CartContext.jsx          Cart state, actions, localStorage sync
  data/
    products.js              Mock product catalog + getProductById()
  pages/
    ProductList.jsx / .css
    ProductDetails.jsx / .css
    Cart.jsx / .css
  test/
    setup.js                 jest-dom matcher setup for Vitest
    testUtils.jsx             renderWithProviders() helper (Router + CartProvider)
  App.jsx                    Route definitions
  main.jsx                   App entry point, provider wiring
```

## 4. Data Model

### Product (static, `src/data/products.js`)
```js
{
  id: number,
  name: string,
  category: string,
  price: number,
  rating: number,       // 0-5
  reviewCount: number,
  image: string,        // URL
  description: string,
  stock: number,
}
```

### Cart Item (runtime, stored in localStorage under key `sample-shop-cart`)
```js
{
  id: number,       // product id
  name: string,
  price: number,
  image: string,
  quantity: number,
}
```

## 5. State Management

`CartContext` (`src/context/CartContext.jsx`) exposes:

- `items` — array of cart items
- `addToCart(product, quantity)` — adds or increments an item
- `removeFromCart(productId)` — removes a line item
- `updateQuantity(productId, quantity)` — sets quantity; removes the item if `quantity <= 0`
- `clearCart()` — empties the cart
- `itemCount` — derived total quantity across all lines (memoized)
- `subtotal` — derived sum of `price * quantity` (memoized)

Cart state is initialized synchronously from `localStorage` on mount and written back via
a `useEffect` on every change, so it survives page reloads within the same browser.

## 6. Routing

| Path | Component | Notes |
|------|-----------|-------|
| `/` | `ProductList` | Default/home route |
| `/products/:id` | `ProductDetails` | `id` resolved via `getProductById` |
| `/cart` | `Cart` | |

`App.jsx` renders `Header` outside `<Routes>` so the cart badge is visible on every page.

## 7. Key Component Behaviors

- **ProductList**: derives `categories` and `filteredProducts` via `useMemo` from local
  `query`/`category` state — no network calls, filtering is instant.
- **ProductDetails**: reads `:id` via `useParams`, looks up the product synchronously.
  Unknown ids render a "not found" state instead of crashing. "Buy Now" calls
  `addToCart` then `navigate('/cart')`.
- **Cart**: renders `items` from context directly; quantity `<select>` and "Remove"
  button call context actions, which re-render the page reactively.

## 8. Testing Strategy

- Component tests with Vitest + React Testing Library, run via `npm run test`.
- Pages are tested through `MemoryRouter` (+ `Routes` where param/navigation behavior is
  under test) and a real `CartProvider`, so behavior is verified end-to-end at the
  component level rather than mocking context.
- `localStorage` is cleared between tests and seeded directly where a pre-populated cart
  is needed, avoiding brittle multi-step UI setup.
- See the companion **Test Plan** and **Test Cases** documents for full coverage details.

## 9. Build & Deployment

- `npm run dev` — local dev server (Vite, HMR)
- `npm run build` — production bundle to `dist/`
- `npm run preview` — serve the production build locally
- No environment variables or backend required; `dist/` is static and can be hosted on
  any static file host (GitHub Pages, Netlify, S3, etc.) in a future phase.

## 10. Known Limitations / Future Work

- No backend: product catalog is fixed at build time; cart is per-browser only (not
  synced across devices, no server-side order record).
- No authentication or checkout flow.
- No image optimization/CDN — placeholder images used for product photos.
- Not yet deployed to a hosting provider (out of scope for Phase 1).
