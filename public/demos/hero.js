/*
 * Hero pitch: who you are, the problem, the turn, then five beats of asking
 * the AI while RoboInvestor changes beside it. Figures are the Meridian
 * Ventures Fund I demo portfolio and the FY2026 report its portfolio company
 * Cadence Labs shares from its ledger (examples/roboinvestor_demo and
 * examples/saas_startup_demo in robosystems), and gross margin and growth from
 * the latest 10-Ks of Asana, Box and Domo on the SEC graph. The LP message and
 * the inbox of PDF updates are illustrative.
 */
import {
  appChrome,
  blurIn,
  clamp01,
  CURSOR,
  dip,
  eio,
  eo,
  money,
  pageHeader,
  PHONE_APP_CSS,
  pointer,
  rise,
  seg,
  spin,
  swap,
  tile,
  typed,
} from './kit.js'

const M = (v) => money(v, 0)

const BEATS = [
  {
    k: 'portfolio',
    q: "What's Fund I marked at today?",
    tool: 'query-graphql',
    res: 'holdings · Fund I — Core Positions',
    a: ['$12.85M in, marked at ', '$17.40M', '. Cadence Labs is 84% of it.'],
  },
  {
    k: 'reports',
    q: 'Did Cadence send its annual numbers?',
    tool: 'financial-statement-analysis',
    res: 'Cadence Labs · FY2026 · shared Sep 16',
    a: [
      'Yes, straight from their ledger. Revenue grew from $193K to ',
      '$1.25M',
      '.',
    ],
  },
  {
    k: 'research',
    q: 'How does that compare to public SaaS?',
    tool: 'financial-statement-analysis',
    res: 'ASAN · BOX · DOMO · latest 10-K each',
    sec: true,
    a: [
      'Gross margin is on par: ',
      '78.6% vs a 79.2% median',
      '. Cadence grew 546%, the peers 8%.',
    ],
  },
  {
    k: 'reports',
    q: 'How long does their cash last?',
    tool: 'financial-statement-analysis',
    res: 'Cadence Labs · balance sheet · FY2026',
    a: [
      'Cash fell $854K over the year to $1.91M. At that burn, ',
      'about 27 months',
      '.',
    ],
  },
  {
    k: 'portfolio',
    q: 'Mark Cadence to its new 409A.',
    tool: 'query-graphql',
    res: 'Cadence Series A · current mark $14,500,000',
    a: [
      'Series A from $14.5M to ',
      '$17.8M',
      ', source 409A refresh. Apply it?',
    ],
    approve: true,
  },
]

// The step label sits at the head of each exchange, where the eye already is.
const STEP = [
  '<i>01</i>Check the marks.',
  '<i>02</i>Get their numbers.',
  '<i>03</i>Compare them.',
  '<i>04</i>Test the runway.',
  '<i>05</i>Update the mark. <em class="grad">You approve.</em>',
]

const chatGroups = BEATS.map(
  (b, i) => `
  <div class="grp" id="g${i}">
    <div class="step">${STEP[i]}</div>
    <div class="ub" id="q${i}"></div>
    <div class="tool" id="tl${i}"><div class="tn"><span>${b.sec ? 'sec · ' : ''}${b.tool}</span><span class="st" id="ts${i}"></span></div><div class="tr" id="tr${i}"></div></div>
    <div class="ans" id="an${i}"></div>
    ${
      b.approve
        ? `<div class="approve" id="ap"><span class="btn go lg" id="apgo">Apply</span><span class="btn ghost lg">Not yet</span></div>
    <div class="tool" id="tl5"><div class="tn"><span>update-portfolio-block</span><span class="st" id="ts5"></span></div><div class="tr" id="tr5"></div></div>`
        : ''
    }
  </div>`
).join('')

