/*
 * Spotlight: Ask the SEC filings in plain English. A question typed into the
 * RoboInvestor Console, the Analyst Operator's tool calls, and the answer as a
 * table. Figures are the latest 10-K of each filer on the SEC graph (fiscal
 * years ended Jan 31, 2026), in thousands.
 */
import {
  appChrome,
  dip,
  eo,
  pageHeader,
  PHONE_APP_CSS,
  push,
  rise,
  seg,
  spin,
  typed,
} from './kit.js'

const Q = 'Compare gross margin for Asana, Box and Domo in their latest 10-Ks.'
const CALLS = ['ASAN', 'BOX', 'DOMO']
const RES = [
  ['Asana', '790,806', '704,047', 89.0],
  ['Box', '1,177,253', '932,606', 79.2],
  ['Domo', '318,857', '239,122', 75.0],
]
const A = ['Asana leads at ', '89.0%', '. Box is at 79.2% and Domo at 75.0%.']

const main = `${pageHeader('RoboInvestor Console', 'Ask the SEC filings in plain English')}
  <div class="term card">
    <div class="ln you"><span class="pr">›</span><span id="q"></span><span class="caret" id="caret"></span></div>
    ${CALLS.map((c, i) => `<div class="ln call" id="c${i}"><span class="tn">financial-statement-analysis</span> <span class="arg">${c} · income statement · 10-K</span><span class="st" id="cs${i}"></span></div>`).join('')}
    <table id="res">
      <tr><th>Company</th><th class="n">Revenue</th><th class="n">Gross profit</th><th>Gross margin</th></tr>
      ${RES.map((r, i) => `<tr id="r${i}"><td>${r[0]}</td><td class="n">${r[1]}</td><td class="n">${r[2]}</td><td><span class="sh"><i id="s${i}"></i></span><em>${r[3].toFixed(1)}%</em></td></tr>`).join('')}
    </table>
    <div class="ans" id="ans"></div>
  </div>`

const css = `
.term { padding: 18px 20px; }
.ln { font-size: 19px; display: flex; align-items: center; gap: 10px; min-height: 34px; }
.you { padding: 10px 14px; border-radius: 10px; background: #13302a; border: 1px solid #1f4d40; margin-bottom: 12px; }
.pr { color: var(--e400); font-weight: 700; }
.caret { width: 2px; height: 24px; background: var(--e300); }
.call { font: 15px var(--mono); color: var(--muted); opacity: 0; min-height: 28px; }
.call .tn { color: var(--e300); }
.call .st { margin-left: auto; }
#res { margin-top: 14px; }
#res tr { opacity: 0; }
#res tr:first-child { opacity: 1; }
#res td { padding: 11px 16px; }
.sh { display: inline-block; width: 150px; height: 10px; border-radius: 5px; background: #29302d; margin-right: 12px; vertical-align: middle; overflow: hidden; }
.sh i { display: block; height: 100%; background: linear-gradient(90deg, var(--e500), var(--c400)); }
#res em { font-style: normal; font-family: var(--mono); font-size: 16px; }
.ans { font-size: 19px; line-height: 1.45; margin-top: 14px; min-height: 28px; }
.ans b { color: var(--c400); font-weight: 600; }
`

function setup(ctx) {
  const { $, root } = ctx
  ctx.nav('console')
  const head = root.getElementById('res').rows[0]
  return (t) => {
    $('q').textContent = typed(Q, t, 0.3, 34)
    $('caret').style.opacity = 1 - seg(t, 2.4, 2.6)
    CALLS.forEach((_, i) => {
      const at = 2.7 + i * 0.35
      rise($('c' + i), eo(seg(t, at, at + 0.3)), 8)
      const done = t > at + 0.9
      $('cs' + i).innerHTML = done
        ? '<span style="color:var(--good)">✓ done</span>'
        : `${spin(t)} running`
      $('cs' + i).style.opacity = dip(t, at + 0.9)
    })
    head.style.opacity = seg(t, 4.1, 4.4)
    RES.forEach((r, i) => {
      const p = eo(seg(t, 4.3 + i * 0.18, 4.7 + i * 0.18))
      rise($('r' + i), p, 10)
      // bars span 60% to 100% margin, so the differences read
      $('s' + i).style.width = ((r[3] - 60) / 40) * 100 * p + '%'
    })
    const n = Math.max(0, Math.floor((t - 5.6) * 55))
    let left = n
    $('ans').innerHTML = A.map((s, i) => {
      const part = s.slice(0, Math.max(0, left))
      left -= s.length
      return i === 1 ? `<b>${part}</b>` : part
    }).join('')
    push($('main'), t, 9.5, 520, 420)
  }
}

// Phone layout: drop the revenue column.
const phoneCss = `
.ln { font-size: 17px; }
.call { font-size: 13px; } .call .arg { display: none; }
#res th:nth-child(2), #res td:nth-child(2) { display: none; }
#res td { font-size: 15px; padding: 9px 10px; }
.sh { width: 80px; }
.ans { font-size: 17px; }
`

export default {
  width: 1200,
  height: 750,
  total: 9.5,
  poster: 7.4,
  css,
  html: appChrome({ active: 'console', main }),
  setup,
  mobile: { width: 720, height: 740, css: PHONE_APP_CSS + phoneCss },
}
