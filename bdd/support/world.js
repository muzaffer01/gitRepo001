import { setWorldConstructor, World } from '@cucumber/cucumber'

// Custom World: each scenario gets its own `page`, set up in hooks.js. Step
// definitions access it via `this.page`, `this.browser`, etc.
class CustomWorld extends World {
  constructor(options) {
    super(options)
    this.browser = null
    this.page = null
  }
}

setWorldConstructor(CustomWorld)
