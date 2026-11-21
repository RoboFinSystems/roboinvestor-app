/*
 * Spotlight: A report loaded from a file. Halyard Robotics keeps its books
 * elsewhere and sends a workbook; the fund's AI chat reads it into the fund's
 * graph, each value with the cell it came from, checks every total on a dry
 * run, and saves it. Halyard is a demo company in the Meridian Ventures Fund I
 * portfolio (examples/roboinvestor_demo in robosystems); its Q3 2026 package
 * and every figure in it are illustrative.
 */
import { dip, eio, eo, rise, seg, spin, swap, tile, typed } from './kit.js'

// [line, actual, budget, total?] in sheet rows 2 to 6
const PL = [
  ['Revenue', '412,500', '450,000'],
  ['Cost of revenue', '268,100', '270,000'],
  ['Gross profit', '144,400', '180,000', 1],
  ['Operating expenses', '506,900', '480,000'],
  ['Operating loss', '(362,500)', '(300,000)', 1],
]
const FILE = 'Halyard_Q3_2026_package.xlsx'
const Q = "Load Halyard's Q3 package into the fund."
const A = [
  'Loaded: 10 values, each traced to its cell, and ',
  'every total foots',
  '. I left the budget column out.',
]

const html = `
<div class="pane" id="chat" data-loop>
  <div class="hd"><div class="t">Your AI chat · connected over MCP</div>
    <span class="chip"><span class="dot"></span>RoboInvestor · Fund I</span></div>
  <div class="body">
    <div class="ub"><div class="attach"><i class="xl">XLS</i>${FILE}</div><div id="q"></div></div>
    <div class="tool" id="t1"><div class="tn"><span>ingest-report · dry run</span><span class="st" id="s1"></span></div><div class="tr" id="r1"></div></div>
    <div class="tool" id="t2"><div class="tn"><span>ingest-report</span><span class="st" id="s2"></span></div><div class="tr" id="r2"></div></div>
    <div class="ans" id="ans"></div>
  </div>
</div>

<div class="pane" id="sheet" data-loop>
  <div class="sbar"><i class="xl">XLS</i><span>${FILE}</span><span class="stab on">P&amp;L</span><span class="stab">Balance Sheet</span></div>
  <div class="grid" id="grid">
    <div class="gr lt"><span></span><span>A</span><span>B</span><span class="bud">C</span></div>
    <div class="gr hdr"><span>1</span><span></span><span class="n">Q3 2026 Actual</span><span class="n bud" id="bh">Q3 2026 Budget</span></div>
    ${PL.map(
      (r, i) =>
        `<div class="gr${r[3] ? ' tot' : ''}"><span>${i + 2}</span><span>${r[0]}</span><span class="n">${r[1]}</span><span class="n bud">${r[2]}</span></div>`
    ).join('')}
    <div class="hl" id="hl"></div>
  </div>
</div>

<div class="pane" id="rep" data-loop>
  <div class="wbar">${tile(28, 8)}<span class="wm">RoboInvestor</span><span class="badge b-warn" id="rb">Dry run</span></div>
  <div class="rt"><b>Q3 2026 Quarterly Package</b><span>Halyard Robotics, Inc. · from a file</span></div>
  ${PL.map(
    (r, i) =>
      `<div class="fr${r[3] ? ' tot' : ''}" id="f${i}"><span>${r[0]}</span><span class="src">P&amp;L!B${i + 2}</span><span class="n">${r[1].startsWith('(') ? `($${r[1].slice(1)}` : `$${r[1]}`}</span><span class="ck" id="k${i}">${r[3] ? '✓ foots' : ''}</span></div>`
  ).join('')}
  <div class="foot" id="foot">Saved to Portfolio Reports · 10 values · 2 statements</div>
</div>`

const ROW = 30

