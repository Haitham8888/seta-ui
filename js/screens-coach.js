/* PART 10 — Coach account: setup, players, review, sessions, plans, earnings, public profile */
(function () {
  const { ic, star, av, spark, radar, ring, lines, bars, delta, orbit } = K;
  const S = (window.SCREENS = window.SCREENS || []);
  const PART = "Part 10 · Coach account";
  const head = (e, t, s, a = "") => K.head(e, t, s, a);
  const SK = ["Aim", "Reaction", "Decision", "Game sense", "Teamwork", "Consistency"];
  const PLAYERS = [
    { n: "Yara Hamami", t: "NYX", role: "Duelist", g: "VAL", s: 82, d: 4, rd: 74, adh: 86, st: ["Decision timing", "e"], sk: [86, 78, 80, 83, 76, 83], goal: [88, 80, 86, 85, 80, 85], next: "Today 18:00", note: "Crosshair height on Haven is now consistent. Next: stop re-peeking after a kill." },
    { n: "Khalid Asiri", t: "KAIRO", role: "Controller", g: "VAL", s: 79, d: 2, rd: 81, adh: 92, st: ["On track", "m"], sk: [74, 72, 86, 88, 90, 80], goal: [78, 74, 88, 90, 92, 84], next: "Mon 19:00", note: "Smoke timing on retakes is excellent. Work on mid-round calls." },
    { n: "Ziyad Qahtani", t: "ZETA", role: "Initiator", g: "VAL", s: 74, d: -3, rd: 62, adh: 58, st: ["Low readiness 3 days", "a"], sk: [76, 70, 74, 79, 82, 66], goal: [80, 76, 80, 82, 84, 78], next: "Tue 20:00", note: "Sleep has dropped below 6h three nights in a row. Lighter week planned." },
    { n: "Rayan Malki", t: "RYN", role: "Sentinel", g: "VAL", s: 77, d: 5, rd: 88, adh: 90, st: ["Top improver", "v"], sk: [78, 76, 80, 84, 78, 80], goal: [82, 78, 84, 86, 82, 84], next: "Wed 18:30", note: "Big jump in post-plant positioning. Keep the same plan." },
    { n: "Saud Hakami", t: "HKM", role: "Flex", g: "CS2", s: 71, d: 1, rd: 70, adh: 44, st: ["Missed 2 sessions", "r"], sk: [80, 74, 66, 70, 72, 64], goal: [82, 78, 74, 76, 78, 74], next: "Thu 21:00", note: "Strong aim, weak utility. Needs to attend the utility sessions." },
    { n: "Nawaf Rashed", t: "NEOR", role: "Duelist", g: "VAL", s: 76, d: 3, rd: 77, adh: 81, st: ["On track", "m"], sk: [84, 82, 72, 74, 70, 76], goal: [86, 84, 78, 80, 76, 80], next: "Fri 17:00", note: "Entry timing is good. Trading with teammates needs work." },
  ];
  K.COACH_PLAYERS = PLAYERS;

  /* =============== COACH ACCOUNT SETUP =============== */
  let cStep = 0;
  const cGames = new Set(["VAL"]);
  const cSpec = new Set(["Tactics", "VOD review", "Entry timing"]);
  const slots = new Set(["Sat-18", "Sat-20", "Sun-17", "Sun-19", "Mon-19", "Tue-21", "Wed-18", "Wed-20", "Thu-19"]);
  S.push({
    id: "coach-setup", part: PART, title: "Coach account setup", kind: "full",
    render() {
      const steps = ["Verify", "Expertise", "Pricing", "Availability"];
      let body = "";
      if (cStep === 0) body = `<div><span class="eyebrow">Step 1 · Trust</span><h1 class="h1" style="margin-top:6px">Verify your coach account</h1><p class="muted" style="margin:8px 0 0">Verified coaches get a badge and appear first in search. It takes about 3 minutes.</p></div>
        <div class="card"><div class="list" style="padding:4px 18px">
          ${[["fingerprint", "National identity", "Verified through Nafath", true, ""], ["award", "Coaching certificate", "PDF or image, issued in the last 3 years", true, "Esports Coaching Level 2 · uploaded"], ["briefcase", "Coaching experience", "Teams or players you have coached", false, ""], ["link-2", "Game account", "Proves your own rank and history", true, "Riot ID linked · Immortal 3"]].map(([i, t, d, ok, extra]) => `<div class="li" style="padding:16px 0;align-items:flex-start"><span class="role-card" style="padding:0;border:0;background:none"><span class="ic" style="${ok ? "background:var(--mint-soft);color:var(--mint)" : ""}">${ic(ok ? "check" : i)}</span></span><div class="grow"><div class="t">${t}</div><div class="s">${extra || d}</div></div>${ok ? `<span class="tag m">${ic("badge-check")}Done</span>` : `<button class="btn sm">${ic("plus")}Add</button>`}</div>`).join("")}
        </div></div>
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label>Years coaching</label><div class="input">${ic("calendar")}<select><option>1 – 2 years</option><option selected>3 – 5 years</option><option>6+ years</option></select>${ic("chevron-down", "i-sm")}</div></div><div class="field"><label>Coaching languages</label><div class="input">${ic("languages")}<select><option selected>Arabic and English</option><option>Arabic</option><option>English</option></select>${ic("chevron-down", "i-sm")}</div></div></div>`;
      if (cStep === 1) body = `<div><span class="eyebrow">Step 2 · Expertise</span><h1 class="h1" style="margin-top:6px">What do you coach?</h1><p class="muted" style="margin:8px 0 0">Players filter coaches by game and specialty.</p></div>
        <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px">${Object.entries(K.GAME_META).map(([k, g]) => `<button class="game-tile ${cGames.has(k) ? "on" : ""}" data-h data-cg="${k}">${K.game(k, 40)}<span class="check ${cGames.has(k) ? "on" : ""}">${ic("check")}</span><div><b>${g.name}</b><br><span>${g.genre}</span></div></button>`).join("")}</div>
        <div class="field"><label>Specialties</label><div class="row wrap" style="gap:8px">${["Aim & mechanics", "Tactics", "VOD review", "Entry timing", "IGL & comms", "Utility", "Mental game", "Team building"].map((g) => `<button class="chip ${cSpec.has(g) ? "on" : ""}" data-h data-cspec="${g}">${cSpec.has(g) ? ic("check") : ic("plus")}${g}</button>`).join("")}</div></div>
        <div class="field"><label>Short bio</label><div class="input" style="height:auto;padding:12px 14px;align-items:flex-start"><textarea rows="3" style="border:0;outline:none;background:transparent;width:100%;resize:none">Former Falcons analyst. I help duelists and IGLs turn replays into habits: clear goals, short drills, weekly reviews.</textarea></div></div>`;
      if (cStep === 2) body = `<div><span class="eyebrow">Step 3 · Pricing</span><h1 class="h1" style="margin-top:6px">Set your services and prices</h1><p class="muted" style="margin:8px 0 0">Prices in Saudi riyals. You can change them any time.</p></div>
        <div class="card"><div class="list" style="padding:4px 18px">${[["video", "1:1 live session", "60 min · video call", "180", true], ["film", "Replay review", "Written + timestamped notes · 48h", "120", true], ["users", "Team session", "Up to 5 players · 90 min", "450", true], ["calendar-range", "Monthly plan", "4 sessions + weekly reviews", "600", false]].map(([i, t, d, p, on]) => `<div class="li" style="padding:14px 0"><span class="role-card" style="padding:0;border:0;background:none"><span class="ic">${ic(i)}</span></span><div class="grow"><div class="t">${t}</div><div class="s">${d}</div></div><div class="input sm" style="width:120px"><input value="${p}" style="text-align: end"><span class="faint" style="font-size:12px">SAR</span></div><button class="switch ${on ? "on" : ""}" aria-label="Offer ${t}"></button></div>`).join("")}</div></div>
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px"><div class="card sunk" style="padding:16px"><div class="eyebrow">You receive</div><b class="wide num" style="font-size:26px">153 SAR</b><div class="faint" style="font-size:12px">per 1:1 session, after the 15% platform fee</div></div><div class="card sunk" style="padding:16px"><div class="eyebrow">Payouts</div><b style="font-size:15px">Bank account · ending 4821</b><div class="faint" style="font-size:12px">Paid every 15th of the month</div></div></div>`;
      if (cStep === 3) {
        const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"], hrs = [16, 17, 18, 19, 20, 21, 22];
        body = `<div><span class="eyebrow">Step 4 · Availability</span><h1 class="h1" style="margin-top:6px">When can players book you?</h1><p class="muted" style="margin:8px 0 0">Tap the slots you’re free. Times are Saudi time (Asia/Riyadh).</p></div>
        <div class="card" style="padding:16px;overflow-x:auto"><div class="slot-grid"><span></span>${days.map((d) => `<b>${d}</b>`).join("")}${hrs.map((h) => `<span class="mono faint">${h}:00</span>${days.map((d) => `<button class="slot ${slots.has(d + "-" + h) ? "on" : ""}" data-h data-slot="${d}-${h}" aria-label="${d} ${h}:00"></button>`).join("")}`).join("")}</div></div>
        <div class="row wrap" style="gap:16px"><span class="row" style="gap:8px;font-size:13px"><button class="switch on" aria-label="Accept new players"></button>Accept new players</span><span class="row" style="gap:8px;font-size:13px"><button class="switch on" aria-label="Instant booking"></button>Instant booking for returning players</span><span class="faint mono" style="font-size:11px;margin-inline-start: auto">${slots.size} SLOTS / WEEK</span></div>`;
      }
      return `<div class="full" style="display:flex;flex-direction:column">
        <header class="land-nav" style="height:64px">${K.wm(18)}<span class="tag v mono">COACH ACCOUNT</span><div class="r">${K.themeSwitch()}<a class="btn ghost" href="#/auth">${ic("x")} Exit</a></div></header>
        <div style="flex:1;display:grid;grid-template-columns:minmax(0,1fr) 400px" class="setup-grid">
          <main style="padding:36px clamp(16px,5vw,72px) 32px;display:flex;flex-direction:column;gap:26px;max-width:860px;width:100%;margin:0 auto">
            <div class="stepper">${steps.map((s, i) => `<div class="st ${i < cStep ? "done" : i === cStep ? "on" : ""}"><i></i><span>${s}</span></div>`).join("")}</div>
            <div class="col fade-in" style="gap:22px">${body}</div>
            <div class="row between" style="margin-top:auto;padding-top:20px;border-top:1px solid var(--line)"><button class="btn ghost" data-h data-cback ${cStep === 0 ? 'style="visibility:hidden"' : ""}>${ic("arrow-left")} Back</button><span class="mono faint" style="font-size:11px">${cStep + 1} of 4</span><button class="btn primary" data-h data-cnext>${cStep === 3 ? "Publish my profile" : "Continue"} ${ic("arrow-right")}</button></div>
          </main>
          <aside class="hide-m" style="border-inline-start:1px solid var(--line);background:var(--bg-sunk);padding:36px 28px;display:flex;flex-direction:column;gap:14px">
            <span class="eyebrow">How players will see you</span>
            ${coachCard(true)}
            <div class="card" style="padding:16px"><div class="row between"><b style="font-size:13px">Profile strength</b><span class="mono" style="font-size:12px;color:var(--violet)">${[45, 70, 88, 100][cStep]}%</span></div><div class="meter" style="margin-top:10px"><i style="width:${[45, 70, 88, 100][cStep]}%"></i></div><p class="faint" style="font-size:12px;margin:10px 0 0">Coaches with 8+ weekly slots get booked 2.4× more.</p></div>
          </aside>
        </div></div>`;
    },
    mount(root) {
      root.querySelectorAll("[data-cg]").forEach((b) => (b.onclick = () => { const k = b.dataset.cg; cGames.has(k) && cGames.size > 1 ? cGames.delete(k) : cGames.add(k); rerender(); }));
      root.querySelectorAll("[data-cspec]").forEach((b) => (b.onclick = () => { const k = b.dataset.cspec; cSpec.has(k) ? cSpec.delete(k) : cSpec.add(k); rerender(); }));
      root.querySelectorAll("[data-slot]").forEach((b) => (b.onclick = () => { const k = b.dataset.slot; slots.has(k) ? slots.delete(k) : slots.add(k); b.classList.toggle("on"); const c = root.querySelector(".slot-grid")?.closest(".col")?.querySelector(".mono.faint[style*='margin-left']"); if (c) c.textContent = `${slots.size} SLOTS / WEEK`; }));
      root.querySelector("[data-cnext]").onclick = () => { if (cStep < 3) { cStep++; rerender(); } else { cStep = 0; toast("Coach profile published"); location.hash = "#/coachhub"; } };
      root.querySelector("[data-cback]").onclick = () => { cStep = Math.max(0, cStep - 1); rerender(); };
    },
  });

  function coachCard(compact = false) {
    return `<div class="card" style="overflow:hidden">
      <div style="height:${compact ? 70 : 110}px;background:#120D1F;position:relative;overflow:hidden">${orbit({ w: 400, h: 110, color: "#9677FF", op: 0.7 })}</div>
      <div style="padding:0 18px 18px;margin-top:-28px;position:relative" class="col">
        <div class="row between" style="align-items:flex-end">${av("Reem Alqahtani", compact ? "lg" : "xl")}<span class="tag m">${ic("badge-check")}Verified coach</span></div>
        <div><b style="font-size:${compact ? 16 : 22}px" class="${compact ? "" : "wide"}">Reem Alqahtani</b><div class="faint" style="font-size:12px">Head Coach · Falcons · Jazan</div></div>
        <div class="row" style="gap:10px;font-size:12.5px"><span class="row" style="gap:4px"><span style="color:var(--amber)">${ic("star", "i-sm")}</span><b>4.9</b><span class="faint">(126)</span></span><span class="faint">·</span><span>126 players</span><span class="faint">·</span><span class="up">+14% avg</span></div>
        <div class="row wrap" style="gap:5px">${[...cGames].map((g) => K.game(g, 24, 7)).join("")}${[...cSpec].slice(0, 3).map((s) => `<span class="tag">${s}</span>`).join("")}</div>
        <div class="row between" style="padding-top:10px;border-top:1px solid var(--line)"><span><b class="num">180</b> <span class="faint" style="font-size:12px">SAR / hour</span></span><button class="btn primary sm">Book</button></div>
      </div></div>`;
  }
  K.coachCard = coachCard;

  /* =============== MY PLAYERS =============== */
  let selP = 0, pFilter = "All";
  S.push({
    id: "coach-players", part: PART, title: "Coach · my players", kind: "app", role: "coach", nav: "coach-players", crumbs: ["Coaching", "Players"],
    render() {
      const list = PLAYERS.map((p, i) => [p, i]).filter(([p]) => pFilter === "All" || (pFilter === "Needs attention" ? ["a", "r", "e"].includes(p.st[1]) : p.d >= 4));
      const p = PLAYERS[selP];
      return `<div class="page fade-in">
        ${head("Coach · 14 active players", "My players", "Everyone you coach, with what changed since your last session.", `<button class="btn">${ic("user-plus")}Invite player</button><button class="btn primary">${ic("clipboard-plus")}Assign plan</button>`)}
        <div class="row wrap" style="gap:10px"><label class="input sm" style="width:260px">${ic("search")}<input placeholder="Search players"></label><div class="seg">${["All", "Needs attention", "Top improvers"].map((f) => `<button class="${pFilter === f ? "on" : ""}" data-h data-pf="${f}">${f}${f === "Needs attention" ? ` <em class="mono" style="font-style:normal;color:var(--ember)">3</em>` : ""}</button>`).join("")}</div><button class="select game-sel" data-pop="games">${K.game("VAL", 22, 6)}<b style="font-weight:600">Valorant</b>${ic("chevron-down")}</button></div>
        <div class="grid g-12">
          <section class="card c-6 r-12"><div class="table-wrap"><table class="table"><thead><tr><th>Player</th><th>Score</th><th class="hide-m">Readiness</th><th>Plan</th><th>Status</th></tr></thead><tbody>
            ${list.map(([x, i]) => `<tr class="${i === selP ? "sel" : ""}" data-h data-cp="${i}"><td><div class="row" style="gap:10px">${av(x.n, "sm", i)}<div><b>${x.t}</b><div class="faint" style="font-size:11.5px">${x.role} · ${x.n}</div></div></div></td><td><div class="row" style="gap:6px"><b class="num wide" style="font-size:16px">${x.s}</b>${delta(x.d)}</div></td><td class="hide-m"><div class="row" style="gap:8px"><div class="meter thin m" style="width:50px"><i style="width:${x.rd}%;${x.rd < 70 ? "background:var(--amber)" : ""}"></i></div><span class="mono faint" style="font-size:11px">${x.rd}</span></div></td><td><span class="mono" style="font-size:12px;color:${x.adh < 60 ? "var(--rose)" : "var(--text-2)"}">${x.adh}%</span></td><td><span class="tag ${x.st[1]}">${x.st[0]}</span></td></tr>`).join("")}
          </tbody></table></div></section>
          <section class="card c-6 r-12"><div class="card-b col" style="gap:18px">
            <div class="row" style="gap:14px">${av(p.n, "xl", selP)}<div style="flex:1;min-width:0"><div class="row" style="gap:8px"><b class="wide" style="font-size:24px">${p.t}</b>${K.game(p.g, 24, 7)}</div><div class="faint" style="font-size:12.5px">${p.n} · ${p.role} · Falcons</div><div class="row wrap" style="gap:6px;margin-top:8px"><span class="tag ${p.st[1]}">${p.st[0]}</span><span class="tag mono">NEXT · ${p.next.toUpperCase()}</span></div></div></div>
            <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:10px">${[["SETA Score", p.s, p.d >= 0 ? `+${p.d}` : p.d, "var(--violet)"], ["Readiness", p.rd, p.rd < 70 ? "Low" : "Good", p.rd < 70 ? "var(--amber)" : "var(--mint)"], ["Plan done", p.adh + "%", p.adh < 60 ? "Behind" : "On track", p.adh < 60 ? "var(--rose)" : "var(--mint)"]].map(([a, b, c, col]) => `<div class="card sunk" style="padding:12px"><div class="eyebrow" style="font-size:10px">${a}</div><b class="num wide" style="font-size:22px">${b}</b><div style="font-size:11.5px;color:${col}">${c}</div></div>`).join("")}</div>
            <div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:center" id="cpGrid">
              <div>${radar(SK, [{ data: p.sk, color: "var(--violet)" }, { data: p.goal, color: "var(--ember)", dash: true, fill: 0 }], { size: 240 })}<div class="legend" style="justify-content:center"><span><i></i>Now</span><span><i class="dash" style="background:repeating-linear-gradient(90deg,var(--ember) 0 3px,transparent 3px 5px)"></i>Your goal</span></div></div>
              <div class="col" style="gap:10px"><span class="eyebrow">Your last note</span><p style="margin:0;font-size:13.5px;line-height:1.55">“${p.note}”</p><span class="eyebrow" style="margin-top:6px">Score · 8 weeks</span>${spark([p.s - 8, p.s - 7, p.s - 5, p.s - 6, p.s - 3, p.s - 2, p.s - p.d, p.s], { w: 220, h: 50, color: p.d < 0 ? "var(--rose)" : "var(--violet)" })}</div>
            </div>
            <div class="row wrap" style="gap:8px"><button class="btn">${ic("message-square")}Message</button><button class="btn">${ic("dumbbell")}Assign drill</button><a class="btn" href="#/coach-sessions">${ic("calendar-plus")}Schedule</a><a class="btn primary" href="#/coach-review" style="margin-inline-start: auto">${ic("film")}Review latest match</a></div>
          </div></section>
        </div>
      </div><style>@media (max-width:760px){#cpGrid{grid-template-columns:1fr !important}}</style>`;
    },
    mount(root) {
      root.querySelectorAll("[data-cp]").forEach((r) => (r.onclick = () => { selP = +r.dataset.cp; rerender(); }));
      root.querySelectorAll("[data-pf]").forEach((b) => (b.onclick = () => { pFilter = b.dataset.pf; rerender(); }));
    },
  });

  /* =============== REVIEW WORKSPACE =============== */
  let selQ = 0, tool = "arrow";
  const QUEUE = [
    ["Yara Hamami", "NYX", "Bind · 8–13", "3 AI-flagged mistakes", "2d", "VAL"],
    ["Ziyad Qahtani", "ZETA", "Lotus · 11–13", "“Why do we lose B retakes?”", "1d", "VAL"],
    ["Khalid Asiri", "KAIRO", "Haven · 13–10", "Smoke timing check", "5h", "VAL"],
    ["Saud Hakami", "HKM", "Mirage · 9–13", "Utility usage", "4h", "CS2"],
  ];
  const NOTES = [
    ["02:14", "Good pre-aim here. Keep this crosshair height on every map.", "v"],
    ["08:42", "Wait for the dart. Swing with Kairo as a pair, not alone.", "e"],
    ["11:06", "Rotate on the first sound cue, not the spike call.", "e"],
  ];
  S.push({
    id: "coach-review", part: PART, title: "Coach · review workspace", kind: "app", role: "coach", nav: "coach-review", crumbs: ["Coaching", "Review queue"],
    render() {
      const q = QUEUE[selQ];
      return `<div class="page fade-in">
        ${head("Review queue · 6 pending", `${q[1]} · ${q[2]}`, "", `<span class="tag e mono" style="height:26px">DUE IN ${["22H", "46H", "2D", "2D"][selQ]}</span><button class="btn">${ic("save")}Save draft</button><button class="btn primary">${ic("send")}Send feedback</button>`)}
        <div class="grid g-12">
          <aside class="c-3 r-12 col" style="gap:8px">${QUEUE.map(([n, t, m, d, ago, g], i) => `<div class="moment ${i === selQ ? "on" : ""}" data-h data-cq="${i}" style="flex-direction:column;gap:8px"><div class="row between"><div class="row" style="gap:8px">${av(n, "sm", [0, 2, 1, 4][i])}<b style="font-size:13px">${t}</b></div><span class="mono faint" style="font-size:10.5px">${ago}</span></div><div class="row" style="gap:6px;font-size:12.5px">${K.game(g, 18, 5)}${m}</div><div class="faint" style="font-size:12px">${d}</div></div>`).join("")}</aside>
          <div class="c-6 r-12 col" style="gap:12px">
            <div class="player">${K.map()}
              <div class="hud"><span class="row" style="gap:8px"><span class="tag mono" style="background:rgba(255,255,255,.08);color:#EDEAF4">ROUND 14</span>${K.game(q[5], 20, 5)}</span><div class="seg" style="background:rgba(0,0,0,.4);border-color:rgba(255,255,255,.1)">${[["mouse-pointer-2", "pointer"], ["move-up-right", "arrow"], ["circle", "circle"], ["pen-line", "pen"], ["type", "text"]].map(([i, k]) => `<button class="${tool === k ? "on" : ""}" data-h data-tool="${k}" title="${k}" style="color:#EDEAF4">${ic(i)}</button>`).join("")}</div></div>
              <svg viewBox="0 0 640 360" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none"><path d="M215 250 C 260 220, 280 205, 300 195" stroke="#FF8550" stroke-width="3" fill="none" stroke-linecap="round" marker-end="url(#ah)"/><defs><marker id="ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#FF8550"/></marker></defs><circle cx="388" cy="146" r="22" stroke="#FF8550" stroke-width="2.5" fill="none" stroke-dasharray="4 4"/></svg>
              <div class="ctrl"><button>${ic("skip-back")}</button><button style="width:38px;height:38px;border-radius:50%;background:#EDEAF4;color:#0E0C13;display:grid;place-items:center">${ic("play")}</button><button>${ic("skip-forward")}</button><span class="mono" style="font-size:12px">08:42 <span style="opacity:.5">/ 21:30</span></span><span style="margin-inline-start: auto" class="mono" style="font-size:11px;opacity:.7">0.25×</span></div>
            </div>
            <div class="card" style="padding:12px 18px 6px"><div class="row between"><span class="eyebrow">Timeline</span><div class="legend" style="font-size:11.5px"><span><i style="background:var(--ember)"></i>AI flag</span><span><i style="background:var(--violet)"></i>Your note</span></div></div>
              <div class="scrub"><div class="track"></div><div class="fill" style="width:41%"></div>${[[9, "var(--violet)"], [41, "var(--ember)"], [41.6, "var(--violet)"], [55, "var(--ember)"], [55.6, "var(--violet)"], [88, "var(--ember)"]].map(([p, c]) => `<i class="mk" style="left:${p}%;background:${c}"></i>`).join("")}<span class="head" style="left:41%"></span></div></div>
            <section class="card"><div class="card-h"><span class="h3">${ic("sparkles")}SETA pre-review</span><span class="r faint" style="font-size:12px">Accept, edit or dismiss</span></div>
              <div class="card-b col" style="gap:8px">${[["08:42", "Wide peek without utility", "Accepted"], ["11:06", "Late rotation", "Accepted"], ["18:12", "Re-peek after kill", ""]].map(([t, d, s]) => `<div class="row" style="gap:10px;padding:10px;border:1px solid var(--line);border-radius:10px"><span class="mono faint" style="font-size:11px;width:40px">${t}</span><span style="flex:1;font-size:13px;font-weight:600">${d}</span>${s ? `<span class="tag m">${ic("check")}${s}</span>` : `<button class="chip" style="height:28px">${ic("check")}Accept</button><button class="chip" style="height:28px">${ic("x")}Dismiss</button>`}</div>`).join("")}</div></section>
          </div>
          <aside class="c-3 r-12 col" style="gap:12px">
            <section class="card"><div class="card-h"><span class="h3">${ic("message-square-text")}Your notes</span><span class="r mono faint" style="font-size:11px">${NOTES.length}</span></div>
              <div class="card-b col" style="gap:10px">${NOTES.map(([t, n, c]) => `<div style="border-inline-start:3px solid var(--${c === "v" ? "violet" : "ember"});padding:2px 0 2px 10px"><span class="mono faint" style="font-size:10.5px">${t}</span><p style="margin:2px 0 0;font-size:12.5px;line-height:1.5">${n}</p></div>`).join("")}</div></section>
            <section class="card"><div class="card-b col" style="gap:10px">
              <div class="row between"><span class="eyebrow">New note at 08:42</span><span class="kbd">N</span></div>
              <div class="input" style="height:auto;padding:10px 12px;align-items:flex-start"><textarea rows="3" placeholder="What should they do differently?" style="border:0;outline:none;background:transparent;width:100%;resize:none;font-size:13px"></textarea></div>
              <div class="row wrap" style="gap:6px"><button class="chip" style="height:28px">${ic("dumbbell")}Attach drill</button><button class="chip" style="height:28px">${ic("mic")}Voice note</button></div>
              <div class="row between" style="font-size:12.5px"><span>Share with player</span><button class="switch on" aria-label="Share with player"></button></div>
              <div class="row between" style="font-size:12.5px"><span>Also notify team</span><button class="switch" aria-label="Notify team"></button></div>
              <button class="btn primary block">${ic("plus")}Add note</button></div></section>
          </aside>
        </div>
      </div>`;
    },
    mount(root) {
      root.querySelectorAll("[data-cq]").forEach((b) => (b.onclick = () => { selQ = +b.dataset.cq; rerender(); }));
      root.querySelectorAll("[data-tool]").forEach((b) => (b.onclick = () => { tool = b.dataset.tool; root.querySelectorAll("[data-tool]").forEach((x) => x.classList.toggle("on", x === b)); }));
    },
  });

  /* =============== SESSIONS =============== */
  const reqs = [
    { n: "Lina Haddad", t: "LUNA", what: "1:1 live · Aim", when: "Sat 20:00", price: 180, g: "VAL" },
    { n: "Fahad Shehri", t: "FHD", what: "Replay review", when: "Within 48h", price: 120, g: "CS2" },
    { n: "Najd Vipers", t: "Team", what: "Team session · 5 players", when: "Sun 21:00", price: 450, g: "VAL" },
  ];
  const reqState = {};
  S.push({
    id: "coach-sessions", part: PART, title: "Coach · sessions", kind: "app", role: "coach", nav: "coach-sessions", crumbs: ["Coaching", "Sessions"],
    render() {
      const days = ["Sat 8", "Sun 9", "Mon 10", "Tue 11", "Wed 12", "Thu 13", "Fri 14"];
      const ev = [[0, 18, 1, "NYX · Entry timing", "e"], [0, 20, 1.5, "Falcons VOD", ""], [1, 17, 1, "ZETA · Retakes", "s"], [1, 19, 1, "Open slot", "free"], [2, 19, 1, "KAIRO · Calls", "m"], [3, 21, 1, "HKM · Utility", "e"], [4, 18, 1, "RYN · Post-plant", "m"], [4, 20, 2, "Falcons scrim", ""], [5, 19, 1, "NEOR · Trading", "s"], [6, 17, 1, "Weekly review", "m"]];
      const H0 = 16, rowH = 46;
      return `<div class="page fade-in">
        ${head("Sessions · Saudi time", "This week", "11 sessions booked · 3 open slots · 2 requests waiting.", `<div class="row" style="gap:4px"><button class="icon-btn" title="Previous week">${ic("chevron-left")}</button><button class="btn sm">Today</button><button class="icon-btn" title="Next week">${ic("chevron-right")}</button></div><a class="btn" href="#/coach-setup">${ic("clock")}Availability</a><button class="btn primary">${ic("plus")}New session</button>`)}
        <div class="grid g-12">
          <section class="card c-8 r-12" style="overflow:hidden"><div class="cal" style="--rh:${rowH}px">
            <div class="cal-h"><span></span>${days.map((d, i) => `<b class="${i === 0 ? "today" : ""}">${d}</b>`).join("")}</div>
            <div class="cal-b"><div class="cal-times">${[16, 17, 18, 19, 20, 21, 22].map((h) => `<span>${h}:00</span>`).join("")}</div>
              ${days.map((_, di) => `<div class="cal-col ${di === 0 ? "today" : ""}">${ev.filter((e) => e[0] === di).map(([, h, len, t, c]) => `<div class="cal-ev ${c}" data-tip="${t} · ${h}:00" style="top:${(h - H0) * rowH + 3}px;height:${len * rowH - 6}px">${t}<span>${h}:00 · ${len * 60} min</span></div>`).join("")}</div>`).join("")}
              <i class="cal-now" style="top:${(18.6 - H0) * rowH}px"></i>
            </div></div></section>
          <aside class="c-4 r-12 col" style="gap:16px">
            <section class="card"><div class="card-h"><span class="h3">${ic("inbox")}Booking requests</span><span class="r"><span class="tag e mono">${reqs.filter((_, i) => !reqState[i]).length} NEW</span></span></div>
              <div class="card-b col" style="gap:10px">${reqs.map((r, i) => `<div class="card sunk" style="padding:12px;${reqState[i] ? "opacity:.6" : ""}"><div class="row" style="gap:10px">${av(r.n, "sm", i + 2)}<div style="flex:1;min-width:0"><b style="font-size:13px">${r.t === "Team" ? r.n : r.t}</b><div class="faint" style="font-size:11.5px" class="row">${r.what}</div></div>${K.game(r.g, 22, 6)}</div><div class="row between" style="margin-top:10px;font-size:12px"><span class="mono faint">${r.when}</span><b class="num">${r.price} SAR</b></div>
                <div class="row" style="gap:6px;margin-top:10px">${reqState[i] ? `<span class="tag ${reqState[i] === "ok" ? "m" : "r"}" style="width:100%;justify-content:center;height:28px">${reqState[i] === "ok" ? "Accepted · added to calendar" : "Declined"}</span>` : `<button class="btn sm" data-h data-req="${i}" data-a="no" style="flex:1">Decline</button><button class="btn sm primary" data-h data-req="${i}" data-a="ok" style="flex:1">Accept</button>`}</div></div>`).join("")}</div></section>
            <section class="card"><div class="card-h"><span class="h3">${ic("video")}Next up · 18:00</span></div>
              <div class="card-b"><div class="row" style="gap:12px">${av("Yara Hamami", "")}<div style="flex:1"><b>NYX · Entry timing</b><div class="faint" style="font-size:12px">45 min · video call · notes ready</div></div></div><div class="row" style="gap:8px;margin-top:12px"><button class="btn primary sm" style="flex:1">${ic("video")}Start call</button><a class="btn sm" href="#/coach-players">${ic("user")}Profile</a></div></div></section>
          </aside>
        </div>
      </div>`;
    },
    mount(root) { root.querySelectorAll("[data-req]").forEach((b) => (b.onclick = () => { reqState[b.dataset.req] = b.dataset.a; toast(b.dataset.a === "ok" ? "Session accepted and added to your calendar" : "Request declined"); rerender(); })); },
  });

  /* =============== TRAINING PLANS =============== */
  let libCat = "All";
  const DRILLS = [
    ["Crossfire timing", "Mechanics", 15, "crosshair", ""],
    ["Utility-first entries", "Decision", 20, "zap", "e"],
    ["Trade spacing", "Decision", 20, "users", "e"],
    ["Counter-strafe drill", "Mechanics", 15, "move-horizontal", ""],
    ["Retake protocol", "Tactics", 25, "map", "s"],
    ["Comms calls drill", "Team", 20, "megaphone", "s"],
    ["Box breathing reset", "Mental", 5, "wind", "m"],
    ["Replay self-review", "Review", 10, "film", "m"],
  ];
  const plan = { Sat: ["Trade spacing", "Premier match"], Sun: ["Replay self-review"], Mon: ["Crossfire timing", "Utility-first entries"], Tue: ["Counter-strafe drill"], Wed: ["Retake protocol", "Box breathing reset"], Thu: ["Comms calls drill"], Fri: ["Rest day"] };
  S.push({
    id: "coach-plans", part: PART, title: "Coach · training plans", kind: "app", role: "coach", nav: "coach-plans", crumbs: ["Coaching", "Training plans"],
    render() {
      const cats = ["All", "Mechanics", "Decision", "Tactics", "Team", "Mental", "Review"];
      const lib = DRILLS.filter((d) => libCat === "All" || d[1] === libCat);
      const cls = (n) => (DRILLS.find((d) => d[0] === n) || [, , , , n === "Premier match" ? "s" : n === "Rest day" ? "m" : ""])[4];
      return `<div class="page fade-in">
        ${head("Training plans", "Plan builder", "Build a week from the drill library, then assign it to one player or the whole team.", `<span class="select"><span class="k">For</span><b style="font-weight:600">NYX</b>${ic("chevron-down")}</span><button class="btn">${ic("copy")}Save as template</button><button class="btn primary">${ic("send")}Assign plan</button>`)}
        <div class="grid g-12">
          <aside class="card c-3 r-12"><div class="card-h"><span class="h3">${ic("library")}Drill library</span></div>
            <div class="card-b col" style="gap:10px"><label class="input sm">${ic("search")}<input placeholder="Search drills"></label>
              <div class="row wrap" style="gap:5px">${cats.map((c) => `<button class="chip ${libCat === c ? "on" : ""}" data-h data-cat="${c}" style="height:26px;font-size:11.5px;padding:0 9px">${c}</button>`).join("")}</div>
              ${lib.map(([t, c, m, i, k]) => `<div class="drill ${k}" style="display:flex;gap:10px;align-items:center;padding:10px;font-size:12.5px"><span style="opacity:.8">${ic(i, "i-sm")}</span><div style="flex:1">${t}<span>${c.toUpperCase()} · ${m} MIN</span></div><button class="icon-btn" data-h data-add="${t}" title="Add to Saturday" style="width:28px;height:28px">${ic("plus", "i-sm")}</button></div>`).join("")}
            </div></aside>
          <section class="card c-9 r-12"><div class="card-h"><span class="h3">${ic("calendar-days")}Week 4 of 6 · Entry timing</span><span class="r">${av("Yara Hamami", "sm")}<span style="font-size:12.5px;font-weight:600">NYX</span>${K.game("VAL", 22, 6)}</span></div>
            <div class="card-b"><div class="week">${Object.entries(plan).map(([d, items], i) => `<div class="day ${i === 0 ? "today" : ""}"><div class="d"><span>${d}</span><span class="mono faint">${items.reduce((a, n) => a + ((DRILLS.find((x) => x[0] === n) || [, , 0])[2]), 0)}m</span></div>${items.map((n) => `<div class="drill ${cls(n)}">${n}<span>${(DRILLS.find((x) => x[0] === n) || [, "", 0])[2] ? (DRILLS.find((x) => x[0] === n))[2] + " MIN" : n === "Premier match" ? "21:00" : "RECOVERY"}</span></div>`).join("")}<button class="day-add" data-h data-addday="${d}">${ic("plus", "i-sm")}</button></div>`).join("")}</div>
              <div class="grid" style="grid-template-columns:repeat(4,1fr);gap:10px;margin-top:16px">${[["Total time", "3h 20m"], ["Drills", Object.values(plan).flat().length], ["Focus", "Decision 45%"], ["Rest days", "1"]].map(([a, b]) => `<div class="card sunk" style="padding:12px"><div class="eyebrow" style="font-size:10px">${a}</div><b class="num" style="font-size:16px">${b}</b></div>`).join("")}</div></div></section>
          <section class="card c-12"><div class="card-h"><span class="h3">${ic("list-checks")}Plan progress across players</span></div>
            <div class="card-b table-wrap"><table class="table"><thead><tr><th>Player</th><th>Plan</th><th style="width:30%">Completion</th><th>Last drill</th><th class="r">Score change</th></tr></thead><tbody>
              ${PLAYERS.slice(0, 5).map((p, i) => `<tr style="cursor:default"><td><div class="row" style="gap:10px">${av(p.n, "sm", i)}<b>${p.t}</b></div></td><td>${["Entry timing", "IGL calls", "Recovery week", "Post-plant", "Utility basics"][i]}</td><td><div class="row" style="gap:10px"><div class="meter" style="flex:1"><i style="width:${p.adh}%;${p.adh < 60 ? "background:var(--rose)" : ""}"></i></div><span class="mono faint" style="font-size:11px">${p.adh}%</span></div></td><td class="faint" style="font-size:12px">${["2h ago", "Yesterday", "3d ago", "5h ago", "6d ago"][i]}</td><td class="r">${delta(p.d)}</td></tr>`).join("")}
            </tbody></table></div></section>
        </div>
      </div>`;
    },
    mount(root) {
      root.querySelectorAll("[data-cat]").forEach((b) => (b.onclick = () => { libCat = b.dataset.cat; rerender(); }));
      root.querySelectorAll("[data-add]").forEach((b) => (b.onclick = () => { plan.Sat.push(b.dataset.add); toast(`${b.dataset.add} added to Saturday`); rerender(); }));
      root.querySelectorAll("[data-addday]").forEach((b) => (b.onclick = () => { const d = b.dataset.addday; const pick = DRILLS[Math.floor(Math.random() * DRILLS.length)][0]; plan[d].push(pick); toast(`${pick} added to ${d}`); rerender(); }));
    },
  });

  /* =============== EARNINGS =============== */
  S.push({
    id: "coach-earnings", part: PART, title: "Coach · earnings", kind: "app", role: "coach", nav: "coach-earnings", crumbs: ["Business", "Earnings"],
    render() {
      const wk = ["Aug 18", "Aug 25", "Sep 1", "Sep 8", "Sep 15", "Sep 22", "Sep 29", "Oct 6", "Oct 13", "Oct 20", "Oct 27", "Nov 3"];
      const rev = [1220, 1480, 1310, 1650, 1720, 1590, 1880, 2010, 1940, 2160, 2240, 2380];
      return `<div class="page fade-in">
        ${head("Earnings · Saudi riyals", "Your coaching business", "Payouts land on the 15th of each month, after the 15% platform fee.", `<span class="select">${ic("calendar")}<span>Last 90 days</span>${ic("chevron-down")}</span><button class="btn">${ic("download")}Export CSV</button>`)}
        <div class="grid g-12">
          ${[["wallet", "This month", "8,640", "SAR", 12], ["calendar-check", "Sessions", "42", "", 8], ["repeat", "Returning players", "78", "%", 5], ["star", "Avg. rating", "4.9", "", 0]].map(([i, l, v, u, d]) => `<section class="card c-3 r-6"><div class="kpi"><div class="top">${ic(i)}<span class="eyebrow">${l}</span></div><div class="val">${v}<small>${u}</small></div><div class="foot">${d ? delta(d, "%") : `<span class="faint" style="font-size:12px">126 reviews</span>`}</div></div></section>`).join("")}
          <section class="card c-8 r-12"><div class="card-h"><span class="h3">${ic("trending-up")}Weekly earnings</span><span class="r legend hide-m"><span><i></i>Net</span><span><i class="dash"></i>Gross</span></span></div>
            <div class="card-b">${lines([{ data: rev, area: true, dots: true }, { data: rev.map((v) => Math.round(v / 0.85)), color: "var(--text-3)", dash: true, width: 1.4 }], wk, { w: 760, h: 250, min: 1000, max: 3000, ticks: 4, tipUnit: " SAR" })}</div></section>
          <section class="card c-4 r-12"><div class="card-h"><span class="h3">${ic("pie-chart")}By service</span></div>
            <div class="card-b col" style="gap:12px">${[["1:1 live sessions", 4860, 56, ""], ["Replay reviews", 1920, 22, "e"], ["Team sessions", 1350, 16, "s"], ["Monthly plans", 510, 6, "m"]].map(([t, v, p, c]) => `<div><div class="row between" style="font-size:12.5px"><span>${t}</span><b class="num">${v.toLocaleString()} SAR</b></div><div class="meter ${c}" style="margin-top:6px;height:8px"><i style="width:${p}%"></i></div></div>`).join("")}
              <div class="card sunk" style="padding:14px;margin-top:4px"><div class="row between"><span class="eyebrow">Next payout · Nov 15</span>${ic("landmark", "i-sm faint")}</div><b class="wide num" style="font-size:26px">7,344 SAR</b><div class="faint" style="font-size:12px">Bank account ending 4821</div></div></div></section>
          <section class="card c-12"><div class="card-h"><span class="h3">${ic("receipt")}Recent transactions</span></div>
            <div class="card-b table-wrap"><table class="table"><thead><tr><th>Player</th><th>Service</th><th>Date</th><th class="r">Gross</th><th class="r">Fee</th><th class="r">Net</th><th>Status</th></tr></thead><tbody>
              ${[["Yara Hamami", "1:1 live session", "Nov 8", 180, "Paid"], ["Najd Vipers", "Team session", "Nov 7", 450, "Paid"], ["Ziyad Qahtani", "Replay review", "Nov 6", 120, "Paid"], ["Lina Haddad", "1:1 live session", "Nov 5", 180, "Pending"], ["Khalid Asiri", "Monthly plan", "Nov 1", 600, "Paid"]].map(([n, s, d, g, st], i) => `<tr style="cursor:default"><td><div class="row" style="gap:10px">${av(n, "sm", i + 1)}<b>${n}</b></div></td><td>${s}</td><td class="faint">${d}</td><td class="r num">${g}</td><td class="r num faint">−${Math.round(g * 0.15)}</td><td class="r num"><b>${Math.round(g * 0.85)}</b></td><td><span class="tag ${st === "Paid" ? "m" : "a"}">${st}</span></td></tr>`).join("")}
            </tbody></table></div></section>
        </div>
      </div>`;
    },
  });

  /* =============== PUBLIC PROFILE =============== */
  let profMode = "preview";
  S.push({
    id: "coach-profile", part: PART, title: "Coach · public profile", kind: "app", role: "coach", nav: "coach-profile", crumbs: ["Business", "Public profile"],
    render() {
      const reviews = [["Yara Hamami", 5, "Clear, direct feedback with timestamps. My decision score went up 6 points in a month.", "2w"], ["Khalid Asiri", 5, "Best IGL sessions I’ve had. She explains the why, not just the what.", "1mo"], ["Lina Haddad", 4, "Great replay reviews. Slots fill up fast, book early.", "1mo"]];
      return `<div class="page fade-in">
        ${head("What players see in the coach marketplace", "Public profile", "", `<div class="seg"><button class="${profMode === "preview" ? "on" : ""}" data-h data-pm="preview">${ic("eye")}Preview</button><button class="${profMode === "edit" ? "on" : ""}" data-h data-pm="edit">${ic("pencil")}Edit</button></div><button class="btn primary" onclick="toast('Profile link copied')">${ic("link")}Copy profile link</button>`)}
        <section class="card" style="overflow:hidden">
          <div style="height:150px;background:#120D1F;position:relative;overflow:hidden">${orbit({ w: 1400, h: 150, color: "#9677FF", op: 0.8 })}<span style="position:absolute;right:20px;top:18px" class="wm on-ink"><img class="d" src="assets/wordmark-dark.png" alt="SETA" style="height:14px"></span></div>
          <div class="card-b row wrap" style="gap:20px;margin-top:-44px;align-items:flex-end;position:relative">
            ${av("Reem Alqahtani", "xl")}
            <div style="flex:1;min-width:240px"><div class="row" style="gap:8px"><h1 class="h1" style="font-size:26px">Reem Alqahtani</h1><span class="tag m">${ic("badge-check")}Verified</span></div><div class="faint" style="font-size:13px">Head Coach · Falcons · Jazan, Saudi Arabia · Arabic & English</div></div>
            <div class="row" style="gap:0">${[["Rating", "4.9★"], ["Players", "126"], ["Avg. lift", "+14%"], ["Replies in", "2h"]].map(([a, b], i) => `<div style="padding:0 18px;${i ? "border-inline-start:1px solid var(--line)" : ""}"><div class="eyebrow" style="font-size:10px">${a}</div><b class="wide num" style="font-size:20px">${b}</b></div>`).join("")}</div>
          </div>
        </section>
        <div class="grid g-12">
          <div class="c-8 r-12 col" style="gap:16px">
            <section class="card"><div class="card-h"><span class="h3">${ic("user-round")}About</span>${profMode === "edit" ? `<span class="r tag v mono">EDITING</span>` : ""}</div>
              <div class="card-b col" style="gap:14px">${profMode === "edit" ? `<div class="input" style="height:auto;padding:12px 14px;align-items:flex-start"><textarea rows="4" style="border:0;outline:none;background:transparent;width:100%;resize:none">Former Falcons analyst. I help duelists and IGLs turn replays into habits: clear goals, short drills, weekly reviews. Sessions in Arabic or English.</textarea></div>` : `<p style="margin:0;font-size:14px;line-height:1.65">Former Falcons analyst. I help duelists and IGLs turn replays into habits: clear goals, short drills, weekly reviews. Sessions in Arabic or English.</p>`}
                <div class="row wrap" style="gap:8px">${["VAL", "CS2"].map((g) => `<span class="row" style="gap:8px;padding:6px 12px 6px 6px;border:1px solid var(--line);border-radius:12px">${K.game(g, 26, 7)}<b style="font-size:13px">${K.gameName(g)}</b></span>`).join("")}</div>
                <div class="row wrap" style="gap:6px">${["Tactics", "VOD review", "Entry timing", "IGL & comms", "Mental game"].map((s) => `<span class="tag v">${s}</span>`).join("")}${profMode === "edit" ? `<button class="chip" style="height:24px;font-size:11.5px">${ic("plus")}Add</button>` : ""}</div>
                <div class="list">${[["award", "Esports Coaching Level 2", "Certified 2024"], ["club:TF", "Falcons · Head coach", "2023 – now · University league #2"], ["trophy", "Former Immortal 3 player", "Valorant · verified Riot account"]].map(([i, t, d]) => `<div class="li">${i.startsWith("club:") ? K.clubAv(i.slice(5), 28) : `<span class="faint">${ic(i, "i-sm")}</span>`}<div class="grow"><div class="t" style="font-size:13px">${t}</div><div class="s">${d}</div></div></div>`).join("")}</div></div></section>
            <section class="card"><div class="card-h"><span class="h3">${ic("star")}Reviews</span><span class="r row" style="gap:6px"><b>4.9</b><span class="faint" style="font-size:12px">from 126</span></span></div>
              <div class="card-b col" style="gap:12px">${reviews.map(([n, r, t, ago], i) => `<div class="row" style="gap:12px;align-items:flex-start;padding-bottom:12px;border-bottom:1px solid var(--line)">${av(n, "sm", i)}<div style="flex:1"><div class="row between"><b style="font-size:13px">${n}</b><span class="faint mono" style="font-size:10.5px">${ago}</span></div><div style="color:var(--amber);font-size:12px;letter-spacing:2px">${"★".repeat(r)}<span style="color:var(--line-2)">${"★".repeat(5 - r)}</span></div><p style="margin:4px 0 0;font-size:13px" class="muted">${t}</p></div></div>`).join("")}</div></section>
          </div>
          <aside class="c-4 r-12 col" style="gap:16px">
            <section class="card"><div class="card-h"><span class="h3">${ic("package")}Services</span></div>
              <div class="card-b col" style="gap:10px">${[["1:1 live session", "60 min", 180, true], ["Replay review", "48h delivery", 120, false], ["Team session", "90 min · up to 5", 450, false], ["Monthly plan", "4 sessions + reviews", 600, false]].map(([t, d, p, pop]) => `<div class="card sunk" style="padding:12px;${pop ? "border-color:var(--violet);background:var(--violet-tint)" : ""}"><div class="row between"><b style="font-size:13px">${t}</b>${pop ? `<span class="tag v mono" style="font-size:9.5px">POPULAR</span>` : ""}</div><div class="row between" style="margin-top:6px"><span class="faint" style="font-size:12px">${d}</span>${profMode === "edit" ? `<div class="input sm" style="width:96px;height:30px"><input value="${p}" style="text-align: end"><span class="faint" style="font-size:11px">SAR</span></div>` : `<b class="num">${p} SAR</b>`}</div></div>`).join("")}</div></section>
            <section class="card"><div class="card-h"><span class="h3">${ic("calendar-clock")}Next open slots</span></div>
              <div class="card-b row wrap" style="gap:6px">${["Sat 18:00", "Sun 19:00", "Mon 19:00", "Tue 21:00", "Wed 20:00"].map((s, i) => `<button class="chip ${i === 0 ? "on" : ""}">${ic("clock")}${s}</button>`).join("")}<button class="btn primary block" style="margin-top:8px">Book a session</button></div></section>
          </aside>
        </div>
      </div>`;
    },
    mount(root) { root.querySelectorAll("[data-pm]").forEach((b) => (b.onclick = () => { profMode = b.dataset.pm; rerender(); })); },
  });

  /* order: setup → hub → players → review → sessions → plans → earnings → profile, before Mobile */
  const order = ["coach-setup", "coachhub", "coach-players", "coach-review", "coach-sessions", "coach-plans", "coach-earnings", "coach-profile"];
  const moved = order.map((id) => S.splice(S.findIndex((s) => s.id === id), 1)[0]).filter(Boolean);
  const hub = moved.find((s) => s.id === "coachhub"); if (hub) { hub.part = PART; hub.title = "Coach · dashboard"; }
  const at = S.findIndex((s) => s.id === "m-start");
  S.splice(at > -1 ? at : S.length - 1, 0, ...moved);
})();
