/* SETA — interaction layer
   One delegated engine for every screen: feedback on every control, working toggles,
   command palette, popovers, tooltips, chart hover, motion and theme transition. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ic = (n, c) => K.ic(n, c);
  const reduced = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const refreshIcons = () => window.lucide && lucide.createIcons();
  let px = innerWidth / 2, py = 80;

  /* elements that already have their own behaviour */
  const HANDLED = "[data-h],[onclick],[data-tab],[data-role],[data-g],[data-goal],[data-pref],[data-next],[data-back],[data-edit],[data-sk],[data-m],[data-mf],[data-mo],[data-cm],[data-cmp],[data-tt],[data-pop],[data-palette],a[href],select,input,textarea";
  const RIPPLE = ".btn,.icon-btn,.m-btn,.m-ib,.sso-ic,.chip,.m-chip,.role-card,.game-tile,.moment,.w-btn,.seg button,.m-seg span,.m-faces span,.tabs button";

  const labelOf = (el) => (el.getAttribute("aria-label") || el.getAttribute("data-tip") || el.textContent || "").replace(/\s+/g, " ").trim();

  /* ---------- action messages ---------- */
  const RULES = [
    [/export|download|save as image/, "Preparing your file…", "download"],
    [/copy link|share|send to coach/, "Link copied to clipboard", "link"],
    [/invite/, "Invitation sent", "send"],
    [/sync/, "Synced just now", "refresh-cw"],
    [/upload/, "Choose a file to upload", "upload"],
    [/join call/, "Joining the call…", "video"],
    [/reschedule|later|snooze/, "Moved to later", "clock"],
    [/reset/, "Filters reset", "rotate-ccw"],
    [/shortlist|bookmark|save search/, "Saved to your shortlist", "bookmark-check"],
    [/request|book|connect|link a watch|allow/, "Request sent", "send"],
    [/add|new|create|assign|plus/, "Added", "plus"],
    [/message|ask/, "Opening chat…", "message-square"],
    [/settings|devices|filters/, "Settings opened", "settings-2"],
    [/apply/, "Filters applied", "check"],
  ];
  function act(el) {
    const l = labelOf(el), low = l.toLowerCase();
    if (/start review|open replay|watch$|^watch|key moment/.test(low)) { toast("Opening replay…"); setTimeout(() => (location.hash = "#/replay"), 350); return; }
    if (/open passports?|passport/.test(low) && !/show qr/.test(low)) { location.hash = "#/passport"; return; }
    for (const [re, msg] of RULES) if (re.test(low)) { if (/copy link|share/.test(low) && navigator.clipboard) navigator.clipboard.writeText(location.href).catch(() => {}); toast(msg); return; }
    toast(l ? `${l.length > 34 ? l.slice(0, 32) + "…" : l} · done` : "Done");
  }

  /* ---------- ripple + pointer tracking ---------- */
  document.addEventListener("pointerdown", (e) => {
    px = e.clientX; py = e.clientY;
    const el = e.target.closest(RIPPLE);
    if (!el || reduced()) return;
    const r = el.getBoundingClientRect(), s = Math.max(r.width, r.height);
    const rip = document.createElement("span");
    rip.className = "rip";
    rip.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    el.appendChild(rip);
    setTimeout(() => rip.remove(), 650);
  }, { passive: true });

  /* ---------- delegated click engine ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t.closest(".pop, .pal")) return;
    const popBtn = t.closest("[data-pop]");
    if (popBtn) { e.preventDefault(); openPop(popBtn.dataset.pop, popBtn); return; }
    if (t.closest("[data-palette]")) { e.preventDefault(); openPalette(); return; }
    if (t.closest(HANDLED)) return;

    // switches
    const sw = t.closest(".switch");
    if (sw) { sw.classList.toggle("on"); return; }

    // segmented controls and tabs
    const seg = t.closest(".seg button, .m-seg span, .tabs button, .m-faces span");
    if (seg) { [...seg.parentElement.children].forEach((c) => c.classList.toggle("on", c === seg)); return; }

    // mobile bottom tabs → move between mobile screens
    const mt = t.closest(".m-tabs > span");
    if (mt) { const l = labelOf(mt).toLowerCase(); const to = { today: "m-day", session: "m-day", live: "m-day", stats: "m-grow", coach: "m-grow", me: "m-grow" }[l]; if (to) location.hash = "#/" + to; return; }

    // radios / role cards inside a group
    const rr = t.closest(".role-card, .m-row:has(> .radio), .li:has(> .radio)");
    if (rr) { const g = rr.parentElement; [...g.children].forEach((c) => { c.classList.toggle("on", c === rr); c.style.background = ""; const r = c.querySelector(".radio"); r && r.classList.toggle("on", c === rr); }); if (rr.classList.contains("m-row")) rr.style.background = "var(--violet-tint)"; return; }

    // check items (row or checkbox)
    const ck = t.closest(".check") || t.closest(".m-row, .li, .row")?.querySelector(":scope > .check");
    if (ck) { const on = ck.classList.toggle("on"); const row = ck.closest(".m-row, .li, .row"); const txt = row && row.querySelector(".grow > div, .grow, span:not(.check)"); if (txt && !ck.closest(".game-tile")) { txt.style.textDecoration = on ? "line-through" : ""; txt.style.color = on ? "var(--text-3)" : ""; } if (on) toast("Marked as done"); return; }

    // drills and days
    const drill = t.closest(".drill");
    if (drill && drill.closest(".day, .col")) { drill.classList.toggle("done"); return; }
    const day = t.closest(".week .day");
    if (day) { $$(".week .day").forEach((d) => d.classList.toggle("today", d === day)); return; }

    // chips
    const chip = t.closest(".chip, .m-chip");
    if (chip) {
      const l = labelOf(chip).toLowerCase();
      if (l === "connect" || l === "link") { chip.outerHTML = `<span class="tag m">${ic("check")}Linked</span>`; refreshIcons(); toast("Account linked"); return; }
      chip.classList.toggle("on"); return;
    }

    // moments (outside replay screen)
    const mo = t.closest(".moment");
    if (mo) { [...mo.parentElement.querySelectorAll(".moment")].forEach((m) => m.classList.toggle("on", m === mo)); return; }

    // table rows
    const tr = t.closest("tbody tr");
    if (tr && !t.closest(".btn")) { [...tr.parentElement.children].forEach((r) => r.classList.toggle("sel", r === tr)); return; }

    // game tiles outside setup / sso icons
    const gt = t.closest(".game-tile");
    if (gt) { gt.classList.toggle("on"); gt.querySelector(".check")?.classList.toggle("on"); return; }

    // generic actions
    const a = t.closest(".btn, .icon-btn, .m-btn, .m-ib, .sso-ic, .w-btn, .link, .m-row:has(.chev), .tag[role=button]");
    if (a) { act(a); return; }
  });

  /* keyboard activation for custom buttons */
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches?.("[role=button]")) { e.preventDefault(); e.target.click(); }
  });

  /* ---------- tooltip ---------- */
  const tip = document.createElement("div");
  tip.className = "tip"; tip.setAttribute("role", "tooltip");
  document.body.appendChild(tip);
  let tipEl = null;
  function placeTip(e) {
    const r = tip.getBoundingClientRect();
    let x, y;
    if (tipEl && tipEl.closest("svg")) { x = e.clientX - r.width / 2; y = e.clientY - r.height - 14; }
    else { const b = tipEl.getBoundingClientRect(); x = b.left + b.width / 2 - r.width / 2; y = b.top - r.height - 8; if (y < 50) y = b.bottom + 8; }
    tip.style.transform = `translate(${Math.max(8, Math.min(innerWidth - r.width - 8, x))}px, ${Math.max(8, y)}px)`;
  }
  document.addEventListener("pointerover", (e) => {
    const el = e.target.closest("[data-tip]");
    if (!el || el === tipEl) return;
    tipEl = el; tip.textContent = el.getAttribute("data-tip"); tip.classList.add("show"); placeTip(e);
    if (el.classList.contains("hv")) guide(el, true);
  });
  document.addEventListener("pointermove", (e) => { if (tipEl) placeTip(e); }, { passive: true });
  document.addEventListener("pointerout", (e) => {
    if (!tipEl) return;
    const to = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest("[data-tip]");
    if (to === tipEl) return;
    if (tipEl.classList.contains("hv")) guide(tipEl, false);
    tipEl = null; tip.classList.remove("show");
  });
  function guide(rect, on) {
    const svg = rect.ownerSVGElement; if (!svg) return;
    let g = svg.querySelector("line.guide");
    if (!g) { g = document.createElementNS("http://www.w3.org/2000/svg", "line"); g.setAttribute("class", "guide"); svg.querySelector(".hovs").before(g); }
    const x = rect.getAttribute("data-hx"), y1 = rect.getAttribute("y"), y2 = +y1 + +rect.getAttribute("height");
    g.setAttribute("x1", x); g.setAttribute("x2", x); g.setAttribute("y1", y1); g.setAttribute("y2", y2);
    g.style.opacity = on ? 1 : 0;
  }

  /* ---------- popovers ---------- */
  let pop = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  const NOTIFS = [
    ["sparkles", "var(--violet)", "Your SETA Score went up to 82", "Best this season · 2h ago", "#/performance"],
    ["film", "var(--ember)", "3 key mistakes found in Bind", "Replay ready · 3h ago", "#/replay"],
    ["message-square", "var(--sky)", "Coach Reem left feedback", "“Stop re-peeking after a kill” · 2d", "#/coach"],
    ["club:TF", "var(--mint)", "Falcons invited you to a trial", "Sat 18:00 · 3d ago", "#/team"],
  ];
  function openPop(kind, anchor) {
    if (pop && pop.dataset.kind === kind) return closePop();
    closePop();
    pop = document.createElement("div");
    pop.className = "pop"; pop.dataset.kind = kind;
    if (kind === "notif") pop.innerHTML = `<div class="pop-h"><b>Notifications</b><button class="link" data-markall>Mark all read</button></div>${NOTIFS.map(([i, c, t, s, h]) => `<a class="pop-i unread" href="${h}">${i.startsWith("club:") ? K.clubAv(i.slice(5), 30) : `<span class="pop-ic" style="color:${c};background:color-mix(in srgb,${c} 14%,transparent)">${ic(i, "i-sm")}</span>`}<span class="grow"><b>${t}</b><span>${s}</span></span><i class="ud"></i></a>`).join("")}<a class="pop-f" href="#/command">See all activity</a>`;
    if (kind === "help") pop.innerHTML = `<div class="pop-h"><b>Keyboard shortcuts</b></div>${[["Search and jump", "Ctrl K"], ["Quick search", "/"], ["Toggle dark mode", "T"], ["Next screen", "Alt →"], ["Previous screen", "Alt ←"], ["Close any panel", "Esc"]].map(([a, b]) => `<div class="pop-i" style="cursor:default"><span class="grow"><b style="font-weight:500">${a}</b></span><span class="kbd">${b}</span></div>`).join("")}`;
    if (kind === "me") {
      const coach = location.hash.includes("coachhub");
      pop.innerHTML = `<div class="pop-h" style="gap:10px;justify-content:flex-start">${K.av(coach ? "Reem Alqahtani" : "Yara Hamami", "sm")}<span><b>${coach ? "Reem Alqahtani" : "Yara Hamami"}</b><span class="faint" style="display:block;font-size:11.5px">${coach ? "Head Coach · Falcons" : "NYX · Falcons"}</span></span></div>
        <a class="pop-i" href="#/${coach ? "command" : "coachhub"}">${ic("repeat", "i-sm")}<span class="grow"><b style="font-weight:500">Switch to ${coach ? "player" : "coach"} view</b></span></a>
        <a class="pop-i" href="#/passport">${ic("id-card", "i-sm")}<span class="grow"><b style="font-weight:500">My Talent Passport</b></span></a>
        <a class="pop-i" href="#/pair">${ic("watch", "i-sm")}<span class="grow"><b style="font-weight:500">Devices</b></span></a>
        <div class="pop-i" style="cursor:default">${ic("palette", "i-sm")}<span class="grow"><b style="font-weight:500">Theme</b></span>${K.themeSwitch()}</div>
        <a class="pop-i" href="#/landing" style="color:var(--rose)">${ic("log-out", "i-sm")}<span class="grow"><b style="font-weight:500">Sign out</b></span></a>`;
    }
    document.body.appendChild(pop);
    refreshIcons();
    const mode = (() => { try { return localStorage.getItem("seta-theme") || "system"; } catch (e) { return "system"; } })();
    pop.querySelectorAll(".theme-sw button").forEach((b) => b.classList.toggle("on", b.dataset.mode === mode));
    const r = anchor.getBoundingClientRect(), w = pop.offsetWidth;
    const below = r.bottom + 8 + pop.offsetHeight < innerHeight;
    const rtlP = document.documentElement.dir === "rtl";
    pop.style.left = Math.max(8, Math.min(innerWidth - w - 8, (kind === "me") !== rtlP ? r.left : r.right - w)) + "px";
    pop.style.top = (below ? r.bottom + 8 : r.top - pop.offsetHeight - 8) + "px";
    pop.style.transformOrigin = below ? "top right" : "bottom left";
    const mark = pop.querySelector("[data-markall]");
    if (mark) mark.onclick = () => { pop.querySelectorAll(".unread").forEach((x) => x.classList.remove("unread")); $$(".icon-btn .pip").forEach((p) => p.remove()); toast("All caught up"); };
    pop.addEventListener("click", (e) => { if (e.target.closest("a[href]")) closePop(); });
  }
  document.addEventListener("pointerdown", (e) => { if (pop && !e.target.closest(".pop, [data-pop]")) closePop(); });

  /* ---------- command palette ---------- */
  let pal = null, palIdx = 0, palItems = [];
  function paletteData() {
    const scr = window.SCREENS.map((s, i) => ({ k: "screen", t: s.title, s: s.part, i: "layers", go: () => (location.hash = "#/" + s.id), n: String(i + 1).padStart(2, "0") }));
    const actions = [
      { k: "action", t: "Switch to dark mode", s: "Appearance", i: "moon", go: () => setTheme("dark") },
      { k: "action", t: "Switch to light mode", s: "Appearance", i: "sun", go: () => setTheme("light") },
      { k: "action", t: "Use system theme", s: "Appearance", i: "monitor", go: () => setTheme("system") },
      { k: "action", t: "Copy link to this screen", s: "Share", i: "link", go: () => { navigator.clipboard && navigator.clipboard.writeText(location.href).catch(() => {}); toast("Link copied to clipboard"); } },
    ];
    return [...scr, ...actions];
  }
  function openPalette() {
    closePop();
    if (pal) return;
    pal = document.createElement("div");
    pal.className = "pal-scrim";
    pal.innerHTML = `<div class="pal" role="dialog" aria-label="Search"><label class="pal-in">${ic("search")}<input placeholder="Jump to a screen or run an action…" aria-label="Search"><span class="kbd">Esc</span></label><div class="pal-list"></div><div class="pal-f"><span><span class="kbd">↑</span><span class="kbd">↓</span> move</span><span><span class="kbd">Enter</span> open</span><span><span class="kbd">T</span> theme</span></div></div>`;
    document.body.appendChild(pal);
    refreshIcons();
    const input = pal.querySelector("input");
    const all = paletteData();
    const draw = () => {
      const q = input.value.toLowerCase().trim();
      palItems = all.filter((x) => !q || (x.t + " " + x.s).toLowerCase().includes(q));
      palIdx = Math.min(palIdx, Math.max(0, palItems.length - 1));
      pal.querySelector(".pal-list").innerHTML = palItems.length ? palItems.map((x, i) => `<button class="pal-i ${i === palIdx ? "on" : ""}" data-i="${i}">${ic(x.i, "i-sm")}<span class="grow"><b>${x.t}</b><span>${x.s}</span></span>${x.n ? `<span class="mono faint" style="font-size:10.5px">${x.n}</span>` : `<span class="tag mono" style="font-size:9.5px">ACTION</span>`}</button>`).join("") : `<div class="pal-empty">Nothing matches “${input.value}”</div>`;
      refreshIcons();
      pal.querySelector(".pal-i.on")?.scrollIntoView({ block: "nearest" });
    };
    draw();
    input.focus();
    input.addEventListener("input", () => { palIdx = 0; draw(); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); palIdx = (palIdx + 1) % Math.max(1, palItems.length); draw(); }
      if (e.key === "ArrowUp") { e.preventDefault(); palIdx = (palIdx - 1 + palItems.length) % Math.max(1, palItems.length); draw(); }
      if (e.key === "Enter" && palItems[palIdx]) { const x = palItems[palIdx]; closePalette(); x.go(); }
    });
    pal.addEventListener("click", (e) => { const b = e.target.closest(".pal-i"); if (b) { const x = palItems[+b.dataset.i]; closePalette(); x.go(); } else if (!e.target.closest(".pal")) closePalette(); });
  }
  function closePalette() { if (pal) { pal.remove(); pal = null; } }
  K.openPalette = openPalette;

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closePalette(); closePop(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal ? closePalette() : openPalette(); return; }
    if (e.target.matches?.("input,textarea,select") || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "/") { e.preventDefault(); openPalette(); }
    if (e.key.toLowerCase() === "t") { const dark = document.documentElement.getAttribute("data-theme") === "dark"; setTheme(dark ? "light" : "dark"); }
  });

  /* ---------- theme transition (circular reveal) ---------- */
  const baseSetTheme = window.setTheme;
  window.setTheme = (m) => {
    if (!document.startViewTransition || reduced()) return baseSetTheme(m);
    const x = px, y = py;
    const tr = document.startViewTransition(() => baseSetTheme(m));
    tr.ready.then(() => {
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 560, easing: "cubic-bezier(.2,.7,.2,1)", pseudoElement: "::view-transition-new(root)" });
    }).catch(() => {});
  };

  /* ---------- card spotlight ---------- */
  document.addEventListener("pointermove", (e) => {
    const c = e.target.closest && e.target.closest(".card, .feat, .role-col");
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", e.clientX - r.left + "px");
    c.style.setProperty("--my", e.clientY - r.top + "px");
  }, { passive: true });

  /* ---------- per-render enhancements ---------- */
  function countUp(root) {
    if (reduced()) return;
    $$(".kpi .val, .m-big, .ticker .big, .w-big, b.num.wide, .big.num", root).forEach((el) => {
      if (el.closest(".shot") || el.dataset.counted) return;
      const node = [...el.childNodes].find((n) => n.nodeType === 3 && /\d/.test(n.textContent));
      if (!node) return;
      const raw = node.textContent;
      if (/[–:\/]/.test(raw)) return;
      const m = raw.match(/^(\s*[+−-]?)(\d+(?:\.\d+)?)(.*)$/s);
      if (!m) return;
      el.dataset.counted = 1;
      const target = parseFloat(m[2]), dec = (m[2].split(".")[1] || "").length, t0 = performance.now(), dur = 900;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        node.textContent = m[1] + (target * e).toFixed(dec) + m[3];
        if (p < 1) requestAnimationFrame(step);
      };
      node.textContent = m[1] + (0).toFixed(dec) + m[3];
      requestAnimationFrame(step);
    });
  }
  function drawRings(root) {
    if (reduced()) return;
    $$(".ring-arc", root).forEach((c) => {
      const da = c.getAttribute("stroke-dasharray"); if (!da) return;
      const [, C] = da.split(" ");
      c.style.transition = "none"; c.setAttribute("stroke-dasharray", `0 ${C}`);
      requestAnimationFrame(() => requestAnimationFrame(() => { c.style.transition = ""; c.setAttribute("stroke-dasharray", da); }));
    });
  }
  let io;
  function reveal(root) {
    if (reduced() || !("IntersectionObserver" in window)) return;
    io && io.disconnect();
    io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -6% 0px" });
    $$(".land .feat, .land .role-col, .land .ticker > div, .land .sec-h, .land .cta-band, .canvas > .flow-row, .canvas > section, .loop > div, .watch-grid > div", root).forEach((el, i) => {
      el.classList.add("rv"); el.style.transitionDelay = `${(i % 6) * 50}ms`; io.observe(el);
    });
  }
  function titlesToTips(root) {
    $$("[title]", root).forEach((el) => {
      if (el.namespaceURI === "http://www.w3.org/2000/svg" && el.tagName !== "svg") return;
      const t = el.getAttribute("title"); if (!t) return;
      el.setAttribute("data-tip", t);
      if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", t);
      el.removeAttribute("title");
    });
    $$(".m-ib, .icon-btn, .sso-ic, .brand-tile[aria-label]", root).forEach((el) => { if (!el.hasAttribute("role") && el.tagName !== "BUTTON" && el.tagName !== "A") el.setAttribute("role", "button"); if (!el.hasAttribute("tabindex") && el.tagName !== "BUTTON" && el.tagName !== "A") el.setAttribute("tabindex", "0"); });
  }
  document.addEventListener("seta:render", () => {
    closePop(); closePalette();
    const root = document.getElementById("app");
    titlesToTips(root); countUp(root); drawRings(root); reveal(root);
    document.querySelector(".tip")?.classList.remove("show"); tipEl = null;
  });
})();
