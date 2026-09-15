// Lokalnie generowane grafiki (SVG) — brak zależności od zewnętrznych serwerów.
// Każdy wpis: id, tytuł, kategoria, opis i funkcja zwracająca znacznik SVG.
const svg = (w, h, inner) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${inner}</svg>`
  )}`;

function gradientDef(id, c1, c2, angle = 45) {
  const r = (angle * Math.PI) / 180;
  const x2 = (Math.cos(r) * 50 + 50).toFixed(1);
  const y2 = (Math.sin(r) * 50 + 50).toFixed(1);
  return `<linearGradient id="${id}" x1="0%" y1="0%" x2="${x2}%" y2="${y2}%">
    <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient>`;
}

const GALLERY = [
  {
    id: "gradient-sunset",
    title: "Gradient — Zachód słońca",
    category: "Abstrakcja",
    desc: "Prosty gradient liniowy testujący renderowanie kolorów.",
    src: svg(400, 400, `<defs>${gradientDef("g1", "#f97316", "#ec4899", 60)}</defs>
      <rect width="400" height="400" fill="url(#g1)"/>`),
  },
  {
    id: "gradient-ocean",
    title: "Gradient — Ocean",
    category: "Abstrakcja",
    desc: "Gradient chłodnych barw niebiesko-zielonych.",
    src: svg(400, 400, `<defs>${gradientDef("g2", "#06b6d4", "#4f46e5", 120)}</defs>
      <rect width="400" height="400" fill="url(#g2)"/>`),
  },
  {
    id: "shapes-circles",
    title: "Koncentryczne okręgi",
    category: "Wzory",
    desc: "Test rysowania wielu nakładających się kształtów wektorowych.",
    src: svg(400, 400, `<rect width="400" height="400" fill="#111827"/>
      ${[180, 140, 100, 60, 20]
        .map(
          (r, i) =>
            `<circle cx="200" cy="200" r="${r}" fill="none" stroke="hsl(${i * 45 + 260},80%,60%)" stroke-width="6"/>`
        )
        .join("")}`),
  },
  {
    id: "pattern-grid",
    title: "Siatka izometryczna",
    category: "Wzory",
    desc: "Powtarzalny wzór linii testujący wydajność renderowania SVG.",
    src: svg(400, 400, `<rect width="400" height="400" fill="#0f172a"/>
      ${Array.from({ length: 11 })
        .map((_, i) => `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="400" stroke="#334155" stroke-width="1"/>`)
        .join("")}
      ${Array.from({ length: 11 })
        .map((_, i) => `<line x1="0" y1="${i * 40}" x2="400" y2="${i * 40}" stroke="#334155" stroke-width="1"/>`)
        .join("")}
      <circle cx="200" cy="200" r="60" fill="#f472b6" opacity="0.85"/>`),
  },
  {
    id: "chart-bars",
    title: "Wykres słupkowy (demo)",
    category: "Wykresy",
    desc: "Przykładowe dane testujące wyświetlanie prostych wykresów.",
    src: svg(400, 300, `<rect width="400" height="300" fill="#111827"/>
      ${[60, 120, 90, 160, 70, 130]
        .map(
          (v, i) =>
            `<rect x="${20 + i * 62}" y="${280 - v}" width="42" height="${v}" rx="6" fill="hsl(${200 + i * 20},70%,55%)"/>`
        )
        .join("")}
      <line x1="10" y1="280" x2="390" y2="280" stroke="#475569" stroke-width="2"/>`),
  },
  {
    id: "chart-line",
    title: "Wykres liniowy (demo)",
    category: "Wykresy",
    desc: "Test krzywej złożonej z punktów danych.",
    src: svg(400, 300, `<rect width="400" height="300" fill="#111827"/>
      <polyline points="20,220 80,160 140,190 200,90 260,130 320,60 380,100"
        fill="none" stroke="#34d399" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      ${"20,220 80,160 140,190 200,90 260,130 320,60 380,100"
        .split(" ")
        .map((p) => {
          const [x, y] = p.split(",");
          return `<circle cx="${x}" cy="${y}" r="5" fill="#34d399"/>`;
        })
        .join("")}
      <line x1="10" y1="280" x2="390" y2="280" stroke="#475569" stroke-width="2"/>`),
  },
  {
    id: "chart-pie",
    title: "Wykres kołowy (demo)",
    category: "Wykresy",
    desc: "Test segmentów wykresu kołowego generowanych dynamicznie.",
    src: svg(400, 400, (() => {
      const data = [35, 25, 20, 20];
      const colors = ["#4f46e5", "#ec4899", "#f59e0b", "#22c55e"];
      let acc = 0;
      const cx = 200, cy = 200, r = 160;
      const arcs = data
        .map((v, i) => {
          const start = (acc / 100) * 2 * Math.PI - Math.PI / 2;
          acc += v;
          const end = (acc / 100) * 2 * Math.PI - Math.PI / 2;
          const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
          const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
          const large = v > 50 ? 1 : 0;
          return `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z" fill="${colors[i]}"/>`;
        })
        .join("");
      return `<rect width="400" height="400" fill="#111827"/>${arcs}<circle cx="200" cy="200" r="60" fill="#111827"/>`;
    })()),
  },
  {
    id: "icon-mountain",
    title: "Ikona — Góry",
    category: "Ikony",
    desc: "Prosta ikona wektorowa testująca płaskie kompozycje kształtów.",
    src: svg(400, 400, `<defs>${gradientDef("g3", "#0ea5e9", "#22d3ee", 90)}</defs>
      <rect width="400" height="400" fill="url(#g3)"/>
      <circle cx="320" cy="90" r="34" fill="#fef9c3"/>
      <polygon points="0,340 110,180 190,290 260,150 400,340" fill="#0f172a" opacity="0.85"/>`),
  },
  {
    id: "icon-rocket",
    title: "Ikona — Rakieta",
    category: "Ikony",
    desc: "Test złożonej ikony z wieloma elementami wektorowymi.",
    src: svg(400, 400, `<rect width="400" height="400" fill="#1e1b4b"/>
      <ellipse cx="200" cy="360" rx="70" ry="14" fill="#4338ca" opacity="0.6"/>
      <path d="M200,60 C250,120 260,220 220,300 L180,300 C140,220 150,120 200,60 Z" fill="#f8fafc"/>
      <circle cx="200" cy="180" r="24" fill="#4f46e5"/>
      <polygon points="180,290 150,340 190,320" fill="#f97316"/>
      <polygon points="220,290 250,340 210,320" fill="#f97316"/>`),
  },
];
