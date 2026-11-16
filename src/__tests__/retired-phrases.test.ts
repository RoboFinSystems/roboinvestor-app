import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

// The public copy on the landing, the research pages and the README, held to the
// positioning lock (gtm/content/positioning.md and voice.md in the vault). Each phrase
// here was retired from public copy; the em dash is a voice hard stop. Code comments are
// not public copy, so they are stripped before the check; tests are skipped because
// they quote the phrases they guard against.
const RETIRED = [
  'financial intelligence',
  'insights',
  'AI-native',
  'early, and we say so',
  'in beta',
  'Finance AI Pilot',
  'XBRL-shaped',
  'in one model',
  'free account',
  'intelligent',
  'intro-meeting-scheduler',
  'hour-meeting-scheduler',
  '—',
]

const ROOT = process.cwd()
const SOURCES = [
  'src/app/(landing)',
  'src/app/(blog)',
  'src/components/landing',
  'src/components/research',
]

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      return name === '__tests__' ? [] : sourceFiles(path)
    }
    return /\.(ts|tsx)$/.test(name) ? [path] : []
  })
}

function withoutComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s)\/\/.*$/gm, '$1')
}

const files: [string, string][] = [
  ...SOURCES.flatMap((dir) => sourceFiles(join(ROOT, dir))).map(
    (path): [string, string] => [
      relative(ROOT, path),
      withoutComments(readFileSync(path, 'utf8')),
    ]
  ),
  ['README.md', readFileSync(join(ROOT, 'README.md'), 'utf8')],
]

describe('retired phrases', () => {
  it('scans the landing, the research pages and the README', () => {
    expect(files.length).toBeGreaterThan(10)
  })

  it.each(RETIRED)('no public copy says %s', (phrase) => {
    const needle = phrase.toLowerCase()
    const hits = files
      .filter(([, text]) => text.toLowerCase().includes(needle))
      .map(([path]) => path)
    expect(hits).toEqual([])
  })
})