const holdings = (id) => `
  <div class="strip card">
    <span><label>Cost basis</label><div>${M(12850000)}</div></span>
    <span><label>Current value</label><div id="${id}val">${M(17404000)}</div></span>
    <span><label>Multiple</label><div id="${id}moic">1.35x</div></span>
  </div>
  <table>
    <tr><th>Security</th><th>Type</th><th class="n">Cost Basis</th><th class="n">Current Value</th></tr>
    <tr class="co"><td colspan="4">Cadence Labs, Inc. <span class="badge b-v sm">Books on RoboLedger</span></td></tr>
    <tr id="${id}ca"><td class="in">Series A Preferred</td><td>Preferred</td><td class="n">${M(10000000)}</td><td class="n" id="${id}cav">${M(14500000)}</td></tr>
    <tr><td class="in">Bridge Warrant</td><td>Warrant</td><td class="n">$0</td><td class="n">${M(54000)}</td></tr>
    <tr class="co"><td colspan="4">Halyard Robotics, Inc.</td></tr>
    <tr><td class="in">SAFE (post-money)</td><td>SAFE</td><td class="n">${M(750000)}</td><td class="n">${M(750000)}</td></tr>
    <tr class="co"><td colspan="4">Thornbury Materials LLC</td></tr>
    <tr><td class="in">Class A Units</td><td>LLC Unit</td><td class="n">${M(2100000)}</td><td class="n">${M(2100000)}</td></tr>
  </table>`

const views = `
  <div class="view" id="v1">${pageHeader('Portfolio', 'Fund I — Core Positions · holdings grouped by company')}${holdings('p1')}<div class="hl" id="hl1"></div></div>
  <div class="view" id="v2">${pageHeader('FY2026 Annual Report', 'Cadence Labs, Inc. · shared from its ledger · Sep 16, 2026')}
    <div class="tabs"><span class="tab on">Income Statement</span><span class="tab">Balance Sheet</span></div>
    <table>
      <tr><th>Concept</th><th class="n">FY2026</th><th class="n">FY2025</th></tr>
      <tr id="rev"><td>Revenue</td><td class="n">$1,245,199</td><td class="n">$192,800</td></tr>
      <tr><td>Cost of revenue</td><td class="n">$266,400</td><td class="n">$39,600</td></tr>
      <tr class="tot"><td>Gross profit</td><td class="n">$978,799</td><td class="n">$153,200</td></tr>
      <tr><td>Operating expenses</td><td class="n">$2,045,211</td><td class="n">$357,067</td></tr>
      <tr class="tot"><td>Operating loss</td><td class="n">($1,066,412)</td><td class="n">($203,867)</td></tr>
    </table><div class="hl" id="hl2"></div>
  </div>
  <div class="view" id="v3">${pageHeader('Box, Inc.', 'BOX · 10-K · fiscal year ended Jan 31, 2026 · one of three peers')}
    <div class="tabs"><span class="tab on">Income Statement</span><span class="tab">Balance Sheet</span><span class="tab">Cash Flow</span></div>
    <table>
      <tr><th>Concept · USD thousands</th><th class="n">FY2026</th><th class="n">FY2025</th></tr>
      <tr><td>Revenue</td><td class="n">1,177,253</td><td class="n">1,090,130</td></tr>
      <tr><td>Cost of revenue</td><td class="n">244,647</td><td class="n">228,105</td></tr>
      <tr class="tot" id="bgp"><td>Gross profit</td><td class="n">932,606</td><td class="n">862,025</td></tr>
      <tr><td>Research and development</td><td class="n">294,542</td><td class="n">264,853</td></tr>
      <tr class="tot"><td>Operating income</td><td class="n">83,189</td><td class="n">79,634</td></tr>
    </table><div class="hl" id="hl3"></div>
    <div class="peers" id="peers"><span>Gross margin</span><b>Asana 89.0%</b><b>Box 79.2%</b><b>Domo 75.0%</b><b class="me">Cadence 78.6%</b></div>
  </div>
  <div class="view" id="v4">${pageHeader('FY2026 Annual Report', 'Cadence Labs, Inc. · shared from its ledger · Sep 16, 2026')}
    <div class="tabs"><span class="tab">Income Statement</span><span class="tab on">Balance Sheet</span></div>
    <table>
      <tr><th>Concept</th><th class="n">Aug 31, 2026</th><th class="n">Aug 31, 2025</th></tr>
      <tr id="cash"><td>Cash and cash equivalents</td><td class="n">$1,913,399</td><td class="n">$2,767,022</td></tr>
      <tr><td>Receivables, net</td><td class="n">$9,600</td><td class="n">$4,800</td></tr>
      <tr class="tot"><td>Total assets</td><td class="n">$2,018,721</td><td class="n">$2,853,155</td></tr>
      <tr><td>Deferred revenue</td><td class="n">$1,154,000</td><td class="n">$922,022</td></tr>
      <tr class="tot"><td>Stockholders' equity</td><td class="n">$864,722</td><td class="n">$1,931,133</td></tr>
    </table><div class="hl" id="hl4"></div>
    <div class="burn card" id="burn"><span><label>Cash used, FY2026</label><div>$853,623</div></span><span><label>Per month</label><div>$71,135</div></span><span><label>Runway</label><div class="grad">≈ 27 months</div></span></div>
  </div>
  <div class="view" id="v5">${pageHeader('Portfolio', 'Fund I — Core Positions · holdings grouped by company')}${holdings('p5')}<div class="hl" id="hl5"></div></div>`

