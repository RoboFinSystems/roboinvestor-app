/*
 * Spotlight: Holdings grouped by company. The fund's AI chat applies one
 * portfolio update and the page follows it: a new LLC position, a warrant
 * beside the Series A, a 409A re-mark, and an exit. Figures are the Meridian
 * Ventures Fund I demo portfolio (examples/roboinvestor_demo in robosystems).
 */
import {
  appChrome,
  eio,
  eo,
  money,
  pageHeader,
  PHONE_APP_CSS,
  push,
  rise,
  seg,
  steps,
  swap,
} from './kit.js'

const M = (v) => money(v, 0)

// [id, security, type, quantity, cost, value, change]
const GROUPS = [
  [
    'Cadence Labs, Inc.',
    'linked',
    [
      [
        'a',
        'Series A Preferred',
        'Preferred',
        '3,205,128 sh',
        10000000,
        14500000,
      ],
      ['w', 'Bridge Warrant', 'Warrant', '120,000 sh', 0, 54000, 'add'],
    ],
  ],
  [
    'Halyard Robotics, Inc.',
    '',
    [['h', 'SAFE (post-money)', 'SAFE', '$750,000', 750000, 750000]],
  ],
  [
    'Thornbury Materials LLC',
    '',
    [
      [
        't',
        'Class A Units',
        'LLC Unit',
        '140,000 units',
        2100000,
        2100000,
        'add',
      ],
    ],
    'add',
  ],
  [
    'Alder Grove Bio, Inc.',
    '',
    [
      [
        'g',
        'Series Seed Preferred',
        'Preferred',
        '1,123,595 sh',
        1000000,
        1000000,
        'out',
      ],
    ],
    'out',
  ],
]

const REMARK = 17800000
const COST = [11750000, 12850000]
const VALUE = [16250000, 20704000]

const row = ([id, name, type, qty, cost, value]) =>
  `<div class="r sec" id="r${id}"><span>${name}</span><span><i class="ty">${type}</i></span><span class="n">${qty}</span>
   <span class="n">${M(cost)}</span><span class="n" id="v${id}">${M(value)}</span></div>`

const main = `${pageHeader('Portfolio', 'Fund I — Core Positions · early-stage venture')}
  <div class="strip card">
    <span><label>Positions</label><div id="npos">3</div></span>
    <span><label>Cost basis</label><div id="cost">${M(COST[0])}</div></span>
    <span><label>Current value</label><div id="val">${M(VALUE[0])}</div></span>
    <span><label>Multiple</label><div id="moic">1.38x</div></span>
  </div>
  <div class="grid">
    <div class="r hd"><span>Security</span><span>Type</span><span class="n">Quantity</span><span class="n">Cost Basis</span><span class="n">Current Value</span></div>
    ${GROUPS.map(
      ([co, tag, rows], gi) => `<div class="grp" id="grp${gi}">
        <div class="r co"><span>${co}${tag ? ' <em class="lk">Books on RoboLedger</em>' : ''}</span></div>
        ${rows.map(row).join('')}</div>`
    ).join('')}
  </div>
  <div class="toast card" id="toast"><span class="tn">update-portfolio-block</span><span id="tst" class="badge b-v">applying</span><span class="tsub">from your AI chat · 4 changes, one envelope</span></div>`

