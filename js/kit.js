/* SETA kit — tiny helpers + hand-built SVG charts (no chart library). */
(function () {
  const K = window.K || {};
  let uid = 0;
  const id = (p) => `${p}${++uid}`;

  K.ic = (name, cls = "") => `<i data-lucide="${name}" class="${cls}"></i>`;

  K.wm = (h = 20, extra = "") =>
    `<span class="wm ${extra}" style="height:${h}px"><img class="l" src="assets/wordmark-light.png" alt="SETA"><img class="d" src="assets/wordmark-dark.png" alt="SETA"></span>`;
  K.logo = (h = 80, extra = "") =>
    `<span class="wm ${extra}" style="height:${h}px"><img class="l" src="assets/logo-light.png" alt="SETA"><img class="d" src="assets/logo-dark.png" alt="SETA"></span>`;

  /* four-point star from the wordmark */
  K.star = (s = 14, fill = "currentColor") =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><path fill="${fill}" d="M12 0c.9 6.4 5.6 11.1 12 12-6.4.9-11.1 5.6-12 12-.9-6.4-5.6-11.1-12-12C6.4 11.1 11.1 6.4 12 0z"/></svg>`;

  /* orbital arc from the wordmark */
  K.orbit = (opts = {}) => {
    const { w = 900, h = 520, color = "var(--violet)", op = 1, stars = true } = opts;
    const g = id("og");
    return `<svg class="orbit" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style="opacity:${op}">
      <defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" style="stop-color:${color};stop-opacity:0"/><stop offset=".55" style="stop-color:${color};stop-opacity:.9"/><stop offset="1" style="stop-color:${color};stop-opacity:.15"/></linearGradient></defs>
      <path class="draw" d="M ${w * 0.05} ${h * 0.95} C ${w * 0.3} ${h * 0.25}, ${w * 0.78} ${h * 0.02}, ${w * 0.96} ${h * 0.42}" fill="none" stroke="url(#${g})" stroke-width="2"/>
      <path d="M ${w * 0.12} ${h * 1.02} C ${w * 0.36} ${h * 0.4}, ${w * 0.8} ${h * 0.18}, ${w * 1.02} ${h * 0.55}" fill="none" stroke="${color}" stroke-opacity=".12" stroke-width="1"/>
      ${stars ? `<g fill="${color}"><path transform="translate(${w * 0.86} ${h * 0.2}) scale(1.1)" d="M0 -12c.5 6 6 11.5 12 12-6 .5-11.5 6-12 12-.5-6-6-11.5-12-12 6-.5 11.5-6 12-12z"/><path opacity=".5" transform="translate(${w * 0.7} ${h * 0.1}) scale(.5)" d="M0 -12c.5 6 6 11.5 12 12-6 .5-11.5 6-12 12-.5-6-6-11.5-12-12 6-.5 11.5-6 12-12z"/></g>` : ""}
    </svg>`;
  };

  const PAL = ["#5A2FCF", "#D9531E", "#12895F", "#1F78B4", "#A33A86", "#3D4A9E", "#9A6B00", "#2E6F6A"];
  K.av = (name, cls = "", i) => {
    const ini = name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase() || name.slice(0, 2).toUpperCase();
    const h = i ?? [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
    return `<span class="av ${cls}" style="background:${PAL[h % PAL.length]}">${ini}</span>`;
  };

  K.delta = (v, suffix = "") => {
    const up = v >= 0;
    return `<span class="delta ${up ? "up" : "down"}">${K.ic(up ? "arrow-up-right" : "arrow-down-right")}${up ? "+" : ""}${v}${suffix}</span>`;
  };

  /* ---------- smooth path ---------- */
  function smooth(pts) {
    if (pts.length < 2) return "";
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const t = 0.18;
      const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
      const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }
  K.smooth = smooth;

  /* ---------- sparkline ---------- */
  K.spark = (vals, o = {}) => {
    const { w = 120, h = 36, color = "var(--violet)", fill = true, dot = true } = o;
    const mn = Math.min(...vals), mx = Math.max(...vals), pad = 3;
    const pts = vals.map((v, i) => [pad + (i * (w - pad * 2)) / (vals.length - 1), h - pad - ((v - mn) / (mx - mn || 1)) * (h - pad * 2)]);
    const g = id("sg"), d = smooth(pts), last = pts[pts.length - 1];
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
      <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:${color};stop-opacity:.22"/><stop offset="1" style="stop-color:${color};stop-opacity:0"/></linearGradient></defs>
      ${fill ? `<path d="${d} L${last[0]},${h} L${pts[0][0]},${h}Z" fill="url(#${g})"/>` : ""}
      <path d="${d}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
      ${dot ? `<circle cx="${last[0]}" cy="${last[1]}" r="2.6" fill="${color}"/>` : ""}
    </svg>`;
  };

  /* ---------- area / line chart ---------- */
  K.lines = (series, labels, o = {}) => {
    const { w = 640, h = 240, min, max, ticks = 4, padL = 34, padB = 26, padT = 12, padR = 10, unit = "", bands = [], marker } = o;
    const all = series.flatMap((s) => s.data);
    const mn = min ?? Math.floor(Math.min(...all) / 10) * 10, mx = max ?? Math.ceil(Math.max(...all) / 10) * 10;
    const iw = w - padL - padR, ih = h - padT - padB;
    const X = (i, n) => padL + (i * iw) / (n - 1), Y = (v) => padT + ih - ((v - mn) / (mx - mn)) * ih;
    let grid = "";
    for (let t = 0; t <= ticks; t++) {
      const v = mn + ((mx - mn) * t) / ticks, y = Y(v);
      grid += `<line x1="${padL}" x2="${w - padR}" y1="${y}" y2="${y}" ${t === 0 ? "" : 'stroke-dasharray="2 4"'}/><text x="${padL - 8}" y="${y + 3}" text-anchor="end">${Math.round(v)}${unit}</text>`;
    }
    const step = Math.ceil(labels.length / 7);
    const xl = labels.map((l, i) => (i % step === 0 || i === labels.length - 1 ? `<text x="${X(i, labels.length)}" y="${h - 6}" text-anchor="middle">${l}</text>` : "")).join("");
    const bandSvg = bands.map((b) => `<rect x="${X(b[0], labels.length)}" y="${padT}" width="${X(b[1], labels.length) - X(b[0], labels.length)}" height="${ih}" fill="${b[2] || "var(--violet)"}" opacity=".08"/><text x="${X(b[0], labels.length) + 6}" y="${padT + 12}" style="fill:${b[2] || "var(--violet)"}">${b[3] || ""}</text>`).join("");
    const paths = series.map((s, si) => {
      const pts = s.data.map((v, i) => [X(i, s.data.length), Y(v)]);
      const d = smooth(pts), g = id("lg"), last = pts[pts.length - 1];
      const c = s.color || "var(--violet)";
      return `${s.area ? `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:${c};stop-opacity:.2"/><stop offset="1" style="stop-color:${c};stop-opacity:0"/></linearGradient></defs><path d="${d} L${last[0]},${padT + ih} L${pts[0][0]},${padT + ih}Z" fill="url(#${g})"/>` : ""}
        <path class="${si === 0 ? "draw" : ""}" d="${d}" fill="none" stroke="${c}" stroke-width="${s.width || 2}" ${s.dash ? 'stroke-dasharray="4 4"' : ""} stroke-linecap="round"/>
        ${s.dots ? pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="2.5" fill="var(--surface)" stroke="${c}" stroke-width="1.5"/>`).join("") : ""}
        ${s.end !== false && !s.dash ? `<circle cx="${last[0]}" cy="${last[1]}" r="4" fill="${c}" stroke="var(--surface)" stroke-width="2"/>` : ""}`;
    }).join("");
    let mk = "";
    if (marker) {
      const x = X(marker.i, labels.length), y = Y(series[0].data[marker.i]);
      mk = `<line x1="${x}" x2="${x}" y1="${padT}" y2="${padT + ih}" stroke="var(--text-3)" stroke-dasharray="2 3"/>
        <g transform="translate(${Math.min(x + 8, w - 172)} ${Math.max(y - 44, padT)})"><rect width="164" height="38" rx="8" fill="var(--text)"/><text x="10" y="15" style="fill:var(--bg);opacity:.6">${marker.label}</text><text x="10" y="30" style="fill:var(--bg);font-size:12px;font-weight:600">${marker.value}</text></g>`;
    }
    const n0 = series[0].data.length, cw = iw / Math.max(1, n0 - 1);
    const hov = series[0].data.map((_, i) => { const lab = (o.tipLabels && o.tipLabels[i]) || labels[i] || ""; const vals = series.map((s) => Math.round(s.data[i] * 10) / 10 + unit).join(" · "); return `<rect class="hv" x="${Math.max(padL, X(i, n0) - cw / 2)}" y="${padT}" width="${cw}" height="${ih}" data-tip="${lab ? lab + ": " : ""}${vals}${o.tipUnit || ""}" data-hx="${X(i, n0)}"/>`; }).join("");
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" width="100%" preserveAspectRatio="none" style="height:auto;overflow:visible"><g class="grid">${grid}</g>${bandSvg}${xl}${paths}${mk}<g class="hovs">${hov}</g></svg>`;
  };

  /* ---------- radar ---------- */
  K.radar = (axes, sets, o = {}) => {
    const { size = 260, max = 100, labels = true, rings = 4 } = o;
    const c = size / 2, r = size / 2 - (labels ? 42 : 8), n = axes.length;
    const P = (i, v) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return [c + Math.cos(a) * r * (v / max), c + Math.sin(a) * r * (v / max)]; };
    let g = "";
    for (let k = 1; k <= rings; k++) g += `<polygon points="${axes.map((_, i) => P(i, (max * k) / rings).join(",")).join(" ")}" fill="none" stroke="var(--chart-grid)" ${k < rings ? 'stroke-dasharray="2 3"' : ""}/>`;
    g += axes.map((_, i) => `<line x1="${c}" y1="${c}" x2="${P(i, max)[0]}" y2="${P(i, max)[1]}" stroke="var(--chart-grid)"/>`).join("");
    const shapes = sets.map((s) => {
      const pts = s.data.map((v, i) => P(i, v));
      return `<polygon points="${pts.map((p) => p.join(",")).join(" ")}" fill="${s.color}" fill-opacity="${s.fill ?? 0.16}" stroke="${s.color}" stroke-width="${s.dash ? 1.2 : 1.8}" ${s.dash ? 'stroke-dasharray="3 3"' : ""} stroke-linejoin="round"/>
        ${s.dash ? "" : pts.map((p, i) => `<circle class="pt" cx="${p[0]}" cy="${p[1]}" r="3" fill="var(--surface)" stroke="${s.color}" stroke-width="1.6" data-tip="${axes[i]}: ${s.data[i]}"/>`).join("")}`;
    }).join("");
    const lb = labels ? axes.map((a, i) => {
      const [x, y] = P(i, max * 1.2); const anchor = Math.abs(x - c) < 6 ? "middle" : x > c ? "start" : "end";
      return `<text x="${x}" y="${y - 2}" text-anchor="${anchor}" style="font-family:var(--font-ui);font-size:11px;fill:var(--text-2);font-weight:500">${a}</text><text x="${x}" y="${y + 12}" text-anchor="${anchor}" style="font-size:11px;fill:var(--text);font-weight:600">${sets[0].data[i]}</text>`;
    }).join("") : "";
    return `<svg class="chart" viewBox="0 0 ${size} ${size}" width="100%" style="max-width:${size}px;height:auto;overflow:visible;margin:auto">${g}${shapes}${lb}</svg>`;
  };

  /* ---------- ring ---------- */
  K.ring = (pct, o = {}) => {
    const { size = 120, stroke = 10, color = "var(--violet)", track = "var(--surface-3)", label = "", sub = "", ticks = false, mark } = o;
    const c = size / 2, r = (size - stroke) / 2, C = 2 * Math.PI * r;
    const pt = (rad, p) => { const a = -Math.PI / 2 + (p / 100) * Math.PI * 2; return [c + Math.cos(a) * rad, c + Math.sin(a) * rad]; };
    let tk = "";
    if (ticks) {
      const n = 50;
      for (let i = 0; i < n; i++) {
        const p = (i / n) * 100, major = i % 5 === 0, lit = p <= pct;
        const r1 = r + stroke / 2 + 4, r2 = r1 + (major ? 5 : 3);
        const [x1, y1] = pt(r1, p), [x2, y2] = pt(r2, p);
        tk += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${lit ? color : "var(--line-2)"}" stroke-opacity="${lit ? (major ? 0.9 : 0.5) : 1}" stroke-width="${major ? 1.4 : 1}" stroke-linecap="round"/>`;
      }
    }
    let mk = "";
    if (mark != null) {
      const [x1, y1] = pt(r - stroke / 2 - 3, mark), [x2, y2] = pt(r + stroke / 2 + 3, mark);
      mk = `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="var(--text)" stroke-width="2" stroke-linecap="round"><title>Tier average ${mark}</title></line>`;
    }
    const [ex, ey] = pt(r, pct);
    const pad = ticks ? 12 : 0;
    const big = size * (sub ? 0.27 : 0.28), small = Math.max(9, size * 0.075);
    return `<svg viewBox="${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}" width="${size + pad * 2}" height="${size + pad * 2}" aria-hidden="true">${tk}
      <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${track}" stroke-width="${stroke}"/>
      ${pct <= 0 ? "" : `<circle class="ring-arc" cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${Math.max(0, (C * pct) / 100 - (pct < 100 ? 0.01 : 0))} ${C}" transform="rotate(-90 ${c} ${c})"/>`}
      ${pct > 0 && pct < 100 && ticks ? `<circle cx="${ex.toFixed(2)}" cy="${ey.toFixed(2)}" r="${stroke * 0.32}" fill="var(--surface)"/>` : ""}
      ${mk}
      ${label ? `<text x="${c}" y="${sub ? c - small * 0.55 : c}" text-anchor="middle" dominant-baseline="central" style="font-family:var(--font-ui);font-stretch:122%;font-weight:650;font-size:${big}px;letter-spacing:-.02em;fill:var(--text);font-variant-numeric:tabular-nums">${label}</text>` : ""}
      ${sub ? `<text x="${c}" y="${c + big * 0.5 + small * 0.6}" text-anchor="middle" dominant-baseline="central" style="font-family:var(--font-mono);font-size:${small}px;fill:var(--text-3);letter-spacing:.1em">${sub}</text>` : ""}
    </svg>`;
  };

  /* ---------- vertical bars ---------- */
  K.bars = (vals, o = {}) => {
    const { w = 300, h = 90, color = "var(--violet)", hl = -1, gap = 4, labels } = o;
    const mx = Math.max(...vals), bw = (w - gap * (vals.length - 1)) / vals.length, lh = labels ? 16 : 0;
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" width="100%" preserveAspectRatio="none" style="height:${h}px">${vals.map((v, i) => {
      const bh = ((h - lh) * v) / mx;
      return `<rect class="bar" data-tip="${labels ? labels[i] + ": " : ""}${v}" x="${i * (bw + gap)}" y="${h - lh - bh}" width="${bw}" height="${bh}" rx="2" fill="${i === hl ? "var(--ember)" : color}" opacity="${i === hl ? 1 : 0.85}"/>${labels ? `<text x="${i * (bw + gap) + bw / 2}" y="${h - 3}" text-anchor="middle">${labels[i]}</text>` : ""}`;
    }).join("")}</svg>`;
  };

  /* ---------- histogram with "you" marker ---------- */
  K.dist = (you, o = {}) => {
    const { w = 420, h = 120 } = o; const n = 34; let s = "";
    for (let i = 0; i < n; i++) {
      const x = i / (n - 1); const v = Math.exp(-Math.pow((x - 0.52) / 0.2, 2)) * 0.9 + 0.06;
      const bw = w / n - 2, bh = v * (h - 26); const on = Math.abs(x - you) < 0.5 / n;
      s += `<rect x="${i * (w / n)}" y="${h - 18 - bh}" width="${bw}" height="${bh}" rx="1.5" fill="${x <= you ? "var(--violet)" : "var(--surface-3)"}" opacity="${x <= you ? 0.35 + x * 0.6 : 1}"/>`;
      if (on) s += `<line x1="${i * (w / n) + bw / 2}" x2="${i * (w / n) + bw / 2}" y1="4" y2="${h - 18}" stroke="var(--text)" stroke-width="1.5"/><text x="${i * (w / n) + bw / 2}" y="${h - 4}" text-anchor="middle" style="fill:var(--text);font-weight:600">YOU</text>`;
    }
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" width="100%" style="height:auto">${s}<text x="0" y="${h - 4}">BOTTOM</text><text x="${w}" y="${h - 4}" text-anchor="end">TOP 1%</text></svg>`;
  };

  /* ---------- heat calendar ---------- */
  K.heat = (weeks = 18, o = {}) => {
    const { cell = 13, gap = 3, seed = 7 } = o; let s = "", r = seed;
    const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
    for (let w = 0; w < weeks; w++) for (let d = 0; d < 7; d++) {
      const v = rnd(); const lv = v < 0.18 ? 0 : v < 0.45 ? 1 : v < 0.72 ? 2 : v < 0.9 ? 3 : 4;
      const op = [0, 0.22, 0.45, 0.7, 1][lv];
      s += `<rect x="${w * (cell + gap)}" y="${d * (cell + gap)}" width="${cell}" height="${cell}" rx="3" fill="${lv ? "var(--violet)" : "var(--surface-3)"}" fill-opacity="${lv ? op : 1}"/>`;
    }
    const W = weeks * (cell + gap) - gap, H = 7 * (cell + gap) - gap;
    return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="height:auto;max-width:${W * 1.4}px">${s}</svg>`;
  };

  /* ---------- fake QR (deterministic) ---------- */
  K.qr = (seed = "SETA", size = 112) => {
    const n = 25; let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const rnd = () => ((h = (h * 1103515245 + 12345) >>> 0) / 4294967296);
    const m = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
    const u = size / n; let s = "";
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!m(x, y) && !(x > 9 && x < 15 && y > 9 && y < 15) && rnd() > 0.52) s += `<rect x="${x * u}" y="${y * u}" width="${u + 0.2}" height="${u + 0.2}"/>`;
    const finder = (x, y) => `<rect x="${x * u}" y="${y * u}" width="${7 * u}" height="${7 * u}" rx="${u * 1.4}"/><rect x="${(x + 1) * u}" y="${(y + 1) * u}" width="${5 * u}" height="${5 * u}" rx="${u}" fill="#fff"/><rect x="${(x + 2) * u}" y="${(y + 2) * u}" width="${3 * u}" height="${3 * u}" rx="${u * 0.6}"/>`;
    const c = 10 * u;
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="#15102A">${s}${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}<g transform="translate(${c} ${c})"><rect width="${5 * u}" height="${5 * u}" rx="${u}" fill="#5A2FCF"/><path fill="#fff" transform="translate(${2.5 * u} ${2.5 * u}) scale(${u * 0.13})" d="M0 -12c.5 6 6 11.5 12 12-6 .5-11.5 6-12 12-.5-6-6-11.5-12-12 6-.5 11.5-6 12-12z"/></g></svg>`;
  };

  /* ---------- guilloche (security pattern) ---------- */
  K.guil = (w = 600, h = 400, color = "#8C6CFF") => {
    let s = "";
    for (let k = 0; k < 18; k++) {
      let d = ""; const amp = 18 + k * 1.2, ph = k * 0.35, yb = 40 + k * 20;
      for (let x = 0; x <= w; x += 6) { const y = yb + Math.sin(x / 38 + ph) * amp * Math.cos(x / 170 + k * 0.2); d += (x ? "L" : "M") + x + "," + y.toFixed(1); }
      s += `<path d="${d}" fill="none" stroke="${color}" stroke-width=".6" opacity="${0.25 + (k % 3) * 0.15}"/>`;
    }
    return `<svg class="guil" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${s}</svg>`;
  };

  /* ---------- tactical minimap for replay ---------- */
  K.map = () => `<svg viewBox="0 0 640 360" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <defs><pattern id="mg" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#fff" stroke-opacity=".04"/></pattern></defs>
    <rect width="640" height="360" fill="#0F0C18"/><rect width="640" height="360" fill="url(#mg)"/>
    <g fill="#1C1828" stroke="#2E2840" stroke-width="1.5">
      <path d="M80 60h150v70h60v-40h120v90h-70v60h110v80H330v-50h-80v70H90v-110h70v-60H80z"/>
      <path d="M460 50h110v120h-60v40h-50z"/><path d="M470 250h110v70H470z"/>
    </g>
    <g font-family="IBM Plex Mono" font-size="11" fill="#6E6880" letter-spacing=".1em"><text x="104" y="92">A SITE</text><text x="488" y="78">B SITE</text><text x="300" y="170">MID</text></g>
    <path d="M140 300 C 190 250, 230 210, 300 190 S 410 150, 470 110" fill="none" stroke="#9677FF" stroke-width="2.5" stroke-dasharray="1 6" stroke-linecap="round"/>
    <path d="M140 300 C 190 250, 230 210, 300 190" fill="none" stroke="#9677FF" stroke-width="2.5" stroke-linecap="round"/>
    <g><circle cx="300" cy="190" r="16" fill="#9677FF" fill-opacity=".18"/><circle cx="300" cy="190" r="6" fill="#9677FF" stroke="#0F0C18" stroke-width="2"/></g>
    <g fill="#FF6B81"><circle cx="388" cy="146" r="5"/><circle cx="512" cy="96" r="5"/><circle cx="420" cy="200" r="5" fill-opacity=".45"/></g>
    <path d="M300 190 L388 146" stroke="#FF6B81" stroke-width="1" stroke-dasharray="3 3"/>
    <g transform="translate(330 150)"><path d="M0 0 L46 -18 L46 18Z" fill="#9677FF" fill-opacity=".14"/></g>
    <g transform="translate(355 216)"><rect width="150" height="44" rx="8" fill="#15121C" stroke="#363141"/><text x="12" y="18" font-family="IBM Plex Mono" font-size="10" fill="#FF8550" letter-spacing=".08em">MISTAKE · 08:42</text><text x="12" y="34" font-family="Archivo" font-size="12" fill="#EDEAF4" font-weight="600">Wide peek without util</text></g>
  </svg>`;

  window.K = K;
})();