const INBOX = [
  ['Cadence Labs', 'Q2 investor update', 'Cadence_Q2_update.pdf', 'Jun 3'],
  ['Halyard Robotics', 'Monthly update: May', 'Halyard_May.pdf', 'Jun 11'],
  [
    'Thornbury Materials',
    'Quarterly letter',
    'Thornbury_Q2_letter.pdf',
    'Jul 22',
  ],
]

const html = `
<div class="bg"></div><div class="gridbg"></div>

<div class="scene" id="s1"><div class="center">
  <div class="eyebrow" id="eb">Venture · Growth · Private equity</div>
  <div class="big" style="margin-top:34px"><span class="wd" id="w1">Your</span> <span class="wd" id="w2">fund</span> <span class="wd" id="w3">runs</span> <span class="wd" id="w4">on</span><br><span class="wd grad" id="w5">other people's books.</span></div>
</div></div>

<div class="scene" id="s2a">
  <div class="msg" id="bm" style="left:510px;top:220px">
    <div class="who"><div class="av" style="background:#334155">LP</div><div><b>Limited partner</b> <span>· 8:40 PM</span></div></div>
    <p>Before the annual meeting: how is Cadence actually doing?</p>
  </div>
  <div class="msg" id="rm" style="left:510px;top:520px;background:#10251f;border-color:#1f4d40">
    <div class="who"><div class="av" style="background:var(--e600)">You</div><div><b>You</b></div></div>
    <p id="rmt"></p>
  </div>
  <div class="caption" id="c2a">An LP has a question. <em>The answer is in someone else's books.</em></div>
</div>

<div class="scene" id="s2b">
  <div class="inbox card" id="ib">
    <div class="ibh"><b>Updates</b><span>from portfolio companies</span></div>
    ${INBOX.map((m, i) => `<div class="mail" id="m${i}"><b>${m[0]}</b><span class="subj">${m[1]}</span><span class="att"><i class="pdfic">PDF</i>${m[2]}</span><span class="dt">${m[3]}</span></div>`).join('')}
    <div class="mail sheet" id="m3"><b>Fund I tracker</b><span class="subj">Fund_I_tracker_v14.xlsx</span><span class="att"><i class="xl">XLS</i>last updated by hand</span><span class="dt" id="age"></span></div>
  </div>
  <div class="caption" id="c2b">The numbers arrive as PDFs. <em>The tracker is always behind.</em></div>
</div>

<div class="scene" id="s2c">
  <div class="gchat" id="gc">
    <div class="ub" style="max-width:640px;margin-left:auto"><div class="attach">📎 Cadence_Q2_update.pdf</div><div id="gq"></div></div>
    <div class="ans" id="ga" style="color:#cad3cf;margin-top:26px"></div>
  </div>
  <div class="caption" id="c2c">And the AI you already pay for <em>can't see any of it.</em></div>
</div>

<div class="scene" id="s3"><div class="center">
  <div class="big" style="font-size:96px"><span id="t1" style="display:inline-block">Your companies share reports.</span><br><span class="grad" id="t2" style="display:inline-block">Ask your AI.</span></div>
  <div style="display:flex;align-items:center;margin-top:70px">
    <div class="node" id="n1">Cadence Labs · RoboLedger</div><div class="wire" id="wr1"></div>
    <div class="node" id="n2" style="border-color:var(--e500)">${tile(48, 12)}RoboInvestor</div><div class="wire" id="wr2"></div>
    <div class="node" id="n3">Claude · ChatGPT · any MCP client</div>
  </div>
</div></div>

<div class="scene" id="s4">
  <div id="chat">
    <div class="hd"><div class="t">Your AI chat · connected over MCP</div>
      <span class="chip"><span class="dot"></span>RoboInvestor · Fund I</span><span class="chip"><span class="dot"></span>SEC filings</span></div>
    <div id="chatbody">${chatGroups}</div>
  </div>
  <div id="app">${appChrome({ active: 'portfolio', main: views })}</div>
  ${CURSOR.replace('class="cursor"', 'class="cursor" id="cursor"')}
</div>

<div class="scene" id="s5"><div class="center">
  <span id="cl">${tile(110, 26)}</span>
  <div class="big grad" id="cu" style="font-size:112px;margin-top:34px">roboinvestor.ai</div>
  <div id="cn" style="font-size:40px;font-weight:600;margin-top:30px">Their reports, public filings, and your marks in one graph.</div>
  <div id="cw" style="font-size:28px;color:var(--muted);margin-top:26px">Works with Claude, ChatGPT, or any MCP client</div>
  <div id="cd" style="position:absolute;bottom:40px;font-size:18px;color:var(--dim)">Meridian Ventures and Cadence Labs are demo companies. Peers: the latest 10-Ks of Asana, Box and Domo.</div>
</div></div>
`

