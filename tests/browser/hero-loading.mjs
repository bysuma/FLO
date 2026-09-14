// Run against a production preview. PLAYWRIGHT_MODULE may point to an external install.
import assert from 'node:assert/strict'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const browser = await chromium.launch({ headless: true })
const baseURL = process.env.BASE_URL || 'http://localhost:3000'
try {
  const staticPage = await browser.newPage({ javaScriptEnabled: false })
  await staticPage.goto(baseURL)
  assert(await staticPage.locator('h1').isVisible())
  assert(await staticPage.locator('[data-hero-media] img').evaluate((img) => img.complete && img.naturalWidth > 0))
  await staticPage.close()
  console.log('PASS headline and poster render without hydration')
  for (const mobile of [false, true]) {
    const page = await browser.newPage({
      viewport: { width: mobile ? 390 : 1440, height: 900 },
      isMobile: mobile, hasTouch: mobile,
    })
    await page.addInitScript(() => {
      window.heroMotionSamples = []
      const started = performance.now()
      const sample = () => {
        const media = document.querySelector('[data-hero-media]')
        const line = document.querySelector('h1 [data-line]')
        if (media && line) window.heroMotionSamples.push({
          media: getComputedStyle(media).clipPath + ':' + getComputedStyle(media).opacity,
          text: getComputedStyle(line).transform,
        })
        if (performance.now() - started < 4000) requestAnimationFrame(sample)
      }
      requestAnimationFrame(sample)
    })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(baseURL)
    await page.waitForFunction(() => {
      const video = document.querySelector('video')
      return video && !video.paused && video.currentTime > 0 && getComputedStyle(video).opacity === '1'
    })
    await page.waitForTimeout(1800)
    const samples = await page.evaluate(() => window.heroMotionSamples)
    assert(new Set(samples.map((sample) => sample.media)).size > 1, 'media entrance animates')
    assert(new Set(samples.map((sample) => sample.text)).size > 1, 'headline entrance animates')
    const source = await page.locator('video').evaluate((video) => video.currentSrc)
    assert(source.endsWith(mobile ? '/landscape-mobile.mp4' : '/landscape-desktop.mp4'))
    if (mobile) assert.equal(await page.locator('html').evaluate((el) => el.classList.contains('lenis')), false)
    assert.deepEqual(errors, [])
    await page.close()
    console.log(`PASS ${mobile ? 'mobile' : 'desktop'} video playback and source`)
  }
  const reduced = await browser.newPage({ reducedMotion: 'reduce' })
  const videos = []
  reduced.on('request', (req) => { if (req.url().endsWith('.mp4')) videos.push(req.url()) })
  await reduced.goto(baseURL)
  await reduced.waitForTimeout(1500)
  assert.equal(await reduced.locator('video').evaluate((video) => video.paused), true)
  assert.deepEqual(videos, [])
  await reduced.close()
  console.log('PASS reduced motion shows poster without downloading video')
} finally {
  await browser.close()
}
