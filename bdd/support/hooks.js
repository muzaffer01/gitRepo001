import { AfterAll, After, BeforeAll, Before } from '@cucumber/cucumber'
import { chromium } from '@playwright/test'
import { ensureDevServer, stopDevServerIfSpawned, BASE_URL } from './devServer.js'

let sharedBrowser = null

BeforeAll({ timeout: 45000 }, async function () {
  await ensureDevServer()
  sharedBrowser = await chromium.launch()
})

AfterAll(async function () {
  if (sharedBrowser) await sharedBrowser.close()
  await stopDevServerIfSpawned()
})

Before(async function () {
  this.browser = sharedBrowser
  this.context = await sharedBrowser.newContext()
  this.page = await this.context.newPage()
  this.baseUrl = BASE_URL
  await this.page.goto(this.baseUrl)
  await this.page.evaluate(() => localStorage.clear())
})

After(async function () {
  if (this.context) await this.context.close()
})
