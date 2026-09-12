import sharp from 'sharp'
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises'
import { join, relative, basename, dirname } from 'node:path'

const root = new URL('../public/', import.meta.url).pathname
const manifest = {}
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === 'responsive') continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) { await walk(path); continue }
    if (!entry.name.endsWith('.webp')) continue
    const { width, height } = await sharp(path).metadata()
    const source = `/${relative(root, path)}`
    const candidates = [...new Set([160, 320, 480, 640, 960, 1280, 1600, 1920].filter(size => size < width).concat(width))]
    const variants = []
    for (const size of candidates) {
      if (size === width) { variants.push({ src: source, width: size }); continue }
      const output = join(dirname(path), 'responsive', `${basename(path, '.webp')}-${size}.webp`)
      await mkdir(dirname(output), { recursive: true })
      const original = await stat(path)
      const generated = await stat(output).catch(() => null)
      if (!generated || generated.mtimeMs < original.mtimeMs) {
        await sharp(path).resize({ width: size, withoutEnlargement: true }).webp({ quality: 82 }).toFile(output)
      }
      variants.push({ src: `/${relative(root, output)}`, width: size })
    }
    manifest[source] = { width, height, srcSet: variants.map(item => `${item.src} ${item.width}w`).join(', ') }
  }
}
await walk(root)
await writeFile(new URL('../src/lib/images.generated.json', import.meta.url), JSON.stringify(manifest, null, 2) + '\n')
console.log(`Generated responsive variants for ${Object.keys(manifest).length} WebP images.`)
