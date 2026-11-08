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

  /* ---------- kashida (tatweel) ---------- */
  const TATWEEL = "ـ";
  const NON_JOIN_AFTER = new Set("اأإآدذرزوؤةءىـ".split(""));
  const ARABIC = /[ء-ي]/;
  function kashidaWord(w, n) {
    // candidate joints: letter i joins to i+1 (i is dual-joining and next is an Arabic letter)
    const chars = [...w], cands = [];
    for (let i = 0; i < chars.length - 1; i++) {
      if (ARABIC.test(chars[i]) && ARABIC.test(chars[i + 1]) && !NON_JOIN_AFTER.has(chars[i]) && !/[ً-ْ]/.test(chars[i + 1])) cands.push(i);
    }
    if (!cands.length) return w;
    // traditional placement: the joint closest to the end (before the last connected letter), never the first joint of short words
    let pick = cands[cands.length - 1];
    if (chars.length > 4 && cands.length > 1 && pick === chars.length - 2) pick = cands[cands.length - 1];
    chars.splice(pick + 1, 0, TATWEEL.repeat(n));
    return chars.join("");
  }
  K.kashida = function (text, n = 2, maxWords = 1) {
    const words = text.split(/(\s+)/);
    const idx = words.map((w, i) => [w, i]).filter(([w]) => ARABIC.test(w) && [...w].length >= 4).sort((a, b) => [...b[0]].length - [...a[0]].length).slice(0, maxWords).map((x) => x[1]);
    idx.forEach((i) => (words[i] = kashidaWord(words[i], n)));
    return words.join("");
  };
  const KASHIDA_SEL = ".hero > h1, .sec-h h2, .cta-band h2, .canvas-head .h1, .page-head .h1, .loop h3, .sp-tag, .pp-large, .m-title, .feat h3";
  function applyKashida(scope) {
    if (!K.isAr) return;
    (scope.matches && scope.matches(KASHIDA_SEL) ? [scope] : []).concat([...scope.querySelectorAll ? scope.querySelectorAll(KASHIDA_SEL) : []]).forEach((el) => {
      if (el.dataset.k || el.closest("[data-noi18n]")) return;
      const tn = [...el.childNodes].filter((n) => n.nodeType === 3 && ARABIC.test(n.textContent));
      if (!tn.length) return;
      // one stretched word per headline, on the longest text node
      const target = tn.sort((a, b) => b.textContent.length - a.textContent.length)[0];
      const base = target.textContent;
      const n = el.matches(".hero > h1, .cta-band h2") ? 3 : el.matches(".sec-h h2, .canvas-head .h1, .sp-tag") ? 2 : 1;
      target.textContent = K.kashida(base, n);
      el.dataset.k = "1";
      if (el.matches(".hero > h1, .sec-h h2, .cta-band h2, .canvas-head .h1")) {
        el.classList.add("k-live");
        let timer;
        el.addEventListener("mouseenter", () => { clearInterval(timer); let s = n; timer = setInterval(() => { s++; target.textContent = K.kashida(base, s); if (s >= n + 4) clearInterval(timer); }, 45); });
        el.addEventListener("mouseleave", () => { clearInterval(timer); let s = n + 4; timer = setInterval(() => { s--; target.textContent = K.kashida(base, s); if (s <= n) clearInterval(timer); }, 45); });
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