const css = `
.pane { position: absolute; border-radius: 16px; overflow: hidden; }
#chat { left: 22px; top: 22px; width: 430px; height: 706px; background: #0b100e; border: 1px solid var(--line); }
#chat .hd { height: 84px; border-bottom: 1px solid var(--line); padding: 14px 18px; }
#chat .hd .t { font-size: 15px; color: var(--muted); margin-bottom: 9px; }
.chip { display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px; border-radius: 999px; border: 1px solid var(--line); background: var(--card2); font-size: 14px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--good); }
.body { padding: 18px; display: flex; flex-direction: column; gap: 14px; }
.ub { max-width: 370px; font-size: 21px; padding: 12px 16px; min-height: 0; border-radius: 18px 18px 6px 18px; }
.attach { display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px; margin-bottom: 8px; border: 1px solid #1f4d40; border-radius: 10px; font: 13px var(--mono); color: #cad3cf; }
.xl { font-style: normal; padding: 2px 6px; border-radius: 4px; color: #fff; font: 700 11px var(--body); background: #1d7a46; }
.tool { padding: 11px 14px; border-radius: 12px; opacity: 0; }
.tool .tn { font-size: 16px; white-space: nowrap; } .tool .st { font-size: 14px; } .tool .tr { font-size: 16px; margin-top: 6px; min-height: 21px; }
.ans { font-size: 20px; line-height: 1.45; min-height: 87px; }

#sheet { left: 472px; top: 22px; width: 706px; height: 262px; background: #fff; border: 1px solid #38403c; color: #1c1b22; }
.sbar { height: 42px; display: flex; align-items: center; gap: 10px; padding: 0 14px; background: #323835; color: #cad3cf; font: 14px var(--mono); }
.sbar span:nth-child(2) { margin-right: auto; }
.stab { padding: 5px 12px; border-radius: 7px 7px 0 0; align-self: flex-end; font: 600 13px var(--body); background: #3f4642; color: #cad3cf; }
.stab.on { background: #fff; color: #1c1b22; }
.grid { position: relative; }
.gr { display: grid; grid-template-columns: 40px 1fr 160px 160px; height: ${ROW}px; align-items: center; font-size: 15px; border-bottom: 1px solid #dfe4e1; }
.gr span { padding: 0 12px; height: 100%; display: flex; align-items: center; border-right: 1px solid #dfe4e1; }
.gr span.n { justify-content: flex-end; font-family: var(--mono); font-size: 14px; }
.gr span:first-child { justify-content: center; padding: 0; background: #eef1ef; color: #6b756f; font-size: 12px; }
.gr.lt { height: 24px; background: #eef1ef; color: #6b756f; font-size: 12px; }
.gr.lt span { justify-content: center; }
.gr.hdr { font-weight: 700; font-size: 13px; }
.gr.hdr span.n { font-family: var(--body); font-size: 13px; }
.gr.tot { font-weight: 700; }
#sheet .hl { left: 40px; right: 160px; height: ${ROW}px; border-radius: 4px; border-color: var(--e600); background: rgba(16,185,129,.12); }

#rep { left: 472px; top: 300px; width: 706px; height: 428px; background: #000; border: 1px solid var(--e500); }
.wbar { height: 52px; display: flex; align-items: center; gap: 10px; padding: 0 18px; border-bottom: 1px solid #1c211f; }
.wbar .wm { font: 700 19px var(--display); margin-right: auto; }
.wbar .badge { font-size: 13px; padding: 5px 10px; }
.rt { display: flex; align-items: baseline; gap: 12px; padding: 14px 18px 10px; }
.rt b { font-size: 19px; } .rt span { font-size: 14px; color: var(--muted); }
.fr { display: grid; grid-template-columns: 1fr 96px 150px 84px; align-items: center; height: 46px; margin: 0 18px 6px; padding: 0 14px; border-radius: 9px; background: var(--row); font-size: 17px; opacity: 0; }
.fr.tot { font-weight: 700; }
.fr .n { text-align: right; font-family: var(--mono); font-size: 16px; }
.src { font: 600 12px var(--mono); color: var(--c300); background: rgba(34,211,238,.12); padding: 4px 0; border-radius: 6px; text-align: center; }
.ck { text-align: right; font-size: 13px; font-weight: 700; color: var(--good); opacity: 0; }
.foot { margin: 10px 18px 0; font-size: 14px; color: var(--muted); opacity: 0; }
`

const SCAN = 2.0
const STEP = 0.6
const CHECK = 6.1
const SAVED = 7.5

const status = (el, t, at, busy, done) => {
  el.innerHTML =
    t > at
      ? `<span style="color:var(--good)">✓ ${done}</span>`
      : `<span style="color:var(--muted)">${spin(t)} ${busy}</span>`
  el.style.opacity = dip(t, at)
}

