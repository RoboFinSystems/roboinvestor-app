/*
 * Landing-page demo kit: the RoboInvestor chrome for the animated product demos in
 * /demos/*.js, on the runtime from @robosystems/core.
 *
 * A demo module default-exports { width, height, total, poster, css, html,
 * setup(ctx) } where setup returns seek(t), a pure function of time. The same
 * module runs live on the landing page (mount, in a shadow root, looping while
 * visible) and frame by frame under the content machine's renderer
 * (render.html), so the page and the social cut share one source.
 *
 * runtime.js is core's demos/runtime.js, committed so the page and the
 * renderer need no build step: `npm run sync:demos` refreshes it after a core
 * bump, and a test fails while it differs from the installed package.
 */
import { mount as mountDemo } from './runtime.js'

export * from './runtime.js'

const NAV = [
  ['home', 'Home'],
  ['entity', 'Entity'],
  ['portfolio', 'Portfolio'],
  ['reports', 'Portfolio Reports'],
  ['console', 'Console'],
  ['search', 'Search'],
  ['research', 'Research'],
  ['repositories', 'Repositories'],
]

export const ICON = '/images/logos/roboinvestor-icon.png'
export const tile = (size, radius) =>
  `<span class="tile" style="width:${size}px;height:${size}px;border-radius:${radius}px"><img src="${ICON}" alt=""></span>`

/* The RoboInvestor app window: top bar, sidebar with the active item, and `main`. */
export function appChrome({
  active,
  main,
  company = 'Meridian Ventures Fund I',
  id = '',
}) {
  const nav = NAV.map(
    ([k, label, sub]) =>
      `<div class="nv${sub ? ' sub' : ''}${k === active ? ' on' : ''}" data-k="${k}">${label}</div>`
  ).join('')
  return `<div class="ri-app"${id ? ` id="${id}"` : ''}>
    <div class="ri-top">${tile(36, 10)}<span class="wm">RoboInvestor</span><span class="co">${company}</span></div>
    <div class="ri-side"><div class="pill"></div>${nav}</div>
    <div class="ri-main" id="main" data-loop>${main}</div>
  </div>`
}

export const pageHeader = (title, sub) =>
  `<div class="vh">${tile(54, 13)}<div><h2>${title}</h2><p>${sub}</p></div></div>`

export const CURSOR = `<svg class="cursor" viewBox="0 0 24 24"><path d="M3 2l7 19 2.6-7.4L20 11z" fill="#fff" stroke="#000" stroke-width="1.2"/></svg>`

