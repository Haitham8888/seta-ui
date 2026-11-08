/* PART 8 — SETA Mobile v3: the match-day companion */
(function () {
  const { ic, star, av, spark, radar, ring, lines, delta, qr, guil, orbit } = K;
  const S = (window.SCREENS = window.SCREENS || []);
  const PART = "Part 8 · Mobile app";

  /* ---------- frame ---------- */
  const phone = (inner, o = {}) => `<div class="phone"><div class="scr" ${o.ink ? 'style="background:#120D1F;color:#EDEAF4"' : ""}><div class="island"></div><div class="sbar"><span>9:41</span><span class="ic">${ic("signal")}${ic("wifi")}${ic("battery-full")}</span></div>${inner}<div class="home-ind"></div></div></div>`;
  K.phone = phone;
  const tabs = (on, live = false) => `<nav class="m-tabs">${[["house", "Today"], ["chart-no-axes-column", "Stats"], ["go", ""], ["graduation-cap", "Coach"], ["circle-user-round", "Me"]].map(([i, l], k) =>
    i === "go" ? `<span class="go ${live ? "live" : ""}"><i class="b">${ic(live ? "square" : "play")}</i>${live ? "Live" : "Session"}</span>` : `<span class="${k === on ? "on" : ""}">${ic(i)}${l}</span>`).join("")}</nav>`;
  const shot = (p, code, cap) => `<div class="ph-col">${p}<div class="caption"><span class="mono">${code}</span>${cap}</div></div>`;
  const wordmark = (h, ink) => `<span class="wm ${ink ? "on-ink" : ""}" style="height:${h}px"><img class="l" src="assets/wordmark-light.png" alt="SETA"><img class="d" src="assets/wordmark-dark.png" alt="SETA"></span>`;
  const head = (eyebrow, title, text, right = "") => `<div class="canvas-head flow-row"><div><span class="eyebrow">${eyebrow}</span><h1 class="h1" style="margin-top:8px">${title}</h1><p>${text}</p></div><div class="row" style="margin-inline-start: auto;gap:8px;flex-wrap:wrap">${right}${K.themeSwitch()}</div></div>`;
  const row = (title, sub, phones) => `<section class="flow-row"><div class="row-h"><h2>${title}</h2><p>${sub}</p></div><div class="phones fade-in" style="justify-content:flex-start">${phones}</div></section>`;
  K.mHead = head; K.mRow = row; K.mShot = shot;

  /* =============== M1 · CONCEPT & START =============== */
  S.push({
    id: "m-start", part: PART, title: "Mobile · concept & sign-in", kind: "full",
    render() {
      const loop = [
        ["sun", "Ready", "A 20-second check-in plus last night’s sleep and HRV from your watch. You know if today is a ranked day before you queue.", ["Phone", "Watch"]],
        ["play", "Play", "Session mode runs quietly while you play. The watch tracks heart rate and nudges you to take a break. Your phone stays silent.", ["Watch", "PC sync"]],
        ["scan-search", "Review", "Two minutes after the match: your result, one key moment and one fix. Nothing more.", ["Phone"]],
        ["trending-up", "Grow", "The fix becomes a drill in your plan, your coach sees it, and your passport updates with verified progress.", ["Phone", "Web"]],
      ];
      const splash = `<div style="flex:1;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px">
          ${orbit({ w: 300, h: 600, color: "#9677FF", op: 0.6, stars: false })}
          <span class="wm on-ink" style="height:100px;position:relative"><img class="l" src="assets/logo-light.png" alt=""><img class="d" src="assets/logo-dark.png" alt="SETA"></span>
          <span class="mono" style="font-size:10px;letter-spacing:.2em;color:rgba(237,234,244,.5);text-transform:uppercase;position:relative">Smart Esports Talent Platform</span>
          <div style="position:absolute;bottom:60px;width:120px;height:2px;background:#2A2245;border-radius:2px;overflow:hidden"><i style="display:block;height:100%;width:64%;background:#9677FF"></i></div></div>`;
      const welcome = `<div class="m-body" style="gap:14px">
          <div class="m-top">${wordmark(15)}<span class="m-chip" style="height:26px">${ic("languages")}EN · ع</span></div>
          <div style="position:relative;height:170px;border-radius:20px;overflow:hidden;background:var(--violet-tint)">${orbit({ w: 280, h: 170, op: 0.9 })}
            <div style="position:absolute;left:16px;bottom:14px;right:16px" class="row between"><div class="col" style="gap:2px"><span class="m-label" style="padding:0">SETA Score</span><b class="m-big" style="font-size:38px">82</b></div>${spark([70, 72, 71, 75, 77, 76, 80, 82], { w: 120, h: 44 })}</div></div>
          <div><h2 class="m-title">Talent is data you haven’t read yet.</h2><p class="m-sub">Sign in to sync your matches, body data and coaching.</p></div>
          <div class="col" style="gap:8px;margin-top:auto">
            <span class="m-btn" style="background:var(--text);color:var(--bg);clip-path:none">${K.brand("apple", 18)}Continue with Apple</span>
            <span class="m-btn alt">${K.brand("google", 18)}Continue with Google</span>
            <div class="row between" style="margin-top:2px"><span class="faint" style="font-size:11.5px">Gaming ID</span><div class="row" style="gap:6px">${["riotgames", "steam", "discord", "playstation", "epicgames"].map((k) => `<span class="brand-tile sm" title="${K.BRANDS[k].name}">${K.brand(k, 16)}</span>`).join("")}</div></div>
            <span class="faint" style="font-size:11px;text-align:center;margin:6px 0 30px">Use email instead · Terms · Privacy</span>
          </div></div>`;
      const roleOpts = [["gamepad-2", "Player", "Track, improve and get scouted", true], ["clipboard-list", "Coach", "Review and train your players", false], ["shield", "Club", "Scout talent, manage a roster", false]];
      const role = `<div class="m-body">
          <div class="m-top">${ic("chevron-left")}<div class="m-steps" style="width:120px"><i class="on"></i><i></i><i></i></div><span class="faint" style="font-size:12px">Skip</span></div>
          <div><h2 class="m-title">How will you use SETA?</h2><p class="m-sub">This sets your home screen. Add another role any time.</p></div>
          <div class="col" style="gap:8px">${roleOpts.map(([i, t, d, on]) => `<div class="role-card ${on ? "on" : ""}" style="flex-direction:row;align-items:center;gap:12px;padding:14px"><span class="ic">${ic(i)}</span><div style="flex:1"><b style="font-size:14px">${t}</b><div class="faint" style="font-size:12px">${d}</div></div><span class="radio ${on ? "on" : ""}" style="position:relative;inset:auto;flex:none"></span></div>`).join("")}</div>
          <div class="m-card" style="display:flex;gap:10px;align-items:flex-start;background:var(--surface-2)"><span style="color:var(--violet)">${star(16)}</span><span class="muted" style="font-size:12px">Players get the daily loop. Coaches get a review queue. Clubs get Discovery.</span></div>
          <span class="m-btn" style="margin-top:auto;margin-bottom:30px">Continue ${ic("arrow-right")}</span></div>`;
      const games = [["riotgames", "Riot Games", "Valorant · NYX#KSA1", "on"], ["steam", "Steam", "Counter-Strike 2", ""], ["epicgames", "Epic Games", "Rocket League", ""], ["playstation", "PlayStation", "EA Sports FC", ""]];
      const link = `<div class="m-body">
          <div class="m-top">${ic("chevron-left")}<div class="m-steps" style="width:120px"><i class="on"></i><i class="on"></i><i></i></div><span class="faint" style="font-size:12px">Skip</span></div>
          <div><h2 class="m-title">Connect your games</h2><p class="m-sub">We read match history only. We never post or play for you.</p></div>
          <div class="m-group">${games.map(([k, n, d, on]) => `<div class="m-row"><span class="brand-tile">${K.brand(k, 18)}</span><div class="grow"><b>${n}</b><div class="s">${d}</div></div>${on ? `<span class="tag m">${ic("check")}Linked</span>` : `<span class="m-chip" style="height:28px">Connect</span>`}</div>`).join("")}</div>
          <div class="m-card" style="display:flex;gap:12px;align-items:center"><span style="color:var(--mint)">${ic("circle-check")}</span><div style="flex:1"><b style="font-size:13px">40 Valorant matches found</b><div class="faint" style="font-size:11.5px">Your first score is being built</div></div></div>
          <div class="meter" style="height:4px"><i style="width:72%"></i></div>
          <span class="m-btn" style="margin-top:auto;margin-bottom:30px">Continue ${ic("arrow-right")}</span></div>`;
      const perms = `<div class="m-body">
          <div class="m-top">${ic("chevron-left")}<div class="m-steps" style="width:120px"><i class="on"></i><i class="on"></i><i class="on"></i></div><span></span></div>
          <div><h2 class="m-title">Two quick permissions</h2><p class="m-sub">Both optional. Change them later in Settings.</p></div>
          <div class="m-card col" style="gap:10px"><div class="row" style="gap:10px"><span class="brand-tile" style="color:var(--ember)">${ic("bell-ring")}</span><div style="flex:1"><b>Notifications</b><div class="faint" style="font-size:11.5px">Break reminders, coach replies, debriefs</div></div></div><span class="m-btn alt" style="height:40px">Allow notifications</span></div>
          <div class="m-card col" style="gap:10px"><div class="row" style="gap:10px"><span class="brand-tile" style="color:var(--rose)">${ic("heart-pulse")}</span><div style="flex:1"><b>Health data</b><div class="faint" style="font-size:11.5px">Heart rate, HRV and sleep from your watch</div></div></div>
            <div class="row" style="gap:6px">${["apple", "samsung", "garmin", "fitbit", "wearos"].map((k) => `<span class="brand-tile sm">${K.brand(k, 15)}</span>`).join("")}</div><span class="m-btn alt" style="height:40px">Link a watch</span></div>
          <span class="faint" style="font-size:11px">BioSync shows patterns, not medical advice.</span>
          <span class="m-btn" style="margin-top:auto;margin-bottom:30px">Enter SETA ${ic("arrow-right")}</span></div>`;
      return `<div class="canvas" style="gap:40px">
        ${head("SETA Mobile · v3", "Your match-day companion", "The web platform is for deep analysis. The phone app has one job: help you play your best today. Everything in it follows one loop.", `<a class="btn" href="#/m-day">Match-day screens ${ic("arrow-right")}</a><a class="btn primary" href="#/m-app">${ic("smartphone")}Open the live app</a>`)}
        <section class="flow-row"><div class="loop">${loop.map(([i, t, p, w], k) => `<div><span class="n">${ic(i, "i-sm")}0${k + 1}</span><h3>${t}</h3><p>${p}</p><div class="where">${w.map((x) => `<span class="tag ${x === "Watch" ? "v" : ""}">${ic(x === "Watch" ? "watch" : x === "Web" ? "monitor" : x === "PC sync" ? "monitor-smartphone" : "smartphone")}${x}</span>`).join("")}</div></div>`).join("")}</div></section>
        <section class="flow-row grid" style="grid-template-columns:repeat(3,minmax(0,1fr));gap:14px" id="mPrinc">
          ${[["timer", "Under 2 minutes", "Every screen answers one question. Most sessions in the app are under two minutes."], ["bell-off", "Quiet while you play", "No pop-ups during a match. Nudges go to the watch, with a soft haptic."], ["shield-check", "You own the data", "Body data is private by default. You choose which coaches and clubs see it."]].map(([i, t, d]) => `<div class="card" style="padding:18px;display:flex;gap:12px"><span class="brand-tile" style="color:var(--violet)">${ic(i)}</span><div><b>${t}</b><p class="faint" style="margin:4px 0 0;font-size:12.5px">${d}</p></div></div>`).join("")}
        </section>
        ${row("Start", "First launch to home screen, about 90 seconds", shot(phone(splash, { ink: true }), "S1", "Splash") + shot(phone(welcome), "S2", "Welcome & sign-in") + shot(phone(role), "S3", "Role") + shot(phone(link), "S4", "Link games") + shot(phone(perms), "S5", "Permissions"))}
      </div><style>@media (max-width:1080px){#mPrinc{grid-template-columns:1fr !important}}</style>`;
    },
  });

  /* =============== M2 · MATCH DAY =============== */
  S.push({
    id: "m-day", part: PART, title: "Mobile · match day", kind: "full",
    render() {
      const home = `<div class="m-body">
          <div class="m-top"><div class="row" style="gap:10px">${av("Yara Hamami", "sm")}<div style="line-height:1.2"><span class="faint" style="font-size:11px">Sunday, 8 Nov</span><div style="font-weight:650">Evening, Nyx</div></div></div><span class="m-ib">${ic("bell")}<span class="pip"></span></span></div>
          <div class="m-card ink" style="display:flex;gap:14px;align-items:center;position:relative;overflow:hidden">${orbit({ w: 280, h: 120, color: "#9677FF", op: 0.4, stars: false })}
            <div style="position:relative">${ring(74, { size: 78, stroke: 7, color: "#45D6A2", track: "#2A2245", label: "74" }).replace("fill:var(--text)", "fill:#EDEAF4")}</div>
            <div style="position:relative;flex:1"><span class="w-lbl" style="color:rgba(237,234,244,.5)">Readiness</span><div style="font-weight:650;font-size:15px;margin:2px 0">Good day for ranked</div><div style="font-size:11.5px;color:rgba(237,234,244,.6)" class="row">${ic("watch", "i-sm")} Slept 7h 40m · HRV 68</div></div></div>
          <div class="m-card" style="display:flex;gap:12px;align-items:center;border-color:var(--violet);background:var(--violet-tint)"><span class="brand-tile" style="background:var(--violet);color:var(--on-violet);border:0">${ic("smile")}</span><div style="flex:1"><b style="font-size:13px">How do you feel?</b><div class="faint" style="font-size:11.5px">20-second check-in</div></div>${ic("chevron-right", "faint")}</div>
          <div class="row between"><span class="m-label">Today’s plan · 25 min</span><span class="mono faint" style="font-size:10.5px">1/3</span></div>
          <div class="m-group">${[["Crossfire timing", "Range · 10 min", true], ["Utility-first entries", "Custom · 10 min", false], ["Review: Bind R14", "Replay · 5 min", false]].map(([t, s, d]) => `<div class="m-row"><span class="check ${d ? "on" : ""}">${ic("check")}</span><div class="grow"><div style="font-weight:600;${d ? "text-decoration:line-through;color:var(--text-3)" : ""}">${t}</div><div class="s">${s}</div></div></div>`).join("")}</div>
          <div class="m-card" style="display:flex;gap:12px;align-items:center;padding:12px">${K.game("VAL", 36, 10)}<div style="flex:1"><b style="font-size:13px">Premier vs Najd Vipers</b><div class="faint" style="font-size:11.5px">21:00 · Bind</div></div><span class="tag e mono">IN 2H</span></div>
        </div>${tabs(0)}`;
      const checkin = `<div class="m-body">
          <div class="m-top">${ic("x")}<span style="font-weight:650">Check-in</span><span class="faint" style="font-size:12px">2 / 3</span></div>
          <div class="m-steps"><i class="on"></i><i class="on"></i><i></i></div>
          <div><h2 class="m-title" style="font-size:24px">How’s your energy right now?</h2></div>
          <div class="m-faces">${["angry", "frown", "meh", "smile", "laugh"].map((f, i) => `<span class="${i === 3 ? "on" : ""}">${ic(f)}</span>`).join("")}</div>
          ${[["Focus", 70], ["Stress", 30]].map(([l, v]) => `<div><div class="row between" style="font-size:12.5px"><b>${l}</b><span class="mono faint">${v}</span></div><div class="m-slider"><i class="tr"></i><i class="fl" style="width:${v}%"></i><i class="th" style="inset-inline-start:${v}%"></i></div></div>`).join("")}
          <div class="m-label">From your watch</div>
          <div class="m-group">${[["moon", "Sleep", "7h 40m", "var(--violet)"], ["activity", "HRV", "68 ms", "var(--sky)"], ["heart", "Resting HR", "58 bpm", "var(--rose)"]].map(([i, l, v, c]) => `<div class="m-row"><span style="color:${c}">${ic(i)}</span><span class="grow">${l}</span><b class="num">${v}</b></div>`).join("")}</div>
          <span class="m-btn" style="margin-top:auto;margin-bottom:30px">Next ${ic("arrow-right")}</span></div>`;
      const live = `<div class="m-body">
          <div class="m-top"><span class="row" style="gap:8px;font-weight:650"><span class="dot live"></span>Session live</span><span class="m-ib">${ic("ellipsis")}</span></div>
          <div style="text-align:center;padding:6px 0 0"><span class="m-label">Playing for</span><div class="m-big" style="font-size:52px;margin-top:4px">1:42:18</div></div>
          <div class="m-card"><div class="row between"><span class="row" style="gap:6px;font-weight:650">${ic("heart-pulse", "i-sm")}<span style="color:var(--rose)">128</span><span class="faint" style="font-weight:500;font-size:11.5px">bpm</span></span><span class="row faint" style="gap:4px;font-size:11px">${ic("watch", "i-sm")}Apple Watch</span></div>
            ${lines([{ data: [92, 110, 124, 131, 120, 98, 102, 118, 126, 133, 128], color: "var(--rose)", area: true, width: 1.8 }], Array(11).fill(""), { w: 260, h: 70, min: 80, max: 140, ticks: 2, padL: 0, padB: 0, padT: 4, padR: 4 }).replace(/<text[^>]*>[^<]*<\/text>/g, "")}</div>
          <div class="grid" style="grid-template-columns:1fr 1fr;gap:8px">${[["Matches", "3", "2W · 1L"], ["Avg in match", "124", "bpm"]].map(([a, b, c]) => `<div class="m-card" style="padding:12px"><span class="m-label" style="padding:0">${a}</span><div class="row" style="gap:6px;align-items:baseline"><b class="num" style="font-size:22px;font-stretch:118%">${b}</b><span class="faint" style="font-size:11px">${c}</span></div></div>`).join("")}</div>
          <div class="m-card" style="display:flex;gap:10px;align-items:center;background:var(--amber-soft);border-color:transparent"><span style="color:var(--amber)">${ic("coffee")}</span><span style="font-size:12.5px;flex:1"><b>Break in 12 min.</b> <span class="muted">HR recovery is slowing.</span></span></div>
          <div class="grid" style="grid-template-columns:1fr 1fr;gap:8px;margin-top:auto;margin-bottom:12px"><span class="m-btn alt" style="height:44px">${ic("flag")}Match ended</span><span class="m-btn ember" style="height:44px">${ic("square")}End</span></div>
        </div>${tabs(-1, true)}`;
      const debrief = `<div class="m-body">
          <div class="m-top">${ic("chevron-left")}<span style="font-weight:650">Debrief</span><span class="m-ib">${ic("share")}</span></div>
          <div class="row between" style="align-items:flex-end"><div><span class="m-label row" style="padding:0;gap:6px">${K.brand("valorant", 11, "#FA4454")}Bind · Premier</span><div class="row" style="gap:10px;align-items:baseline"><b class="m-big">8–13</b><span class="tag r">Defeat</span></div></div><div style="text-align: end"><span class="m-label" style="padding:0">SETA</span><div>${delta(-2)}</div></div></div>
          <div class="m-card" style="padding:0;overflow:hidden"><div style="height:110px">${K.map().replace('width="100%" height="100%"', 'width="100%" height="110"')}</div>
            <div style="padding:12px"><span class="tag e mono">ONE THING TO FIX · 08:42</span><div style="font-weight:650;margin-top:8px">Wide peek before the recon dart</div><p class="faint" style="margin:4px 0 0;font-size:12px">Wait about 2 s, then swing as a pair with Kairo.</p></div></div>
          <div><div class="m-label" style="margin-bottom:8px">How was your focus?</div><div class="m-faces">${["angry", "frown", "meh", "smile", "laugh"].map((f, i) => `<span class="${i === 2 ? "on" : ""}">${ic(f)}</span>`).join("")}</div></div>
          <div class="grid" style="grid-template-columns:1fr 1fr;gap:8px;margin-top:auto;margin-bottom:30px"><span class="m-btn alt" style="height:44px">${ic("play")}Watch</span><span class="m-btn" style="height:44px">${ic("plus")}Add drill</span></div></div>`;
      const replay = `<div class="m-body">
          <div class="m-top">${ic("chevron-left")}<span style="font-weight:650">Round 14</span><span class="m-ib">${ic("send")}</span></div>
          <div style="border-radius:16px;overflow:hidden;height:170px;position:relative">${K.map().replace('width="100%" height="100%"', 'width="100%" height="170"')}<span class="w-pill" style="position:absolute;top:10px;left:10px;color:#EDEAF4">${ic("play")}08:42</span></div>
          <div class="scrub" style="height:36px"><div class="track" style="top:15px;height:4px"></div><div class="fill" style="top:15px;height:4px;width:41%"></div>${[9, 24, 41, 55, 72, 88].map((p, i) => `<i class="mk" style="left:${p}%;top:6px;height:22px;background:${["var(--violet)", "var(--sky)", "var(--ember)", "var(--ember)", "var(--mint)", "var(--ember)"][i]}"></i>`).join("")}<span class="head" style="left:41%;top:11px;height:12px;width:10px;margin-inline-start:-5px"></span></div>
          <div class="m-card" style="padding:12px"><b class="row" style="gap:6px;color:var(--ember);font-size:12.5px">${ic("x-circle", "i-sm")}What happened</b><p style="margin:6px 0 0;font-size:12px" class="muted">Peeked B long 2.1 s before the dart landed. Lost the duel.</p></div>
          <div class="m-card" style="padding:12px;border-color:color-mix(in srgb,var(--mint) 40%,var(--line))"><b class="row" style="gap:6px;color:var(--mint);font-size:12.5px">${ic("check-circle-2", "i-sm")}Better play</b><p style="margin:6px 0 0;font-size:12px" class="muted">Swing after info. In 41 similar rounds, this won 68% of duels.</p></div>
          <span class="m-btn alt" style="margin-top:auto;margin-bottom:30px;height:44px">${ic("message-square")}Ask Coach Reem</span></div>`;
      return `<div class="canvas" style="gap:40px">
        ${head("SETA Mobile · Match day", "Ready, play, review", "The daily loop in five screens. The centre tab starts a session; while it runs, the tab turns orange and the watch takes over.", `<a class="btn" href="#/m-start">${ic("arrow-left")} Concept</a><a class="btn primary" href="#/m-grow">Grow screens ${ic("arrow-right")}</a>`)}
        ${row("01 · Ready", "Before you queue", shot(phone(home), "D1", "Today") + shot(phone(checkin), "D2", "Check-in"))}
        ${row("02 · Play  →  03 · Review", "During and right after a match", shot(phone(live), "D3", "Session live") + shot(phone(debrief), "D4", "Debrief") + shot(phone(replay), "D5", "Key moment"))}
      </div>`;
    },
  });

  /* =============== M3 · GROW & GET SEEN =============== */
  S.push({
    id: "m-grow", part: PART, title: "Mobile · grow & profile", kind: "full",
    render() {
      const stats = `<div class="m-body">
          <div class="m-top"><h2 class="m-title">Stats</h2><span class="m-chip" style="height:30px">${K.brand("valorant", 13, "#FA4454")}Valorant${ic("chevron-down")}</span></div>
          <div class="m-seg">${["7D", "30D", "90D", "Season"].map((p, i) => `<span class="${i === 1 ? "on" : ""}">${p}</span>`).join("")}</div>
          <div class="m-card" style="display:flex;gap:14px;align-items:center">${ring(82, { size: 84, stroke: 7, label: "82", mark: 76 })}<div class="col" style="gap:4px"><span class="m-label" style="padding:0">SETA Score</span>${delta(4)}<span class="faint" style="font-size:11.5px">Top 18% · Immortal duelists</span></div></div>
          <div class="m-group">${[["Aim", 86, 12], ["Reaction", 78, 9], ["Decision", 80, -6], ["Game sense", 83, 9], ["Teamwork", 76, 3]].map(([s, v, d]) => `<div class="m-row"><span class="grow" style="font-weight:600">${s}</span><div class="meter" style="width:70px"><i style="width:${v}%;${d < 0 ? "background:var(--rose)" : ""}"></i></div><b class="num" style="width:22px;text-align: end">${v}</b><span style="width:42px;text-align: end">${delta(d)}</span></div>`).join("")}</div>
          <span class="faint" style="font-size:11px;text-align:center">Full breakdown on seta.gg</span>
        </div>${tabs(1)}`;
      const coach = `<div class="m-body">
          <div class="m-top"><h2 class="m-title">Coach</h2><span class="m-ib">${ic("calendar-days")}</span></div>
          <div class="m-seg"><span class="on">${star(12)}AI Coach</span><span>${ic("user-round")}Reem</span></div>
          <div class="thread" style="gap:10px">
            <div class="msg ai"><span class="coach-mark" style="width:26px;height:26px">${star(12)}</span><div class="bub" style="font-size:12.5px">You lost 4 of 5 rounds where you entered before the recon landed.</div></div>
            <div class="msg ai" style="padding-inline-start:36px"><div class="bub" style="font-size:12.5px;padding:10px 12px"><span class="m-label" style="padding:0">Added to Saturday</span><div class="row" style="gap:8px;margin-top:6px">${ic("dumbbell", "i-sm")}<b style="font-size:12.5px">Trade spacing · 20 min</b></div></div></div>
            <div class="msg me"><div class="bub" style="font-size:12.5px">Every time?</div></div>
            <div class="msg ai"><span class="coach-mark" style="width:26px;height:26px">${star(12)}</span><div class="bub" style="font-size:12.5px">Only on B long (Bind) and A main (Haven). Elsewhere your early peeks win 61%.</div></div>
          </div>
          <div class="row" style="gap:6px;flex-wrap:wrap">${["Show rounds", "Ask Reem"].map((s) => `<span class="m-chip">${s}</span>`).join("")}</div>
          <div class="input" style="height:42px;border-radius:14px;margin-top:auto;margin-bottom:10px">${ic("sparkles")}<input placeholder="Ask anything" style="font-size:13px"><span class="brand-tile sm" style="background:var(--violet);color:var(--on-violet);border:0;width:28px;height:28px">${ic("arrow-up", "i-sm")}</span></div>
        </div>${tabs(3)}`;
      const days = [["M", 3, 1], ["T", 4, 1], ["W", 5, 1], ["T", 6, 1], ["F", 7, 1], ["S", 8, 2], ["S", 9, 0]];
      const plan = `<div class="m-body">
          <div class="m-top">${ic("chevron-left")}<span style="font-weight:650">Training plan</span><span class="m-ib">${ic("plus")}</span></div>
          <div><span class="m-label" style="padding:0">Week 3 of 6 · Entry timing</span><div class="row between" style="margin-top:6px"><b class="m-big" style="font-size:34px">71%</b><span class="faint" style="font-size:12px">10 of 14 drills</span></div><div class="meter" style="margin-top:8px"><i style="width:71%"></i></div></div>
          <div class="row between">${days.map(([d, n, s]) => `<div class="col" style="gap:4px;align-items:center;width:34px;padding:8px 0;border-radius:12px;${s === 2 ? "background:var(--violet);color:var(--on-violet)" : ""}"><span style="font-size:10.5px;font-weight:600;opacity:.7">${d}</span><b style="font-size:14px">${n}</b><i style="width:5px;height:5px;border-radius:50%;background:${s === 1 ? "var(--mint)" : s === 2 ? "currentColor" : "var(--line-2)"}"></i></div>`).join("")}</div>
          <span class="m-label">Saturday</span>
          <div class="col" style="gap:8px">${[["Trade spacing", "CUSTOM · 20 MIN", "e", false], ["Premier match", "21:00 · BIND", "s", false], ["Debrief", "AUTO · 2 MIN", "m", false]].map(([t, s, c]) => `<div class="drill ${c}" style="font-size:13px;padding:11px 12px;display:flex;justify-content:space-between;align-items:center"><div>${t}<span>${s}</span></div>${ic("chevron-right", "faint i-sm")}</div>`).join("")}</div>
          <div class="m-card" style="display:flex;gap:10px;align-items:center;padding:12px;margin-top:auto;margin-bottom:12px">${av("Reem Alqahtani", "sm")}<span style="font-size:12px;flex:1"><b>Reem</b> <span class="muted">reviewed this plan · 2d ago</span></span></div>
        </div>${tabs(3)}`;
      const pass = `<div class="m-body">
          <div class="m-top">${ic("chevron-left")}<span style="font-weight:650">Talent Passport</span><span class="m-ib">${ic("share")}</span></div>
          <div class="passport" style="min-height:0;padding:16px;gap:12px;border-radius:20px">${guil(280, 330)}
            <div class="row between" style="position:relative">${wordmark(12, true)}<span class="tag" style="background:rgba(69,214,162,.14);color:#45D6A2;font-size:10px">${ic("badge-check")}Verified</span></div>
            <div class="row" style="gap:10px;position:relative">${av("Yara Hamami", "lg")}<div><b class="wide" style="font-size:22px">NYX</b><div class="lbl">Valorant · Duelist · ST-10427</div></div></div>
            <div style="position:relative;display:grid;place-items:center;padding:4px 0"><div class="qr">${qr("NYX", 136)}</div></div>
            <div class="grid" style="grid-template-columns:1fr 1fr 1fr;gap:8px;position:relative">${[["Score", "82"], ["Potential", "92"], ["Rank", "Imm 1"]].map(([a, b]) => `<div><div class="lbl">${a}</div><div class="v">${b}</div></div>`).join("")}</div>
          </div>
          <div class="m-card" style="display:flex;gap:10px;align-items:center;padding:11px 13px"><span style="color:var(--violet)">${ic("eye")}</span><span style="font-size:12px;flex:1">Visible to <b>verified clubs</b></span><span class="link" style="font-size:12px">Change</span></div>
          <span class="m-btn" style="margin-top:auto;margin-bottom:30px">${ic("scan-line")}Show QR to a scout</span></div>`;
      const me = `<div class="m-body" style="gap:10px">
          <div class="m-top"><h2 class="m-title">Me</h2><span class="m-ib">${ic("settings")}</span></div>
          <div class="row" style="gap:12px">${av("Yara Hamami", "lg")}<div style="flex:1"><b style="font-size:15px">Yara Hamami</b><div class="faint" style="font-size:12px">NYX · Player · Jazan</div></div><span class="tag v mono">PRO 92%</span></div>
          <span class="m-label">Linked accounts</span>
          <div class="m-group">${[["riotgames", "Riot Games", "NYX#KSA1", true], ["discord", "Discord", "nyx.sa", true], ["steam", "Steam", "Not linked", false]].map(([k, n, d, on]) => `<div class="m-row"><span class="brand-tile sm">${K.brand(k, 15)}</span><div class="grow"><b>${n}</b><div class="s">${d}</div></div>${on ? ic("circle-check", "i-sm") : `<span class="link" style="font-size:12px">Link</span>`}</div>`).join("").replace(/<i data-lucide="circle-check" class="i-sm"><\/i>/g, `<span style="color:var(--mint)">${ic("circle-check", "i-sm")}</span>`)}</div>
          <span class="m-label">Devices</span>
          <div class="m-group"><div class="m-row"><span class="brand-tile sm">${K.brand("apple", 15)}</span><div class="grow"><b>Apple Watch</b><div class="s">Synced 6 min ago</div></div>${ic("chevron-right", "chev")}</div></div>
          <span class="m-label">Appearance</span>
          <div class="m-seg"><span>${ic("sun")}Light</span><span class="on">${ic("monitor")}Auto</span><span>${ic("moon")}Dark</span></div>
        </div>${tabs(4)}`;
      return `<div class="canvas" style="gap:40px">
        ${head("SETA Mobile · Grow", "Grow and get seen", "The fix from each debrief lands in your plan, your coach sees it, and verified progress shows on your passport.", `<a class="btn" href="#/m-day">${ic("arrow-left")} Match day</a><a class="btn primary" href="#/watch">Watch app ${ic("arrow-right")}</a>`)}
        ${row("04 · Grow", "Stats, coaching and the plan", shot(phone(stats), "G1", "Stats") + shot(phone(coach), "G2", "Coach") + shot(phone(plan), "G3", "Training plan"))}
        ${row("Identity", "Passport and account", shot(phone(pass), "G4", "Passport") + shot(phone(me), "G5", "Me & linked accounts"))}
      </div>`;
    },
  });
})();
