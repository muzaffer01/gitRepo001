import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Config used ONLY to run intentionally-failing demo scenarios under demo/**.
// Not used by `npm run test` / `npm run build` — see vite.config.js.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
    include: ['demo/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
})