const css = `
.stage { background: var(--bg); }
.bg { position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(6,78,59,.26), rgba(19,78,74,.16) 50%, rgba(22,78,99,.18)); }
.gridbg { position: absolute; inset: 0; opacity: .07;
  background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px);
  background-size: 64px 64px; }
.scene { position: absolute; inset: 0; opacity: 0; display: none; }
.center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.eyebrow { font: 600 24px var(--display); letter-spacing: .32em; color: var(--e300); text-transform: uppercase; }
.big { font: 800 118px/1.04 var(--display); letter-spacing: -.01em; }
.caption { position: absolute; left: 0; right: 0; bottom: 96px; text-align: center; font-size: 46px; font-weight: 600; }
.caption em { font-style: normal; color: var(--c400); }
.msg { position: absolute; width: 900px; background: var(--card); border: 1px solid var(--line); border-radius: 22px; padding: 30px 36px; }
.who { display: flex; align-items: center; gap: 18px; margin-bottom: 16px; }
.av { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; font-weight: 700; font-size: 22px; }
.who b { font-size: 26px; } .who span { color: var(--muted); font-size: 22px; }
.msg p { font-size: 36px; line-height: 1.35; min-height: 48px; }
.inbox { position: absolute; left: 360px; top: 150px; width: 1200px; padding: 26px 28px; border-radius: 24px; }
.ibh { display: flex; align-items: baseline; gap: 14px; margin-bottom: 16px; }
.ibh b { font: 700 30px var(--display); } .ibh span { color: var(--muted); font-size: 22px; }
.mail { display: grid; grid-template-columns: 260px 1fr 360px 150px; align-items: center; gap: 18px; padding: 20px 18px;
  border-top: 1px solid var(--line); font-size: 24px; opacity: 0; }
.mail b { font-weight: 700; } .mail .subj { color: #cad3cf; }
.mail .att { display: flex; align-items: center; gap: 10px; font: 19px var(--mono); color: var(--muted); }
.mail .dt { text-align: right; color: var(--muted); font-size: 20px; }
.pdfic, .xl { font-style: normal; padding: 3px 7px; border-radius: 5px; color: #fff; font: 700 13px var(--body); }
.pdfic { background: #d9443b; } .xl { background: #1d7a46; }
.mail.sheet .dt { color: var(--bad); font-weight: 700; }
.gchat { position: absolute; left: 460px; top: 230px; width: 1000px; height: 440px; background: #0d1210; border: 1px solid var(--line); border-radius: 24px; padding: 40px; }
.attach { display: inline-flex; gap: 12px; padding: 12px 18px; margin-bottom: 12px; border: 1px solid var(--line); border-radius: 14px; font: 22px var(--mono); color: var(--muted); }
.node { padding: 22px 34px; border-radius: 18px; border: 1px solid var(--line); background: var(--card); font-size: 30px; font-weight: 600; display: flex; align-items: center; gap: 16px; }
.wire { width: 130px; height: 3px; background: linear-gradient(90deg, var(--e500), var(--c500)); transform-origin: left; }

.step { font: 700 34px var(--display); margin-bottom: 4px; }
.step i { font-style: normal; font-size: 18px; color: var(--muted); letter-spacing: .3em; margin-right: 16px; vertical-align: middle; }
.step em { font-style: normal; }
.wd { display: inline-block; }
#chat { position: absolute; left: 70px; top: 80px; width: 700px; height: 920px; background: #0b100e; border: 1px solid var(--line); border-radius: 26px; overflow: hidden; }
#chat .hd { height: 120px; border-bottom: 1px solid var(--line); padding: 22px 30px; }
#chat .hd .t { font-size: 22px; color: var(--muted); margin-bottom: 14px; }
.chip { display: inline-flex; align-items: center; gap: 10px; padding: 8px 16px; border-radius: 999px; border: 1px solid var(--line); background: var(--card2); font-size: 19px; margin-right: 10px; }
.dot { width: 10px; height: 10px; border-radius: 50%; background: var(--good); }
#chatbody { position: absolute; left: 0; right: 0; top: 120px; bottom: 0; }
.grp { position: absolute; left: 30px; right: 30px; top: 34px; display: none; flex-direction: column; gap: 22px; }
.approve { display: flex; gap: 14px; }
.btn.lg { padding: 14px 28px; font-size: 23px; border-radius: 12px; }
#app { position: absolute; left: 810px; top: 80px; width: 1040px; height: 920px; border: 1px solid var(--line); border-radius: 26px; overflow: hidden; }
.view { position: absolute; inset: 0; padding: 26px 30px; opacity: 0; }
.strip { display: flex; gap: 44px; padding: 16px 24px; margin-bottom: 18px; }
.strip label { display: block; font-size: 13px; letter-spacing: .08em; color: var(--muted); text-transform: uppercase; margin-bottom: 6px; }
.strip div { font: 700 23px var(--mono); }
tr.co td { background: #151a18; font-weight: 700; }
td.in { padding-left: 34px; }
.badge.sm { font-size: 12px; padding: 3px 8px; margin-left: 10px; vertical-align: 2px; }
.mk { display: inline-block; margin-right: 10px; font: 700 12px var(--body); padding: 2px 7px; border-radius: 6px;
  background: rgba(34,211,238,.15); color: var(--c300); vertical-align: 2px; }
.peers { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-top: 20px; font-size: 17px; color: var(--muted); }
.peers b { padding: 8px 14px; border-radius: 10px; background: var(--card2); border: 1px solid var(--line); color: var(--ink); font: 600 17px var(--mono); opacity: 0; }
.peers b.me { border-color: var(--c400); color: var(--c300); }
.burn { display: flex; gap: 44px; padding: 16px 24px; margin-top: 20px; opacity: 0; }
.burn label { display: block; font-size: 13px; letter-spacing: .08em; color: var(--muted); text-transform: uppercase; margin-bottom: 6px; }
.burn div { font: 700 23px var(--mono); }
`

