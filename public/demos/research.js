/*
 * Spotlight: Research any public company. A ticker typed into Research, the
 * latest 10-K picked, and its income statement rendered from the XBRL. Figures
 * are Box, Inc.'s 10-K for the fiscal year ended Jan 31, 2026 (filed
 * Mar 9, 2026), as they sit on the SEC graph, in thousands.
 */
import {
  appChrome,
  CURSOR,
  eio,
  eo,
  pageHeader,
  PHONE_APP_CSS,
  pointer,
  push,
  rise,
  seg,
  typed,
} from './kit.js'

const IS = [
  ['Revenue', '1,177,253', '1,090,130'],
  ['Cost of revenue', '244,647', '228,105'],
  ['Gross profit', '932,606', '862,025', 'tot'],
  ['Research and development', '294,542', '264,853'],
  ['Sales and marketing', '403,992', '380,154'],
  ['General and administrative', '150,883', '137,384'],
  ['Operating income', '83,189', '79,634', 'tot'],
  ['Net income', '115,383', '244,621', 'tot'],
]

const main = `${pageHeader('Research', 'Every listed filer, rendered from its XBRL filings')}
  <div class="srch card"><span class="mag">⌕</span><span id="q"></span><span class="caret" id="caret"></span></div>
  <div class="hit card" id="hit"><div><b>Box, Inc.</b><span>BOX · 10-K · fiscal year ended Jan 31, 2026 · filed Mar 9, 2026</span></div><span class="btn go" id="open">Open</span></div>
  <div id="st">
    <div class="tabs"><span class="tab on">Income Statement</span><span class="tab">Balance Sheet</span><span class="tab">Cash Flow</span><span class="unit">USD thousands</span></div>
    <table id="is">
      <tr><th>Concept</th><th class="n">FY2026</th><th class="n">FY2025</th></tr>
      ${IS.map((r, i) => `<tr id="i${i}"${r[3] ? ' class="tot"' : ''}><td>${r[0]}</td><td class="n">${r[1]}</td><td class="n">${r[2]}</td></tr>`).join('')}
    </table>
    <div class="hl" id="hl"></div>
    <div class="gm badge b-v" id="gm">Gross margin 79.2%</div>
  </div>`

const css = `
.srch { display: flex; align-items: center; gap: 12px; padding: 12px 18px; font-size: 20px; }
.mag { color: var(--e400); font-size: 22px; }
.caret { width: 2px; height: 24px; background: var(--e300); }
.hit { margin-top: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; opacity: 0; }
.hit b { font-size: 19px; } .hit span:not(.btn) { display: block; color: var(--muted); font-size: 15px; margin-top: 4px; }
#st { position: absolute; left: 30px; right: 30px; top: 172px; opacity: 0; }
.unit { margin-left: auto; font-size: 14px; color: var(--muted); }
#is td { padding: 9px 16px; font-size: 17px; }
.gm { display: inline-block; margin-top: 14px; opacity: 0; }
`

function setup(ctx) {
  const { $, root } = ctx
  ctx.nav('research')
  const rows = [...root.getElementById('is').rows]
  return (t) => {
    $('q').textContent = typed('BOX', t, 0.4, 6)
    $('caret').style.opacity = t < 1.2 ? 1 : 0
    rise($('hit'), eo(seg(t, 1.2, 1.6)), 12)
    pointer(ctx, $('cur'), $('open'), t, 1.9, 2.6)

    // the statement replaces the search once the filing opens
    const open = eio(seg(t, 2.8, 3.3))
    $('hit').style.opacity = t > 2.8 ? 1 - open : $('hit').style.opacity
    $('st').style.opacity = open
    $('st').style.transform = `translateY(${(1 - open) * 20}px)`
    rows.forEach((r, i) => {
      if (i) rise(r, eo(seg(t, 3.1 + i * 0.1, 3.45 + i * 0.1)), 8)
    })
    ctx.ring($('hl'), $('i2'), t > 3 ? eo(seg(t, 4.8, 5.2)) : 0)
    rise($('gm'), eo(seg(t, 5.2, 5.6)), 8)

    push($('main'), t, 9.5, 560, 400)
  }
}

// Phone layout: drop the prior year and the unit label.
const phoneCss = `
#is th:nth-child(3), #is td:nth-child(3) { display: none; }
#is td { font-size: 16px; padding: 8px 12px; }
.unit { display: none; }
#st { left: 22px; right: 22px; top: 160px; }
.hit span:not(.btn) { font-size: 13px; }
.tab { font-size: 14px; padding: 7px 12px; }
`

export default {
  width: 1200,
  height: 750,
  total: 9.5,
  poster: 6.4,
  css,
  html:
    appChrome({ active: 'research', main }) +
    CURSOR.replace('class="cursor"', 'class="cursor" id="cur"'),
  setup,
  mobile: { width: 720, height: 740, css: PHONE_APP_CSS + phoneCss },
}
