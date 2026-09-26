/*
 * Spotlight: Reports your portfolio companies share. Cadence Labs publishes its
 * FY2026 report from its own ledger into the fund's graph; the fund opens it
 * rendered and asks why cash fell. Figures are Cadence Labs' compiled FY2026
 * report (examples/saas_startup_demo in robosystems), shared Sep 16, 2026.
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
  swap,
  typed,
} from './kit.js'

const IS = [
  ['Revenue', '$1,245,199', '$192,800'],
  ['Cost of revenue', '$266,400', '$39,600'],
  ['Gross profit', '$978,799', '$153,200', 'tot'],
  ['Operating expenses', '$2,045,211', '$357,067'],
  ['Operating loss', '($1,066,412)', '($203,867)', 'tot'],
  ['Cash, end of year', '$1,913,399', '$2,767,022', 'cash'],
]
const Q = 'Why did cash fall this year?'
const A = [
  'An operating loss of ',
  '$1.07M',
  ', softened by $232K more in prepaid subscriptions. Cash fell $854K to $1.91M.',
]

const list = `<div class="view" id="vl">${pageHeader('Portfolio Reports', 'Reports your portfolio companies share with the fund')}
  <div class="empty card" id="empty"><b>No reports received yet</b><span>When a portfolio company shares a report with this fund, it appears here.</span></div>
  <table id="tbl">
    <tr><th>Report</th><th>From</th><th>Period</th><th>Received</th></tr>
    <tr id="nr"><td><b>FY2026 Annual Report</b> <span class="badge b-v" id="nb">New</span></td><td>Cadence Labs, Inc.</td><td>Sep 2025 – Aug 2026</td><td>Sep 16, 2026</td></tr>
  </table>
</div>`

const detail = `<div class="view" id="vd">${pageHeader('FY2026 Annual Report', 'Cadence Labs, Inc. · shared from its ledger · Sep 16, 2026')}
  <table id="is">
    <tr><th>From the statements</th><th class="n">FY2026</th><th class="n">FY2025</th></tr>
    ${IS.map((r, i) => `<tr id="i${i}"${r[3] ? ` class="${r[3]}"` : ''}><td>${r[0]}</td><td class="n">${r[1]}</td><td class="n">${r[2]}</td></tr>`).join('')}
  </table>
  <div class="hl" id="hl"></div>
  <div class="askc card" id="askc"><div class="ah">Ask about this report</div>
    <div class="ask"><span id="q"></span><span class="caret" id="caret"></span></div>
    <div class="ans" id="ans"></div>
  </div>
</div>`

const css = `
.view { position: absolute; inset: 26px 30px; }
#main { padding: 0; }
.empty { padding: 30px; text-align: center; }
.empty b { display: block; font-size: 20px; margin-bottom: 8px; } .empty span { color: var(--muted); font-size: 16px; }
#tbl { position: absolute; left: 0; right: 0; top: 94px; opacity: 0; }
#tbl td { font-size: 17px; }
#nr td { cursor: default; }
#is td { padding: 10px 16px; font-size: 17px; }
#is tr.cash td { border-top: 2px solid #343a37; }
.askc { margin-top: 14px; padding: 14px 18px; opacity: 0; }
.ah { font-size: 13px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
.ask { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 10px; background: #13302a; border: 1px solid #1f4d40; font-size: 18px; min-height: 44px; }
.caret { width: 2px; height: 22px; background: var(--e300); }
.ans { font-size: 18px; line-height: 1.45; margin-top: 10px; min-height: 52px; }
.ans b { color: var(--c400); font-weight: 600; }
`

function setup(ctx) {
  const { $, root } = ctx
  ctx.nav('reports')
  const rows = [...root.getElementById('is').rows]
  return (t) => {
    // the report arrives in place of the empty state
    const arrive = eo(seg(t, 0.9, 1.4))
    $('empty').style.opacity = 1 - arrive
    rise($('tbl'), arrive, 16)
    swap($('nb'), t, 2.9, 'New', 'Opened', ['badge b-v', 'badge b-mute'])
    pointer(ctx, $('cur'), $('nr').cells[0], t, 1.9, 2.6)

    const open = eio(seg(t, 2.8, 3.3))
    $('vl').style.opacity = 1 - open
    $('vl').style.transform = `translateX(${-30 * open}px)`
    $('vd').style.opacity = open
    $('vd').style.transform = `translateX(${30 * (1 - open)}px)`
    rows.forEach((r, i) => {
      if (i) rise(r, eo(seg(t, 3.1 + i * 0.1, 3.45 + i * 0.1)), 8)
    })

    rise($('askc'), eo(seg(t, 4.2, 4.6)), 14)
    $('q').textContent = typed(Q, t, 4.6, 30)
    $('caret').style.opacity = t < 5.6 ? 1 : 0
    const n = Math.max(0, Math.floor((t - 6.0) * 55))
    let left = n
    $('ans').innerHTML = A.map((s, i) => {
      const part = s.slice(0, Math.max(0, left))
      left -= s.length
      return i === 1 ? `<b>${part}</b>` : part
    }).join('')
    ctx.ring($('hl'), $('i4'), t > 3 ? eo(seg(t, 6.2, 6.6)) : 0)

    push($('main'), t, 11, 520, 380)
  }
}

// Phone layout: drop the period column and the prior year.
const phoneCss = `
#tbl th:nth-child(3), #tbl td:nth-child(3) { display: none; }
#tbl td { font-size: 14px; }
#is th:nth-child(3), #is td:nth-child(3) { display: none; }
#is td { font-size: 16px; padding: 9px 12px; }
.view { inset: 20px 22px; }
.ans, .ask { font-size: 17px; }
`

export default {
  width: 1200,
  height: 750,
  total: 11,
  poster: 8.6,
  css,
  html:
    appChrome({ active: 'reports', main: list + detail }) +
    CURSOR.replace('class="cursor"', 'class="cursor" id="cur"'),
  setup,
  mobile: { width: 720, height: 740, css: PHONE_APP_CSS + phoneCss },
}
