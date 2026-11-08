/* SETA prototype — router, shell, theme */
(function () {
  const { ic, wm, av } = K;
  const S = (window.SCREENS = window.SCREENS || []);

  /* ---------- theme ---------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  function applyTheme(mode) {
    const sysDark = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
    const t = mode === "system" ? (sysDark ? "dark" : "light") : mode;
    document.documentElement.setAttribute("data-theme", t);
    document.querySelectorAll(".theme-sw button").forEach((b) => b.classList.toggle("on", b.dataset.mode === mode));
  }
  let themeMode = store.get("seta-theme") || "system";
  applyTheme(themeMode);
  if (window.matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => themeMode === "system" && applyTheme("system"));
  window.setTheme = (m) => { themeMode = m; store.set("seta-theme", m); applyTheme(m); };

  const themeSwitch = () => `<div class="theme-sw" role="group" aria-label="Theme">
    <button data-mode="light" onclick="setTheme('light')" title="Light">${ic("sun")}</button>
    <button data-mode="system" onclick="setTheme('system')" title="System">${ic("monitor")}</button>
    <button data-mode="dark" onclick="setTheme('dark')" title="Dark">${ic("moon")}</button></div>`;
  K.themeSwitch = themeSwitch;

  /* ---------- toast ---------- */
  let tt;
  window.toast = (msg) => {
    let el = document.querySelector(".toast");
    if (!el) { el = document.createElement("div"); el.className = "toast"; document.body.appendChild(el); }
    el.innerHTML = `${ic("circle-check")}<span>${msg}</span>`;
    lucide.createIcons();
    el.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => el.classList.remove("show"), 2200);
  };

  /* ---------- app shell ---------- */
  const NAV = {
    player: [
      ["Workspace", [["command", "layout-dashboard", "Command Center"], ["performance", "activity", "Performance"], ["matches", "swords", "Matches", "3"], ["biosync", "heart-pulse", "BioSync"]]],
      ["Grow", [["coach", "graduation-cap", "Dual Coach", "2", true], ["passport", "id-card", "Talent Passport"]]],
      ["Network", [["discovery", "radar", "Discovery"], ["team", "shield", "Team & Club"]]],
    ],
    coach: [
      ["Coaching", [["coachhub", "layout-dashboard", "Dashboard"], ["coach-players", "users", "Players"], ["coach-review", "film", "Review queue", "6", true], ["coach-sessions", "calendar-days", "Sessions", "2"], ["coach-plans", "clipboard-list", "Training plans"]]],
      ["Business", [["coach-earnings", "wallet", "Earnings"], ["coach-profile", "id-card", "Public profile"]]],
      ["Network", [["discovery", "radar", "Discovery"], ["team", "shield", "Team & Club"]]],
    ],
  };
  const ME = { player: ["Yara Hamami", "NYX · Duelist"], coach: ["Reem Alqahtani", "Head Coach · Falcons"] };

  function shell(scr, body) {
    const role = scr.role || "player";
    const groups = NAV[role].map(([g, items]) => `<div class="nav-group"><span class="eyebrow">${g}</span>${items.map(([id, icon, label, count, hot]) =>
      `<a class="nav-item ${scr.nav === id ? "on" : ""}" href="#/${id.split("#")[0]}" title="${label}">${ic(icon)}<span>${label}</span>${count ? `<em class="count ${hot ? "hot" : ""}">${count}</em>` : ""}</a>`).join("")}</div>`).join("");
    const tabs = role === "coach" ? [["coachhub", "layout-dashboard", "Hub"], ["coach-players", "users", "Players"], ["coach-review", "film", "Review"], ["coach-sessions", "calendar-days", "Sessions"], ["coach-profile", "id-card", "Profile"]] : [["command", "layout-dashboard", "Home"], ["performance", "activity", "Stats"], ["matches", "swords", "Matches"], ["coach", "graduation-cap", "Coach"], ["passport", "id-card", "Passport"]];
    return `<div class="shell">
      <aside class="side">
        <div class="brand">${wm(20)}<span class="role-pill">${role}</span></div>
        <nav>${groups}</nav>
        <div class="foot">
          <a class="nav-item" href="#/system" title="Settings">${ic("settings-2")}<span>Settings</span></a>
          <div class="me" data-pop="me" role="button" tabindex="0">${av(ME[role][0], "sm")}<div class="who"><b>${ME[role][0]}</b><span>${ME[role][1]}</span></div>${ic("chevrons-up-down", "i-sm faint")}</div>
        </div>
      </aside>
      <div class="main">
        <header class="topbar">
          <div class="crumbs"><span class="crumb-mark">${K.star(13)}</span>${scr.crumbs ? scr.crumbs.map((c, i, a) => (i === a.length - 1 ? `<b>${c}</b>` : `<span>${c}</span>${ic("chevron-right")}`)).join("") : `<b>${scr.title}</b>`}</div>
          <label class="search" data-palette>${ic("search")}<input placeholder="Search players, matches, drills"><span class="kbd">Ctrl K</span></label>
          <span class="tag a demo-tag" data-noi18n data-tip="${K.isAr ? "بيانات اللاعبين والمباريات في هذا النموذج توضيحية، وليست لأشخاص حقيقيين" : "Player and match data in this prototype is illustrative, not real people"}">${K.ic("flask-conical")}${K.isAr ? "بيانات توضيحية" : "Illustrative data"}</span>
          <button class="icon-btn" title="Notifications" data-pop="notif">${ic("bell")}<span class="pip"></span></button>
          <button class="icon-btn hide-m" title="Shortcuts" data-pop="help">${ic("life-buoy")}</button>
        </header>
        ${body}
        ${K.footer()}
      </div>
      <nav class="tabbar">${tabs.map(([id, icon, l]) => `<a href="#/${id}" class="${scr.nav === id ? "on" : ""}">${ic(icon)}${l}</a>`).join("")}</nav>
    </div>`;
  }

  K.footer = () => `<footer class="app-foot">${wm(14)}<span class="faint">Smart Esports Talent Platform</span><span class="sp"></span><a href="#/system">Design system</a><a href="#/landing">Website</a><span class="mono faint">v2 · 2026</span></footer>`;
  K.shell = shell;

  /* ---------- prototype bar ---------- */
  function protoBar(cur) {
    const parts = [];
    S.forEach((s) => { let p = parts.find((x) => x[0] === s.part); if (!p) parts.push((p = [s.part, []])); p[1].push(s); });
    const opts = parts.map(([p, list]) => `<optgroup label="${p}">${list.map((s) => `<option value="${s.id}" ${s.id === cur.id ? "selected" : ""}>${String(S.indexOf(s) + 1).padStart(2, "0")} — ${s.title}</option>`).join("")}</optgroup>`).join("");
    return `<div class="proto">
      <span class="wm" style="height:14px"><img class="l" src="assets/wordmark-light.png" alt="SETA"><img class="d" src="assets/wordmark-dark.png" alt="SETA"></span>
      <span class="tag-v">Interface v2 · ${S.length} screens</span>
      <span class="sp hide-s"></span>
      <div class="nav-arrows">
        <button class="icon-btn" style="width:30px;height:30px" onclick="go(-1)" title="Previous screen">${ic("arrow-left", "i-sm")}</button>
      </div>
      <label class="proto-sel">${ic("layers", "i-sm faint")}<select onchange="location.hash='#/'+this.value">${opts}</select>${ic("chevron-down", "i-sm faint")}</label>
      <div class="nav-arrows"><button class="icon-btn" style="width:30px;height:30px" onclick="go(1)" title="Next screen">${ic("arrow-right", "i-sm")}</button></div>
      <span class="sp"></span>
      ${K.langSwitch()}
      ${themeSwitch()}
    </div>`;
  }
  window.go = (d) => { const i = S.findIndex((s) => s.id === current); const n = S[(i + d + S.length) % S.length]; location.hash = "#/" + n.id; };

  /* ---------- router ---------- */
  let current = null;
  function render() {
    const h = location.hash.replace(/^#\//, "").split("#")[0] || "landing";
    const scr = S.find((s) => s.id === h) || S[0];
    current = scr.id;
    const body = scr.render();
    const bare = ["landing", "auth", "setup", "complete"].includes(scr.id);
    const html = protoBar(scr) + (scr.kind === "app" ? shell(scr, body) : body + (bare ? "" : K.footer()));
    const root = document.getElementById("app");
    root.innerHTML = html;
    document.title = `SETA — ${scr.title}`;
    lucide.createIcons();
    applyTheme(themeMode);
    scr.mount && scr.mount(root);
    document.dispatchEvent(new CustomEvent("seta:render", { detail: scr }));
    window.scrollTo(0, 0);
  }
  window.rerender = () => { const y = scrollY; render(); scrollTo(0, y); };
  window.addEventListener("hashchange", render);
  document.addEventListener("keydown", (e) => {
    if (e.target.matches?.("input,textarea,select")) return;
    if (e.key === "ArrowRight" && e.altKey) go(1);
    if (e.key === "ArrowLeft" && e.altKey) go(-1);
  });
  window.addEventListener("DOMContentLoaded", render);
})();
