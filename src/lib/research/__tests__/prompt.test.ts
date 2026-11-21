import { describe, expect, it } from 'vitest'

import { defaultPrompt, splitPrompt } from '../prompt'

describe('splitPrompt', () => {
  it('returns a brief with no prompt whole', () => {
    const md = '# Title\n\nBody text.\n\n*Footer.*\n'
    expect(splitPrompt(md)).toEqual({ body: md, prompt: null })
  })

  it('lifts a prompt on its own line out of the body', () => {
    const md =
      'Watch three things.\n\n*Ask the filing yourself:* "What share of revenue went to income tax in 2025?"\n\n---\n\n*Footer.*\n'
    const { body, prompt } = splitPrompt(md)
    expect(prompt).toBe('What share of revenue went to income tax in 2025?')
    expect(body).not.toMatch(/ask the filing/i)
    expect(body).toContain('Watch three things.')
    expect(body).toContain('*Footer.*')
  })

  it('lifts a prompt that closes a paragraph, keeping the paragraph', () => {
    const md =
      'The thesis held. **Ask the filing yourself:** *“How did free cash flow change?”*\n\nNext.\n'
    const { body, prompt } = splitPrompt(md)
    expect(prompt).toBe('How did free cash flow change?')
    expect(body).toBe('The thesis held.\n\nNext.\n')
  })

  it('treats a marker with nothing after it as no prompt', () => {
    const md = 'Body.\n\n*Ask the filing yourself:*\n'
    expect(splitPrompt(md)).toEqual({ body: md, prompt: null })
  })
})

describe('defaultPrompt', () => {
  it('names the company and asks only for the primary statements', () => {
    const p = defaultPrompt('Halvorsen Instruments Corp')
    expect(p).toContain('Halvorsen Instruments Corp')
    expect(p).toMatch(/income statement/)
  })
})
