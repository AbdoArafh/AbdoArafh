// Generates the README SVG assets (light + dark) from one source of truth.
// Zero dependencies. Run from anywhere:  node assets/build.mjs
//
// Visual language is borrowed from the portfolio: ruled paper, tape, sticky
// note, ocean + amber palette (#023047 #219ebc #8ecae6 #ffb703 #fb8500).

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = dirname(fileURLToPath(import.meta.url));

const SANS =
  "'Segoe UI','Helvetica Neue',Helvetica,Arial,'Liberation Sans',sans-serif";
const MONO =
  "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

const THEMES = {
  light: {
    desk: "#e6f3fa",
    rule: "#cfe5f1",
    card: "#f8fcfe",
    cardStroke: "#b9dcec",
    ink: "#023047",
    muted: "#4a7690",
    label: "#5b8aa3",
    name1: "#ffb703",
    name2: "#fb8500",
    pill: "#e3f2f9",
    pillStroke: "#b9dcec",
    teal: "#219ebc",
    amber: "#fb8500",
    sticky: "#ffe08a",
    stickyInk: "#023047",
    tape: "#ffcf5a",
    shadow: "#023047",
    shadowOpacity: 0.16,
  },
  dark: {
    desk: "#0a1820",
    rule: "#13303e",
    card: "#0e2531",
    cardStroke: "#215266",
    ink: "#eaf6fc",
    muted: "#93bccf",
    label: "#7fb3cb",
    name1: "#ffc83d",
    name2: "#ffa01f",
    pill: "#133749",
    pillStroke: "#215266",
    teal: "#8ecae6",
    amber: "#ffb703",
    sticky: "#ffb703",
    stickyInk: "#023047",
    tape: "#ffcf5a",
    shadow: "#000000",
    shadowOpacity: 0.45,
  },
};

/** Torn-edge tape strip: plain top/bottom, zig-zag left/right. */
function tape(x, y, w, h, fill, opacity = 0.9) {
  const teeth = 6;
  const step = h / teeth;
  const amp = 4;
  let d = `M ${x + amp} ${y} L ${x + w - amp} ${y}`;
  for (let i = 1; i <= teeth; i++) {
    const px = i % 2 ? x + w : x + w - amp;
    d += ` L ${px} ${y + step * i}`;
  }
  d += ` L ${x + amp} ${y + h}`;
  for (let i = teeth - 1; i >= 0; i--) {
    const px = i % 2 ? x : x + amp;
    d += ` L ${px} ${y + step * i}`;
  }
  d += " Z";
  return `<path d="${d}" fill="${fill}" fill-opacity="${opacity}"/>
  <path d="M ${x + 10} ${y + 6} H ${x + w - 10} M ${x + 10} ${y + h - 6} H ${x + w - 10}" stroke="#fff" stroke-opacity=".28" stroke-width="1.2" stroke-linecap="round"/>`;
}

function ruledLines(w, h, color, gap = 26) {
  let out = "";
  for (let y = gap; y < h; y += gap) {
    out += `<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`;
  }
  return `<g stroke="${color}" stroke-width="1">${out}</g>`;
}

function pill(x, y, w, label, dot, t) {
  return `<g transform="translate(${x} ${y})">
    <rect width="${w}" height="34" rx="17" fill="${t.pill}" stroke="${t.pillStroke}"/>
    <circle cx="19" cy="17" r="4" fill="${dot}"/>
    <text x="34" y="22" font-family="${SANS}" font-size="14" font-weight="600" fill="${t.ink}" textLength="${w - 54}" lengthAdjust="spacingAndGlyphs">${label}</text>
  </g>`;
}

