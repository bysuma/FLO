// Run against the dev server with Playwright installed, or set PLAYWRIGHT_MODULE
// to its module path. BASE_URL defaults to http://localhost:3000.
import assert from 'node:assert/strict'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const browser = await chromium.launch({ headless: true })
try {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion,
    })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(process.env.BASE_URL || 'http://localhost:3000')
    await page.getByRole('button', { name: 'Open menu' }).waitFor()
    // Allow the server-rendered controls to hydrate before clicking.
    await page.waitForTimeout(1500)
    for (const [name, pathname, hash, changesPage] of [
      ['About us', '/about', '', true],
      ['FLO Engineering home', '/', '#home', true],
      ['Services', '/', '#services', false],
    ]) {
      await page.getByRole('button', { name: 'Open menu' }).click()
      const dialog = page.getByRole('dialog')
      await dialog.waitFor()
      await page.waitForTimeout(800)
      await page.evaluate(() => {
        window.curtainSeen = false
        const curtain = document.querySelector('[aria-hidden="true"].fixed.inset-0.bg-brand')
        window.curtainObserver = new MutationObserver(() => {
          if (getComputedStyle(curtain).visibility === 'visible') window.curtainSeen = true
        })
        window.curtainObserver.observe(curtain, { attributes: true })
      })
      await dialog.getByRole('link', { name, exact: true }).click()
      await page.waitForURL((url) => url.pathname === pathname && url.hash === hash)
      await page.waitForFunction(() => {
        const curtain = document.querySelector('[aria-hidden="true"].fixed.inset-0.bg-brand')
        return !document.querySelector('dialog[open]') && getComputedStyle(curtain).visibility === 'hidden'
      })
      const seen = await page.evaluate(() => {
        window.curtainObserver.disconnect()
        return window.curtainSeen
      })
      assert.equal(seen, changesPage && reducedMotion === 'no-preference', `${name}: curtain (${reducedMotion})`)
      assert.equal(await page.evaluate(() => document.documentElement.style.overflow), '')
      console.log(`PASS ${reducedMotion}: ${name}`)
    }
    assert.deepEqual(errors, [])
    await page.close()
  }
} finally {
  await browser.close()
}
