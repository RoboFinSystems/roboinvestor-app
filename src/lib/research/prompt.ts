// The prompt a research brief hands its reader: one question to put to the SEC Shared
// Repository that reproduces the brief's most interesting number. Briefs written since
// 2026-11-16 carry it at the end of their Bottom Line, introduced as "Ask the filing
// yourself:". The page lifts it out of the prose and shows it in the trial block, so it is
// read once, where it can be copied.

const MARKER = /[*_]*ask the filing yourself:[*_]*[ \t]*(.*)$/im

/** Markdown emphasis and the quotes around a question, which are typography, not the prompt. */
function clean(text: string): string {
  return text
    .trim()
    .replace(/^[*_]+|[*_]+$/g, '')
    .trim()
    .replace(/^["“”']+|["“”']+$/g, '')
    .trim()
}

/**
 * Split a brief into its body and its prompt. A brief with no prompt (every one published
 * before 2026-11-16) comes back whole with `prompt: null`.
 */
export function splitPrompt(markdown: string): {
  body: string
  prompt: string | null
} {
  const m = MARKER.exec(markdown)
  if (!m) return { body: markdown, prompt: null }
  const prompt = clean(m[1])
  if (!prompt) return { body: markdown, prompt: null }
  const body =
    markdown.slice(0, m.index).replace(/[ \t]+$/, '') +
    markdown.slice(m.index + m[0].length)
  return { body, prompt }
}

/**
 * The prompt for a brief that has none of its own. It asks only for what the repository
 * holds for every filer, the primary statements of the latest annual report, so it works
 * for any company the page can name.
 */
export function defaultPrompt(company: string): string {
  return `Show ${company}'s income statement from its latest annual report, and compare revenue, operating income and net income with the year before.`
}
