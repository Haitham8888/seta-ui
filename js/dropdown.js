/* SETA — one dropdown for every screen
   - native <select> elements are replaced by a styled trigger + menu (value stays in sync)
   - custom ".select" chips open a menu with sensible options
   - the game picker shows official game logos
   Keyboard: ↑ ↓ to move, Enter to pick, Esc to close. */
(function () {
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ic = (n, c) => K.ic(n, c);
  const refresh = () => window.lucide && lucide.createIcons();
  const SAUDI = [
    { group: "Saudi Arabia" },
    { label: "Jazan · KSA South", note: "Base server", icon: "map-pin" },
    { label: "Riyadh · KSA Central", icon: "map-pin" },
    { label: "Jeddah · KSA West", icon: "map-pin" },
    { label: "Dammam · KSA East", icon: "map-pin" },
  ];
  const opts = (arr, icon) => arr.map((label) => ({ label, icon }));
  const RULES = [
    [/^\s*(for\b|لـ|ل |إلى|لـ)/i, () => [{ group: "Your players" }, ...(K.COACH_PLAYERS || []).map((p) => ({ label: p.t, note: `${p.n} · ${p.role}`, icon: "user-round" })), { group: "Groups" }, { label: "Whole team · Falcons", icon: "users" }]],
    [/jazan|riyadh|jeddah|dammam|ksa|server|region|جازان|الرياض|جدة|الدمام|المملكة|السعودية|خادم|منطقة/i, () => SAUDI],
    [/days|week|season|period|يوم|أيام|أسبوع|الموسم|فترة|آخر/i, () => opts(["This week", "Last 7 days", "30 days", "90 days", "This season"], "calendar")],
    [/map|خريطة|خرائط|الخرائط/i, () => opts(["All maps", "Haven", "Bind", "Ascent", "Lotus", "Split", "Sunset", "Icebox", "Pearl"], "map")],
    [/agent|عميل|العملاء|عملاء/i, () => opts(["All agents", "Jett", "Raze", "Neon", "Reyna", "Phoenix"], "user-round")],
    [/role|دور|الأدوار|أدوار/i, () => opts(["Any role", "Duelist", "Initiator", "Controller", "Sentinel", "Flex"], "crosshair")],
    [/potential|الإمكانات|إمكانات/i, () => opts(["Potential ≥ 70", "Potential ≥ 80", "Potential ≥ 85", "Potential ≥ 90"], "sparkles")],
    [/\d+\s*–\s*\d+|age|العمر|عمر/i, () => opts(["13 – 15", "16 – 18", "16 – 22", "19 – 24", "25 +"], "cake")],
  ];

  /* ---------- menu ---------- */
  let menu = null, idx = 0, items = [], pick = null, anchorEl = null;
  function close() { if (menu) { menu.remove(); menu = null; anchorEl && anchorEl.classList.remove("dd-open"); anchorEl = null; } }
  function open(anchor, list, current, onPick, opt = {}) {
    if (menu && anchorEl === anchor) return close();
    close();
    anchorEl = anchor; anchor.classList.add("dd-open");
    pick = onPick; items = list.filter((x) => !x.group);
    idx = Math.max(0, items.findIndex((x) => (x.value ?? x.label) === current));
    menu = document.createElement("div");
    menu.className = "pop dd-menu"; menu.setAttribute("role", "listbox");
    let n = 0;
    menu.innerHTML = (opt.title ? `<div class="dd-title">${opt.title}</div>` : "") + `<div class="dd-scroll">` + list.map((x) => {
      if (x.group) return `<div class="dd-group">${x.group}</div>`;
      const i = n++, sel = (x.value ?? x.label) === current;
      return `<button class="dd-i ${sel ? "sel" : ""} ${i === idx ? "on" : ""}" role="option" aria-selected="${sel}" data-i="${i}">${x.html || (x.icon ? ic(x.icon, "i-sm") : "")}<span class="grow"><b>${x.label}</b>${x.note ? `<span>${x.note}</span>` : ""}</span>${x.badge || ""}<span class="tick">${ic("check", "i-sm")}</span></button>`;
    }).join("") + `</div>`;
    document.body.appendChild(menu); refresh();
    const r = anchor.getBoundingClientRect();
    menu.style.minWidth = Math.max(220, r.width) + "px";
    const h = menu.offsetHeight, w = menu.offsetWidth;
    const below = r.bottom + 6 + h < innerHeight || r.top < h;
    const rtl = document.documentElement.dir === "rtl";
    menu.style.left = Math.max(8, Math.min(innerWidth - w - 8, rtl ? r.right - w : r.left)) + "px";
    menu.style.top = (below ? r.bottom + 6 : r.top - h - 6) + "px";
    menu.style.transformOrigin = below ? "top left" : "bottom left";
    menu.querySelector(".dd-i.sel, .dd-i.on")?.scrollIntoView({ block: "nearest" });
    menu.addEventListener("click", (e) => { const b = e.target.closest(".dd-i"); if (b) choose(+b.dataset.i); });
  }
  function move(d) { if (!menu) return; idx = (idx + d + items.length) % items.length; $$(".dd-i", menu).forEach((b, i) => b.classList.toggle("on", i === idx)); menu.querySelector(".dd-i.on")?.scrollIntoView({ block: "nearest" }); }
  function choose(i) { const x = items[i]; const a = anchorEl; close(); if (x && pick) pick(x, a); }
  K.dropdown = open;

  document.addEventListener("keydown", (e) => {
    if (!menu) return;
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Enter") { e.preventDefault(); choose(idx); }
    else if (e.key === "Escape") { close(); }
  }, true);
  document.addEventListener("pointerdown", (e) => { if (menu && !e.target.closest(".dd-menu") && !e.target.closest(".dd-open")) close(); });
  addEventListener("resize", close);
  addEventListener("scroll", (e) => { if (menu && !(e.target.closest && e.target.closest(".dd-menu"))) close(); }, true);

  /* ---------- native <select> → styled ---------- */
  function enhance(sel) {
    if (sel.dataset.dd) return;
    sel.dataset.dd = 1;
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "dd-trigger";
    const inProto = !!sel.closest(".proto-sel");
    const label = () => sel.options[sel.selectedIndex]?.text || "";
    btn.innerHTML = `<span class="dd-val">${label()}</span>`;
    sel.after(btn); sel.classList.add("dd-native"); sel.tabIndex = -1;
    btn.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      const list = [];
      [...sel.children].forEach((c) => {
        if (c.tagName === "OPTGROUP") { list.push({ group: c.label }); [...c.children].forEach((o) => list.push({ label: o.text, value: o.value, icon: inProto ? "layers" : null })); }
        else list.push({ label: c.text, value: c.value, icon: /KSA/.test(c.text) ? "map-pin" : null, note: /\(base\)/.test(c.text) ? "Base server" : "" });
      });
      list.forEach((x) => { if (x.label) x.label = x.label.replace(" (base)", ""); });
      open(btn.closest(".input, .proto-sel") || btn, list, sel.value, (x) => { sel.value = x.value; btn.querySelector(".dd-val").textContent = label().replace(" (base)", ""); sel.dispatchEvent(new Event("change", { bubbles: true })); if (!inProto) toast(`${x.label} selected`); }, { title: inProto ? "Jump to screen" : "" });
    });
    btn.querySelector(".dd-val").textContent = label().replace(" (base)", "");
  }

  /* ---------- custom .select chips ---------- */
  function textNodeOf(el) { return [...el.childNodes].reverse().find((n) => n.nodeType === 3 && n.textContent.trim()) || [...el.querySelectorAll("b, span:not(.k)")].reverse().find((n) => n.textContent.trim() && !n.querySelector("svg")); }
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-pop=games]");
    if (g) { e.preventDefault(); e.stopImmediatePropagation(); openGames(g); return; }
    const s = e.target.closest(".select");
    if (!s || s.closest(".dd-menu") || s.hasAttribute("data-pop")) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const tn = textNodeOf(s); const cur = tn ? tn.textContent.trim() : "";
    const full = s.textContent.trim();
    if (/filter|فلاتر|التصفية|عوامل/i.test(full)) { toast("Filters opened"); return; }
    const rule = RULES.find(([re]) => re.test(full));
    const list = rule ? rule[1]() : opts([cur, "Option 2", "Option 3"]);
    open(s, list, cur, (x) => { if (tn) tn.textContent = x.label; s.classList.add("dd-changed"); setTimeout(() => s.classList.remove("dd-changed"), 500); });
  }, true);

  /* ---------- game picker ---------- */
  K.currentGame = "VAL";
  const LINKED = { VAL: true, CS2: true };
  function openGames(anchor) {
    const list = [{ group: "Your games" }, ...Object.entries(K.GAME_META).filter(([c]) => LINKED[c]).map(([c, g]) => ({ value: c, label: g.name, note: g.genre, html: K.game(c, 28, 8) })),
      { group: "Supported titles" }, ...Object.entries(K.GAME_META).filter(([c]) => !LINKED[c]).map(([c, g]) => ({ value: c, label: g.name, note: g.genre, html: K.game(c, 28, 8), badge: `<span class="tag mono" style="font-size:9.5px">LINK</span>` }))];
    open(anchor, list, K.currentGame, (x) => {
      if (!LINKED[x.value]) { LINKED[x.value] = true; toast(`${x.label} linked`); }
      K.currentGame = x.value;
      $$(".game-sel").forEach((b) => { b.innerHTML = `${K.game(x.value, 22, 6)}<b style="font-weight:600">${x.label}</b>${ic("chevron-down")}`; });
      refresh();
      if (LINKED[x.value]) toast(`Showing ${x.label}`);
    }, { title: "Choose a game" });
  }

  document.addEventListener("seta:render", () => { close(); $$("select").forEach(enhance); });
})();
