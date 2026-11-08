/* SETA — i18n engine: Arabic-first, RTL, kashida display typography.
   - Language + direction are applied before first paint.
   - Every rendered node (screens, phone app, popovers, menus, toasts, SVG labels)
     is translated live through a MutationObserver against the AR dictionary.
   - Display headlines get rule-based kashida (tatweel) that stretches on hover. */
(function () {
  const K = (window.K = window.K || {});
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const lang = (K.lang = store.get("seta-lang") || "ar");
  K.plain = (s) => String(s).replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "");
  const root = document.documentElement;
  root.setAttribute("lang", lang);
  root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  K.isAr = lang === "ar";
  K.setLang = (l) => { store.set("seta-lang", l); location.reload(); };

  const DICT = () => window.SETA_AR || {};
  const RX = () => window.SETA_AR_RX || [];
  const norm = (s) => s.replace(/\s+/g, " ").trim();
  const hasLatin = /[A-Za-z]/;

  /* translate a single string (exact → rules) */
  function t(s) {
    if (!K.isAr || !s) return s;
    const k = norm(s);
    if (!k || !hasLatin.test(k)) return s;
    const d = DICT();
    if (Object.prototype.hasOwnProperty.call(d, k)) return s.replace(k, d[k]);
    for (const [re, rep] of RX()) { if (re.test(k)) return s.replace(k, k.replace(re, rep)); }
    return s;
  }
  K.t = t;

  /* ---------- kashida + swash, following “دليل جماليات خط ثمانية” ----------
     Slanted kashida (الكشيدة المائلة):
       1. only between the LAST letter and the one before it
       2. never more than once in a word
       3. never stretched to its maximum (we cap at 3 units)
     Swash letters (الأحرف المرسلة · OpenType "salt"):
       4. never used heavily in a sentence (one word per headline)
       5. never on two adjacent words (kept away from the kashida word too) */
  const TATWEEL = "ـ";
  const KMAX = 3;
  const NON_JOIN_AFTER = new Set("اأإآدذرزوؤةءىـ".split(""));
  const LETTER = /[ء-ي]/;
  const MARK = /[ً-ْٰ]/;
  const ARABIC = LETTER;
  /* returns the insertion index (before the last letter) or -1 when the rule can't be met */
  function kashidaPoint(chars) {
    if (chars.includes(TATWEEL)) return -1;                            // once per word
    // the last place where a letter connects to the next one — i.e. inside the word's final connected group
    for (let j = chars.length - 1; j > 0; j--) {
      if (!LETTER.test(chars[j])) continue;
      let prev = j - 1;
      while (prev >= 0 && MARK.test(chars[prev])) prev--;             // marks belong to the previous letter
      if (prev >= 0 && LETTER.test(chars[prev]) && !NON_JOIN_AFTER.has(chars[prev])) return j;
    }
    return -1;
  }
  function kashidaWord(w, n) {
    const chars = [...w], at = kashidaPoint(chars);
    if (at < 0 || n <= 0) return w;
    chars.splice(at, 0, TATWEEL.repeat(Math.min(KMAX, n)));
    return chars.join("");
  }
  const eligible = (w) => LETTER.test(w) && [...w].filter((c) => LETTER.test(c)).length >= 3 && kashidaPoint([...w]) > -1;
  /* stretch the longest eligible word(s) — one kashida per word */
  K.kashida = function (text, n = 1, maxWords = 1) {
    const words = text.split(/(\s+)/);
    const idx = words.map((w, i) => [w, i]).filter(([w]) => eligible(w)).sort((a, b) => [...b[0]].length - [...a[0]].length).slice(0, maxWords).map((x) => x[1]);
    idx.forEach((i) => (words[i] = kashidaWord(words[i], n)));
    return words.join("");
  };
  K.kashidaRules = { max: KMAX };

  const KASHIDA_SEL = ".hero > h1, .sec-h h2, .cta-band h2, .canvas-head .h1, .page-head .h1, .loop h3, .sp-tag, .pp-large, .m-title, .feat h3";
  const BIG = ".hero > h1, .cta-band h2, .sec-h h2, .canvas-head .h1";
  const reduced = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function applyKashida(scope) {
    if (!K.isAr) return;
    (scope.matches && scope.matches(KASHIDA_SEL) ? [scope] : []).concat([...(scope.querySelectorAll ? scope.querySelectorAll(KASHIDA_SEL) : [])]).forEach((el) => {
      if (el.dataset.k || el.closest("[data-noi18n]")) return;
      const tns = [...el.childNodes].filter((n) => n.nodeType === 3 && LETTER.test(n.textContent));
      if (!tns.length) return;
      el.dataset.k = "1";
      // pick the text node holding the longest eligible word
      let best = null;
      tns.forEach((tn) => tn.textContent.split(/\s+/).forEach((w) => { if (eligible(w) && (!best || [...w].length > [...best.w].length)) best = { tn, w }; }));
      if (!best) return;
      const n = el.matches(".hero > h1, .cta-band h2") ? 2 : 1;
      // split that text node into: before · <span.kw>word</span> · after   (so we can animate just the word)
      const txt = best.tn.textContent, pos = txt.indexOf(best.w);
      const frag = document.createDocumentFragment();
      if (pos > 0) frag.appendChild(document.createTextNode(txt.slice(0, pos)));
      const kw = document.createElement("span"); kw.className = "kw"; kw.textContent = kashidaWord(best.w, n); frag.appendChild(kw);
      const rest = txt.slice(pos + best.w.length);
      if (rest) frag.appendChild(document.createTextNode(rest));
      best.tn.replaceWith(frag);
      // swash: one word, never adjacent to the kashida word (or to another swash)
      if (el.matches(BIG)) {
        const nodes = [...el.childNodes].filter((n) => n.nodeType === 3 && LETTER.test(n.textContent));
        const order = [];
        [...el.childNodes].forEach((n) => { if (n === kw) order.push({ kw: true }); else if (n.nodeType === 3) n.textContent.split(/(\s+)/).forEach((w) => /\S/.test(w) && order.push({ n, w })); else if (n.nodeType === 1 && n.tagName !== "BR") order.push({ el: n }); });
        const ki = order.findIndex((o) => o.kw);
        const cand = order.map((o, i) => [o, i]).filter(([o, i]) => o.n && LETTER.test(o.w) && Math.abs(i - ki) >= 2 && [...o.w].length >= 3).pop();
        if (cand && nodes.includes(cand[0].n)) {
          const tn = cand[0].n, t2 = tn.textContent, p2 = t2.lastIndexOf(cand[0].w);
          const f2 = document.createDocumentFragment();
          if (p2 > 0) f2.appendChild(document.createTextNode(t2.slice(0, p2)));
          const sw = document.createElement("span"); sw.className = "sw"; sw.textContent = cand[0].w; f2.appendChild(sw);
          if (t2.slice(p2 + cand[0].w.length)) f2.appendChild(document.createTextNode(t2.slice(p2 + cand[0].w.length)));
          tn.replaceWith(f2);
        }
      }
      // motion: the kashida draws in, and breathes on hover — never past the font's comfortable maximum
      if (el.matches(BIG) && !reduced()) {
        el.classList.add("k-live");
        const base = best.w; let timer, cur = 0;
        const set = (k) => { cur = k; kw.textContent = kashidaWord(base, k); };
        const tween = (to, ms) => { clearInterval(timer); timer = setInterval(() => { if (cur === to) return clearInterval(timer); set(cur + (to > cur ? 1 : -1)); }, ms); };
        set(0); setTimeout(() => tween(n, 160), 650);
        el.addEventListener("mouseenter", () => tween(KMAX, 110));
        el.addEventListener("mouseleave", () => tween(n, 140));
      }
    });
  }
  K.applyKashida = applyKashida;

  /* ---------- tree translation ---------- */
  const ATTRS = ["placeholder", "data-tip", "aria-label", "title", "alt"];
  const SKIP = "script,style,code,[data-noi18n]";
  const RICH = "h1, h2, h3, p, li, .bub, .lede, .m-sub, .faint, .muted, .s, .hint, .caption span:last-child";
  function translateTree(rootEl) {
    if (!K.isAr || !rootEl) return;
    if (rootEl.nodeType === 3) { const v = t(rootEl.textContent); if (v !== rootEl.textContent) rootEl.textContent = v; return; }
    if (rootEl.nodeType !== 1 || rootEl.closest?.(SKIP)) return;
    // 1) rich sentences that contain inline markup: translate as a whole when the dictionary has them
    const d = DICT();
    const rich = (rootEl.matches(RICH) ? [rootEl] : []).concat([...rootEl.querySelectorAll(RICH)]);
    rich.forEach((el) => {
      if (!el.children.length || el.querySelector("svg, img, button, input, i[data-lucide], .lucide")) return;
      const k = norm(el.textContent);
      if (k && Object.prototype.hasOwnProperty.call(d, k)) { if (/<(em|br|b)>/.test(d[k])) el.innerHTML = d[k]; else el.textContent = d[k]; }
    });
    // 2) text nodes
    const w = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement && n.parentElement.closest(SKIP) ? NodeFilter.FILTER_REJECT : hasLatin.test(n.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT) });
    const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    const TAGS = /<(em|br|b)[^>]*>/;
    nodes.forEach((n) => {
      const v = t(n.textContent); if (v === n.textContent) return;
      if (TAGS.test(v)) { const p = n.parentElement; if (p && p.childNodes.length === 1 && !p.closest("svg")) { p.innerHTML = v; return; } n.textContent = v.replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, ""); return; }
      n.textContent = v;
    });
    // 3) attributes
    ATTRS.forEach((a) => {
      const els = rootEl.hasAttribute?.(a) ? [rootEl] : [];
      els.concat([...rootEl.querySelectorAll(`[${a}]`)]).forEach((el) => { const v = el.getAttribute(a); const tv = t(v).replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, ""); if (tv !== v) el.setAttribute(a, tv); });
    });
    applyKashida(rootEl);
  }
  K.translateTree = translateTree;

  /* ---------- observe everything ---------- */
  let queued = new Set(), raf = 0;
  function flush() { raf = 0; const q = [...queued]; queued.clear(); q.forEach((n) => n.isConnected && translateTree(n)); }
  function start() {
    if (!K.isAr) return;
    translateTree(document.body);
    new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === "childList") m.addedNodes.forEach((n) => (n.nodeType === 1 || n.nodeType === 3) && queued.add(n));
        else if (m.type === "attributes" && ATTRS.includes(m.attributeName)) queued.add(m.target);
      }
      if (queued.size && !raf) raf = requestAnimationFrame(flush);
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ATTRS });
    const ti = document.title; document.title = t(ti);
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);

  /* language switch control (used in prototype bar, landing nav, phone) */
  K.langSwitch = () => `<div class="lang-sw" role="group" aria-label="Language" data-noi18n><button class="${lang === "ar" ? "on" : ""}" onclick="K.setLang('ar')" lang="ar">ع</button><button class="${lang === "en" ? "on" : ""}" onclick="K.setLang('en')" lang="en">EN</button></div>`;
})();