const css = `
.strip { display: flex; gap: 40px; padding: 14px 22px; margin-bottom: 16px; }
.strip label { display: block; font-size: 12px; letter-spacing: .08em; color: var(--muted); text-transform: uppercase; margin-bottom: 4px; }
.strip div { font: 700 21px var(--mono); }
.grid { border-radius: 10px; overflow: hidden; }
.r { display: grid; grid-template-columns: 1.9fr 0.9fr 1.2fr 1.1fr 1.8fr; align-items: center; padding: 0 16px;
  height: 40px; font-size: 16px; background: var(--row); border-top: 1px solid #171c1a; overflow: hidden; }
.r .n { white-space: nowrap; text-align: right; font-family: var(--mono); font-size: 15px; }
.r.hd { background: #343a37; color: #c5cfcb; font-size: 13px; letter-spacing: .06em; text-transform: uppercase; font-weight: 600; }
.r.co { background: #151a18; font-weight: 700; font-size: 16px; grid-template-columns: 1fr; }
.r.sec span:first-child { padding-left: 18px; }
.ty { font-style: normal; font-size: 13px; padding: 3px 8px; border-radius: 6px; background: #29302d; color: #cad3cf; font-weight: 600; }
.lk { font-style: normal; margin-left: 10px; font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 6px;
  background: rgba(34,211,238,.15); color: var(--c300); }
.mk { display: inline-block; margin-right: 10px; font: 700 12px var(--body); padding: 2px 7px; border-radius: 6px;
  background: rgba(34,211,238,.15); color: var(--c300); vertical-align: 1px; }
.grp { overflow: hidden; }
.toast { position: absolute; right: 30px; bottom: 26px; padding: 14px 18px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px; opacity: 0; }
.toast .tn { font: 600 16px var(--mono); color: var(--e300); }
.toast .tsub { width: 100%; font-size: 14px; color: var(--muted); }
`

const H = 40
const lerp = (a, b, p) => a + (b - a) * p

function setup(ctx) {
  const { $ } = ctx
  ctx.nav('portfolio')
  return (t) => {
    rise($('toast'), eo(seg(t, 1.6, 2.0)) * (1 - seg(t, 7.6, 8.0)), 16)
    steps(
      $('tst'),
      t,
      [5.0],
      ['applying', '✓ applied'],
      ['badge b-v', 'badge b-good']
    )

    // additions open to their height; the exit closes
    const tIn = eio(seg(t, 2.4, 2.9))
    $('grp2').style.height = H * 2 * tIn + 'px'
    $('grp2').style.opacity = tIn
    const wIn = eio(seg(t, 2.9, 3.4))
    $('rw').style.height = H * wIn + 'px'
    $('rw').style.opacity = wIn

    const remarked = swap($('va'), t, 3.9)
    $('va').innerHTML = remarked
      ? `<span class="mk">409A refresh</span>${M(REMARK)}`
      : M(14500000)

    const out = eio(seg(t, 4.4, 5.0))
    $('grp3').style.opacity = 1 - out
    $('grp3').style.height = H * 2 * (1 - out) + 'px'

    const p = eio(seg(t, 2.4, 5.0))
    $('cost').textContent = M(Math.round(lerp(COST[0], COST[1], p)))
    $('val').textContent = M(Math.round(lerp(VALUE[0], VALUE[1], p)))
    $('moic').textContent =
      (lerp(VALUE[0], VALUE[1], p) / lerp(COST[0], COST[1], p)).toFixed(2) + 'x'
    swap($('npos'), t, 5.0, '3', '4')
    $('moic').style.color = t > 5.0 ? 'var(--good)' : ''

    push($('main'), t, 9.5, 560, 360)
  }
}

// Phone layout: drop the type and quantity columns.
const phoneCss = `
.strip { gap: 18px; padding: 12px 14px; flex-wrap: wrap; } .strip div { font-size: 17px; }
.strip span:first-child { display: none; }
.r { grid-template-columns: 1.8fr 1.2fr 1.4fr; font-size: 14px; padding: 0 10px; }
.r span:nth-child(2), .r span:nth-child(3) { display: none; }
.r .n { font-size: 13px; }
.r.sec span:first-child { padding-left: 10px; }
.mk { display: none; }
.lk { display: none; }
.toast { left: 22px; right: 22px; bottom: 18px; }
`

export default {
  width: 1200,
  height: 750,
  total: 9.5,
  poster: 6.2,
  css,
  html: appChrome({ active: 'portfolio', main }),
  setup,
  mobile: { width: 720, height: 740, css: PHONE_APP_CSS + phoneCss },
}
