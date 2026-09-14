import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import ts from 'typescript'

function sources(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? sources(path) : /\.tsx?$/.test(path) ? [path] : []
  })
}

test('DOM selector lists have no empty entries after class cleanup', () => {
  let checked = 0
  for (const file of sources('src')) {
    const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true)
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) &&
          ['closest', 'querySelector', 'querySelectorAll', 'matches'].includes(node.expression.name.text)) {
        const argument = node.arguments[0]
        if (argument && ts.isStringLiteral(argument)) {
          checked++
          assert.doesNotMatch(argument.text, /^\s*,|,\s*$|,\s*,/, `${file}: invalid selector ${argument.text}`)
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
  }
  assert.ok(checked > 0)
})