function header(t, mode) {
  const W = 860;
  const H = 330;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc">
  <title id="title">Abdurrahman Salah, Frontend Engineer</title>
  <desc id="desc">A taped paper note introducing Abdurrahman Salah, a frontend engineer who builds and leads React and Next.js products, with a sticky note saying he is currently at Roon Studio and DataAnnotation.</desc>
  <defs>
    <clipPath id="desk"><rect width="${W}" height="${H}" rx="16"/></clipPath>
    <filter id="lift" x="-10%" y="-10%" width="120%" height="135%">
      <feDropShadow dx="0" dy="7" stdDeviation="9" flood-color="${t.shadow}" flood-opacity="${t.shadowOpacity}"/>
    </filter>
    <filter id="liftSm" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="${t.shadow}" flood-opacity="${t.shadowOpacity + 0.04}"/>
    </filter>
    <linearGradient id="name" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${t.name1}"/>
      <stop offset="1" stop-color="${t.name2}"/>
    </linearGradient>
  </defs>

  <g clip-path="url(#desk)">
    <rect width="${W}" height="${H}" fill="${t.desk}"/>
    ${ruledLines(W, H, t.rule)}
  </g>

  <!-- paper card -->
  <rect x="30" y="42" width="800" height="256" rx="6" fill="${t.card}" stroke="${t.cardStroke}" filter="url(#lift)"/>

  <!-- tape holding the card -->
  <g transform="rotate(-2 365 44)">
    ${tape(300, 27, 130, 34, t.tape, 0.92)}
  </g>

  <text x="70" y="96" font-family="${MONO}" font-size="13" font-weight="700" letter-spacing="5" fill="${t.label}">HI, I'M</text>
  <text x="68" y="152" font-family="${SANS}" font-size="60" font-weight="800" fill="url(#name)" textLength="524" lengthAdjust="spacingAndGlyphs">Abdurrahman Salah</text>

  <text font-family="${SANS}" font-size="19" fill="${t.ink}">
    <tspan x="70" y="190">I build and lead the frontend of products</tspan>
    <tspan x="70" y="215">that hold up at scale.</tspan>
  </text>

  ${pill(70, 236, 176, "Frontend Engineer", t.amber, t)}
  ${pill(256, 236, 150, "React / Next.js", t.teal, t)}
  ${pill(416, 236, 118, "SaaS &amp; AI", t.amber, t)}

  <!-- sticky note: what is happening now -->
  <g transform="translate(644 90) rotate(3)">
    <rect width="178" height="168" rx="3" fill="${t.sticky}" filter="url(#liftSm)"/>
    <g transform="translate(58 -12) rotate(-3)">${tape(0, 0, 64, 22, t.tape, mode === "dark" ? 0.7 : 0.75)}</g>
    <text x="18" y="38" font-family="${MONO}" font-size="11" font-weight="700" letter-spacing="3" fill="${t.stickyInk}" fill-opacity=".65">RIGHT NOW</text>
    <text x="18" y="68" font-family="${SANS}" font-size="19" font-weight="800" fill="${t.stickyInk}">Roon Studio</text>
    <text font-family="${SANS}" font-size="13.5" fill="${t.stickyInk}">
      <tspan x="18" y="88">Frontend engineer</tspan>
    </text>
    <line x1="18" y1="110" x2="160" y2="110" stroke="${t.stickyInk}" stroke-opacity=".3" stroke-dasharray="3 5" stroke-linecap="round"/>
    <text x="18" y="134" font-family="${SANS}" font-size="16" font-weight="800" fill="${t.stickyInk}">DataAnnotation</text>
    <text x="18" y="151" font-family="${SANS}" font-size="13.5" fill="${t.stickyInk}">AI model evaluator</text>
  </g>
</svg>
`;
}

function stats(t) {
  const W = 860;
  const H = 120;
  const items = [
    ["4+", "years building", "frontend products"],
    ["15+", "production apps", "shipped end to end"],
    ["13,000+", "users on KLUUU,", "an AI learning platform"],
    ["4", "person frontend team", "that I led"],
    ["100", "Lighthouse performance", "and SEO, recent apps"],
  ];
  const colW = W / items.length;
  const cols = items
    .map(([n, l1, l2], i) => {
      const cx = colW * i + colW / 2;
      const sep =
        i > 0
          ? `<line x1="${colW * i}" y1="22" x2="${colW * i}" y2="${H - 22}" stroke="${t.cardStroke}" stroke-dasharray="3 6" stroke-linecap="round"/>`
          : "";
      return `${sep}
  <text x="${cx}" y="60" text-anchor="middle" font-family="${SANS}" font-size="36" font-weight="800" fill="${t.amber}">${n}</text>
  <text text-anchor="middle" font-family="${SANS}" font-size="12.5" fill="${t.muted}">
    <tspan x="${cx}" y="84">${l1}</tspan>
    <tspan x="${cx}" y="101">${l2}</tspan>
  </text>`;
    })
    .join("\n  ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title">
  <title id="title">4+ years building frontend products. 15+ production apps shipped end to end. 13,000+ users on KLUUU, an AI learning platform. A 4 person frontend team led. Lighthouse 100 for performance and SEO on recent apps.</title>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="10" fill="${t.card}" stroke="${t.cardStroke}"/>
  ${cols}
</svg>
`;
}

/** Stitched divider with an amber "pin" in the middle. Works on light and dark. */
function divider() {
  const W = 860;
  const H = 28;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="presentation" aria-hidden="true">
  <line x1="6" y1="14" x2="${W / 2 - 18}" y2="14" stroke="#219ebc" stroke-opacity=".55" stroke-width="2" stroke-dasharray="1 8" stroke-linecap="round"/>
  <line x1="${W / 2 + 18}" y1="14" x2="${W - 6}" y2="14" stroke="#219ebc" stroke-opacity=".55" stroke-width="2" stroke-dasharray="1 8" stroke-linecap="round"/>
  <circle cx="${W / 2}" cy="14" r="7" fill="none" stroke="#fb8500" stroke-opacity=".45" stroke-width="1.5"/>
  <circle cx="${W / 2}" cy="14" r="3.5" fill="#fb8500"/>
</svg>
`;
}

for (const [mode, t] of Object.entries(THEMES)) {
  writeFileSync(join(OUT, `header-${mode}.svg`), header(t, mode));
  writeFileSync(join(OUT, `stats-${mode}.svg`), stats(t));
}
writeFileSync(join(OUT, "divider.svg"), divider());

console.log("assets written to", OUT);