function setup(ctx) {
  const { $, root } = ctx
  const budget = [...root.querySelectorAll('.bud')]
  const firstRow = root.querySelectorAll('.gr')[2]
  return (t) => {
    rise($('chat'), eo(seg(t, 0, 0.5)), 24)
    rise($('sheet'), eo(seg(t, 0.1, 0.6)), 24)
    rise($('rep'), eo(seg(t, 0.2, 0.7)), 24)

    $('q').textContent = typed(Q, t, 0.7, 40)

    // the dry run reads the sheet a row at a time; the budget column is left out
    rise($('t1'), eo(seg(t, 1.6, 1.9)), 10)
    status($('s1'), t, CHECK, 'reading', 'totals foot')
    const read = Math.min(PL.length, Math.max(0, (t - SCAN) / STEP))
    $('r1').textContent =
      t > CHECK
        ? '10 values · 2 statements · each with its cell'
        : `${Math.min(10, Math.round(read * 2))} of 10 values read`
    $('r1').style.opacity = seg(t, SCAN, SCAN + 0.3) * dip(t, CHECK)

    const dim = 1 - 0.65 * eio(seg(t, 1.8, 2.3))
    budget.forEach((el) => (el.style.opacity = dim))
    swap($('bh'), t, 2.05, 'Q3 2026 Budget', 'Budget · left out')
    $('bh').style.opacity = dim * dip(t, 2.05)

    let pos = 0
    for (let i = 1; i < PL.length; i++)
      pos += eio(seg(t, SCAN + i * STEP - 0.25, SCAN + i * STEP))
    $('hl').style.top = firstRow.offsetTop + pos * ROW + 'px'
    $('hl').style.opacity =
      seg(t, SCAN - 0.2, SCAN) *
      (1 - seg(t, SCAN + 5 * STEP, SCAN + 5.5 * STEP))

    PL.forEach((r, i) => {
      rise(
        $('f' + i),
        eo(seg(t, SCAN + 0.2 + i * STEP, SCAN + 0.55 + i * STEP)),
        10
      )
      if (r[3])
        $('k' + i).style.opacity = eo(seg(t, 5.2 + i * 0.15, 5.5 + i * 0.15))
    })

    // then the same request without the dry run
    rise($('t2'), eo(seg(t, 6.5, 6.8)), 10)
    status($('s2'), t, SAVED, 'writing', 'saved')
    $('r2').textContent = 'Halyard Robotics · Q3 2026'
    $('r2').style.opacity = seg(t, SAVED, SAVED + 0.3)
    swap($('rb'), t, SAVED, 'Dry run', 'Saved · from a file', [
      'badge b-warn',
      'badge b-good',
    ])
    $('foot').style.opacity = eo(seg(t, SAVED + 0.1, SAVED + 0.5))

    const n = Math.max(0, Math.floor((t - 7.9) * 55))
    let left = n
    $('ans').innerHTML = A.map((s, i) => {
      const part = s.slice(0, Math.max(0, left))
      left -= s.length
      return i === 1 ? `<b>${part}</b>` : part
    }).join('')
  }
}

// Phone layout: the chat over the report; the workbook itself is dropped.
const phoneCss = `
#sheet { display: none; }
#chat { left: 16px; top: 16px; width: 688px; height: 318px; }
#chat .hd { height: 46px; padding: 10px 16px; display: flex; align-items: center; gap: 12px; }
#chat .hd .t { margin: 0 auto 0 0; font-size: 15px; }
.body { padding: 12px 16px; gap: 10px; }
.ub { max-width: 520px; font-size: 20px; padding: 10px 14px; }
.tool { padding: 9px 14px; } .tool .tn { font-size: 16px; } .tool .st { font-size: 15px; }
.tool .tr { font-size: 15px; margin-top: 3px; }
.ans { display: none; }
#rep { left: 16px; top: 346px; width: 688px; height: 378px; }
.wbar { height: 46px; }
.rt { padding: 10px 16px 8px; } .rt b { font-size: 18px; } .rt span { font-size: 13px; }
.fr { grid-template-columns: 1fr 92px 136px 76px; height: 44px; margin: 0 14px 5px; padding: 0 12px; font-size: 16px; }
.fr .n { font-size: 15px; }
.foot { margin: 6px 16px 0; }
`

export default {
  width: 1200,
  height: 750,
  total: 12,
  poster: 10.6,
  css,
  html,
  setup,
  mobile: { width: 720, height: 740, css: phoneCss },
}