const CSS = `
:host { display: block; }
.stage { position: absolute; left: 0; top: 0; transform-origin: 0 0; overflow: hidden;
  --bg: #050907; --ink: #f1f6f4; --muted: #94a39d; --dim: #66756f;
  --e300: #6EE7B7; --e400: #34D399; --e500: #10B981; --e600: #059669; --e700: #047857;
  --t500: #14B8A6; --c300: #67E8F9; --c400: #22D3EE; --c500: #06B6D4;
  --card: #111614; --card2: #18201d; --line: #25302c; --row: #1c2320;
  --good: #86efac; --bad: #f87171; --warn: #fbbf24;
  --display: 'Orbitron', 'Space Grotesk', sans-serif;
  --body: 'Space Grotesk', system-ui, sans-serif;
  --mono: ui-monospace, SFMono-Regular, Menlo, monospace;
  background: #000; color: var(--ink); font-family: var(--body);
  -webkit-font-smoothing: antialiased; line-height: 1.3;
  text-align: left; font-size: 16px; font-weight: 400; font-style: normal; letter-spacing: normal; text-transform: none; }
:where(.stage *) { box-sizing: border-box; margin: 0; padding: 0; }
.grad { background: linear-gradient(90deg, var(--e400), var(--t500) 50%, var(--c400));
  -webkit-background-clip: text; background-clip: text; color: transparent; }
.tile { display: inline-grid; place-items: center; flex-shrink: 0; overflow: hidden;
  background: linear-gradient(135deg, var(--e500), var(--c500)); }
.tile img { mix-blend-mode: screen; width: 78%; height: 78%; }
.cursor { position: absolute; width: 34px; height: 34px; z-index: 40; opacity: 0; pointer-events: none;
  transform-origin: 20% 10%; }

.ri-app { position: absolute; inset: 0; background: #000; overflow: hidden; }
.ri-top { position: absolute; left: 0; right: 0; top: 0; height: 62px; border-bottom: 1px solid #1c211f;
  display: flex; align-items: center; gap: 14px; padding: 0 22px; }
.ri-top .wm { font: 700 24px var(--display); }
.ri-top .co { margin-left: auto; padding: 8px 16px; border-radius: 10px; background: #232826;
  border: 1px solid #323835; font-size: 17px; font-weight: 600; }
.ri-side { position: absolute; top: 62px; bottom: 0; left: 0; width: 214px; border-right: 1px solid #1c211f; padding: 16px 12px; }
.ri-side .nv { position: relative; font-size: 18px; padding: 10px 14px; border-radius: 10px; margin-bottom: 3px; color: #e4e9e7; }
.ri-side .nv.sub { padding-left: 30px; font-size: 17px; color: #cad3cf; }
.ri-side .nv.on { color: var(--e700); }
.ri-side .pill { position: absolute; left: 12px; width: 190px; height: 42px; border-radius: 10px; background: #D1FAE5; }
.ri-main { position: absolute; top: 62px; left: 214px; right: 0; bottom: 0; padding: 26px 30px; }

.vh { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.vh h2 { font: 700 32px var(--display); }
.vh p { font-size: 16px; color: var(--muted); margin-top: 4px; }
table { width: 100%; border-collapse: collapse; }
th { background: #343a37; color: #c5cfcb; font-size: 14px; letter-spacing: .06em; text-transform: uppercase;
  text-align: left; padding: 12px 16px; font-weight: 600; }
th:first-child { border-top-left-radius: 10px; } th:last-child { border-top-right-radius: 10px; }
th.n, td.n { text-align: right; }
td { background: var(--row); padding: 13px 16px; font-size: 18px; border-top: 1px solid #171c1a; }
td.n { font-family: var(--mono); font-size: 17px; }
tr.tot td { font-weight: 700; }
.tabs { display: flex; gap: 10px; align-items: center; margin-bottom: 18px; }
.tab { padding: 9px 16px; border-radius: 9px; background: #3f4642; font-size: 16px; font-weight: 600; }
.tab.on { background: var(--e600); }
.btn { display: inline-block; padding: 10px 20px; border-radius: 10px; font-size: 17px; font-weight: 600; }
.btn.go { background: linear-gradient(90deg, var(--e600), var(--t500)); color: #fff; }
.btn.ghost { border: 1px solid var(--line); color: var(--muted); }
.badge { display: inline-block; padding: 6px 12px; border-radius: 8px; font-size: 15px; font-weight: 700; }
.b-good { background: rgba(134,239,172,.14); color: var(--good); }
.b-warn { background: rgba(251,191,36,.15); color: var(--warn); }
.b-v { background: rgba(34,211,238,.15); color: var(--c300); }
.b-mute { background: #29302d; color: #cad3cf; }
.card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; }
.hl { position: absolute; border: 2px solid var(--c400); border-radius: 10px;
  pointer-events: none; opacity: 0; z-index: 5; }

.ub { align-self: flex-end; max-width: 520px; background: #13302a; border: 1px solid #1f4d40;
  border-radius: 22px 22px 6px 22px; padding: 16px 22px; font-size: 26px; line-height: 1.35; min-height: 66px; }
.tool { border: 1px solid var(--line); background: var(--card); border-radius: 16px; padding: 14px 18px; }
.tool .tn { font: 600 19px var(--mono); color: var(--e300); display: flex; justify-content: space-between; }
.tool .tr { font-size: 20px; color: var(--muted); margin-top: 8px; min-height: 1px; }
.tool .st { font: 500 17px var(--mono); }
.ans { font-size: 26px; line-height: 1.45; min-height: 40px; }
.ans b { color: var(--c400); font-weight: 600; }
`

/* Shared phone CSS for the app-screen spotlights: no sidebar, larger type. */
export const PHONE_APP_CSS = `
.ri-side { display: none; }
.ri-main { left: 0; padding: 20px 22px; }
.ri-top { height: 58px; } .ri-main { top: 58px; }
.ri-top .co { font-size: 15px; padding: 7px 12px; }
.vh { margin-bottom: 16px; } .vh h2 { font-size: 28px; } .vh p { font-size: 14px; }
th { padding: 10px 12px; font-size: 13px; }
td { padding: 11px 12px; font-size: 17px; } td.n { font-size: 16px; white-space: nowrap; }
`

/* How nav() finds this app's sidebar and blends its item colours. */
const THEME = {
  side: '.ri-side',
  rest: [228, 233, 231],
  restSub: [202, 211, 207],
  active: [4, 120, 87],
}

/* mount() with this app's chrome CSS and sidebar theme. */
export const mount = (host, def, opts = {}) =>
  mountDemo(host, def, { css: CSS, theme: THEME, ...opts })