const S1 = [0, 3.6],
  S2A = [3.6, 8.0],
  S2B = [8.0, 11.6],
  S2C = [11.6, 15.4],
  S3 = [15.4, 18.8]
const B = [18.8, 23.2, 27.6, 32.0, 36.4]
const S4 = [18.8, 41.6],
  S5 = [41.6, 46.2]
const TOTAL = 46.2

function win(el, t, [a, b], fi = 0.45, fo = 0.4) {
  const v =
    t >= a && t < b ? eo(seg(t, a, a + fi)) * (1 - eio(seg(t, b - fo, b))) : 0
  el.style.opacity = v
  el.style.display = v > 0 ? 'block' : 'none'
  return t - a
}

function answer(parts, n) {
  let out = '',
    left = n
  parts.forEach((p, i) => {
    const s = p.slice(0, Math.max(0, left))
    left -= p.length
    out += i === 1 ? `<b>${s}</b>` : s
  })
  return out
}

// Blend two #rrggbb colours, so a highlight arrives instead of popping.
const mix = (a, b, p) => {
  const c = (h, i) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16)
  return `rgb(${[0, 1, 2].map((i) => Math.round(c(a, i) + (c(b, i) - c(a, i)) * clamp01(p))).join(',')})`
}

function setup(ctx) {
  const { $, root } = ctx
  const peers = [...root.getElementById('peers').querySelectorAll('b')]

  return (t) => {
    t = Math.max(0, Math.min(TOTAL, t))

    let lt = win($('s1'), t, S1)
    blurIn($('eb'), seg(lt, 0.05, 0.6), 12)
    ;['w1', 'w2', 'w3', 'w4', 'w5'].forEach((w, i) =>
      blurIn($(w), seg(lt, 0.25 + i * 0.08, 0.85 + i * 0.08))
    )

    lt = win($('s2a'), t, S2A)
    rise($('bm'), eo(seg(lt, 0.2, 0.8)))
    rise($('rm'), eo(seg(lt, 1.5, 1.9)))
    $('rmt').textContent = typed('Let me get back to you.', lt, 1.9, 22)
    rise($('c2a'), eo(seg(lt, 2.6, 3.1)), 20)

    lt = win($('s2b'), t, S2B)
    rise($('ib'), eo(seg(lt, 0.05, 0.5)), 40)
    for (let i = 0; i < 4; i++)
      rise($('m' + i), eo(seg(lt, 0.4 + i * 0.22, 0.75 + i * 0.22)), 12)
    // the tracker ages while you read the inbox
    const days = Math.round(12 + 35 * eio(seg(lt, 1.3, 2.6)))
    $('age').textContent = days + ' days ago'
    rise($('c2b'), eo(seg(lt, 1.7, 2.2)), 20)

    lt = win($('s2c'), t, S2C)
    rise($('gc'), eo(seg(lt, 0, 0.5)), 30)
    $('gq').textContent = typed(
      'How does Cadence compare to public SaaS?',
      lt,
      0.5,
      40
    )
    $('ga').textContent = typed(
      "I can read this one PDF. I don't have Cadence's books, the rest of your fund, or any public filers to compare against.",
      lt,
      1.3,
      85
    )
    rise($('c2c'), eo(seg(lt, 2.5, 3.0)), 20)

    lt = win($('s3'), t, S3)
    blurIn($('t1'), seg(lt, 0.1, 0.7))
    blurIn($('t2'), seg(lt, 0.6, 1.2))
    rise($('n1'), eo(seg(lt, 1.2, 1.6)), 20)
    $('wr1').style.transform = `scaleX(${eo(seg(lt, 1.5, 1.9))})`
    rise($('n2'), eo(seg(lt, 1.8, 2.2)), 20)
    $('wr2').style.transform = `scaleX(${eo(seg(lt, 2.1, 2.5))})`
    rise($('n3'), eo(seg(lt, 2.4, 2.8)), 20)

    lt = win($('s4'), t, S4, 0.5, 0.45)
    if (t >= S4[0] && t < S4[1]) {
      rise($('chat'), eo(seg(lt, 0, 0.7)), 60)
      rise($('app'), eo(seg(lt, 0.15, 0.85)), 60)

      let bi = 0
      for (let i = 0; i < B.length; i++) if (t >= B[i]) bi = i
      const bt = t - B[bi]

      BEATS.forEach((b, i) => {
        const g = $('g' + i)
        if (i === bi) {
          g.style.display = 'flex'
          rise(g, eo(seg(bt, 0.15, 0.5)), 30)
          $('q' + i).textContent = typed(b.q, bt, 0.2, 48)
          rise($('tl' + i), eo(seg(bt, 1.0, 1.25)), 12)
          const done = bt > 1.75
          $('ts' + i).innerHTML = done
            ? '<span style="color:var(--good)">✓ done</span>'
            : `<span style="color:var(--muted)">${spin(bt)} running</span>`
          $('ts' + i).style.opacity = dip(bt, 1.75)
          $('tr' + i).textContent = b.res
          $('tr' + i).style.opacity = seg(bt, 1.75, 2.05)
          $('an' + i).innerHTML = answer(b.a, Math.floor((bt - 1.85) * 70))
          if (b.approve) {
            rise($('ap'), eo(seg(bt, 2.9, 3.2)), 10)
            pointer(ctx, $('cursor'), $('apgo'), bt, 3.0, 3.5)
            swap($('apgo'), bt, 3.55, 'Apply', 'Applied ✓')
            rise($('tl5'), eo(seg(bt, 3.75, 4.0)), 12)
            const cd = bt > 4.15
            $('ts5').innerHTML = cd
              ? '<span style="color:var(--good)">✓ done</span>'
              : `<span style="color:var(--muted)">${spin(bt)} running</span>`
            $('ts5').style.opacity = dip(bt, 4.15)
            $('tr5').textContent = '1 position re-marked · Fund I at $20.70M'
            $('tr5').style.opacity = seg(bt, 4.15, 4.45)
          }
        } else if (i === bi - 1 && bt < 0.35) {
          g.style.display = 'flex'
          const q = seg(bt, 0, 0.3)
          g.style.opacity = 1 - q
          g.style.transform = `translateY(${-50 * q}px)`
        } else g.style.display = 'none'
      })
      if (bi !== 4) $('cursor').style.opacity = 0

      // the app view switches when the tool fires
      const vi = bt >= 1.0 || bi === 0 ? bi : bi - 1
      const vt =
        bt >= 1.0 ? bt - 1.0 : bi === 0 ? 0 : bt + (B[bi] - B[bi - 1]) - 1.0
      // crossfade: the previous screen fades out as the next fades in
      const f = bi === 0 ? 1 : eio(seg(vt, 0, 0.45))
      for (let i = 0; i < 5; i++) {
        const v = $('v' + (i + 1))
        const p = i === vi ? f : i === vi - 1 ? 1 - f : 0
        v.style.opacity = p
        v.style.transform = `translateX(${(1 - p) * (i === vi ? 30 : -30)}px)`
      }
      ctx.nav(
        BEATS[vi].k,
        vi > 0 ? BEATS[vi - 1].k : BEATS[vi].k,
        seg(vt, 0, 0.7)
      )

      ctx.ring($('hl1'), $('p1ca'), vi === 0 ? eo(seg(vt, 0.85, 1.2)) : 0)
      ctx.ring($('hl2'), $('rev'), vi === 1 ? eo(seg(vt, 0.85, 1.2)) : 0)
      ctx.ring($('hl3'), $('bgp'), vi === 2 ? eo(seg(vt, 0.85, 1.2)) : 0)
      peers.forEach((b, i) =>
        rise(b, vi === 2 ? eo(seg(vt, 1.1 + i * 0.15, 1.4 + i * 0.15)) : 0, 8)
      )
      ctx.ring($('hl4'), $('cash'), vi === 3 ? eo(seg(vt, 0.85, 1.2)) : 0)
      rise($('burn'), vi === 3 ? eo(seg(vt, 1.1, 1.5)) : 0, 14)
      $('cash').cells[1].style.color = mix(
        '#f1f6f4',
        '#f87171',
        vi === 3 ? seg(vt, 0.85, 1.15) : 0
      )
      if (vi === 4) {
        // in this beat vt = bt - 1, so the mark applies at vt 3.15
        const marked = swap($('p5cav'), vt, 3.15)
        $('p5cav').innerHTML = marked
          ? `<span class="mk">409A refresh</span>${M(17800000)}`
          : M(14500000)
        swap($('p5val'), vt, 3.15, M(17404000), M(20704000))
        swap($('p5moic'), vt, 3.15, '1.35x', '1.61x')
        $('p5moic').style.color = marked ? 'var(--good)' : ''
        ctx.ring($('hl5'), $('p5ca'), eo(seg(vt, 3.15, 3.5)))
      }
    }

    // the end card fades into the background and the loop opens on the first scene:
    // no black dip
    lt = win($('s5'), t, S5, 0.5, 0.6)
    rise($('cl'), eo(seg(lt, 0.1, 0.5)), 20)
    blurIn($('cu'), seg(lt, 0.3, 0.9), 30)
    rise($('cn'), eo(seg(lt, 0.9, 1.3)), 20)
    rise($('cw'), eo(seg(lt, 1.3, 1.7)), 20)
    $('cd').style.opacity = seg(lt, 1.6, 2.0)
    $('cl').style.display = 'inline-block'
  }
}

