/* SETA — seamless infinite marquee.
   Items leave on the left and re-enter from the right, forever, with no seam.
   rAF-driven: eases to a stop on hover/focus, pauses off-screen, re-measures on resize,
   respects prefers-reduced-motion, and works the same in Arabic (RTL) and English. */
(function () {
  const reduced = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function init(m) {
    if (m.dataset.mq) return;
    m.dataset.mq = "1";
    const track = m.querySelector(".mq-track");
    if (!track) return;
    const all = [...track.children];
    const set = all.slice(0, Math.max(1, Math.round(all.length / 2)));   // the template ships two copies
    track.classList.add("js");
    m.style.direction = "ltr";                                             // motion runs in physical pixels
    set.forEach((el) => (el.dir = document.documentElement.dir));          // but each item reads in the page language
    let unit = 0, x = 0, v = 0, target = 1, visible = true, last = performance.now();
    const SPEED = 52;                                                      // px per second
    function build() {
      track.replaceChildren(...set);
      const w = track.scrollWidth + parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0);
      unit = w;
      let guard = 0;
      while (track.scrollWidth < m.clientWidth + unit * 2 && guard++ < 20) set.forEach((el) => track.appendChild(el.cloneNode(true)));
      x = x % unit;
    }
    build();
    if (reduced()) { track.style.transform = "none"; return; }
    v = 1;
    const enter = () => (target = 0), leave = () => (target = 1);
    m.addEventListener("pointerenter", enter); m.addEventListener("pointerleave", leave);
    m.addEventListener("focusin", enter); m.addEventListener("focusout", leave);
    new IntersectionObserver((e) => (visible = e[0].isIntersecting)).observe(m);
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 150); });
    (function tick(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!m.isConnected) return;
      v += (target - v) * Math.min(1, dt * 4);                              // smooth ease to stop / resume
      if (visible) { x -= SPEED * v * dt; if (x <= -unit) x += unit; track.style.transform = `translate3d(${x}px,0,0)`; }
      requestAnimationFrame(tick);
    })(last);
  }
  const scan = () => document.querySelectorAll(".marquee").forEach(init);
  document.addEventListener("seta:render", () => setTimeout(scan, 60));
  window.addEventListener("load", scan);
})();
