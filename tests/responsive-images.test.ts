import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import sharp from 'sharp'
import manifest from '../src/lib/images.generated.json'
import { responsiveImage } from '../src/lib/images'

describe('responsive image assets', () => {
  it('every advertised candidate exists and matches its width descriptor without upscaling', async () => {
    for (const metadata of Object.values(manifest)) {
      let previous = 0
      for (const candidate of metadata.srcSet.split(', ')) {
        const [url, descriptor] = candidate.split(' ')
        const width = Number(descriptor.slice(0, -1))
        await access(`public${url}`)
        const actual = await sharp(`public${url}`).metadata()
        assert.equal(actual.width, width, url)
        assert.ok(width > previous && width <= metadata.width, url)
        previous = width
      }
    }
  })
  it('keeps SVGs unchanged and supplies sizes for known raster assets', () => {
    assert.deepEqual(responsiveImage('/footer/logo.svg', '178px'), { src: '/footer/logo.svg' })
    assert.equal(responsiveImage('/about/team.webp', '220px').sizes, '220px')
    assert.ok(responsiveImage('/about/team.webp', '220px').srcSet)
  })
})
