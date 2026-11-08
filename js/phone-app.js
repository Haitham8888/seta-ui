/* SETA Mobile — live, fully interactive phone prototype.
   Tap = click · drag = scroll · drag from the left edge = back · drag a sheet down = close.
   Keys: Esc/Backspace back · 1–5 tabs · H hotspots · R restart. */
(function () {
  const { ic, star, av, spark, ring, lines, bars, delta, qr, guil, orbit } = K;
  const S = (window.SCREENS = window.SCREENS || []);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ================= state ================= */
  const fresh = () => ({
    stack: [{ name: "splash" }], onboarded: false, role: "player",
    unread: 3, checked: false, energy: 3, focus: 70, stress: 30,
    plan: [{ t: "Crossfire timing", s: "Range · 10 min", d: true }, { t: "Utility-first entries", s: "Custom · 10 min", d: false }, { t: "Review: Bind R14", s: "Replay · 5 min", d: false }],
    week: { Sat: ["Trade spacing · 20 min", "Premier match · 21:00", "Debrief · 2 min"], Sun: ["Replay self-review · 10 min"], Mon: ["Crossfire timing · 15 min", "Deathmatch · 30 min"], Tue: ["Utility-first entries · 20 min"], Wed: ["Session with Reem · 45 min"], Thu: ["Counter-strafe drill · 15 min"], Fri: ["Rest day"] },
    weekDone: {}, day: "Sat",
    session: { live: false, t0: 0, hr: [92, 96, 101, 98, 104, 110, 108, 115], matches: [] },
    game: "VAL", mode: "Ranked", range: "30D",
    linked: { riotgames: true, discord: true, steam: false, epicgames: false, playstation: false },
    watch: false, device: "apple", notifOn: true, pairCode: "",
    coachMode: "ai",
    chat: [{ me: false, t: "Morning, Nyx. Your aim was the best it has been all month (86), but you lost 4 of 5 rounds where you entered before the recon landed." }, { me: false, t: "Want me to turn that into a drill for Saturday?" }],
    reem: [{ me: false, t: "See you Wednesday at 20:00. Bring your Bind replay." }],
    slot: 1, booked: false, focusFace: 2, flip: false,
    notifs: [
      { i: "sparkles", c: "var(--violet)", t: "SETA Score went up to 82", s: "Best this season · 2h", go: "stats", unread: true },
      { i: "film", c: "var(--ember)", t: "3 key mistakes found in Bind", s: "Replay ready · 3h", go: "moment", unread: true },
      { i: "message-square", c: "var(--sky)", t: "Coach Reem replied", s: "“Bring your Bind replay” · 5h", go: "coach", unread: true },
      { i: "club:TF", c: "var(--mint)", t: "Falcons invited you to a trial", s: "Sat 18:00 · 1d", go: "passport", unread: false },
    ],
    replayP: 41, playing: false,
  });
  let st = fresh();
  let phoneEl, scr, viewsEl, tabsEl, islandEl, sheetEl, scrimEl, alertEl, liveTimer = null, islandTimer = null, playTimer = null, hintAlways = false, device = "iphone";

  /* ================= routes ================= */
  const TABS = ["today", "stats", "session", "coach", "me"];
  const TITLES = { splash: "Splash", welcome: "Welcome", role: "Role", link: "Link games", perms: "Permissions", today: "Today", notifs: "Notifications", biosync: "BioSync", session: "Session", debrief: "Debrief", moment: "Key moment", matches: "Matches", match: "Match", stats: "Stats", skill: "Skill", coach: "Coach", plan: "Training plan", me: "Me", passport: "Passport", accounts: "Linked accounts", devices: "Devices", pair1: "Choose watch", pair2: "Health access", pair3: "Pairing code", pair4: "Linked", notifset: "Notifications", privacy: "Privacy" };
  const top = () => st.stack[st.stack.length - 1];
  const prevTitle = () => (st.stack.length > 1 ? TITLES[st.stack[st.stack.length - 2].name] : "Back");
  const tabOf = (name) => (TABS.includes(name) ? name : { notifs: "today", biosync: "today", matches: "stats", match: "stats", skill: "stats", plan: "coach", passport: "me", accounts: "me", devices: "me", notifset: "me", privacy: "me", debrief: "session", moment: "session", pair1: "me", pair2: "me", pair3: "me", pair4: "me" }[name] || null);

  const nav = (title, right = "") => `<div class="pp-nav">${st.stack.length > 1 ? `<button class="pp-back" data-back>${ic("chevron-left")}<span>${prevTitle()}</span></button>` : "<span></span>"}<span class="pp-title">${title}</span>${right || "<span style='width:30px'></span>"}</div>`;
  const greet = () => { const h = new Date().getHours(); return h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening"; };
  const fmt = (ms) => { const s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return `${h}:${String(m).padStart(2, "0")}:${String(x).padStart(2, "0")}`; };
  const hrNow = () => st.session.hr[st.session.hr.length - 1];
  const hrChart = (w = 280, h = 92) => lines([{ data: st.session.hr.slice(-36), color: "var(--rose)", area: true, width: 1.8 }], Array(Math.min(36, st.session.hr.length)).fill(""), { w, h, min: 60, max: 165, ticks: 2, padL: 0, padB: 0, padT: 6, padR: 6, tipUnit: " bpm" }).replace(/<text[^>]*>[^<]*<\/text>/g, "");
  const faces = (sel, act) => `<div class="m-faces">${["angry", "frown", "meh", "smile", "laugh"].map((f, i) => `<span class="pp-tap ${i === sel ? "on" : ""}" data-act="${act}" data-v="${i}">${ic(f)}</span>`).join("")}</div>`;
  const slider = (key, v) => `<div class="pp-slider" data-slider="${key}"><i class="tr"></i><i class="fl" style="width:${v}%"></i><i class="th" style="inset-inline-start:${v}%"></i></div>`;
  const sw = (on, act, extra = "") => `<button class="switch ${on ? "on" : ""}" data-act="${act}" ${extra} aria-label="toggle"></button>`;
  const RANGE = { "7D": [84, 6, [87, 79, 81, 84, 77, 84]], "30D": [82, 4, [86, 78, 80, 83, 76, 83]], "90D": [79, 9, [83, 76, 82, 80, 74, 80]], Season: [77, 14, [81, 75, 83, 78, 73, 78]] };
  const SHORT = { VAL: "Valorant", CS2: "CS2", LoL: "LoL", RL: "Rocket League", DOTA: "Dota 2", PUBG: "PUBG", FC: "EA FC", R6: "R6 Siege" };
  const SKILLS = ["Aim", "Reaction", "Decision", "Game sense", "Teamwork", "Consistency"];
  const SKD = [12, 9, -6, 9, 3, 11];

  const R = {
    /* ---------- onboarding ---------- */
    splash: () => ({ ink: true, html: `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;position:relative;margin:-54px -18px -18px;min-height:100%">${orbit({ w: 340, h: 700, color: "#9677FF", op: 0.6, stars: false })}<img src="assets/logo-dark.png" alt="SETA" style="width:220px;position:relative;animation:spLogo 1s cubic-bezier(.2,.7,.2,1) both"><span class="mono" style="font-size:10px;letter-spacing:.22em;color:rgba(237,234,244,.5);text-transform:uppercase;position:relative">Smart Esports Talent Platform</span></div>` }),
    welcome: () => ({ html: `<div class="pp-nav">${K.wm(15)}<button class="m-chip pp-tap" data-act="lang">${ic("languages")}${K.isAr ? "English" : "العربية"}</button></div>
      <div style="position:relative;height:190px;border-radius:22px;overflow:hidden;background:var(--violet-tint);flex:none">${orbit({ w: 300, h: 190, op: 0.9 })}<div style="position:absolute;left:16px;bottom:14px;right:16px" class="row between"><div class="col" style="gap:2px"><span class="m-label" style="padding:0">SETA Score</span><b class="m-big" style="font-size:40px">82</b></div>${spark([70, 72, 71, 75, 77, 76, 80, 82], { w: 130, h: 46 })}</div></div>
      <div><h2 class="pp-large" style="font-size:28px">Talent is data you haven’t read yet.</h2><p class="m-sub">Sign in to sync your matches, body data and coaching.</p></div>
      <div class="col" style="gap:8px;margin-top:auto">
        <button class="m-btn pp-tap" data-act="signin" data-v="Apple" style="background:var(--text);color:var(--bg);clip-path:none">${K.brand("apple", 18)}Continue with Apple</button>
        <button class="m-btn alt pp-tap" data-act="signin" data-v="Google">${K.brand("google", 18)}Continue with Google</button>
        <div class="row between"><span class="faint" style="font-size:11.5px">Gaming ID</span><div class="row" style="gap:6px">${["riotgames", "steam", "discord", "playstation", "epicgames"].map((k) => `<button class="brand-tile sm pp-tap" data-act="signin" data-v="${K.BRANDS[k].name}">${K.brand(k, 16)}</button>`).join("")}</div></div>
        <button class="faint pp-tap" data-act="emailSheet" style="font-size:12px;padding:8px">Use email instead</button></div>` }),
    role: () => ({ html: `${nav("", `<div class="m-steps" style="width:110px"><i class="on"></i><i></i><i></i></div>`)}
      <div><h2 class="pp-large">How will you use SETA?</h2><p class="m-sub">This sets your home screen. Add another role any time.</p></div>
      <div class="col" style="gap:8px">${[["player", "gamepad-2", "Player", "Track, improve and get scouted"], ["coach", "clipboard-list", "Coach", "Review and train your players"], ["club", "shield", "Club", "Scout talent, manage a roster"]].map(([k, i, t, d]) => `<button class="role-card pp-tap pp-row-btn ${st.role === k ? "on" : ""}" data-act="role" data-v="${k}" style="flex-direction:row;align-items:center;gap:12px;padding:14px"><span class="ic">${ic(i)}</span><div style="flex:1"><b style="font-size:14px">${t}</b><div class="faint" style="font-size:12px">${d}</div></div><span class="radio ${st.role === k ? "on" : ""}" style="position:relative;inset:auto;flex:none"></span></button>`).join("")}</div>
      <button class="m-btn pp-tap" data-go="link" style="margin-top:auto">Continue ${ic("arrow-right")}</button>` }),
    link: () => ({ html: `${nav("", `<div class="m-steps" style="width:110px"><i class="on"></i><i class="on"></i><i></i></div>`)}
      <div><h2 class="pp-large">Connect your games</h2><p class="m-sub">We read match history only. We never post or play for you.</p></div>
      ${accountsGroup()}
      <div class="m-card row" style="gap:12px"><span style="color:var(--mint)">${ic("circle-check")}</span><div style="flex:1"><b style="font-size:13px">40 Valorant matches found</b><div class="faint" style="font-size:11.5px">Your first score is ready</div></div></div>
      <button class="m-btn pp-tap" data-go="perms" style="margin-top:auto">Continue ${ic("arrow-right")}</button>` }),
    perms: () => ({ html: `${nav("", `<div class="m-steps" style="width:110px"><i class="on"></i><i class="on"></i><i class="on"></i></div>`)}
      <div><h2 class="pp-large">Two quick permissions</h2><p class="m-sub">Both optional. Change them any time in Me.</p></div>
      <div class="m-card col" style="gap:10px"><div class="row" style="gap:10px"><span class="brand-tile" style="color:var(--ember)">${ic("bell-ring")}</span><div style="flex:1"><b>Notifications</b><div class="faint" style="font-size:11.5px">Break reminders, coach replies, debriefs</div></div>${st.notifOn === "yes" ? `<span class="tag m">${ic("check")}On</span>` : ""}</div>${st.notifOn === "yes" ? "" : `<button class="m-btn alt pp-tap" data-act="askNotif" style="height:40px">Allow notifications</button>`}</div>
      <div class="m-card col" style="gap:10px"><div class="row" style="gap:10px"><span class="brand-tile" style="color:var(--rose)">${ic("heart-pulse")}</span><div style="flex:1"><b>Watch & health data</b><div class="faint" style="font-size:11.5px">Heart rate, HRV and sleep</div></div>${st.watch ? `<span class="tag m">${ic("check")}Linked</span>` : ""}</div>${st.watch ? "" : `<div class="row" style="gap:6px">${["apple", "samsung", "garmin", "fitbit", "wearos"].map((k) => `<span class="brand-tile sm">${K.brand(k, 15)}</span>`).join("")}</div><button class="m-btn alt pp-tap" data-go="pair1" style="height:40px">Link a watch</button>`}</div>
      <span class="faint" style="font-size:11px">BioSync shows patterns, not medical advice.</span>
      <button class="m-btn pp-tap" data-act="enter" style="margin-top:auto">Enter SETA ${ic("arrow-right")}</button>` }),

    /* ---------- today ---------- */
    today: () => {
      const done = st.plan.filter((x) => x.d).length;
      return { tabs: true, html: `<div class="pp-ptr">${ic("loader-circle")}</div>
      <div class="pp-nav"><button class="row pp-tap" data-tab="me" style="gap:10px;text-align: start">${av("Yara Hamami", "sm")}<span style="line-height:1.2"><span class="faint" style="font-size:11px">${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}</span><b style="display:block;font-size:13px">Yara · NYX</b></span></button><button class="m-ib pp-tap" data-go="notifs">${ic("bell")}${st.unread ? `<span class="pip"></span>` : ""}</button></div>
      <h1 class="pp-large">${greet()}, Nyx.</h1>
      <button class="m-card ink pp-tap pp-row-btn" data-go="biosync" style="display:flex;gap:14px;align-items:center;position:relative;overflow:hidden">${orbit({ w: 300, h: 120, color: "#9677FF", op: 0.4, stars: false })}<span style="position:relative">${ring(st.watch ? 74 : 0, { size: 76, stroke: 7, color: "#45D6A2", track: "#2A2245", label: st.watch ? "74" : "–" }).replace(/fill:var\(--text\)/, "fill:#EDEAF4")}</span><span style="position:relative;flex:1"><span class="w-lbl" style="color:rgba(237,234,244,.5)">Readiness</span><b style="display:block;font-size:15px;margin:2px 0">${st.watch ? "Good day for ranked" : "Link a watch to see it"}</b><span style="font-size:11.5px;color:rgba(237,234,244,.6)" class="row">${ic("watch", "i-sm")}${st.watch ? " Slept 7h 40m · HRV 68" : " Takes about a minute"}</span></span>${ic("chevron-right")}</button>
      ${st.checked ? `<button class="m-card pp-tap pp-row-btn row" data-act="checkin" style="gap:12px;border-color:color-mix(in srgb,var(--mint) 40%,var(--line))"><span class="brand-tile" style="background:var(--mint-soft);color:var(--mint);border:0">${ic(["angry", "frown", "meh", "smile", "laugh"][st.energy])}</span><span style="flex:1"><b style="font-size:13px">Checked in</b><span class="faint" style="display:block;font-size:11.5px">Focus ${st.focus} · Stress ${st.stress} · tap to edit</span></span>${ic("pencil", "i-sm faint")}</button>`
        : `<button class="m-card pp-tap pp-row-btn row" data-act="checkin" style="gap:12px;border-color:var(--violet);background:var(--violet-tint)"><span class="brand-tile" style="background:var(--violet);color:var(--on-violet);border:0">${ic("smile")}</span><span style="flex:1"><b style="font-size:13px">How do you feel?</b><span class="faint" style="display:block;font-size:11.5px">20-second check-in</span></span>${ic("chevron-right", "faint")}</button>`}
      <div class="row between"><span class="m-label">Today’s plan · 25 min</span><span class="mono faint" style="font-size:10.5px">${done}/${st.plan.length}</span></div>
      <div class="m-group">${st.plan.map((x, i) => `<button class="m-row pp-row-btn" data-act="plan" data-v="${i}"><span class="check ${x.d ? "on" : ""}">${ic("check")}</span><span class="grow"><b style="font-weight:600;${x.d ? "text-decoration:line-through;color:var(--text-3)" : ""}">${x.t}</b><span class="s" style="display:block">${x.s}</span></span></button>`).join("")}</div>
      <button class="m-card pp-tap pp-row-btn row" data-go="match" data-p='{"id":"next"}' style="gap:12px;padding:12px">${K.game("VAL", 38, 10)}<span style="flex:1"><b style="font-size:13px">Premier vs Najd Vipers</b><span class="faint" style="display:block;font-size:11.5px">21:00 · Bind</span></span><span class="tag e mono">IN 2H</span></button>
      <div class="row between"><span class="m-label">Last match</span><button class="link" data-go="matches">See all ${ic("chevron-right")}</button></div>
      ${matchRow(K.MATCHES[0], 0)}` };
    },
    notifs: () => ({ tabs: true, html: `${nav("Notifications", `<button class="link" data-act="readAll">Read all</button>`)}
      <div class="m-group">${st.notifs.map((n, i) => `<button class="m-row pp-row-btn" data-act="openNotif" data-v="${i}">${n.i.startsWith("club:") ? K.clubAv(n.i.slice(5), 36) : `<span class="brand-tile" style="color:${n.c};background:color-mix(in srgb,${n.c} 12%,transparent);border:0">${ic(n.i, "i-sm")}</span>`}<span class="grow"><b style="font-size:12.5px">${n.t}</b><span class="s" style="display:block">${n.s}</span></span>${n.unread ? `<i style="width:8px;height:8px;border-radius:50%;background:var(--violet)"></i>` : ""}</button>`).join("")}</div>
      <p class="pp-empty">That’s everything from this week.</p>` }),
    biosync: () => ({ tabs: true, html: `${nav("BioSync", `<button class="m-ib pp-tap" data-go="devices">${ic("watch")}</button>`)}
      ${st.watch ? `<div class="m-card" style="display:flex;gap:14px;align-items:center">${ring(74, { size: 96, stroke: 8, color: "var(--mint)", label: "74", sub: "READY" })}<div><b style="font-size:15px">Good day for ranked</b><p class="faint" style="margin:4px 0 0;font-size:12px">Keep tonight under 3 hours. HRV is above your baseline.</p></div></div>
      <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:8px">${[["moon", "Sleep", "7h40", "var(--violet)"], ["activity", "HRV", "68", "var(--sky)"], ["heart", "RHR", "58", "var(--rose)"]].map(([i, l, v, c]) => `<div class="m-card" style="padding:10px"><span style="color:${c}">${ic(i, "i-sm")}</span><div class="m-label" style="padding:0;margin-top:4px">${l}</div><b class="num" style="font-size:17px">${v}</b></div>`).join("")}</div>
      <span class="m-label">Last night</span>
      <div class="m-card"><div class="row" style="height:46px;gap:2px;align-items:flex-end">${"DLLRDDLLRRLLDLLRRRLLLRLLRRA".split("").map((s) => `<i style="flex:1;border-radius:2px;height:${{ D: 30, L: 55, R: 80, A: 100 }[s]}%;background:${{ D: "var(--violet)", L: "var(--chart-2)", R: "var(--sky)", A: "var(--amber)" }[s]}"></i>`).join("")}</div><div class="row between faint mono" style="font-size:10px;margin-top:6px"><span>23:50</span><span>07:30</span></div></div>
      <span class="m-label">HRV · 7 days</span>
      <div class="m-card">${bars([58, 61, 60, 63, 66, 64, 68], { w: 280, h: 70, color: "var(--sky)", hl: 6, labels: ["S", "S", "M", "T", "W", "T", "F"] })}</div>`
        : `<div class="pp-empty" style="padding:40px 10px"><div style="color:var(--violet);margin-bottom:10px">${ic("watch", "i-lg")}</div><b style="color:var(--text);font-size:15px">No watch linked yet</b><p style="margin:6px 0 16px">Link a watch to see sleep, recovery and heart rate next to your matches.</p><button class="m-btn pp-tap" data-go="pair1" style="width:100%">${ic("plus")}Link a watch</button></div>`}
      <button class="m-card pp-tap pp-row-btn row" data-act="healthSheet" style="gap:10px">${K.healthIcon ? K.healthIcon(34) : ""}<span style="flex:1"><b style="font-size:13px">Apple Health</b><span class="faint" style="display:block;font-size:11.5px">One permission for every device</span></span>${ic("chevron-right", "faint")}</button>
      <p class="faint" style="font-size:11px;margin:0">BioSync shows patterns next to your matches. It is not medical advice.</p>` }),

    /* ---------- session ---------- */
    session: () => {
      const s = st.session;
      if (!s.live) return { tabs: true, html: `<h1 class="pp-large" style="margin-top:6px">Ready to play?</h1>
        <div class="m-card row" style="gap:12px">${ring(st.watch ? 74 : 0, { size: 60, stroke: 6, color: "var(--mint)", label: st.watch ? "74" : "–" })}<div style="flex:1"><b style="font-size:13px">${st.watch ? "Readiness 74 · good" : "No readiness yet"}</b><div class="faint" style="font-size:11.5px">${st.checked ? "Checked in today" : "Tip: do a 20-second check-in first"}</div></div>${st.checked ? "" : `<button class="link" data-act="checkin">Check in</button>`}</div>
        <span class="m-label">Game</span>
        <div class="row wrap" style="gap:8px">${["VAL", "CS2", "LoL", "RL"].map((g) => `<button class="m-chip pp-tap ${st.game === g ? "on" : ""}" data-act="game" data-v="${g}" style="height:36px;padding-inline-start:4px">${K.game(g, 26, 8)}${SHORT[g]}</button>`).join("")}</div>
        <span class="m-label">Mode</span>
        <div class="m-seg">${["Ranked", "Premier", "Practice"].map((m) => `<span class="${st.mode === m ? "on" : ""}" data-act="mode" data-v="${m}">${m}</span>`).join("")}</div>
        <div class="m-card row" style="gap:10px">${st.watch ? `<span class="brand-tile sm">${K.brand("apple", 14)}</span><span style="flex:1;font-size:12.5px"><b>Apple Watch</b> will record heart rate</span><span class="tag m">${ic("check")}Ready</span>` : `<span class="brand-tile sm" style="color:var(--text-3)">${ic("watch", "i-sm")}</span><span style="flex:1;font-size:12.5px">No watch, heart rate off</span><button class="link" data-go="pair1">Link</button>`}</div>
        <button class="m-btn pp-tap" data-act="startSession" style="margin-top:6px;height:54px;font-size:15px">${ic("play")}Start session</button>
        <p class="faint" style="font-size:11px;margin:0;text-align:center">Your phone stays silent. Nudges go to the watch.</p>` };
      const el = Date.now() - s.t0, w = s.matches.filter((m) => m.r === "W").length;
      return { tabs: true, html: `<div class="pp-nav"><span class="row" style="gap:8px;font-weight:650"><span class="dot live"></span>Session live</span><span class="tag mono">${SHORT[st.game].toUpperCase()} · ${st.mode.toUpperCase()}</span></div>
        <div style="text-align:center;padding:4px 0 0"><span class="m-label">Playing for</span><div class="m-big" style="font-size:54px;margin-top:4px" data-timer>${fmt(el)}</div></div>
        <div class="m-card"><div class="row between"><span class="row" style="gap:6px;font-weight:650">${ic("heart-pulse", "i-sm")}<span style="color:var(--rose)" data-hr>${st.watch ? hrNow() : "–"}</span><span class="faint" style="font-weight:500;font-size:11.5px">bpm</span></span><span class="row faint" style="gap:4px;font-size:11px">${ic("watch", "i-sm")}${st.watch ? "Apple Watch · live" : "No watch"}</span></div><div data-hrchart>${st.watch ? hrChart() : `<p class="pp-empty" style="padding:16px 0">Link a watch to see live heart rate</p>`}</div></div>
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:8px"><div class="m-card" style="padding:12px"><span class="m-label" style="padding:0">Matches</span><div class="row" style="gap:6px;align-items:baseline"><b class="num" style="font-size:22px">${s.matches.length}</b><span class="faint" style="font-size:11px">${w}W · ${s.matches.length - w}L</span></div></div><div class="m-card" style="padding:12px"><span class="m-label" style="padding:0">Avg in match</span><div class="row" style="gap:6px;align-items:baseline"><b class="num" style="font-size:22px">${st.watch ? Math.round(s.hr.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, s.hr.length)) : "–"}</b><span class="faint" style="font-size:11px">bpm</span></div></div></div>
        ${s.matches.length ? `<div class="row" style="gap:6px">${s.matches.map((m) => `<span class="res ${m.r === "W" ? "w" : "l"}">${m.r}</span>`).join("")}<span class="faint" style="font-size:11.5px;margin-inline-start:4px">${s.matches.map((m) => m.map).join(" · ")}</span></div>` : ""}
        ${el > 45000 ? `<div class="m-card row" style="gap:10px;background:var(--amber-soft);border-color:transparent"><span style="color:var(--amber)">${ic("coffee")}</span><span style="font-size:12.5px;flex:1"><b>Break soon.</b> <span class="muted">Heart rate recovery is slowing.</span></span></div>` : ""}
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:8px;margin-top:4px"><button class="m-btn alt pp-tap" data-act="matchEnded" style="height:46px">${ic("flag")}Match ended</button><button class="m-btn ember pp-tap" data-act="endSession" style="height:46px">${ic("square")}End</button></div>` };
    },
    debrief: (p) => {
      const m = p.m || { map: "Bind", r: "L", sc: "8–13" };
      return { html: `${nav("Debrief", `<button class="m-ib pp-tap" data-act="share">${ic("share")}</button>`)}
        <div class="row between" style="align-items:flex-end"><div><span class="m-label row" style="padding:0;gap:6px">${K.brand(K.GAME_META[st.game].k, 11, K.GAME_META[st.game].bg === "#1B1A20" ? undefined : K.GAME_META[st.game].bg)}${m.map} · ${st.mode}</span><div class="row" style="gap:10px;align-items:baseline"><b class="m-big">${m.sc}</b><span class="tag ${m.r === "W" ? "m" : "r"}">${m.r === "W" ? "Victory" : "Defeat"}</span></div></div><div style="text-align: end"><span class="m-label" style="padding:0">SETA</span><div>${delta(m.r === "W" ? 2 : -2)}</div></div></div>
        <button class="m-card pp-tap pp-row-btn" data-go="moment" style="padding:0;overflow:hidden"><div style="height:120px">${K.map().replace('width="100%" height="100%"', 'width="100%" height="120"')}</div><div style="padding:12px"><span class="tag e mono">ONE THING TO FIX · 08:42</span><b style="display:block;margin-top:8px">${m.r === "W" ? "Late rotation on round 9" : "Wide peek before the recon dart"}</b><span class="faint" style="font-size:12px">${m.r === "W" ? "Rotate on the first sound cue." : "Wait about 2 s, then swing as a pair."}</span></div></button>
        <div><div class="m-label" style="margin-bottom:8px">How was your focus?</div>${faces(st.focusFace, "focusFace")}</div>
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:8px;margin-top:auto"><button class="m-btn alt pp-tap" data-go="moment" style="height:46px">${ic("play")}Watch</button><button class="m-btn pp-tap" data-act="addDrill" style="height:46px">${ic("plus")}Add drill</button></div>
        <button class="faint pp-tap" data-act="debriefDone" style="font-size:12.5px;padding:6px">Done</button>` };
    },
    moment: () => ({ html: `${nav("Round 14", `<button class="m-ib pp-tap" data-act="sendCoach">${ic("send")}</button>`)}
      <div style="border-radius:16px;overflow:hidden;height:190px;position:relative;flex:none">${K.map().replace('width="100%" height="100%"', 'width="100%" height="190"')}<button class="pp-tap" data-act="play" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.92);color:#0E0C13;display:grid;place-items:center">${ic(st.playing ? "pause" : "play")}</button><span class="w-pill" style="position:absolute;top:10px;left:10px;color:#EDEAF4" data-ts>${ts(st.replayP)}</span></div>
      <div class="scrub pp-scrub" style="height:40px;touch-action:none;cursor:pointer"><div class="track" style="top:16px;height:5px"></div><div class="fill" style="top:16px;height:5px;width:${st.replayP}%"></div>${[9, 24, 41, 55, 72, 88].map((p, i) => `<i class="mk" data-act="seek" data-v="${p}" style="left:${p}%;top:6px;height:24px;cursor:pointer;background:${["var(--violet)", "var(--sky)", "var(--ember)", "var(--ember)", "var(--mint)", "var(--ember)"][i]}"></i>`).join("")}<span class="head" style="left:${st.replayP}%;top:12px;height:14px;width:10px;margin-inline-start:-5px"></span></div>
      <div class="m-card" style="padding:12px"><b class="row" style="gap:6px;color:var(--ember);font-size:12.5px">${ic("x-circle", "i-sm")}What happened</b><p style="margin:6px 0 0;font-size:12px" class="muted">Peeked B long 2.1 s before the dart landed. Lost the duel.</p></div>
      <div class="m-card" style="padding:12px;border-color:color-mix(in srgb,var(--mint) 40%,var(--line))"><b class="row" style="gap:6px;color:var(--mint);font-size:12.5px">${ic("check-circle-2", "i-sm")}Better play</b><p style="margin:6px 0 0;font-size:12px" class="muted">Swing after info. In 41 similar rounds, this won 68% of duels.</p></div>
      <button class="m-btn alt pp-tap" data-act="sendCoach" style="height:46px">${ic("message-square")}Ask Coach Reem</button>` }),

    /* ---------- stats ---------- */
    stats: () => {
      const [score, d, sk] = RANGE[st.range];
      return { tabs: true, html: `<div class="pp-nav"><h1 class="pp-large">Stats</h1><button class="m-chip pp-tap" data-act="gameSheet" style="height:32px">${K.brand(K.GAME_META[st.game].k, 13, st.game === "VAL" ? "#FA4454" : undefined)}${SHORT[st.game]}${ic("chevron-down")}</button></div>
        <div class="m-seg">${Object.keys(RANGE).map((r) => `<span class="${st.range === r ? "on" : ""}" data-act="range" data-v="${r}">${r}</span>`).join("")}</div>
        <div class="m-card row" style="gap:14px">${ring(score, { size: 86, stroke: 7, label: String(score), mark: 76 })}<div class="col" style="gap:4px"><span class="m-label" style="padding:0">SETA Score</span>${delta(d)}<span class="faint" style="font-size:11.5px">Top 18% · Immortal in Saudi Arabia</span></div></div>
        <span class="m-label">Skills · tap for detail</span>
        <div class="m-group">${SKILLS.map((s, i) => `<button class="m-row pp-row-btn" data-go="skill" data-p='{"i":${i}}'><span class="grow" style="font-weight:600">${s}</span><div class="meter" style="width:64px"><i style="width:${sk[i]}%;${SKD[i] < 0 ? "background:var(--rose)" : ""}"></i></div><b class="num" style="width:22px;text-align: end">${sk[i]}</b><span style="width:40px;text-align: end">${delta(SKD[i])}</span>${ic("chevron-right", "chev")}</button>`).join("")}</div>
        <button class="m-card pp-tap pp-row-btn row" data-go="matches" style="gap:10px">${ic("swords", "faint")}<span style="flex:1;font-weight:600">Match history</span><span class="faint" style="font-size:12px">40 matches</span>${ic("chevron-right", "faint")}</button>` };
    },
    skill: (p) => {
      const i = p.i || 0, v = RANGE[st.range][2][i];
      const tips = [["Crosshair placement", "Keep it at head height while moving"], ["Pre-aim common angles", "Saves about 120 ms on first contact"], ["Review 2 duels a day", "From your last match"]];
      return { tabs: true, html: `${nav(SKILLS[i])}
        <div class="row" style="gap:12px;align-items:flex-end"><b class="m-big" style="font-size:56px">${v}</b><div style="padding-bottom:8px">${delta(SKD[i], "%")}<div class="faint" style="font-size:11.5px">vs. last 30 days</div></div></div>
        <div class="m-card">${lines([{ data: Array.from({ length: 12 }, (_, k) => v - SKD[i] + (SKD[i] * k) / 11 + Math.sin(k) * 1.5), area: true, dots: true }], ["W1", "", "", "W4", "", "", "W7", "", "", "W10", "", "W12"], { w: 280, h: 130, ticks: 3 })}</div>
        <span class="m-label">How to improve</span>
        <div class="m-group">${tips.map(([t, d]) => `<div class="m-row"><span style="color:var(--violet)">${ic("lightbulb", "i-sm")}</span><span class="grow"><b style="font-size:12.5px">${t}</b><span class="s" style="display:block">${d}</span></span></div>`).join("")}</div>
        <button class="m-btn pp-tap" data-act="addDrill" style="height:46px">${ic("dumbbell")}Add drill · ${SKILLS[i]}</button>` };
    },
    matches: () => ({ tabs: true, html: `${nav("Matches")}<div class="m-seg"><span class="on">All</span><span>Wins</span><span>Losses</span></div><div class="m-group">${K.MATCHES.map((m, i) => matchRow(m, i, true)).join("")}</div>` }),
    match: (p) => {
      if (p.id === "next") return { tabs: true, html: `${nav("Upcoming")}
        <div class="m-card col" style="gap:12px;align-items:center;text-align:center;padding:20px">${K.game("VAL", 54, 14)}<b style="font-size:17px">Premier vs Najd Vipers</b><span class="faint" style="font-size:12.5px">Today 21:00 · Bind · Saudi server (Jazan)</span><div class="row" style="gap:18px;margin-top:6px">${av("Yara Hamami", "", 0)}<b class="mono faint">VS</b>${av("Najd Vipers", "", 5)}</div></div>
        <div class="m-group"><div class="m-row"><span class="grow">Remind me 30 min before</span>${sw(st.remind, "remind")}</div><div class="m-row"><span class="grow">Start session automatically</span>${sw(st.autoSession !== false, "autoSession")}</div></div>
        <span class="m-label">Scouting the opponent</span>
        <div class="m-card col" style="gap:8px;font-size:12.5px"><span>• They play fast B executes on attack (62%).</span><span>• Their duelist peeks A long first in most pistol rounds.</span></div>` };
      const m = K.MATCHES[p.id || 0], rounds = "WWLWWLLWLLWWLLLWLLLLL".split("");
      return { tabs: true, html: `${nav(m[0])}
        <div class="row between" style="align-items:flex-end"><div class="row" style="gap:10px">${K.game("VAL", 42, 11)}<div><span class="m-label" style="padding:0">${m[1]} · ${m[7]}</span><b class="m-big" style="display:block;font-size:40px">${m[3]}</b></div></div><span class="tag ${m[2] === "W" ? "m" : "r"}">${m[2] === "W" ? "Victory" : "Defeat"}</span></div>
        <div><div class="m-label" style="margin-bottom:6px">Rounds</div><div class="row" style="gap:2px">${rounds.map((r) => `<i style="flex:1;height:18px;border-radius:2px;background:${r === "W" ? "var(--mint)" : "var(--rose)"};opacity:.85"></i>`).join("")}</div></div>
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:8px">${[["K / D / A", m[4]], ["ACS", m[5]], ["Agent", m[8]], ["RR", m[6]]].map(([a, b]) => `<div class="m-card" style="padding:12px"><span class="m-label" style="padding:0">${a}</span><b class="num" style="display:block;font-size:17px">${b}</b></div>`).join("")}</div>
        <button class="m-btn pp-tap" data-go="moment" style="height:46px">${ic("play")}Open key moment</button>` };
    },

    /* ---------- coach ---------- */
    coach: () => {
      const ai = st.coachMode === "ai", list = ai ? st.chat : st.reem;
      return { tabs: true, composer: true, html: `<div class="pp-nav"><h1 class="pp-large">Coach</h1><button class="m-ib pp-tap" data-go="plan">${ic("calendar-days")}</button></div>
        <div class="m-seg"><span class="${ai ? "on" : ""}" data-act="coachMode" data-v="ai">${star(12)}AI Coach</span><span class="${ai ? "" : "on"}" data-act="coachMode" data-v="reem">${ic("user-round")}Coach Reem</span></div>
        ${ai ? "" : `<div class="m-card col" style="gap:10px"><div class="row" style="gap:10px">${av("Reem Alqahtani", "")}<div style="flex:1"><b>Reem Alqahtani</b><div class="faint" style="font-size:11.5px">Head Coach · Falcons · ★ 4.9</div></div><span class="tag m">${ic("badge-check")}</span></div>
          <div class="row wrap" style="gap:6px">${["Sat 18:00", "Sat 20:30", "Sun 17:00", "Mon 19:00"].map((s, i) => `<button class="m-chip pp-tap ${st.slot === i ? "on" : ""}" data-act="slot" data-v="${i}">${s}</button>`).join("")}</div>
          <button class="m-btn pp-tap" data-act="book" style="height:42px">${st.booked ? `${ic("check")}Booked · ${["Sat 18:00", "Sat 20:30", "Sun 17:00", "Mon 19:00"][st.slot]}` : "Book 1:1 · 180 SAR"}</button></div>`}
        <div class="pp-chat" data-chat>${list.map(bubble).join("")}</div>
        ${ai ? `<div class="row wrap" style="gap:6px">${["Show those rounds", "Make it a 3-day plan", "Am I ready for ranked?"].map((q) => `<button class="m-chip pp-tap" data-act="quick" data-v="${q}">${q}</button>`).join("")}</div>` : ""}
        <div style="height:60px;flex:none"></div>`, after: `<div class="pp-composer" style="bottom:84px;padding-bottom:10px"><input data-input placeholder="${ai ? "Ask your AI coach…" : "Message Reem…"}" enterkeyhint="send"><button class="pp-send" data-act="send">${ic("arrow-up")}</button></div>` };
    },
    plan: () => {
      const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"], items = st.week[st.day] || [];
      const total = Object.values(st.week).flat().length, done = Object.keys(st.weekDone).filter((k) => st.weekDone[k]).length + 10;
      return { tabs: true, html: `${nav("Training plan", `<button class="m-ib pp-tap" data-act="drillSheet">${ic("plus")}</button>`)}
        <div><span class="m-label" style="padding:0">Week 3 of 6 · Entry timing</span><div class="row between" style="margin-top:6px"><b class="m-big" style="font-size:34px">${Math.round((done / (total + 10)) * 100)}%</b><span class="faint" style="font-size:12px">${done} of ${total + 10} drills</span></div><div class="meter" style="margin-top:8px"><i style="width:${Math.round((done / (total + 10)) * 100)}%"></i></div></div>
        <div class="row between">${days.map((d, i) => `<button class="col pp-tap" data-act="day" data-v="${d}" style="gap:4px;align-items:center;width:38px;padding:8px 0;border-radius:12px;${st.day === d ? "background:var(--violet);color:var(--on-violet)" : ""}"><span style="font-size:10.5px;font-weight:600;opacity:.75">${d[0]}</span><b style="font-size:14px">${8 + i}</b><i style="width:5px;height:5px;border-radius:50%;background:${i < 1 ? "currentColor" : (st.week[d] || []).length ? "var(--mint)" : "var(--line-2)"}"></i></button>`).join("")}</div>
        <span class="m-label">${st.day === "Sat" ? "Today" : st.day}</span>
        <div class="col" style="gap:8px">${items.length ? items.map((t, i) => { const k = st.day + i, dn = st.weekDone[k]; const [name, meta] = t.split(" · "); return `<button class="drill pp-tap pp-row-btn ${["", "e", "s", "m"][i % 4]} ${dn ? "done" : ""}" data-act="drill" data-v="${k}" style="font-size:13px;padding:11px 12px;display:flex;justify-content:space-between;align-items:center"><span class="dn"><b>${name}</b><em>${(meta || "").toUpperCase()}</em></span><span class="check ${dn ? "on" : ""}" style="width:20px;height:20px">${ic("check")}</span></button>`; }).join("") : `<p class="pp-empty">Nothing planned. Tap + to add a drill.</p>`}</div>
        <div class="m-card row" style="gap:10px;padding:12px">${av("Reem Alqahtani", "sm")}<span style="font-size:12px;flex:1"><b>Reem</b> <span class="muted">reviewed this plan · 2d ago</span></span></div>` };
    },

    /* ---------- me ---------- */
    me: () => ({ tabs: true, html: `<div class="pp-nav"><h1 class="pp-large">Me</h1><button class="m-ib pp-tap" data-act="settingsToast">${ic("settings")}</button></div>
      <div class="row" style="gap:12px">${av("Yara Hamami", "lg")}<div style="flex:1"><b style="font-size:16px">Yara Hamami</b><div class="faint" style="font-size:12px">NYX · Duelist · Falcons</div></div><span class="tag v mono">PRO 92%</span></div>
      <button class="passport pp-tap pp-row-btn" data-go="passport" style="min-height:0;padding:14px;gap:10px;border-radius:18px">${guil(300, 160)}<span class="row between" style="position:relative;width:100%"><span class="wm on-ink" style="height:12px"><img class="d" src="assets/wordmark-dark.png" alt="SETA" style="height:12px"></span><span class="lbl">Talent Passport ›</span></span><span class="row between" style="position:relative;width:100%;align-items:flex-end"><span><span class="lbl" style="display:block">ST-10427</span><b class="wide" style="font-size:20px">NYX</b></span><span class="qr" style="padding:3px;border-radius:6px">${qr("NYX", 44)}</span></span></button>
      <span class="m-label">Account</span>
      <div class="m-group">${[["link", "Linked accounts", `${Object.values(st.linked).filter(Boolean).length} linked`, "accounts"], ["watch", "Devices", st.watch ? "Apple Watch" : "None", "devices"], ["bell", "Notifications", st.notifOn ? "On" : "Off", "notifset"], ["shield-check", "Privacy", "Verified clubs", "privacy"]].map(([i, t, s, g]) => `<button class="m-row pp-row-btn" data-go="${g}"><span class="faint">${ic(i, "i-sm")}</span><span class="grow"><b style="font-weight:500">${t}</b></span><span class="faint" style="font-size:12px">${s}</span>${ic("chevron-right", "chev")}</button>`).join("")}
        <button class="m-row pp-row-btn" data-act="healthSheet"><span>${K.healthIcon ? K.healthIcon(20) : ""}</span><span class="grow"><b style="font-weight:500">Apple Health</b></span><span class="faint" style="font-size:12px">${st.watch ? "Connected" : "Off"}</span>${ic("chevron-right", "chev")}</button></div>
      <span class="m-label">Appearance</span>
      <div class="m-seg">${[["light", "sun", "Light"], ["system", "monitor", "Auto"], ["dark", "moon", "Dark"]].map(([m, i, l]) => `<span class="${themeMode() === m ? "on" : ""}" data-act="theme" data-v="${m}">${ic(i)}${l}</span>`).join("")}</div>
      <span class="m-label">Language</span>
      <div class="m-seg" data-noi18n><span class="${K.isAr ? "on" : ""}" data-act="setLang" data-v="ar">العربية</span><span class="${K.isAr ? "" : "on"}" data-act="setLang" data-v="en">English</span></div>
      <div class="m-group"><button class="m-row pp-row-btn" data-act="help"><span class="faint">${ic("life-buoy", "i-sm")}</span><span class="grow"><b style="font-weight:500">Help & feedback</b></span>${ic("chevron-right", "chev")}</button><button class="m-row pp-row-btn" data-act="signout"><span style="color:var(--rose)">${ic("log-out", "i-sm")}</span><span class="grow" style="color:var(--rose)"><b style="font-weight:500">Sign out</b></span></button></div>
      <p class="faint mono" style="font-size:10px;text-align:center">SETA 2.0 · build 2611</p>` }),
    passport: () => ({ tabs: true, html: `${nav("Talent Passport", `<button class="m-ib pp-tap" data-act="shareSheet">${ic("share")}</button>`)}
      <div class="pp-flip ${st.flip ? "on" : ""}" data-act="flip"><div class="pp-flip-in">
        <div class="pp-face passport" style="min-height:0;padding:16px;gap:12px;border-radius:20px">${guil(300, 340)}<div class="row between" style="position:relative"><span class="wm on-ink" style="height:12px"><img class="d" src="assets/wordmark-dark.png" alt="" style="height:12px"></span><span class="tag" style="background:rgba(69,214,162,.14);color:#45D6A2;font-size:10px">${ic("badge-check")}Verified</span></div><div class="row" style="gap:10px;position:relative">${av("Yara Hamami", "lg")}<div><b class="wide" style="font-size:22px">NYX</b><div class="lbl">Valorant · Duelist</div></div></div><div style="position:relative;display:grid;place-items:center;padding:4px 0"><div class="qr">${qr("NYX", 132)}</div></div><div class="lbl" style="text-align:center;position:relative">Tap to flip</div></div>
        <div class="pp-face back passport" style="min-height:0;padding:16px;gap:10px;border-radius:20px">${guil(300, 340)}<div class="lbl" style="position:relative">Verified stats</div>${[["SETA Score", "82"], ["Potential", "92"], ["Rank", "Immortal 1"], ["Server", "Jazan · KSA"], ["Matches", "412"], ["Team", "Falcons"]].map(([a, b]) => `<div class="row between" style="position:relative;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:7px"><span class="lbl">${a}</span><b class="v">${b}</b></div>`).join("")}</div>
      </div></div>
      <button class="m-card pp-tap pp-row-btn row" data-go="privacy" style="gap:10px;padding:11px 13px"><span style="color:var(--violet)">${ic("eye")}</span><span style="font-size:12px;flex:1">Visible to <b>verified clubs</b></span><span class="link">Change</span></button>
      <button class="m-btn pp-tap" data-act="showQR">${ic("scan-line")}Show QR to a scout</button>` }),
    accounts: () => ({ tabs: true, html: `${nav("Linked accounts")}${accountsGroup()}<p class="faint" style="font-size:11.5px;margin:0">SETA reads match history only. Unlink any time.</p>` }),
    devices: () => ({ tabs: true, html: `${nav("Devices")}
      ${st.watch ? `<div class="m-group"><div class="m-row"><span class="brand-tile">${K.brand(st.device, 18)}</span><span class="grow"><b>${{ apple: "Apple Watch", samsung: "Galaxy Watch", wearos: "Pixel Watch", garmin: "Garmin", fitbit: "Fitbit", huawei: "Huawei Watch" }[st.device]}</b><span class="s" style="display:block">Synced just now · 92% battery</span></span><span class="tag m">${ic("check")}Live</span></div><button class="m-row pp-row-btn" data-act="unlink"><span class="grow" style="color:var(--rose);font-weight:600">Unlink watch</span></button></div>` : `<p class="pp-empty">No devices yet.</p>`}
      <button class="m-btn ${st.watch ? "alt" : ""} pp-tap" data-go="pair1">${ic("plus")}${st.watch ? "Link another device" : "Link a watch"}</button>` }),
    pair1: () => ({ html: `${nav("", `<div class="m-steps" style="width:110px"><i class="on"></i><i></i><i></i><i></i></div>`)}
      <div><h2 class="pp-large" style="font-size:26px">Which watch?</h2><p class="m-sub">We’ll show the right steps for it.</p></div>
      <div class="m-group">${[["apple", "Apple Watch", "SETA app + Apple Health"], ["samsung", "Galaxy Watch", "SETA app + Health Connect"], ["wearos", "Pixel / Wear OS", "SETA app + Health Connect"], ["garmin", "Garmin", "Sign in to Garmin Connect"], ["fitbit", "Fitbit", "Sign in to Fitbit"], ["huawei", "Huawei Watch", "Huawei Health Kit"]].map(([k, n, d]) => `<button class="m-row pp-row-btn" data-act="device" data-v="${k}" style="${st.device === k ? "background:var(--violet-tint)" : ""}"><span class="brand-tile">${K.brand(k, 18)}</span><span class="grow"><b>${n}</b><span class="s" style="display:block">${d}</span></span><span class="radio ${st.device === k ? "on" : ""}"></span></button>`).join("")}</div>
      <button class="m-btn pp-tap" data-go="pair2" style="margin-top:auto">Continue ${ic("arrow-right")}</button>` }),
    pair2: () => ({ html: `${nav("", `<div class="m-steps" style="width:110px"><i class="on"></i><i class="on"></i><i></i><i></i></div>`)}
      <div class="row" style="gap:10px">${K.healthIcon ? K.healthIcon(40) : ""}<div><b>Health Access</b><div class="faint" style="font-size:11.5px">“SETA” would like to read</div></div></div>
      <div class="m-group">${[["heart", "Heart rate"], ["activity", "Heart rate variability"], ["moon", "Sleep"], ["heart-handshake", "Resting heart rate"], ["footprints", "Steps"]].map(([i, t], k) => `<div class="m-row"><span style="color:var(--rose)">${ic(i, "i-sm")}</span><span class="grow">${t}</span>${sw(k < 4, "noop")}</div>`).join("")}</div>
      <div class="m-card row" style="gap:10px;background:var(--surface-2);padding:12px"><span style="color:var(--mint)">${ic("lock", "i-sm")}</span><span class="muted" style="font-size:11.5px">Read only. SETA never writes to Health or reads location.</span></div>
      <button class="m-btn pp-tap" data-go="pair3" style="margin-top:auto">Allow</button>` }),
    pair3: () => {
      const c = st.pairCode;
      return { html: `${nav("", `<div class="m-steps" style="width:110px"><i class="on"></i><i class="on"></i><i class="on"></i><i></i></div>`)}
        <div><h2 class="pp-large" style="font-size:24px">Type the code on your watch</h2><p class="m-sub">Open SETA on the watch. Code: <b class="mono" style="color:var(--violet)">482913</b></p></div>
        <div class="code-box">${[0, 1, 2, 3, 4, 5].map((i) => `<b class="${i === c.length ? "on" : ""}">${c[i] || ""}</b>`).join("")}</div>
        <div class="row" style="gap:8px;justify-content:center;font-size:12px"><span class="dot live" style="background:var(--violet);box-shadow:0 0 0 3px var(--violet-tint)"></span><span class="faint">Watch found nearby · Bluetooth</span></div>
        <div class="pp-keypad" style="margin-top:auto">${["1", "2", "3", "4", "5", "6", "7", "8", "9", "auto", "0", "del"].map((k) => `<button data-act="key" data-v="${k}" style="${k === "auto" ? "font-size:11px;color:var(--violet)" : ""}">${k === "del" ? ic("delete") : k === "auto" ? "Paste" : k}</button>`).join("")}</div>` };
    },
    pair4: () => ({ html: `<div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding-top:30px"><span style="width:72px;height:72px;border-radius:50%;background:var(--mint);color:#fff;display:grid;place-items:center;animation:pop .5s var(--ease)">${ic("check", "i-lg")}</span><h2 class="pp-large" style="font-size:26px">Watch linked</h2><p class="m-sub" style="margin:0">Importing the last 30 days now.</p></div>
      <div class="m-card col" style="gap:8px"><div class="row between" style="font-size:12px"><span class="muted">First sync</span><span class="mono faint">100%</span></div><div class="meter"><i style="width:100%;background:var(--mint)"></i></div><div class="faint" style="font-size:11px">Sleep ✓ · HRV ✓ · Heart rate ✓</div></div>
      <div class="m-group"><div class="m-row"><span class="grow"><b style="font-size:12.5px">Start session when a match begins</b><span class="s" style="display:block">Detected from your Riot account</span></span>${sw(true, "noop")}</div><div class="m-row"><span class="grow"><b style="font-size:12.5px">Break nudges on watch</b><span class="s" style="display:block">Soft haptic, no sound</span></span>${sw(true, "noop")}</div></div>
      <button class="m-btn pp-tap" data-act="pairDone" style="margin-top:auto">Done</button>` }),
    notifset: () => ({ tabs: true, html: `${nav("Notifications")}<div class="m-group"><div class="m-row"><span class="grow"><b>Allow notifications</b></span>${sw(!!st.notifOn, "notifOn")}</div></div>
      <div class="m-group" style="${st.notifOn ? "" : "opacity:.4;pointer-events:none"}">${[["Debrief after each match", true], ["Coach replies", true], ["Break nudges (watch only)", true], ["Weekly progress", false], ["Club and scout requests", true]].map(([t, on]) => `<div class="m-row"><span class="grow">${t}</span>${sw(on, "noop")}</div>`).join("")}</div>` }),
    privacy: () => ({ tabs: true, html: `${nav("Privacy")}<span class="m-label">Who can see your passport</span><div class="m-group">${[["Public link", "Limited card", false], ["Verified clubs", "Full profile, on request", true], ["Coaches I work with", "Full + BioSync summary", true], ["Tournament admins", "Identity and rank", true]].map(([t, d, on]) => `<div class="m-row"><span class="grow"><b style="font-size:12.5px">${t}</b><span class="s" style="display:block">${d}</span></span>${sw(on, "noop")}</div>`).join("")}</div><span class="m-label">Body data</span><div class="m-group"><div class="m-row"><span class="grow"><b style="font-size:12.5px">Share BioSync with Coach Reem</b></span>${sw(true, "noop")}</div><button class="m-row pp-row-btn" data-act="deleteData"><span class="grow" style="color:var(--rose);font-weight:600">Delete my body data</span></button></div>` }),
  };

  const ts = (p) => { const s = Math.round((p / 100) * 1290); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
  const bubble = (m) => `<div class="msg ${m.me ? "me" : "ai"}">${m.me ? "" : `<span class="coach-mark" style="width:26px;height:26px">${st.coachMode === "ai" ? star(12) : `<b style="font-size:10px">RA</b>`}</span>`}<div class="bub" style="font-size:12.5px">${m.t}</div></div>`;
  const matchRow = (m, i, chev) => `<button class="m-row pp-row-btn ${chev ? "" : "m-card"}" data-go="match" data-p='{"id":${i}}' style="${chev ? "" : "padding:12px"}">${K.game("VAL", 30, 8)}<span class="grow"><b>${m[0]}</b> <span class="faint" style="font-weight:500">· ${m[8]}</span><span class="s" style="display:block">${m[1]} · ${m[7]}</span></span><span class="res ${m[2] === "W" ? "w" : "l"}">${m[2]}</span><b class="num" style="width:44px;text-align: end">${m[3]}</b></button>`;
  const accountsGroup = () => `<div class="m-group">${[["riotgames", "Riot Games", "Valorant · NYX#KSA1"], ["steam", "Steam", "Counter-Strike 2"], ["epicgames", "Epic Games", "Rocket League"], ["playstation", "PlayStation", "EA Sports FC"], ["discord", "Discord", "Team voice"]].map(([k, n, d]) => `<div class="m-row"><span class="brand-tile">${K.brand(k, 18)}</span><span class="grow"><b>${n}</b><span class="s" style="display:block">${d}</span></span>${st.linked[k] ? `<button class="tag m pp-tap" data-act="link" data-v="${k}">${ic("check")}Linked</button>` : `<button class="m-chip pp-tap" data-act="link" data-v="${k}" style="height:28px">Connect</button>`}</div>`).join("")}</div>`;
  const themeMode = () => { try { return localStorage.getItem("seta-theme") || "system"; } catch (e) { return "system"; } };

  /* ================= rendering / navigation ================= */
  function build(route) {
    const out = R[route.name](route.p || {});
    const v = document.createElement("div");
    v.className = "pp-view" + (out.ink ? " ink" : "");
    v.dataset.route = route.name;
    v.innerHTML = `<div class="pp-scroll ${out.tabs ? "tabs-pad" : ""}">${out.html}</div>${out.after || ""}`;
    return { v, out };
  }
  function after(out) {
    window.lucide && lucide.createIcons();
    tabsEl.classList.toggle("hidden", !out.tabs);
    updateTabs();
    scr.classList.toggle("ink", !!out.ink);
    updateChrome();
    const inp = $("[data-input]", viewsEl);
    if (inp) inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); act("send"); } e.stopPropagation(); });
  }
  function current() { return viewsEl.lastElementChild; }
  function show(anim) {
    const old = current(), { v, out } = build(top());
    if (anim === "push") { v.classList.add("from-right"); viewsEl.appendChild(v); v.offsetWidth; v.classList.remove("from-right"); old && old.classList.add("to-left"); setTimeout(() => old && old.remove(), 450); }
    else if (anim === "pop") { v.classList.add("to-left"); old ? viewsEl.insertBefore(v, old) : viewsEl.appendChild(v); v.offsetWidth; v.classList.remove("to-left"); if (old) { old.classList.add("from-right"); setTimeout(() => old.remove(), 450); } }
    else if (anim === "fade") { v.classList.add("fade-in-start"); viewsEl.appendChild(v); v.offsetWidth; v.classList.remove("fade-in-start"); if (old) { old.classList.add("fade-out"); setTimeout(() => old.remove(), 320); } }
    else { viewsEl.innerHTML = ""; viewsEl.appendChild(v); }
    after(out);
  }
  function refresh() {
    const old = current(); if (!old) return show();
    const y = $(".pp-scroll", old)?.scrollTop || 0;
    const { v, out } = build(top());
    viewsEl.replaceChild(v, old);
    $(".pp-scroll", v).scrollTop = y;
    after(out);
  }
  const go = (name, p) => { st.stack.push({ name, p }); show("push"); };
  function edgeBack(old) {
    st.stack.pop();
    const { v, out } = build(top());
    viewsEl.insertBefore(v, old);
    after(out);
    old.style.transition = "transform .28s cubic-bezier(.2,.8,.2,1)";
    old.style.transform = document.documentElement.dir === "rtl" ? "translateX(-100%)" : "translateX(100%)";
    setTimeout(() => old.remove(), 300);
  }
  const back = () => { if (st.stack.length > 1) { st.stack.pop(); show("pop"); return true; } return false; };
  const tab = (name) => { if (top().name === name && st.stack.length === 1) { const sc = $(".pp-scroll", current()); sc && sc.scrollTo({ top: 0, behavior: "smooth" }); return; } st.stack = [{ name }]; show("fade"); };
  const reset = (name, anim = "fade") => { st.stack = [{ name }]; show(anim); };
  K.ppGo = (name) => { if (!R[name]) return; if (TABS.includes(name)) reset(name); else { if (!st.onboarded && !["splash", "welcome", "role", "link", "perms"].includes(name)) st.onboarded = true; const t = tabOf(name); st.stack = t ? [{ name: t }, { name }] : [{ name }]; show("fade"); } };

  function updateTabs() {
    const t = tabOf(top().name);
    $$("button", tabsEl).forEach((b) => b.classList.toggle("on", b.dataset.tab === t));
    const g = $(".go", tabsEl); g.classList.toggle("live", st.session.live);
    g.querySelector("i").innerHTML = ic(st.session.live ? "square" : "play"); g.querySelector("span").textContent = st.session.live ? "Live" : "Session";
    const b = $("[data-tab=today] .badge", tabsEl); if (b) b.style.display = st.unread ? "" : "none";
    window.lucide && lucide.createIcons();
  }
  function updateChrome() {
    const c = $(".pp-crumb"); if (c) c.innerHTML = st.stack.map((r, i) => (i === st.stack.length - 1 ? `<b>${TITLES[r.name]}</b>` : `<span>${TITLES[r.name]}</span>${ic("chevron-right", "i-sm")}`)).join("");
    $$(".pp-flows button").forEach((b) => b.classList.toggle("on", b.dataset.jump === top().name));
    window.lucide && lucide.createIcons();
  }

  /* ================= island + overlays ================= */
  function island(icon, title, sub) {
    clearTimeout(islandTimer);
    islandEl.className = "pp-island msg";
    islandEl.innerHTML = `<span class="pp-toast-dot">${ic(icon, "i-sm")}</span><span style="display:flex;flex-direction:column;line-height:1.3;text-align: start;min-width:0"><b style="font-size:12.5px">${title}</b>${sub ? `<span style="font-size:11px;font-weight:500;color:#A7A0B6;overflow:hidden;text-overflow:ellipsis">${sub}</span>` : ""}</span>`;
    window.lucide && lucide.createIcons();
    islandTimer = setTimeout(islandIdle, 1800);
  }
  function islandIdle() {
    if (st.session.live) { islandEl.className = "pp-island live"; islandEl.innerHTML = `<span class="row" style="gap:6px"><i class="rec"></i><span data-timer>${fmt(Date.now() - st.session.t0)}</span></span><span class="row" style="gap:4px;color:#FF6B81">${ic("heart", "i-sm")}<span data-hr>${st.watch ? hrNow() : "–"}</span></span>`; window.lucide && lucide.createIcons(); }
    else { islandEl.className = "pp-island"; islandEl.innerHTML = ""; }
  }
  function sheet(html, onMount) {
    sheetEl.onclick = null;
    sheetEl.innerHTML = `<div class="pp-grab"></div><div class="pp-sheet-body">${html}</div>`;
    window.lucide && lucide.createIcons();
    scrimEl.classList.add("on"); sheetEl.offsetWidth; sheetEl.classList.add("on");
    onMount && onMount(sheetEl);
  }
  function closeSheet() { sheetEl.classList.remove("on"); scrimEl.classList.remove("on"); sheetEl.style.transform = ""; }
  function alertBox(t, m, a, b, cb) {
    alertEl.innerHTML = `<div class="box"><div class="t">${t}</div><div class="m">${m}</div><div class="acts"><button data-alert="0">${a}</button><button data-alert="1">${b}</button></div></div>`;
    alertEl.classList.add("on");
    alertEl.onclick = (e) => { const x = e.target.closest("[data-alert]"); if (!x) return; alertEl.classList.remove("on"); cb && cb(x.dataset.alert === "1"); };
  }

  /* ================= live session ================= */
  function tick() {
    const s = st.session; if (!s.live) return;
    const last = hrNow(), target = 112 + Math.sin(Date.now() / 9000) * 22;
    s.hr.push(Math.round(Math.max(72, Math.min(162, last + (target - last) * 0.25 + (Math.random() - 0.5) * 8))));
    if (s.hr.length > 120) s.hr.shift();
    const t = fmt(Date.now() - s.t0);
    $$("[data-timer]", scr).forEach((e) => (e.textContent = t));
    if (st.watch) { $$("[data-hr]", scr).forEach((e) => (e.textContent = hrNow())); const ch = $("[data-hrchart]", scr); if (ch) ch.innerHTML = hrChart(); }
  }

  /* ================= actions ================= */
  const ACT = {
    noop() {},
    lang() { K.setLang(K.isAr ? "en" : "ar"); },
    signin(el) { island("check", `Signed in with ${el.dataset.v}`, "Welcome to SETA"); setTimeout(() => go("role"), 300); },
    emailSheet() { sheet(`<b style="font-size:17px">Sign in with email</b><div class="input" style="height:44px">${ic("at-sign")}<input value="yara@jazanu.edu.sa"></div><div class="input" style="height:44px">${ic("lock")}<input type="password" value="seta-2026"></div><button class="m-btn pp-tap" data-act="emailGo">Continue</button>`); },
    emailGo() { closeSheet(); setTimeout(() => go("role"), 250); },
    role(el) { st.role = el.dataset.v; refresh(); },
    link(el) { const k = el.dataset.v; st.linked[k] = !st.linked[k]; refresh(); island(st.linked[k] ? "link" : "unlink", `${K.BRANDS[k].name} ${st.linked[k] ? "linked" : "unlinked"}`, st.linked[k] ? "Importing match history" : ""); },
    askNotif() { alertBox("“SETA” Would Like to Send You Notifications", "Debriefs, coach replies and break reminders.", "Don’t Allow", "Allow", (ok) => { st.notifOn = ok ? "yes" : false; refresh(); if (ok) island("bell", "Notifications on", ""); }); },
    enter() { st.onboarded = true; reset("today"); setTimeout(() => island("sparkles", "Welcome, Nyx", "Your SETA Score is 82"), 400); },
    checkin() {
      const body = () => `<div class="row between"><b style="font-size:17px">Check-in</b><span class="faint mono" style="font-size:11px">20 SEC</span></div><span class="m-label">Energy right now</span>${faces(st.energy, "energy")}
        <div><div class="row between" style="font-size:12.5px"><b>Focus</b><span class="mono faint" data-val="focus">${st.focus}</span></div>${slider("focus", st.focus)}</div>
        <div><div class="row between" style="font-size:12.5px"><b>Stress</b><span class="mono faint" data-val="stress">${st.stress}</span></div>${slider("stress", st.stress)}</div>
        ${st.watch ? `<div class="m-group"><div class="m-row"><span style="color:var(--violet)">${ic("moon", "i-sm")}</span><span class="grow">Sleep · from watch</span><b>7h 40m</b></div></div>` : ""}
        <button class="m-btn pp-tap" data-act="saveCheckin">Save check-in</button>`;
      sheet(body(), (sh) => bindSliders(sh));
      ACT._checkinBody = body;
    },
    energy(el) { st.energy = +el.dataset.v; $$("[data-act=energy]", sheetEl).forEach((x) => x.classList.toggle("on", x === el)); },
    saveCheckin() { st.checked = true; closeSheet(); refresh(); island("circle-check", "Check-in saved", `Focus ${st.focus} · Stress ${st.stress}`); },
    plan(el) { const i = +el.dataset.v; st.plan[i].d = !st.plan[i].d; refresh(); if (st.plan.every((x) => x.d)) island("trophy", "Plan complete", "25 minutes done today"); },
    readAll() { st.notifs.forEach((n) => (n.unread = false)); st.unread = 0; refresh(); updateTabs(); },
    openNotif(el) { const n = st.notifs[+el.dataset.v]; if (n.unread) { n.unread = false; st.unread = Math.max(0, st.unread - 1); } if (TABS.includes(n.go)) tab(n.go); else go(n.go); },
    healthSheet() { sheet(`<div class="row" style="gap:10px">${K.healthIcon ? K.healthIcon(44) : ""}<div><b style="font-size:16px">Apple Health</b><div class="faint" style="font-size:12px">${st.watch ? "Connected · reading 4 types" : "Not connected"}</div></div></div><p class="muted" style="margin:0;font-size:12.5px">One permission covers every device that saves to Health: Apple Watch, Oura, Garmin Connect and more.</p><div class="m-group">${["Heart rate", "HRV", "Sleep", "Resting HR"].map((t) => `<div class="m-row"><span class="grow">${t}</span>${sw(st.watch, "noop")}</div>`).join("")}</div><button class="m-btn pp-tap" data-act="${st.watch ? "closeSheet" : "healthGo"}">${st.watch ? "Done" : "Connect Apple Health"}</button>`); },
    healthGo() { closeSheet(); setTimeout(() => go("pair1"), 250); },
    closeSheet() { closeSheet(); },
    game(el) { st.game = el.dataset.v; refresh(); },
    gameSheet() { sheet(`<b style="font-size:17px">Choose a game</b><div class="m-group">${Object.keys(K.GAME_META).map((g) => `<button class="m-row pp-row-btn" data-act="pickGame" data-v="${g}">${K.game(g, 30, 8)}<span class="grow"><b>${K.gameName(g)}</b></span>${st.game === g ? `<span style="color:var(--violet)">${ic("check")}</span>` : ""}</button>`).join("")}</div>`); },
    pickGame(el) { st.game = el.dataset.v; closeSheet(); refresh(); },
    mode(el) { st.mode = el.dataset.v; refresh(); },
    startSession() {
      const start = () => { st.session.live = true; st.session.t0 = Date.now() - 1000; st.session.matches = []; clearInterval(liveTimer); liveTimer = setInterval(tick, 1000); refresh(); updateTabs(); island("play", "Session started", st.watch ? "Watch is recording heart rate" : "Heart rate off"); };
      if (!st.watch) alertBox("No watch linked", "Start without heart rate, or link a watch first?", "Link watch", "Start anyway", (ok) => (ok ? start() : go("pair1")));
      else start();
    },
    matchEnded() {
      const maps = ["Bind", "Haven", "Ascent", "Lotus", "Split"]; let r = "W", map = maps[0];
      sheet(`<b style="font-size:17px">How did it go?</b><div class="m-seg" data-res><span class="on" data-v="W">Win</span><span data-v="L">Loss</span></div><span class="m-label">Map</span><div class="row wrap" style="gap:6px" data-maps>${maps.map((m, i) => `<span class="m-chip ${i ? "" : "on"}" data-v="${m}">${m}</span>`).join("")}</div><button class="m-btn pp-tap" data-save>Save & see debrief</button>`, (sh) => {
        sh.onclick = (e) => {
          const s1 = e.target.closest("[data-res] span"); if (s1) { r = s1.dataset.v; $$("[data-res] span", sh).forEach((x) => x.classList.toggle("on", x === s1)); }
          const s2 = e.target.closest("[data-maps] span"); if (s2) { map = s2.dataset.v; $$("[data-maps] span", sh).forEach((x) => x.classList.toggle("on", x === s2)); }
          if (e.target.closest("[data-save]")) { const m = { r, map, sc: r === "W" ? "13–" + (6 + Math.floor(Math.random() * 6)) : 7 + Math.floor(Math.random() * 5) + "–13" }; st.session.matches.push(m); closeSheet(); sh.onclick = null; setTimeout(() => go("debrief", { m }), 260); }
        };
      });
    },
    endSession() { alertBox("End session?", `You played for ${fmt(Date.now() - st.session.t0)}.`, "Keep playing", "End", (ok) => { if (!ok) return; st.session.live = false; clearInterval(liveTimer); islandIdle(); refresh(); updateTabs(); island("flag", "Session saved", `${st.session.matches.length} matches · debriefs ready`); }); },
    focusFace(el) { st.focusFace = +el.dataset.v; $$("[data-act=focusFace]", viewsEl).forEach((x) => x.classList.toggle("on", x === el)); },
    addDrill() { st.plan.push({ t: "Trade spacing", s: "Custom · 20 min", d: false }); st.week.Sat.push("Trade spacing · 20 min"); island("dumbbell", "Drill added", "Trade spacing · Saturday"); },
    debriefDone() { if (st.session.live) tab("session"); else tab("today"); },
    share() { ACT.shareSheet(); },
    shareSheet() { sheet(`<b style="font-size:17px">Share</b><div class="grid" style="grid-template-columns:repeat(4,1fr);gap:10px;text-align:center;font-size:11px">${[["link", "Copy link"], ["image", "Save image"], ["message-circle", "Messages"], ["qr-code", "QR code"]].map(([i, t]) => `<button class="col pp-tap" data-act="shared" data-v="${t}" style="gap:6px;align-items:center"><span class="brand-tile" style="width:52px;height:52px;border-radius:16px">${ic(i)}</span>${t}</button>`).join("")}</div>`); },
    shared(el) { closeSheet(); island("check", el.dataset.v === "Copy link" ? "Link copied" : `${el.dataset.v} ready`, "seta.gg/p/ST-10427"); },
    play() { st.playing = !st.playing; clearInterval(playTimer); if (st.playing) playTimer = setInterval(() => { st.replayP = st.replayP >= 100 ? 0 : st.replayP + 0.6; paintScrub(); }, 60); const b = $("[data-act=play]", viewsEl); if (b) { b.innerHTML = ic(st.playing ? "pause" : "play"); lucide.createIcons(); } },
    seek(el) { st.replayP = +el.dataset.v; paintScrub(); },
    sendCoach() { st.coachMode = "reem"; st.reem.push({ me: true, t: "Can you look at round 14 on Bind? I peeked too early again." }); tab("coach"); setTimeout(() => replyTo("reem", "round"), 900); },
    range(el) { st.range = el.dataset.v; refresh(); },
    coachMode(el) { st.coachMode = el.dataset.v; refresh(); },
    quick(el) { sendMsg(el.dataset.v); },
    send() { const i = $("[data-input]", viewsEl); if (!i || !i.value.trim()) { i && i.focus(); return; } sendMsg(i.value.trim()); },
    slot(el) { st.slot = +el.dataset.v; st.booked = false; refresh(); },
    book() { if (st.booked) return; alertBox("Book with Reem?", `${["Sat 18:00", "Sat 20:30", "Sun 17:00", "Mon 19:00"][st.slot]} · 60 min · 180 SAR`, "Cancel", "Book", (ok) => { if (!ok) return; st.booked = true; refresh(); island("calendar-check", "Session booked", "Added to your training plan"); }); },
    day(el) { st.day = el.dataset.v; refresh(); },
    drill(el) { const k = el.dataset.v; st.weekDone[k] = !st.weekDone[k]; refresh(); },
    drillSheet() { sheet(`<b style="font-size:17px">Add a drill to ${st.day}</b><div class="m-group">${[["Crossfire timing", "15 min"], ["Trade spacing", "20 min"], ["Retake protocol", "25 min"], ["Box breathing reset", "5 min"], ["Replay self-review", "10 min"]].map(([t, m]) => `<button class="m-row pp-row-btn" data-act="addToDay" data-v="${t} · ${m}"><span style="color:var(--violet)">${ic("dumbbell", "i-sm")}</span><span class="grow"><b>${t}</b></span><span class="faint">${m}</span></button>`).join("")}</div>`); },
    addToDay(el) { (st.week[st.day] = st.week[st.day] || []).push(el.dataset.v); closeSheet(); refresh(); island("plus", "Added to " + st.day, el.dataset.v.split(" · ")[0]); },
    theme(el) { setTheme(el.dataset.v); setTimeout(refresh, 600); },
    setLang(el) { if ((el.dataset.v === "ar") !== K.isAr) K.setLang(el.dataset.v); },
    help() { island("life-buoy", "Help centre", "Opens seta.gg/help"); },
    settingsToast() { go("notifset"); },
    signout() { alertBox("Sign out?", "You can sign back in with Apple, Google or your gaming ID.", "Cancel", "Sign out", (ok) => { if (!ok) return; const keepTheme = true; st = fresh(); st.stack = [{ name: "welcome" }]; clearInterval(liveTimer); islandIdle(); show("fade"); }); },
    flip() { st.flip = !st.flip; $(".pp-flip", viewsEl)?.classList.toggle("on", st.flip); },
    showQR() { sheet(`<div style="display:grid;place-items:center;padding:10px 0"><div class="qr" style="padding:14px;border-radius:18px">${qr("NYX", 200)}</div></div><b style="text-align:center;font-size:16px">NYX · ST-10427</b><p class="faint" style="text-align:center;margin:0;font-size:12px">Scouts scan this to open your verified passport. Brightness turned up.</p><button class="m-btn alt pp-tap" data-act="closeSheet">Done</button>`); },
    device(el) { st.device = el.dataset.v; refresh(); },
    key(el) { const k = el.dataset.v; if (k === "del") st.pairCode = st.pairCode.slice(0, -1); else if (k === "auto") st.pairCode = "482913"; else if (st.pairCode.length < 6) st.pairCode += k; refresh(); if (st.pairCode.length === 6) { if (st.pairCode === "482913") setTimeout(() => { st.watch = true; st.stack[st.stack.length - 1] = { name: "pair4" }; show("fade"); island("watch", "Watch linked", "Importing 30 days of data"); }, 350); else { island("x", "Wrong code", "Check the code on your watch"); setTimeout(() => { st.pairCode = ""; refresh(); }, 600); } } },
    pairDone() { st.pairCode = ""; const i = st.stack.findIndex((r) => r.name === "pair1"); st.stack = st.stack.slice(0, Math.max(1, i)); show("pop"); },
    unlink() { alertBox("Unlink watch?", "Imported body data will be deleted within 24 hours.", "Cancel", "Unlink", (ok) => { if (!ok) return; st.watch = false; refresh(); island("unlink", "Watch unlinked", ""); }); },
    notifOn() { st.notifOn = !st.notifOn; refresh(); },
    remind() { st.remind = !st.remind; refresh(); if (st.remind) island("bell", "Reminder set", "20:30 · Premier vs Najd Vipers"); },
    autoSession() { st.autoSession = st.autoSession === false; refresh(); },
    deleteData() { alertBox("Delete body data?", "This removes all imported sleep, HRV and heart rate. It can’t be undone.", "Cancel", "Delete", (ok) => ok && island("trash-2", "Body data deleted", "")); },
  };
  function act(name, el, e) { (ACT[name] || ACT.noop)(el || document.createElement("i"), e); }
  K.ppAct = (name, v) => { const el = document.createElement("i"); if (v !== undefined) el.dataset.v = v; act(name, el); };
  K.ppState = () => st;
  function paintScrub() { const f = $(".pp-scrub .fill", viewsEl), h = $(".pp-scrub .head", viewsEl), t = $("[data-ts]", viewsEl); if (f) f.style.width = st.replayP + "%"; if (h) h.style.left = st.replayP + "%"; if (t) t.textContent = ts(st.replayP); }
  function sendMsg(text) {
    const key = st.coachMode === "ai" ? "chat" : "reem";
    st[key].push({ me: true, t: esc(text) });
    const i = $("[data-input]", viewsEl); if (i) i.value = "";
    refresh(); scrollChat();
    setTimeout(() => $("[data-input]", viewsEl)?.focus({ preventScroll: true }), 50);
    const chat = $("[data-chat]", viewsEl); if (chat) { chat.insertAdjacentHTML("beforeend", `<div class="msg ai" data-typing><span class="coach-mark" style="width:26px;height:26px">${star(12)}</span><span class="pp-typing"><i></i><i></i><i></i></span></div>`); scrollChat(); }
    setTimeout(() => replyTo(key, text.toLowerCase()), 1000 + Math.random() * 500);
  }
  function replyTo(key, q) {
    let t;
    if (key === "reem") t = /round|bind|peek/.test(q) ? "Watched it. You swung 2 seconds before the dart. Let’s drill that Wednesday, I’ve added it to your plan." : "Got it! I’ll take a look before our session.";
    else if (/ready|ranked|tired|sleep/.test(q)) t = st.watch ? "Readiness is 74 and you slept 7h 40m. Good day for ranked, but stop after 3 hours." : "I can’t see your sleep yet. Link a watch and I’ll tell you every morning.";
    else if (/plan|day|drill/.test(q)) { t = "Done. Saturday: Trade spacing (20 min). Sunday: Replay self-review. Monday: Crossfire timing + deathmatch."; st.plan.push({ t: "Trade spacing", s: "Custom · 20 min", d: false }); }
    else if (/round|show|bind/.test(q)) t = "Rounds 4, 9, 14, 17 and 21 on Bind. In each one you peeked B long before the recon landed. Round 14 is the clearest, open it from Debrief.";
    else if (/aim|crosshair/.test(q)) t = "Aim is 86, your best this month. Keep the crosshair at head height on Haven, it slips on A main.";
    else t = "Good question. From your last 40 matches: decision timing is the one skill holding your score back. Want a drill for it?";
    st[key].push({ me: false, t });
    if (top().name === "coach" && ((key === "chat") === (st.coachMode === "ai"))) { refresh(); scrollChat(); } else island("message-square", key === "reem" ? "Coach Reem" : "AI Coach", t.slice(0, 48) + "…");
  }
  function scrollChat() { const sc = $(".pp-scroll", current()); if (sc) sc.scrollTo({ top: sc.scrollHeight, behavior: "smooth" }); }

  /* ================= gestures ================= */
  function bindSliders(root) {
    $$("[data-slider]", root).forEach((s) => {
      const set = (e) => { const r = s.getBoundingClientRect(); const rtl = getComputedStyle(s).direction === "rtl"; const v = Math.round(Math.max(0, Math.min(100, ((rtl ? r.right - e.clientX : e.clientX - r.left) / r.width) * 100))); st[s.dataset.slider] = v; $(".fl", s).style.width = v + "%"; $(".th", s).style.insetInlineStart = v + "%"; const lbl = $(`[data-val=${s.dataset.slider}]`, root); if (lbl) lbl.textContent = v; };
      s.onpointerdown = (e) => { e.stopPropagation(); s.setPointerCapture(e.pointerId); set(e); s.onpointermove = set; s.onpointerup = () => { s.onpointermove = null; }; };
    });
  }
  function bindGestures() {
    let mode = null, sx = 0, sy = 0, sc = null, st0 = 0, vy = 0, lastY = 0, lastT = 0, moved = false, view = null, momentum = null;
    scr.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || e.target.closest("input,textarea,[data-slider],.pp-alert,.pp-composer")) return;
      cancelAnimationFrame(momentum); moved = false; sx = e.clientX; sy = e.clientY; lastY = sy; lastT = performance.now(); vy = 0;
      const scrRect = scr.getBoundingClientRect();
      if (sheetEl.classList.contains("on") && e.target.closest(".pp-sheet")) { const body = $(".pp-sheet-body", sheetEl); if (e.target.closest(".pp-grab") || (body && body.scrollTop <= 0)) { mode = "sheet"; } else mode = null; return; }
      if (e.target.closest(".pp-scrub")) { mode = "scrub"; seekTo(e); return; }
      view = current(); sc = view && $(".pp-scroll", view); st0 = sc ? sc.scrollTop : 0;
      const rtl = document.documentElement.dir === "rtl";
      mode = (rtl ? scrRect.right - sx < 28 : sx - scrRect.left < 28) && st.stack.length > 1 ? "edge" : "pending";
    });
    window.addEventListener("pointermove", (e) => {
      if (!mode) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved = true;
      if (mode === "scrub") return seekTo(e);
      if (mode === "sheet") { if (dy > 0) { sheetEl.classList.add("dragging"); sheetEl.style.transform = `translateY(${dy}px)`; } return; }
      if (mode === "edge") { const ddx = document.documentElement.dir === "rtl" ? -dx : dx; if (ddx > 0) { view.classList.add("dragging"); view.style.transform = `translateX(${dx}px)`; view.style.boxShadow = `${document.documentElement.dir === "rtl" ? 10 : -10}px 0 30px rgba(0,0,0,.25)`; } return; }
      if (mode === "pending" && Math.abs(dy) > 5) mode = "scroll";
      if (mode === "scroll" && sc) {
        const now = performance.now(); vy = (e.clientY - lastY) / Math.max(1, now - lastT); lastY = e.clientY; lastT = now;
        sc.scrollTop = st0 - dy;
        const ptr = $(".pp-ptr", view);
        if (ptr && st0 <= 0 && dy > 0) ptr.style.height = Math.min(54, dy * 0.5) + "px";
      }
    });
    window.addEventListener("pointerup", (e) => {
      if (!mode) return;
      const dx = e.clientX - sx, dy = e.clientY - sy, m = mode; mode = null;
      if (m === "sheet") { sheetEl.classList.remove("dragging"); if (dy > 90) closeSheet(); else sheetEl.style.transform = ""; return; }
      if (m === "edge" && view) { view.classList.remove("dragging"); view.style.boxShadow = ""; if ((document.documentElement.dir === "rtl" ? -dx : dx) > 90) edgeBack(view); else { view.style.transition = "transform .25s cubic-bezier(.2,.8,.2,1)"; view.style.transform = ""; setTimeout(() => (view.style.transition = ""), 260); } return; }
      if (m === "scroll" && sc) {
        const ptr = $(".pp-ptr", view);
        if (ptr && parseFloat(ptr.style.height) >= 50) { ptr.classList.add("spin"); setTimeout(() => { ptr.classList.remove("spin"); ptr.style.height = "0px"; island("refresh-cw", "Up to date", "Synced matches and BioSync"); }, 900); }
        else if (ptr) ptr.style.height = "0px";
        let v = vy * 16; const step = () => { if (Math.abs(v) < 0.5) return; sc.scrollTop -= v; v *= 0.94; momentum = requestAnimationFrame(step); }; momentum = requestAnimationFrame(step);
      }
    });
    scr.addEventListener("click", (e) => {
      if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; return; }
      if (e.target.closest(".pp-alert")) return;
      if (e.target === scrimEl) return closeSheet();
      const isl = e.target.closest(".pp-island"); if (isl) { if (st.session.live) { reset("session"); } return; }
      const b = e.target.closest("[data-back]"); if (b) return back();
      const t = e.target.closest("[data-tab]"); if (t) { if (t.dataset.tab === "session" && top().name === "session" && st.session.live) return; return tab(t.dataset.tab); }
      const g = e.target.closest("[data-go]"); if (g) { let p; try { p = g.dataset.p ? JSON.parse(g.dataset.p) : undefined; } catch (x) {} return go(g.dataset.go, p); }
      const a = e.target.closest("[data-act]"); if (a) return act(a.dataset.act, a, e);
      if (top().name === "splash") { st.stack = [{ name: "welcome" }]; show("fade"); }
    }, true);
    function seekTo(e) { const s = $(".pp-scrub", viewsEl); if (!s) return; const r = s.getBoundingClientRect(); st.replayP = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)); paintScrub(); }
  }

  /* ================= screen ================= */
  const FLOWS = [
    ["Onboarding", [["splash", "sparkles"], ["welcome", "log-in"], ["role", "users"], ["link", "link"], ["perms", "shield-check"]]],
    ["Match day", [["today", "house"], ["biosync", "heart-pulse"], ["session", "play"], ["debrief", "flag"], ["moment", "film"], ["notifs", "bell"]]],
    ["Grow", [["stats", "chart-no-axes-column"], ["skill", "crosshair"], ["matches", "swords"], ["coach", "graduation-cap"], ["plan", "calendar-days"]]],
    ["Me & devices", [["me", "circle-user-round"], ["passport", "id-card"], ["accounts", "link-2"], ["devices", "watch"], ["pair1", "bluetooth"], ["notifset", "bell-ring"], ["privacy", "lock"]]],
  ];
  S.push({
    id: "m-app", part: "Part 8 · Mobile app", title: "Mobile · live app", kind: "full",
    render() {
      return `<div class="pp-page">
        <aside class="pp-side left">
          <div class="card"><div class="row between"><h3>Jump to</h3><button class="link" data-h data-pp="restart">${ic("rotate-ccw")}Restart</button></div><div class="pp-flows">${FLOWS.map(([g, list]) => `<div class="grp">${g}</div>${list.map(([r, i]) => `<button data-h data-jump="${r}">${ic(i)}${TITLES[r]}</button>`).join("")}`).join("")}</div></div>
          <div class="card col" style="gap:10px"><h3>Device</h3><div class="seg" style="width:100%">${[["iphone", "iPhone"], ["pixel", "Pixel"], ["small", "Small"]].map(([d, l]) => `<button class="${device === d ? "on" : ""}" data-h data-dev="${d}" style="flex:1">${l}</button>`).join("")}</div>
            <div class="row between" style="font-size:12.5px"><span>Show hotspots</span><button class="switch ${hintAlways ? "on" : ""}" data-h data-pp="hints" aria-label="Show hotspots"></button></div>
            <div class="row between" style="font-size:12.5px"><span>Theme</span>${K.themeSwitch()}</div><div class="row between" style="font-size:12.5px"><span>Language</span>${K.langSwitch()}</div></div>
        </aside>
        <div class="pp-stage">
          <div class="pp-crumb"></div>
          <div class="pp" data-device="${device}" data-h>
            <div class="pp-scr ${hintAlways ? "hint-always" : ""}">
              <div class="pp-sbar"><span data-clock></span><span class="ic">${ic("signal")}${ic("wifi")}${ic("battery-full")}</span></div>
              <div class="pp-island"></div>
              <div class="pp-views"></div>
              <nav class="pp-tabs hidden">${[["today", "house", "Today"], ["stats", "chart-no-axes-column", "Stats"], ["session", "", ""], ["coach", "graduation-cap", "Coach"], ["me", "circle-user-round", "Me"]].map(([k, i, l]) => k === "session" ? `<button class="go" data-tab="session"><i>${ic("play")}</i><span>Session</span></button>` : `<button data-tab="${k}">${ic(i)}${l}${k === "today" ? `<em class="badge" style="font-style:normal">${st.unread}</em>` : ""}</button>`).join("")}</nav>
              <div class="pp-scrim"></div><div class="pp-sheet"></div><div class="pp-alert"></div>
              <div class="home-ind" style="z-index:70;color:var(--text)"></div>
            </div>
          </div>
          <p class="faint" style="font-size:12px;margin:0;text-align:center">Click to tap · drag to scroll · drag from the left edge to go back · drag sheets down to close</p>
        </div>
        <aside class="pp-side right">
          <div class="card"><h3>Controls</h3><div class="pp-keys">${[["Click", "Tap"], ["Drag", "Scroll / swipe"], ["Esc", "Back"], ["1 – 5", "Switch tab"], ["H", "Show hotspots"], ["R", "Restart"], ["Enter", "Send in chat"]].map(([k, d]) => `<span class="kbd">${k}</span><span>${d}</span>`).join("")}</div></div>
          <div class="card col" style="gap:8px"><h3>Try this</h3>${["Start a session from the centre tab, then browse: the timer stays in the Dynamic Island.", "Link a watch from Me › Devices. Tap “Paste” on the keypad.", "Ask the AI coach “am I ready for ranked?”", "Flip your passport card.", "Pull down on Today to refresh."].map((t, i) => `<div class="row" style="gap:8px;align-items:flex-start;font-size:12.5px"><span class="mono" style="color:var(--violet);font-size:11px;margin-top:1px">0${i + 1}</span><span class="muted">${t}</span></div>`).join("")}</div>
          <a class="btn block" href="#/m-start">${ic("layout-grid")}See all screens as flows</a>
        </aside>
      </div>`;
    },
    mount(root) {
      phoneEl = $(".pp", root); scr = $(".pp-scr", root); viewsEl = $(".pp-views", root); tabsEl = $(".pp-tabs", root);
      islandEl = $(".pp-island", root); sheetEl = $(".pp-sheet", root); scrimEl = $(".pp-scrim", root); alertEl = $(".pp-alert", root);
      const clock = () => { const c = $("[data-clock]", root); if (c) c.textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); };
      clock(); clearInterval(K._ppClock); K._ppClock = setInterval(clock, 15000);
      bindGestures();
      [scr, viewsEl, phoneEl].forEach((el) => el.addEventListener("scroll", () => { if (el.scrollTop || el.scrollLeft) { el.scrollTop = 0; el.scrollLeft = 0; } }, true));
      show();
      islandIdle();
      if (top().name === "splash") setTimeout(() => { if (top().name === "splash") { st.stack = [{ name: "welcome" }]; show("fade"); } }, 1700);
      if (st.session.live) { clearInterval(liveTimer); liveTimer = setInterval(tick, 1000); }
      root.querySelectorAll("[data-jump]").forEach((b) => (b.onclick = () => { K.ppGo(b.dataset.jump); if (b.dataset.jump === "splash") setTimeout(() => { if (top().name === "splash") { st.stack = [{ name: "welcome" }]; show("fade"); } }, 1700); }));
      root.querySelectorAll("[data-dev]").forEach((b) => (b.onclick = () => { device = b.dataset.dev; phoneEl.dataset.device = device; root.querySelectorAll("[data-dev]").forEach((x) => x.classList.toggle("on", x === b)); }));
      root.querySelector("[data-pp=restart]").onclick = () => restart();
      root.querySelector("[data-pp=hints]").onclick = (e) => { hintAlways = !hintAlways; e.currentTarget.classList.toggle("on", hintAlways); scr.classList.toggle("hint-always", hintAlways); };
    },
  });
  function restart() { clearInterval(liveTimer); clearInterval(playTimer); st = fresh(); closeSheet(); alertEl.classList.remove("on"); islandIdle(); show("fade"); setTimeout(() => { if (top().name === "splash") { st.stack = [{ name: "welcome" }]; show("fade"); } }, 1700); }

  document.addEventListener("keydown", (e) => {
    if (!document.querySelector(".pp") || e.target.matches?.("input,textarea") || e.ctrlKey || e.metaKey || e.altKey) return;
    if (alertEl && alertEl.classList.contains("on")) { if (e.key === "Escape") alertEl.classList.remove("on"); return; }
    if (e.key === "Escape" || e.key === "Backspace") { if (sheetEl.classList.contains("on")) closeSheet(); else back(); e.preventDefault(); }
    else if (/^[1-5]$/.test(e.key) && st.onboarded) tab(TABS[+e.key - 1]);
    else if (e.key.toLowerCase() === "h") { scr.classList.add("hint"); setTimeout(() => scr.classList.remove("hint"), 900); }
    else if (e.key.toLowerCase() === "r") restart();
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") { const sc = $(".pp-scroll", current()); if (sc) { sc.scrollBy({ top: e.key === "ArrowDown" ? 120 : -120, behavior: "smooth" }); e.preventDefault(); } }
  });

  /* place first in Part 8 */
  const me = S.findIndex((s) => s.id === "m-app"), ms = S.findIndex((s) => s.id === "m-start");
  if (me > -1 && ms > -1) S.splice(ms, 0, S.splice(me, 1)[0]);
})();