// Phone layout: a 720-wide portrait stage, the chat stacked over the app,
// larger type throughout, and the connector flow turned vertical.
const phoneCss = `
.big { font-size: 64px; }
.eyebrow { font-size: 16px; letter-spacing: .16em; }
.caption { font-size: 34px; bottom: 64px; padding: 0 36px; line-height: 1.25; }
#bm { left: 40px !important; top: 190px !important; }
#rm { left: 40px !important; top: 520px !important; }
.msg { width: 640px; padding: 24px 28px; }
.msg p { font-size: 32px; }
.inbox { left: 24px; top: 130px; width: 672px; padding: 20px 18px; }
.ibh b { font-size: 26px; } .ibh span { font-size: 18px; }
.mail { grid-template-columns: 1fr auto; gap: 6px 12px; padding: 14px 8px; font-size: 22px; }
.mail .subj { display: none; }
.mail .att { grid-column: 1; font-size: 16px; }
.mail .dt { grid-row: 1; grid-column: 2; font-size: 18px; }
.gchat { left: 24px; top: 220px; width: 672px; height: 420px; padding: 28px; }
.gchat .ub { font-size: 26px; }
.gchat .ans { font-size: 26px; }
#s3 .big { font-size: 46px !important; }
#s3 .center > div:last-child { flex-direction: column; margin-top: 50px !important; }
.wire { width: 3px; height: 34px; }
.node { font-size: 26px; padding: 16px 26px; }
.step { font-size: 24px; margin-bottom: 0; } .step i { font-size: 13px; margin-right: 10px; }
#chat { left: 20px; top: 20px; width: 680px; height: 560px; }
#chat .hd { height: 96px; padding: 14px 20px; }
#chat .hd .t { font-size: 17px; margin-bottom: 10px; }
.chip { font-size: 16px; padding: 6px 12px; }
#chatbody { top: 96px; }
.grp { left: 20px; right: 20px; top: 14px; gap: 10px; }
.ub { font-size: 24px; padding: 14px 18px; min-height: 56px; }
.tool { padding: 11px 14px; } .tool .tn { font-size: 17px; } .tool .tr { font-size: 18px; margin-top: 6px; }
.ans { font-size: 24px; }
.btn.lg { font-size: 20px; padding: 11px 20px; }
#app { left: 20px; top: 594px; width: 680px; height: 470px; }
.view { padding: 16px 18px; }
.strip, .burn { gap: 22px; padding: 12px 16px; margin-bottom: 12px; } .strip div, .burn div { font-size: 17px; }
.view th:nth-child(3), .view td:nth-child(3) { display: none; }
.view tr.co td { display: table-cell; }
.view td { padding: 9px 12px; font-size: 16px; }
.view td.n { font-size: 15px; }
.badge.sm { display: none; }
.mk { display: none; }
#v3 tr:nth-child(n + 5), #v4 tr:nth-child(n + 5) { display: none; }
.peers span { display: none; }
.peers { margin-top: 10px; gap: 8px; font-size: 14px; } .peers b { font-size: 14px; padding: 6px 10px; }
#cu { font-size: 76px !important; }
#cn { font-size: 30px !important; padding: 0 30px; }
#cw { font-size: 22px !important; }
#cd { padding: 0 30px; font-size: 16px !important; }
`

export default {
  width: 1920,
  height: 1080,
  total: TOTAL,
  poster: 30.4,
  css,
  html,
  setup,
  mobile: { width: 720, height: 1080, css: PHONE_APP_CSS + phoneCss },
}
