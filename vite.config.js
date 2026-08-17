import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
    // demo/** holds intentionally-failing scenarios used to demonstrate the
    // failure-reporting workflow (see docs/Defect-001-CartQuantityExceedsStock.md).
    // `include` is scoped to src/ so `npm run test` stays green; run demo tests
    // explicitly with `npx vitest run demo/<file> --config vite.demo.config.js`.
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
})
