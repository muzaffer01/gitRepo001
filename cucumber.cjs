// Cucumber.js configuration. Kept as .cjs since the project itself is ESM
// ("type": "module" in package.json) — this file is loaded by the cucumber-js CLI
// directly (not imported by app code), so CommonJS here is safe and simplest.
module.exports = {
  default: {
    paths: ['bdd/features/**/*.feature'],
    import: ['bdd/support/**/*.js', 'bdd/step-definitions/**/*.js'],
    format: ['summary', 'progress'],
    publishQuiet: true,
  },
}
