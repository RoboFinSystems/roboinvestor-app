/*
 * Contrast: last year's update arrives as a PDF and gets retyped into the fund
 * tracker, while this year's report arrives in RoboInvestor as data from the
 * company's own ledger and answers a question. Figures are Cadence Labs'
 * compiled FY2025 and FY2026 reports (examples/saas_startup_demo in
 * robosystems); the PDF and the tracker are illustrative.
 */
import { blurIn, eio, eo, rise, seg, tile, typed } from './kit.js'

const PDF = [
  ['Revenue', '$192,800'],
  ['Cash', '$2,767,022'],
  ['Deferred revenue', '$922,022'],
]
const LIVE = [
  ['Revenue', '$1,245,199'],
  ['Gross margin', '78.6%'],
  ['Cash', '$1,913,399'],
  ['Deferred revenue', '$1,154,000'],
]
const Q = "What's their monthly burn?"
const A = ['About ', '$71K a month', ': roughly 27 months of cash left.']

const html = `
<div class="half" id="lh" data-loop>
  <div class="cap" id="capl">A PDF you retype</div>
  <div class="viewer" id="pdf">
    <div class="vbar"><span class="pdfic">PDF</span>Cadence_FY2025_update.pdf</div>
    <div class="paper" id="paper">
      <div class="ph">Cadence Labs · Annual update</div>
      <div class="ps">Fiscal year ended August 31, 2025</div>
      ${PDF.map((l) => `<div class="pl"><span>${l[0]}</span><b>${l[1]}</b></div>`).join('')}
    </div>
    <div class="sheet"><span class="xl">XLS</span>Fund_I_tracker_v14.xlsx · Cadence row
      <div class="cells">${PDF.map((l, i) => `<span class="cell"><label>${l[0]}</label><b id="c${i}"></b></span>`).join('')}</div>
    </div>
  </div>
  <div class="age" id="age"></div>
</div>

<div class="half" id="rh" data-loop>
  <div class="cap grad" id="capr">A report you can ask</div>
  <div class="win" id="win">
    <div class="wbar">${tile(30, 8)}<span class="wm">RoboInvestor</span><span class="live"><i></i><b>FY2026</b> · shared from Cadence's ledger</span></div>
    <div class="wbody">
      ${LIVE.map((l, i) => `<div class="wl" id="wl${i}"><span>${l[0]}</span><b>${l[1]}</b></div>`).join('')}
      <div class="ask" id="ask"><span class="pr">›</span><span id="q"></span></div>
      <div class="ans" id="ans"></div>
    </div>
  </div>
</div>`

const css = `
.stage { background: transparent; }
.half { position: absolute; top: 0; bottom: 0; width: 720px; }
#lh { left: 40px; } #rh { right: 40px; }
.cap { font: 700 34px var(--display); margin: 8px 0 22px; }
#lh .cap { color: #d3dbd8; }
.viewer { height: 560px; border-radius: 20px; background: #282d2b; border: 1px solid #38403c; overflow: hidden; }
.vbar { height: 50px; display: flex; align-items: center; gap: 12px; padding: 0 18px; background: #323835; font: 17px var(--mono); color: #cad3cf; }
.pdfic, .xl { padding: 3px 7px; border-radius: 5px; color: #fff; font: 700 13px var(--body); }
.pdfic { background: #d9443b; } .xl { background: #1d7a46; margin-right: 10px; }
.paper { margin: 24px auto 0; width: 600px; height: 270px; background: #f6f3ea; border-radius: 4px; padding: 26px 36px; color: #1c1b22; }
.ph { font: 700 23px var(--body); }
.ps { font-size: 15px; color: #6b6780; margin: 6px 0 16px; }
.pl { display: flex; justify-content: space-between; padding: 11px 0; border-top: 1px solid #ddd8ca; font-size: 20px; }
.pl b { font-family: var(--mono); font-weight: 600; }
.sheet { margin: 18px 40px 0; font: 15px var(--mono); color: #cad3cf; }
.cells { display: flex; gap: 10px; margin-top: 10px; }
.cell { flex: 1; background: #fff; color: #1c1b22; border: 1px solid #b9c2be; border-radius: 3px; padding: 6px 10px; }
.cell label { display: block; font: 12px var(--body); color: #6b6780; }
.cell b { display: block; font: 600 17px var(--mono); min-height: 22px; }
.age { margin-top: 18px; font-size: 22px; color: var(--muted); }
.age b { color: var(--bad); }
.win { height: 560px; border-radius: 20px; background: #000; border: 1px solid var(--e500); overflow: hidden; }
.wbar { height: 58px; display: flex; align-items: center; gap: 12px; padding: 0 20px; border-bottom: 1px solid #1c211f; }
.wbar .wm { font: 700 21px var(--display); }
.live { margin-left: auto; display: flex; align-items: center; gap: 8px; font-size: 16px; color: var(--muted); }
.live i { width: 10px; height: 10px; border-radius: 50%; background: var(--good); }
.live b { color: var(--ink); font-weight: 600; }
.wbody { padding: 22px 26px; }
.wl { display: flex; justify-content: space-between; padding: 14px 16px; border-radius: 10px; font-size: 21px; background: var(--row); margin-bottom: 8px; opacity: 0; }
.wl b { font-family: var(--mono); font-weight: 600; }
.ask { display: flex; gap: 10px; align-items: center; margin-top: 16px; padding: 12px 16px; border-radius: 12px; background: #13302a; border: 1px solid #1f4d40; font-size: 20px; min-height: 50px; opacity: 0; }
.ask .pr { color: var(--e400); font-weight: 700; }
.ans { font-size: 20px; line-height: 1.4; margin-top: 12px; min-height: 30px; }
.ans b { color: var(--c400); font-weight: 600; }
`

