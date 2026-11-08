/* PART 2–4 — Player experience, Matches & Replay, BioSync */
(function () {
  const { ic, star, av, spark, radar, ring, lines, bars, dist, heat, delta } = K;
  const S = (window.SCREENS = window.SCREENS || []);
  const days = Array.from({ length: 30 }, (_, i) => (i % 5 === 0 ? `Oct ${i + 9 > 31 ? i - 22 : i + 9}` : ""));
  const lbl30 = ["Oct 10", "", "", "", "", "Oct 15", "", "", "", "", "Oct 20", "", "", "", "", "Oct 25", "", "", "", "", "Oct 30", "", "", "", "", "Nov 4", "", "", "", "Nov 8"];
  const score30 = [68, 69, 67, 70, 71, 70, 72, 71, 73, 74, 72, 74, 75, 74, 76, 75, 77, 76, 78, 77, 76, 78, 79, 80, 79, 81, 80, 82, 81, 82];
  const avg30 = score30.map((v, i) => 70 + i * 0.12);
  const SK = ["Aim", "Reaction", "Decision", "Game sense", "Teamwork", "Consistency"];
  const ME = [86, 78, 80, 83, 76, 83], TIER = [82, 80, 84, 81, 79, 78];
  const MATCHES = [
    ["Haven", "Competitive", "W", "13–7", "24/12/6", 286, "+18", "2h ago", "Jett"],
    ["Ascent", "Competitive", "W", "13–9", "21/14/4", 241, "+15", "4h ago", "Jett"],
    ["Bind", "Competitive", "L", "8–13", "15/17/3", 198, "−17", "Yesterday", "Raze"],
    ["Lotus", "Premier", "W", "13–11", "19/15/9", 233, "+12", "Yesterday", "Jett"],
    ["Split", "Competitive", "L", "10–13", "17/16/5", 214, "−15", "2d ago", "Neon"],
    ["Sunset", "Competitive", "W", "13–4", "22/8/7", 312, "+21", "3d ago", "Jett"],
    ["Icebox", "Premier", "W", "13–10", "18/13/6", 228, "+14", "3d ago", "Jett"],
    ["Pearl", "Competitive", "L", "11–13", "20/18/2", 231, "−14", "4d ago", "Raze"],
  ];
  K.MATCHES = MATCHES;

  const head = (eyebrow, title, sub, actions = "") => `<div class="page-head"><div class="t"><span class="eyebrow">${eyebrow}</span><h1 class="h1">${title}</h1>${sub ? `<p class="muted" style="margin:0">${sub}</p>` : ""}</div><div class="actions">${actions}</div></div>`;
  const filters = (extra = "") => `<button class="select game-sel" data-pop="games">${K.game("VAL", 22, 6)}<b style="font-weight:600">Valorant</b>${ic("chevron-down")}</button><div class="seg hide-m">${["7D", "30D", "90D", "Season"].map((p, i) => `<button class="${i === 1 ? "on" : ""}">${p}</button>`).join("")}</div>${extra}`;
  K.head = head; K.filters = filters;

  /* =============== COMMAND CENTER =============== */
  let editing = false;
  S.push({
    id: "command", part: "Part 2 · Player", title: "My Command Center", kind: "app", nav: "command", crumbs: ["Workspace", "Command Center"],
    render() {
      const w = (cls, inner, name) => `<section class="card widget ${cls}"><span class="handle">${ic("grip-vertical")}${name}</span>${inner}</section>`;
      return `<div class="page fade-in ${editing ? "editing" : ""}">
        ${head("Sunday, 8 November", "Good evening, Nyx.", "Your score rose 4 points this week. Decision-making is the one thing holding it back.",
          `${filters()}<button class="btn ${editing ? "primary" : ""}" data-edit>${ic(editing ? "check" : "layout-grid")}${editing ? "Done" : "Customize"}</button>`)}
        <div class="edit-bar">${ic("move")}<span><b>Edit layout.</b> Drag widgets to reorder, or hide the ones you don’t use.</span><span style="margin-inline-start: auto" class="row"><button class="btn sm">${ic("plus")} Add widget</button><button class="btn sm ghost" data-edit>Reset</button></span></div>

        <div class="grid g-12">
          ${w("c-4 r-12", `<div class="card-h"><span class="h3">${ic("gauge")}SETA Score</span><span class="r"><span class="tag v mono">TOP 18%</span></span></div>
            <div class="card-b row" style="gap:20px;align-items:center">
              <div style="position:relative">${ring(82, { size: 132, stroke: 9, label: "82", sub: "OF 100", ticks: true, mark: 76 })}</div>
              <div class="col" style="gap:12px;flex:1;min-width:0">
                <div><div class="row between"><span class="muted" style="font-size:12.5px">This week</span>${delta(4)}</div><div class="meter" style="margin-top:6px"><i style="width:82%"></i></div></div>
                <div><div class="row between"><span class="muted" style="font-size:12.5px">Immortal avg.</span><span class="mono faint" style="font-size:11.5px">76</span></div><div class="meter ghost" style="margin-top:6px"><i style="width:76%;background:var(--chart-2)"></i></div></div>
                <p class="faint" style="font-size:12px;margin:0">Built from 40 matches. Updated 2h ago.</p>
              </div>
            </div>`, "Score")}
          ${[["trophy", "Win rate", "64", "%", 7, [52, 55, 54, 58, 57, 60, 61, 63, 62, 64], "var(--violet)"], ["crosshair", "Headshot", "28", "%", 4, [22, 23, 24, 23, 25, 26, 25, 27, 27, 28], "var(--violet)"], ["target", "ACS", "267", "", 14, [231, 240, 236, 248, 251, 246, 255, 260, 258, 267], "var(--violet)"], ["brain", "Decision", "80", "", -6, [86, 85, 86, 84, 83, 84, 82, 81, 82, 80], "var(--rose)"]].map(([i, l, v, u, d, s, c], k) =>
            w("c-2 r-6", `<div class="kpi"><div class="top">${ic(i)}<span class="eyebrow">${l}</span></div><div class="val">${v}<small>${u}</small></div><div class="foot">${delta(d, u === "%" ? "pt" : "")}${spark(s, { w: 74, h: 28, color: c })}</div></div>`, l)).join("")}

          ${w("c-8 r-12", `<div class="card-h"><span class="h3">${ic("trending-up")}Performance trend</span><span class="r"><div class="legend hide-m"><span><i></i>SETA Score</span><span><i class="dash"></i>Tier average</span></div></span></div>
            <div class="card-b">${lines([{ data: score30, area: true }, { data: avg30, color: "var(--text-3)", dash: true, width: 1.4 }], lbl30, { w: 760, h: 250, min: 60, max: 90, ticks: 3, tipLabels: score30.map((_, i) => (i < 22 ? `Oct ${10 + i}` : `Nov ${i - 21}`)), marker: { i: 27, label: "NOV 6 · 3 MATCHES", value: "82 · best this season" } })}</div>`, "Trend")}
          ${w("c-4 r-12", `<div class="card-h"><span class="h3">${ic("hexagon")}Skill profile</span><span class="r"><a class="link" href="#/performance">Details ${ic("arrow-right")}</a></span></div>
            <div class="card-b">${radar(SK, [{ data: ME, color: "var(--violet)" }, { data: TIER, color: "var(--text-3)", dash: true, fill: 0 }], { size: 270 })}</div>`, "Skills")}

          ${w("c-5 r-12", `<div class="card-h"><span class="h3">${ic("swords")}Recent matches</span><span class="r">${K.game("VAL", 22, 6)}<a class="link" href="#/matches">All matches ${ic("arrow-right")}</a></span></div>
            <div class="card-b" style="padding-top:8px"><div class="list">${MATCHES.slice(0, 4).map(([m, q, r, sc, kda, acs, rr, t, ag]) => `<a class="li" href="#/matches"><span class="res ${r === "W" ? "w" : "l"}">${r}</span><div class="grow"><div class="t">${m} <span class="faint" style="font-weight:500">· ${ag}</span></div><div class="s">${q} · ${t}</div></div><span class="mono hide-m" style="font-size:12px;color:var(--text-2)">${kda}</span><b class="num" style="width:52px;text-align: end">${sc}</b></a>`).join("")}</div></div>`, "Matches")}
          ${w("c-4 r-6", `<div class="card-h"><span class="h3">${ic("sparkles")}Today’s focus</span><span class="r"><span class="tag e mono">25 MIN</span></span></div>
            <div class="card-b col" style="gap:10px">
              <p style="margin:0;font-size:13.5px">You lose <b>62% of rounds</b> where you peek before your team’s utility lands. Today is about timing.</p>
              ${[["Crossfire timing", "Range · 10 min", true], ["Utility-first entries", "Custom · 10 min", false], ["Review: Bind R14", "Replay · 5 min", false]].map(([t, s, d]) => `<div class="row" style="gap:10px;padding:10px;border:1px solid var(--line);border-radius:10px"><span class="check ${d ? "on" : ""}">${ic("check")}</span><div class="grow" style="flex:1"><div style="font-weight:600;font-size:13px;${d ? "text-decoration:line-through;color:var(--text-3)" : ""}">${t}</div><div class="faint" style="font-size:11.5px">${s}</div></div>${ic("chevron-right", "faint i-sm")}</div>`).join("")}
            </div>`, "Focus")}
          ${w("c-3 r-6", `<div class="card-h"><span class="h3">${ic("heart-pulse")}Readiness</span><span class="r"><span class="dot live"></span></span></div>
            <div class="card-b col" style="gap:14px;align-items:center;text-align:center">
              ${ring(74, { size: 104, stroke: 8, color: "var(--mint)", label: "74", sub: "READY" })}
              <div class="grid" style="grid-template-columns:1fr 1fr 1fr;gap:6px;width:100%">${[["Sleep", "7h40"], ["HRV", "68"], ["RHR", "58"]].map(([a, b]) => `<div><div class="eyebrow" style="font-size:10px">${a}</div><b class="num" style="font-size:15px">${b}</b></div>`).join("")}</div>
              <a class="link" href="#/biosync">Open BioSync ${ic("arrow-right")}</a>
            </div>`, "BioSync")}
        </div>
      </div>`;
    },
    mount(root) { root.querySelectorAll("[data-edit]").forEach((b) => (b.onclick = () => { editing = !editing; rerender(); if (!editing) toast("Layout saved"); })); },
  });

  /* =============== PERFORMANCE ANALYTICS =============== */
  let skillOn = new Set(["Aim", "Decision"]);
  S.push({
    id: "performance", part: "Part 2 · Player", title: "Performance analytics", kind: "app", nav: "performance", crumbs: ["Workspace", "Performance"],
    render() {
      const colors = { Aim: "var(--violet)", Reaction: "var(--sky)", Decision: "var(--ember)", "Game sense": "var(--mint)", Teamwork: "var(--amber)", Consistency: "var(--text-2)" };
      const series = { Aim: [78, 79, 80, 81, 80, 82, 83, 84, 84, 85, 86, 86], Reaction: [74, 74, 75, 76, 75, 76, 77, 77, 78, 78, 78, 78], Decision: [86, 85, 85, 84, 84, 83, 83, 82, 82, 81, 81, 80], "Game sense": [76, 77, 78, 78, 79, 80, 80, 81, 82, 82, 83, 83], Teamwork: [72, 72, 73, 73, 74, 74, 75, 75, 75, 76, 76, 76], Consistency: [74, 75, 76, 77, 77, 78, 79, 80, 81, 81, 82, 83] };
      const wk = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"];
      const rows = [["Aim", 86, 12, 82, "Crosshair placement and first-bullet accuracy"], ["Reaction", 78, 9, 80, "Time-to-damage on first contact"], ["Decision", 80, -6, 84, "Peek timing, rotations, trade discipline"], ["Game sense", 83, 9, 81, "Positioning and info usage"], ["Teamwork", 76, 3, 79, "Trades, utility for teammates, comms"], ["Consistency", 83, 11, 78, "Variance across the last 40 matches"]];
      return `<div class="page fade-in">
        ${head("Performance analytics", "Where your game stands", "Six skills from 40 matches, compared with Immortal duelists in Saudi Arabia.", `${filters()}<button class="btn">${ic("download")}Export</button>`)}
        <div class="grid g-12">
          <section class="card c-5 r-12"><div class="card-h"><span class="h3">${ic("hexagon")}Skill radar</span><span class="r"><div class="legend"><span><i></i>You</span><span><i class="dash"></i>Immortal avg.</span></div></span></div>
            <div class="card-b">${radar(SK, [{ data: ME, color: "var(--violet)" }, { data: TIER, color: "var(--text-3)", dash: true, fill: 0 }], { size: 340 })}</div></section>
          <section class="card c-7 r-12"><div class="card-h"><span class="h3">${ic("list")}Skill breakdown</span><span class="r faint mono" style="font-size:11px">vs. previous 30 days</span></div>
            <div class="card-b table-wrap"><table class="table"><thead><tr><th>Skill</th><th>Score</th><th style="width:38%">You vs. tier</th><th class="r">Change</th></tr></thead><tbody>
              ${rows.map(([s, v, d, t, desc]) => `<tr><td><div style="font-weight:600">${s}</div><div class="faint" style="font-size:11.5px;white-space:normal">${desc}</div></td><td><b class="num wide" style="font-size:18px">${v}</b></td><td><div class="meter ghost" style="height:8px"><i style="width:${v}%;background:${d < 0 ? "var(--rose)" : "var(--violet)"}"></i><b style="left:${t}%"></b></div><div class="faint mono" style="font-size:10.5px;margin-top:5px">TIER ${t}</div></td><td class="r">${delta(d, "%")}</td></tr>`).join("")}
            </tbody></table></div></section>

          <section class="card c-8 r-12"><div class="card-h"><span class="h3">${ic("line-chart")}Skill trends · 12 weeks</span><span class="r hide-m"><div class="row wrap" style="gap:6px">${SK.map((s) => `<button class="chip ${skillOn.has(s) ? "on" : ""}" data-sk="${s}" style="height:28px;font-size:12px">${skillOn.has(s) ? `<i style="width:8px;height:8px;border-radius:2px;background:${colors[s]}"></i>` : ""}${s}</button>`).join("")}</div></span></div>
            <div class="card-b">${lines([...skillOn].map((s) => ({ data: series[s], color: colors[s], width: 2, dots: true })), wk, { w: 760, h: 260, min: 65, max: 90, ticks: 5 })}</div></section>
          <section class="card c-4 r-12"><div class="card-h"><span class="h3">${ic("users")}Percentile</span></div>
            <div class="card-b col" style="gap:14px"><div><span class="wide num" style="font-size:44px;font-weight:650;line-height:1">82<span style="font-size:18px;color:var(--text-3)">nd</span></span><p class="muted" style="margin:6px 0 0;font-size:13px">You score higher than 82% of Immortal duelists in Saudi Arabia.</p></div>${dist(0.82)}</div></section>

          <section class="card c-6 r-12"><div class="card-h"><span class="h3">${ic("calendar-range")}Practice consistency</span><span class="r"><span class="mono faint" style="font-size:11px">18 WEEKS</span></span></div>
            <div class="card-b col" style="gap:12px">${heat(26)}<div class="row between"><span class="faint" style="font-size:12px">Longest streak <b style="color:var(--text)">16 days</b> · current <b style="color:var(--text)">6 days</b></span><div class="row" style="gap:3px;font-size:11px" class="faint"><span class="faint">Less</span>${[0.15, 0.35, 0.6, 1].map((o) => `<i style="width:11px;height:11px;border-radius:3px;background:var(--violet);opacity:${o}"></i>`).join("")}<span class="faint">More</span></div></div></div></section>
          <section class="card c-3 r-6" style="border-color:color-mix(in srgb,var(--mint) 35%,var(--line))"><div class="card-h"><span class="h3" style="color:var(--mint)">${ic("arrow-up-right")}Strengths</span></div>
            <div class="card-b"><div class="list">${[["Aim accuracy", 12], ["Consistency", 11], ["Game sense", 9]].map(([t, d]) => `<div class="li"><div class="grow t" style="font-weight:500">${t}</div>${delta(d, "%")}</div>`).join("")}</div></div></section>
          <section class="card c-3 r-6" style="border-color:color-mix(in srgb,var(--rose) 35%,var(--line))"><div class="card-h"><span class="h3" style="color:var(--rose)">${ic("arrow-down-right")}Work on</span></div>
            <div class="card-b"><div class="list">${[["Decision-making", -6], ["Early-round survival", -5], ["Utility usage", -4]].map(([t, d]) => `<div class="li"><div class="grow t" style="font-weight:500">${t}</div>${delta(d, "%")}</div>`).join("")}</div></div></section>
        </div>
      </div>`;
    },
    mount(root) { root.querySelectorAll("[data-sk]").forEach((b) => (b.onclick = () => { const s = b.dataset.sk; skillOn.has(s) ? skillOn.size > 1 && skillOn.delete(s) : skillOn.add(s); rerender(); })); },
  });

  /* =============== MATCHES =============== */
  let selM = 2, mFilter = "All";
  S.push({
    id: "matches", part: "Part 3 · Matches & Replay", title: "Matches", kind: "app", nav: "matches", crumbs: ["Workspace", "Matches"],
    render() {
      const list = MATCHES.map((m, i) => [m, i]).filter(([m]) => mFilter === "All" || (mFilter === "Wins" ? m[2] === "W" : mFilter === "Losses" ? m[2] === "L" : m[1] === "Premier"));
      const m = MATCHES[selM];
      const rounds = "WWLWWLLWLLWWLLLWLLLLL".split("").slice(0, 21);
      return `<div class="page fade-in">
        ${head("Match history", "Matches", "Every match synced from Riot. Pick one to see what happened, then open the replay.", `<button class="btn">${ic("upload")}Upload replay</button><button class="btn primary">${ic("refresh-cw")}Sync now</button>`)}
        <div class="row wrap" style="gap:10px">
          <label class="input sm" style="width:280px">${ic("search")}<input placeholder="Search map, agent, opponent"></label>
          <div class="seg">${["All", "Wins", "Losses", "Premier"].map((f) => `<button class="${mFilter === f ? "on" : ""}" data-mf="${f}">${f}</button>`).join("")}</div>
          <span class="select">${ic("map")}<span>All maps</span>${ic("chevron-down")}</span>
          <span class="select hide-m">${ic("user-round")}<span>All agents</span>${ic("chevron-down")}</span>
          <span style="margin-inline-start: auto" class="row faint" style="font-size:12px"><span class="form">${MATCHES.map((x) => `<i class="${x[2] === "L" ? "l" : ""}"></i>`).join("")}</span><span class="mono" style="font-size:11px;margin-inline-start:8px">5W · 3L</span></span>
        </div>
        <div class="grid g-12">
          <section class="card c-7 r-12"><div class="table-wrap"><table class="table"><thead><tr><th></th><th>Map</th><th>Agent</th><th>Score</th><th class="hide-m">K / D / A</th><th class="r">ACS</th><th class="r">RR</th><th class="r hide-m">When</th></tr></thead><tbody>
            ${list.map(([x, i]) => `<tr class="${i === selM ? "sel" : ""}" data-m="${i}"><td><span class="res ${x[2] === "W" ? "w" : "l"}">${x[2]}</span></td><td><div class="row" style="gap:10px">${K.game("VAL", 28, 8)}<div><div style="font-weight:600">${x[0]}</div><div class="faint" style="font-size:11.5px">${x[1]}</div></div></div></td><td>${x[8]}</td><td><b class="num">${x[3]}</b></td><td class="mono hide-m" style="font-size:12px">${x[4]}</td><td class="r num">${x[5]}</td><td class="r mono" style="font-size:12px;color:${x[6][0] === "+" ? "var(--mint)" : "var(--rose)"}">${x[6]}</td><td class="r faint hide-m" style="font-size:12px">${x[7]}</td></tr>`).join("")}
          </tbody></table></div></section>
          <section class="card c-5 r-12">
            <div class="card-b col" style="gap:18px">
              <div class="row between"><div class="row" style="gap:12px">${K.game("VAL", 44)}<div><span class="eyebrow">${m[1]} · ${m[7]}</span><h2 class="h2" style="margin-top:4px">${m[0]}</h2></div></div><span class="tag ${m[2] === "W" ? "m" : "r"}" style="height:26px;font-size:12.5px">${m[2] === "W" ? "Victory" : "Defeat"}</span></div>
              <div class="row" style="gap:18px;align-items:flex-end"><b class="wide num" style="font-size:52px;line-height:.9;font-weight:680">${m[3]}</b><div class="col" style="gap:2px"><span class="faint" style="font-size:12px">as ${m[8]}</span><span class="mono" style="font-size:12px;color:${m[6][0] === "+" ? "var(--mint)" : "var(--rose)"}">${m[6]} RR</span></div></div>
              <div><div class="row between" style="margin-bottom:8px"><span class="eyebrow">Rounds</span><span class="mono faint" style="font-size:10.5px">HALF ↦ 12</span></div><div class="row" style="gap:3px">${rounds.map((r, i) => `<i title="Round ${i + 1}" style="flex:1;height:22px;border-radius:2px;background:${r === "W" ? "var(--mint)" : "var(--rose)"};opacity:${r === "W" ? 0.85 : 0.75};${i === 11 ? "margin-inline-end:6px" : ""};${i === 13 ? "outline:2px solid var(--text);outline-offset:1px" : ""}"></i>`).join("")}</div><p class="faint" style="font-size:12px;margin:8px 0 0">Round 14 flagged: the loss streak started here.</p></div>
              <div class="grid" style="grid-template-columns:repeat(4,1fr);gap:10px">${[["K/D/A", m[4]], ["ACS", m[5]], ["HS%", "24%"], ["First bloods", "3"]].map(([a, b]) => `<div class="card sunk" style="padding:12px"><div class="eyebrow" style="font-size:10px">${a}</div><b class="num" style="font-size:16px">${b}</b></div>`).join("")}</div>
              <div class="row" style="gap:12px;padding:14px;border-radius:12px;background:var(--ember-soft)"><span style="color:var(--ember)">${ic("triangle-alert")}</span><div style="font-size:13px"><b>3 key mistakes found.</b> <span class="muted">Mostly early peeks on B long without flash support.</span></div></div>
              <div class="row" style="gap:8px"><a class="btn primary" href="#/replay" style="flex:1">${ic("play")}Open Replay Intelligence</a><button class="btn" title="Share">${ic("share-2")}</button></div>
            </div>
          </section>
        </div>
      </div>`;
    },
    mount(root) {
      root.querySelectorAll("[data-m]").forEach((r) => (r.onclick = () => { selM = +r.dataset.m; rerender(); }));
      root.querySelectorAll("[data-mf]").forEach((b) => (b.onclick = () => { mFilter = b.dataset.mf; rerender(); }));
    },
  });

  /* =============== REPLAY INTELLIGENCE =============== */
  let selMoment = 2;
  const MOMENTS = [
    ["02:14", 9, "crosshair", "var(--violet)", "Opening pick", "Clean first bullet on A main. Good pre-aim."],
    ["05:31", 24, "users", "var(--sky)", "Trade secured", "You traded Kairo within 1.2 s. Textbook spacing."],
    ["08:42", 41, "triangle-alert", "var(--ember)", "Wide peek without utility", "Peeked B long 2.1 s before Sova’s dart landed. Lost the duel at 3 HP disadvantage."],
    ["11:06", 55, "triangle-alert", "var(--ember)", "Late rotation", "Rotated after the spike call. Arrived 4 s after plant."],
    ["14:50", 72, "zap", "var(--mint)", "1v2 clutch", "Held off-angle, isolated both fights. Round won."],
    ["18:12", 88, "triangle-alert", "var(--ember)", "Re-peek after kill", "Same angle re-peeked. Opponent pre-fired."],
  ];
  S.push({
    id: "replay", part: "Part 3 · Matches & Replay", title: "Replay intelligence", kind: "app", nav: "matches", crumbs: ["Matches", "Bind · Yesterday", "Replay"],
    render() {
      const mo = MOMENTS[selMoment];
      return `<div class="page fade-in">
        ${head("Replay intelligence · Bind · 8–13", "Where round 14 went wrong", "", `<div class="seg"><button class="on">${ic("sparkles")}AI review</button><button>${ic("message-square")}Coach notes <em class="mono faint" style="font-style:normal">2</em></button></div><button class="btn">${ic("share-2")}Send to coach</button>`)}
        <div class="grid g-12">
          <div class="c-8 r-12 col" style="gap:14px">
            <div class="player">${K.map()}
              <div class="hud"><span class="row" style="gap:8px"><span class="tag mono" style="background:rgba(255,255,255,.08);color:#EDEAF4">ROUND 14</span><span class="tag mono" style="background:rgba(255,133,80,.18);color:#FF8550">ATTACK</span></span><span class="mono" style="font-size:11px;opacity:.7">TOP-DOWN · 2D RECONSTRUCTION</span></div>
              <div class="ctrl"><button>${ic("skip-back")}</button><button style="width:38px;height:38px;border-radius:50%;background:#EDEAF4;color:#0E0C13;display:grid;place-items:center">${ic("play")}</button><button>${ic("skip-forward")}</button><span class="mono" style="font-size:12px">08:42 <span style="opacity:.5">/ 21:30</span></span><span style="margin-inline-start: auto" class="row" style="gap:12px"><span class="mono" style="font-size:11px;opacity:.7">0.5×</span><button>${ic("maximize-2")}</button></span></div>
            </div>
            <div class="card" style="padding:12px 18px 6px"><div class="row between"><span class="eyebrow">Timeline</span><div class="legend" style="font-size:11.5px"><span><i style="background:var(--violet)"></i>Kill</span><span><i style="background:var(--sky)"></i>Trade</span><span><i style="background:var(--ember)"></i>Mistake</span><span><i style="background:var(--mint)"></i>Clutch</span></div></div>
              <div class="scrub"><div class="track"></div><div class="fill" style="width:${mo[1]}%"></div>${MOMENTS.map((m, i) => `<i class="mk" data-mo="${i}" style="left:${m[1]}%;background:${m[3]};cursor:pointer" title="${m[0]} ${m[4]}"></i>`).join("")}<span class="head" style="left:${mo[1]}%"></span></div></div>
            <div class="grid" style="grid-template-columns:1fr 1fr;gap:14px" id="rpGrid">
              <section class="card"><div class="card-h"><span class="h3" style="color:var(--ember)">${ic("x-circle")}What happened</span></div><div class="card-b"><p style="margin:0;font-size:13.5px">${mo[5]}</p><div class="row wrap" style="gap:6px;margin-top:12px"><span class="tag mono">PEEK 2.1s EARLY</span><span class="tag mono">NO FLASH</span><span class="tag r mono">−1 PLAYER</span></div></div></section>
              <section class="card" style="border-color:color-mix(in srgb,var(--mint) 40%,var(--line))"><div class="card-h"><span class="h3" style="color:var(--mint)">${ic("check-circle-2")}Better play</span></div><div class="card-b"><p style="margin:0;font-size:13.5px">Wait for the recon dart (≈2 s), then swing with Kairo as a pair. In 41 similar rounds this year, swinging after info won 68% of duels.</p><button class="btn sm" style="margin-top:12px">${ic("dumbbell")}Add drill to plan</button></div></section>
            </div>
          </div>
          <aside class="c-4 r-12 col" style="gap:10px">
            <div class="row between"><span class="h3">Key moments</span><span class="mono faint" style="font-size:11px">6 FOUND</span></div>
            ${MOMENTS.map(([t, p, i, c, ti, d], k) => `<div class="moment ${k === selMoment ? "on" : ""}" data-mo="${k}"><span class="ts">${t}</span><span class="kind" style="background:color-mix(in srgb,${c} 16%,transparent);color:${c}">${ic(i)}</span><div style="min-width:0"><div style="font-weight:600;font-size:13px">${ti}</div><div class="faint" style="font-size:12px;line-height:1.4;margin-top:2px">${d.length > 64 ? d.slice(0, 62) + "…" : d}</div></div></div>`).join("")}
            <div class="card sunk stripes" style="padding:18px;text-align:center;border-style:dashed"><div style="color:var(--text-3)">${ic("upload-cloud", "i-lg")}</div><b style="font-size:13px;display:block;margin-top:6px">Drop a replay file</b><span class="faint" style="font-size:12px">.vod, .dem or .replay up to 2 GB</span></div>
          </aside>
        </div>
      </div><style>@media (max-width:760px){#rpGrid{grid-template-columns:1fr !important}}</style>`;
    },
    mount(root) { root.querySelectorAll("[data-mo]").forEach((b) => (b.onclick = () => { selMoment = +b.dataset.mo; rerender(); })); },
  });

  /* =============== BIOSYNC =============== */
  S.push({
    id: "biosync", part: "Part 4 · BioSync", title: "BioSync", kind: "app", nav: "biosync", crumbs: ["Workspace", "BioSync"],
    render() {
      const hr = [62, 64, 66, 70, 92, 118, 126, 131, 124, 138, 142, 129, 120, 96, 84, 78, 74, 96, 121, 133, 128, 136, 126, 104, 86, 76, 70, 66];
      const t = ["18:00", "", "", "", "18:40", "", "", "", "19:20", "", "", "", "20:00", "", "", "", "20:40", "", "", "", "21:20", "", "", "", "22:00", "", "", "22:40"];
      return `<div class="page fade-in">
        ${head("BioSync · Garmin Forerunner 265", "Body and game, side by side", "", `<span class="tag m" style="height:28px">${ic("bluetooth")}Synced 6 min ago</span><button class="btn">${ic("settings-2")}Devices</button>`)}
        <div class="row" style="gap:10px;padding:12px 14px;border-radius:var(--r-md);background:var(--sky-soft);color:var(--sky);font-size:12.5px">${ic("info")}<span>BioSync describes patterns. It does not show cause and effect and is not medical advice.</span></div>
        <div class="grid g-12">
          <section class="card c-3 r-6"><div class="card-b col" style="gap:14px;align-items:center;text-align:center;padding-top:22px">
            <span class="eyebrow">Readiness today</span>${ring(74, { size: 140, stroke: 10, color: "var(--mint)", label: "74", sub: "GOOD", ticks: true })}
            <p class="muted" style="margin:0;font-size:12.5px">Good day for ranked. Keep sessions under 3 hours.</p></div></section>
          ${[["moon", "Sleep", "7h 40m", "var(--violet)", "+35m vs. avg", [6.2, 6.8, 7.1, 6.5, 7.4, 7.9, 7.7]], ["activity", "HRV", "68 ms", "var(--sky)", "Above baseline", [58, 61, 60, 63, 66, 64, 68]], ["heart", "Resting HR", "58 bpm", "var(--rose)", "−2 vs. week", [62, 61, 61, 60, 59, 60, 58]]].map(([i, l, v, c, s, d]) => `<section class="card c-3 r-6"><div class="kpi"><div class="top">${ic(i)}<span class="eyebrow">${l}</span></div><div class="val" style="font-size:30px">${v}</div><span class="muted" style="font-size:12px">${s}</span>${bars(d, { w: 220, h: 64, color: c, hl: 6, labels: ["M", "T", "W", "T", "F", "S", "S"] })}</div></section>`).join("")}

          <section class="card c-8 r-12"><div class="card-h"><span class="h3">${ic("heart-pulse")}Heart rate across tonight’s session</span><span class="r"><div class="legend hide-m"><span><i style="background:var(--rose)"></i>Heart rate</span><span><i style="background:var(--violet);opacity:.4;height:8px"></i>Match</span></div></span></div>
            <div class="card-b">${lines([{ data: hr, color: "var(--rose)", area: true, width: 1.8 }], t, { w: 760, h: 260, min: 50, max: 150, ticks: 4, tipUnit: " bpm", tipLabels: hr.map((_, i) => { const m = 18 * 60 + i * 10; return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`; }), bands: [[4, 12, "var(--violet)", "HAVEN · W"], [17, 23, "var(--violet)", "BIND · L"]] })}
            <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:10px;margin-top:10px">${[["Peak", "142 bpm", "R14 · Bind"], ["Avg in match", "124 bpm", "+8 vs. usual"], ["Recovery after", "11 min", "to < 90 bpm"]].map(([a, b, c]) => `<div class="card sunk" style="padding:12px"><div class="eyebrow" style="font-size:10px">${a}</div><b class="num" style="font-size:16px">${b}</b><div class="faint" style="font-size:11.5px">${c}</div></div>`).join("")}</div></div></section>
          <section class="card c-4 r-12"><div class="card-h"><span class="h3">${ic("bed-double")}Last night</span><span class="r mono faint" style="font-size:11px">23:50 – 07:30</span></div>
            <div class="card-b col" style="gap:16px">
              <div class="row" style="height:56px;gap:2px;align-items:flex-end">${"DLLRDDLLRRLLDLLRRRLLLRLLRRA".split("").map((s) => `<i style="flex:1;border-radius:2px;height:${{ D: 30, L: 55, R: 80, A: 100 }[s]}%;background:${{ D: "var(--violet)", L: "var(--chart-2)", R: "var(--sky)", A: "var(--amber)" }[s]}"></i>`).join("")}</div>
              <div class="list">${[["Deep", "1h 32m", "var(--violet)", 20], ["Light", "3h 58m", "var(--chart-2)", 52], ["REM", "1h 51m", "var(--sky)", 24], ["Awake", "19m", "var(--amber)", 4]].map(([a, b, c, p]) => `<div class="li"><i style="width:10px;height:10px;border-radius:3px;background:${c}"></i><span class="grow">${a}</span><span class="mono faint" style="font-size:11.5px">${p}%</span><b class="num" style="width:62px;text-align: end">${b}</b></div>`).join("")}</div>
              <div class="row" style="gap:10px;padding:12px;border-radius:10px;background:var(--surface-2);font-size:12.5px">${ic("lightbulb", "faint")}<span class="muted">On nights with 7h+ sleep, your aim score averaged <b style="color:var(--text)">+4</b> the next day.</span></div>
            </div></section>
          <section class="card c-6 r-12"><div class="card-h"><span class="h3">${ic("battery-medium")}Fatigue estimate</span><span class="r"><span class="tag a mono">MODERATE</span></span></div>
            <div class="card-b col" style="gap:12px"><div class="segbar" style="height:10px">${Array.from({ length: 20 }, (_, i) => `<i class="${i < 11 ? "on" : ""}" style="${i < 11 ? `background:color-mix(in srgb,var(--amber) ${40 + i * 5}%,var(--mint))` : ""}"></i>`).join("")}</div><div class="row between faint mono" style="font-size:10.5px"><span>FRESH</span><span>TIRED</span></div><p class="muted" style="margin:0;font-size:13px">2h 50m of ranked tonight, HR recovery slowing. A 15-minute break before the next match is a good idea.</p></div></section>
          <section class="card c-6 r-12"><div class="card-h"><span class="h3">${ic("link")}Connected devices</span><span class="r"><button class="btn sm">${ic("plus")}Add</button></span></div>
            <div class="card-b"><div class="list">${[["watch", "Garmin Forerunner 265", "HR, HRV, sleep · 92% battery", true], ["smartphone", "Apple Health", "Sleep, steps", true], ["circle-dot", "Whoop 4.0", "Not connected", false]].map(([i, n, d, on]) => `<div class="li"><span class="role-card" style="padding:0;border:0;background:none"><span class="ic">${ic(i)}</span></span><div class="grow"><div class="t">${n}</div><div class="s">${d}</div></div>${on ? `<span class="tag m">${ic("check")}Live</span>` : `<button class="btn sm">Connect</button>`}</div>`).join("")}</div></div></section>
        </div>
      </div>`;
    },
  });
})();
