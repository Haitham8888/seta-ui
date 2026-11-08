/* SETA — splash on every load
   Starfield that reacts to the cursor, the wordmark's orbit drawing itself with a
   satellite riding it, a light sweep across the logo, 3D tilt that follows the pointer,
   a boot sequence, and a star burst on click. Click, tap or press any key to skip. */
(function () {
  const reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STEPS = ["Syncing matches", "Reading BioSync", "Scoring 40 matches", "Preparing your Command Center"];
  const DURATION = reduced ? 700 : 2600;

  const light = document.documentElement.getAttribute("data-theme") === "light";
  const el = document.createElement("div");
  el.className = "splash" + (light ? " sp-light" : "");
  el.setAttribute("role", "status");
  el.setAttribute("aria-label", "Loading SETA");
  const ORBIT = "M 40 250 C 170 40, 520 -20, 640 170";
  el.innerHTML = `
    <canvas class="sp-stars"></canvas>
    <div class="sp-glow"></div>
    <div class="sp-stage">
      <div class="sp-tilt">
        <svg class="sp-orbit" viewBox="0 0 680 300" aria-hidden="true">
          <defs>
            <linearGradient id="spg" x1="0" x2="1"><stop offset="0" style="stop-color:var(--sp-a);stop-opacity:0"/><stop offset=".55" style="stop-color:var(--sp-a)"/><stop offset="1" style="stop-color:var(--sp-b);stop-opacity:.2"/></linearGradient>
            <filter id="spb"><feGaussianBlur stdDeviation="3"/></filter>
          </defs>
          <path class="sp-arc2" d="M 70 285 C 200 80, 540 30, 670 210" fill="none" style="stroke:var(--sp-a)" stroke-opacity=".22" stroke-width="1"/>
          <path class="sp-arc" d="${ORBIT}" fill="none" stroke="url(#spg)" stroke-width="2.4" stroke-linecap="round"/>
          <g class="sp-sat"><circle r="9" style="fill:var(--sp-a)" opacity=".35" filter="url(#spb)"/><circle r="3.4" style="fill:var(--sp-sat)"/>
            ${reduced ? "" : `<animateMotion dur="2.2s" begin="0.15s" fill="freeze" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".2 .7 .2 1" path="${ORBIT}"/>`}</g>
          <g class="sp-star" transform="translate(588 92)"><path style="fill:var(--sp-b)" d="M0 -22c1 11 11 21 22 22-11 1-21 11-22 22-1-11-11-21-22-22 11-1 21-11 22-22z"/></g>
          <g class="sp-star s2" transform="translate(520 40) scale(.45)"><path style="fill:var(--sp-b)" d="M0 -22c1 11 11 21 22 22-11 1-21 11-22 22-1-11-11-21-22-22 11-1 21-11 22-22z"/></g>
        </svg>
        <div class="sp-logo">
          <img src="assets/wordmark-${light ? "light" : "dark"}.png" alt="SETA" draggable="false">
          <i class="sp-shine"></i>
        </div>
      </div>
      <div class="sp-tag">Smart Esports Talent Platform</div>
      <div class="sp-boot">
        <div class="sp-bar"><i></i></div>
        <div class="sp-row"><span class="sp-step">${STEPS[0]}</span><span class="sp-pct">0%</span></div>
      </div>
    </div>
    <div class="sp-hint"><span class="sp-key">Click</span> or press any key to enter</div>`;

  const mount = () => { document.body.appendChild(el); start(); };
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

  function start() {
    document.documentElement.classList.add("sp-lock");
    const t0 = performance.now();
    let done = false, raf;
    const bar = el.querySelector(".sp-bar i"), pct = el.querySelector(".sp-pct"), step = el.querySelector(".sp-step");
    const tilt = el.querySelector(".sp-tilt"), glow = el.querySelector(".sp-glow");

    /* ---------- starfield ---------- */
    const cv = el.querySelector(".sp-stars"), ctx = cv.getContext("2d");
    let W, H, DPR = Math.min(2, devicePixelRatio || 1);
    const stars = [], sparks = [];
    const size = () => { W = cv.width = innerWidth * DPR; H = cv.height = innerHeight * DPR; cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px"; };
    size(); addEventListener("resize", size);
    for (let i = 0; i < 140; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, z: Math.random() * .9 + .1, tw: Math.random() * 6.28, vx: 0, vy: 0 });
    let mx = W / 2, my = H / 2, tx = 0, ty = 0;

    function frame(now) {
      ctx.clearRect(0, 0, W, H);
      const px = (mx / W - .5), py = (my / H - .5);
      for (const s of stars) {
        const dx = s.x - mx, dy = s.y - my, d2 = dx * dx + dy * dy, R = 140 * DPR;
        if (d2 < R * R) { const f = (1 - Math.sqrt(d2) / R) * 1.6; s.vx += (dx / (Math.sqrt(d2) + 1)) * f; s.vy += (dy / (Math.sqrt(d2) + 1)) * f; }
        s.vx *= .9; s.vy *= .9; s.x += s.vx + .06 * s.z * DPR; s.y += s.vy;
        if (s.x > W) s.x = 0; if (s.x < 0) s.x = W; if (s.y > H) s.y = 0; if (s.y < 0) s.y = H;
        const ox = -px * 30 * s.z * DPR, oy = -py * 30 * s.z * DPR;
        const a = .25 + .55 * s.z * (.6 + .4 * Math.sin(now / 600 + s.tw));
        ctx.fillStyle = light ? `rgba(90,47,207,${a * .55})` : `rgba(214,204,255,${a})`;
        const r = s.z * 1.5 * DPR;
        ctx.beginPath(); ctx.arc(s.x + ox, s.y + oy, r, 0, 6.283); ctx.fill();
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i]; p.x += p.vx; p.y += p.vy; p.vx *= .96; p.vy = p.vy * .96 + .05 * DPR; p.life -= .018;
        if (p.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot += .1); ctx.globalAlpha = p.life; ctx.fillStyle = p.c;
        const s = p.s * DPR; ctx.beginPath(); ctx.moveTo(0, -s); ctx.quadraticCurveTo(s * .15, -s * .15, s, 0); ctx.quadraticCurveTo(s * .15, s * .15, 0, s); ctx.quadraticCurveTo(-s * .15, s * .15, -s, 0); ctx.quadraticCurveTo(-s * .15, -s * .15, 0, -s); ctx.fill(); ctx.restore();
      }
      // smooth tilt
      tx += ((mx / W - .5) - tx) * .08; ty += ((my / H - .5) - ty) * .08;
      tilt.style.transform = `rotateY(${tx * 18}deg) rotateX(${-ty * 14}deg)`;
      glow.style.transform = `translate(${tx * 60}px, ${ty * 60}px)`;
      // boot progress
      const p = Math.min(1, (now - t0) / DURATION), e = 1 - Math.pow(1 - p, 2.2);
      bar.style.transform = `scaleX(${e})`;
      pct.textContent = Math.round(e * 100) + "%";
      const sv = STEPS[Math.min(STEPS.length - 1, Math.floor(e * STEPS.length))]; const tv = window.K && K.t ? K.t(sv) : sv; if (step.textContent !== tv) step.textContent = tv;
      if (p >= 1 && !done) leave(innerWidth / 2, innerHeight / 2);
      if (!done || sparks.length) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    const burst = (x, y, n = 36) => { for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, v = (2 + Math.random() * 6) * DPR; sparks.push({ x: x * DPR, y: y * DPR, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, s: 2 + Math.random() * 5, rot: Math.random() * 6, c: Math.random() < .25 ? (light ? "#D9531E" : "#FF8550") : Math.random() < .5 ? (light ? "#241046" : "#F1EEFF") : (light ? "#5A2FCF" : "#9677FF") }); } };

    const move = (e) => { const t = e.touches ? e.touches[0] : e; mx = t.clientX * DPR; my = t.clientY * DPR; };
    el.addEventListener("pointermove", move, { passive: true });

    function leave(x, y) {
      if (done) return; done = true;
      el.style.setProperty("--ox", x + "px"); el.style.setProperty("--oy", y + "px");
      el.classList.add("sp-out");
      document.documentElement.classList.remove("sp-lock");
      setTimeout(() => { cancelAnimationFrame(raf); el.remove(); removeEventListener("resize", size); }, 900);
    }
    el.addEventListener("pointerdown", (e) => { burst(e.clientX, e.clientY); setTimeout(() => leave(e.clientX, e.clientY), 160); });
    const key = (e) => { if (done) return removeEventListener("keydown", key, true); e.preventDefault(); e.stopPropagation(); burst(innerWidth / 2, innerHeight / 2, 28); leave(innerWidth / 2, innerHeight / 2); removeEventListener("keydown", key, true); };
    addEventListener("keydown", key, true);
  }
})();