const TOTAL = 10

const mixHex = (a, b, p) => {
  const c = (h, i) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16)
  return `rgb(${[0, 1, 2].map((i) => Math.round(c(a, i) + (c(b, i) - c(a, i)) * p)).join(',')})`
}

function setup(ctx) {
  const { $ } = ctx
  return (t) => {
    rise($('pdf'), eo(seg(t, 0, 0.5)), 30)
    rise($('win'), eo(seg(t, 0.15, 0.65)), 30)
    blurIn($('capl'), seg(t, 0.05, 0.6))
    blurIn($('capr'), seg(t, 0.2, 0.75))

    // the tracker is filled by hand, one cell at a time, while the update ages
    PDF.forEach((l, i) => {
      $('c' + i).textContent = typed(l[1], t, 1.0 + i * 1.1, 9)
    })
    const p = eio(seg(t, 0.8, 4.8))
    const months = Math.round(12 * p)
    $('age').innerHTML =
      `Received Sep 2025 · <b>${months} month${months === 1 ? '' : 's'} old</b>`
    // the page yellows as it ages: authored colours, not a filter
    $('paper').style.background = mixHex('#f6f3ea', '#ddd3b8', p)

    // this year's report lands as data
    LIVE.forEach((_, i) =>
      rise($('wl' + i), eo(seg(t, 1.2 + i * 0.25, 1.6 + i * 0.25)), 10)
    )
    rise($('ask'), eo(seg(t, 5.0, 5.4)), 10)
    $('q').textContent = typed(Q, t, 5.2, 30)
    const n = Math.max(0, Math.floor((t - 6.3) * 55))
    let left = n
    $('ans').innerHTML = A.map((s, i) => {
      const part = s.slice(0, Math.max(0, left))
      left -= s.length
      return i === 1 ? `<b>${part}</b>` : part
    }).join('')
  }
}

// Phone layout: the two halves stack.
const phoneCss = `
#lh { left: 20px; top: 0; width: 680px; }
#rh { left: 20px; right: auto; top: 560px; width: 680px; }
.cap { font-size: 28px; margin: 4px 0 12px; }
.viewer { height: 440px; }
.vbar { height: 44px; font-size: 15px; }
.paper { margin-top: 16px; width: 600px; height: 230px; padding: 18px 26px; }
.ph { font-size: 20px; } .ps { font-size: 14px; margin: 4px 0 10px; }
.pl { font-size: 18px; padding: 8px 0; }
.sheet { margin: 14px 40px 0; font-size: 13px; }
.age { margin-top: 10px; font-size: 19px; }
.win { height: 460px; }
.wbar { height: 52px; }
.live { font-size: 14px; }
.wbody { padding: 16px 18px; }
.wl { font-size: 19px; padding: 11px 14px; margin-bottom: 6px; }
.ask { font-size: 18px; padding: 10px 14px; min-height: 44px; }
.ans { font-size: 18px; margin-top: 8px; }
`

export default {
  width: 1600,
  height: 720,
  total: TOTAL,
  poster: 8.5,
  css,
  html,
  setup,
  mobile: { width: 720, height: 1100, css: phoneCss },
}
