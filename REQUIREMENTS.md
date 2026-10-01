# Requirements - SampleAppDesktop001 (SampleShop)

Distilled from `docs/PRD.md` (Phase 1, 2026-08-17). The full user stories, functional requirements and test documents are in `docs/`.

1. SampleShop is a simplified, Amazon-style e-commerce web app built with React 19, Vite and React Router. It was built and documented through the Claude agent in Windows Terminal.
2. Phase 1 has three pages: Product List (`/`), Product Details (`/products/:id`) and Cart (`/cart`).
3. Product List shows all products in a responsive grid (image, name, star rating, review count, price), a live case-insensitive search by name, a category dropdown including "All", an empty state when nothing matches, and a link from each card to its Details page.
4. Product Details shows image, name, rating, review count, price, description and stock status; a quantity selector capped at the lesser of 10 or available stock; "Add to Cart" with a confirmation message; "Buy Now" which adds the item and goes straight to the Cart; both buttons disabled when out of stock; and a "Product not found" message with a link back for an unknown id.
5. Cart lists every item with image, name, unit price, quantity control and line total; lets the user change a quantity or remove a line; shows the subtotal; shows an empty-cart state with a link back; and has a "Proceed to Checkout" button that is visual only in Phase 1.
6. The cart item count is visible in the header at all times, and the cart persists across page reloads (React Context plus `localStorage`, single browser).
7. Product data is static mock data in `src/data/products.js`. There is no backend, database, login, checkout, payment, order history, tax or shipping in Phase 1.
8. Quality is covered by unit and component tests (Vitest and React Testing Library), end-to-end tests (Playwright, real Chromium), and a Cucumber BDD suite with full test-case parity. A GitHub Actions workflow runs lint, unit, build, E2E and BDD tests.
9. Testing documents live in `docs/`: PRD, TDD, Test Plan, Test Cases (TDD and BDD), RTM, Defect Summary Report, test run reports and a Runbook for recreating the build.
10. The Claude Code skills that drive the build, test and publish workflow are described in `docs/SkillsFlow.md`, and architecture diagrams are in `docs/ArchitectureBlueprint.html`.
11. Documents are kept on GitHub (`muzaffer01/gitRepo001`) and Google Drive; the Drive folder is SampleAppDesktop001.
12. Dashboards and display pages use light, high-contrast color coding for labels, tabs, filters and statuses on dark backgrounds, with darker variants in light mode (standing rule, 2026-10-01).
