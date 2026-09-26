/*
 * Spotlight: Search the filings by meaning. A question typed into Document
 * Search with semantic matching on, filtered to 10-Ks, and the two best
 * passages. The hits and their text are the real top results of this search
 * on the SEC graph (Figma's FY2025 10-K and Domo's FY2024 10-K).
 */
import {
  appChrome,
  eo,
  pageHeader,
  PHONE_APP_CSS,
  push,
  rise,
  seg,
  swap,
  typed,
} from './kit.js'

const Q = 'customers moving from per-seat to usage-based pricing'
const HITS = [
  [
    'Figma, Inc.',
    'FIG · 10-K FY2025 · Risk Factors',
    '…customers may shift preferences from per-seat subscriptions to <mark>credit-based, usage-based, or outcome-based billing models</mark>, which may increase pricing pressure',
  ],
  [
    'Domo, Inc.',
    'DOMO · 10-K FY2024 · Risk Factors',
    'We have started to introduce <mark>consumption-based pricing</mark>, which is pricing based upon the use of our platform, for certain of our customers.',
  ],
]

const main = `${pageHeader('Document Search', 'SEC filings and your own documents, by keyword or by meaning')}
  <div class="srch card"><span class="mag">⌕</span><span id="q"></span><span class="caret" id="caret"></span></div>
  <div class="flt">
    <span class="seg"><span id="kw" class="on">Keyword</span><span id="sm">Semantic</span></span>
    <span class="chip">Form: 10-K</span><span class="chip">Section: any</span><span class="chip">Fiscal year: any</span>
  </div>
  ${HITS.map((h, i) => `<div class="hit card" id="h${i}"><div class="hh"><b>${h[0]}</b><span>${h[1]}</span></div><p>${h[2]}</p></div>`).join('')}`

const css = `
.srch { display: flex; align-items: center; gap: 12px; padding: 12px 18px; font-size: 20px; }
.mag { color: var(--e400); font-size: 22px; }
.caret { width: 2px; height: 24px; background: var(--e300); }
.flt { display: flex; align-items: center; gap: 10px; margin: 14px 0 16px; }
.seg { display: inline-flex; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; margin-right: 8px; }
.seg span { padding: 8px 14px; font-size: 15px; font-weight: 600; color: var(--muted); }
.seg span.on { background: var(--e600); color: #fff; }
.chip { padding: 7px 12px; border-radius: 999px; border: 1px solid var(--line); background: var(--card2); font-size: 14px; color: #cad3cf; }
.hit { padding: 16px 20px; margin-bottom: 12px; opacity: 0; }
.hh { display: flex; align-items: baseline; gap: 12px; margin-bottom: 8px; }
.hh b { font-size: 18px; } .hh span { font-size: 14px; color: var(--muted); }
.hit p { font-size: 17px; line-height: 1.5; color: #d9e2de; }
mark { background: rgba(34,211,238,.16); color: var(--c300); border-radius: 4px; padding: 0 3px; }
`

function setup(ctx) {
  const { $ } = ctx
  ctx.nav('search')
  return (t) => {
    $('q').textContent = typed(Q, t, 0.3, 32)
    $('caret').style.opacity = 1 - seg(t, 2.1, 2.3)
    swap($('sm'), t, 2.5, null, null, ['', 'on'])
    swap($('kw'), t, 2.5, null, null, ['on', ''])
    HITS.forEach((_, i) =>
      rise($('h' + i), eo(seg(t, 3.1 + i * 0.35, 3.6 + i * 0.35)), 14)
    )
    push($('main'), t, 9.5, 540, 420)
  }
}

// Phone layout: the filters wrap and the section chips go.
const phoneCss = `
.srch { font-size: 17px; }
.flt { flex-wrap: wrap; }
.chip:not(:nth-child(2)) { display: none; }
.hh { flex-direction: column; gap: 2px; }
.hit p { font-size: 16px; }
`

export default {
  width: 1200,
  height: 750,
  total: 9.5,
  poster: 6,
  css,
  html: appChrome({ active: 'search', main }),
  setup,
  mobile: { width: 720, height: 740, css: PHONE_APP_CSS + phoneCss },
}
