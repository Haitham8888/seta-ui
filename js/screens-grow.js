/* PART 5–7 — Dual Coach, Talent Passport & Discovery, Team & Club, Coach experience, Mobile, System */
(function () {
  const { ic, star, av, spark, radar, ring, lines, bars, delta, qr, guil, head, filters, wm, logo, orbit } = K;
  const S = (window.SCREENS = window.SCREENS || []);
  const SK = ["Aim", "Reaction", "Decision", "Game sense", "Teamwork", "Consistency"];

  /* =============== DUAL COACH =============== */
  let coachMode = "ai";
  S.push({
    id: "coach", part: "Part 5 · Dual Coach", title: "Dual Coach", kind: "app", nav: "coach", crumbs: ["Grow", "Dual Coach"],
    render() {
      const week = [
        ["Mon", "3", [["Crossfire timing", "RANGE · 15M", "", true], ["Deathmatch", "30M", "s", true]]],
        ["Tue", "4", [["Utility-first entries", "CUSTOM · 20M", "e", true]]],
        ["Wed", "5", [["Review Bind R14", "REPLAY · 10M", "m", true], ["Session w/ Reem", "LIVE · 45M", "e", true]]],
        ["Thu", "6", [["Counter-strafe drill", "RANGE · 15M", "", true], ["Ranked x3", "PLAY", "s", true]]],
        ["Fri", "7", [["Rest day", "RECOVERY", "m", true]]],
        ["Sat", "8", [["Trade spacing", "CUSTOM · 20M", "e", false], ["Premier match", "21:00", "s", false]]],
        ["Sun", "9", [["Weekly review", "AI · 10M", "", false]]],
      ];
      const ai = `<section class="card c-7 r-12" style="display:flex;flex-direction:column"><div class="card-h"><span class="coach-mark">${star(15)}</span><div><div class="h3">SETA Coach</div><div class="faint" style="font-size:11.5px">Reads your last 40 matches · replies in seconds</div></div><span class="r"><span class="tag m">${ic("circle")}Online</span></span></div>
          <div class="card-b thread" style="flex:1">
            <div class="msg ai"><div class="bub">Morning, Nyx. Quick read on last night: your aim was the best it has been all month (86), but you lost <b>4 of 5 rounds</b> where you entered before Sova’s recon landed.</div></div>
            <div class="msg ai"><div class="bub" style="padding:0;overflow:hidden;background:var(--surface-2)"><div style="padding:12px 14px 4px" class="row between"><span class="eyebrow">Entry timing · last 40 matches</span><span class="mono" style="font-size:11px;color:var(--ember)">−18% WR</span></div><div style="padding:0 10px 10px">${bars([68, 64, 61, 52, 44, 38, 32], { w: 320, h: 80, labels: ["−3s", "−2s", "−1s", "0", "+1s", "+2s", "+3s"], hl: 1 })}</div></div></div>
            <div class="msg me"><div class="bub">So I should just wait for the dart every time?</div></div>
            <div class="msg ai"><div class="bub">Not every time. On <b>attack, B long on Bind</b> and <b>A main on Haven</b>, yes. Elsewhere your early peeks win 61%, so keep them. I added two drills to Saturday.</div></div>
            <div class="row wrap" style="gap:6px;padding-inline-start:2px">${["Show those rounds", "Make it a 3-day plan", "Ask Reem to review"].map((s) => `<button class="chip" style="height:30px">${s}</button>`).join("")}</div>
          </div>
          <div style="padding:12px 18px 18px"><div class="input">${ic("sparkles")}<input placeholder="Ask about any match, map or skill"><button class="btn primary sm" style="height:30px">${ic("arrow-up")}</button></div></div>
        </section>`;
      const coaches = [["Reem Alqahtani", "Valorant · Tactical", "4.9", "126", "180", ["Duelist", "Entry", "Arabic/EN"], true], ["Omar Fallatah", "Valorant · Aim", "4.8", "88", "140", ["Aim", "Mechanics"], false], ["Lina Haddad", "Valorant · Mental", "5.0", "54", "200", ["Mindset", "Tilt"], false]];
      const human = `<section class="card c-7 r-12"><div class="card-h"><span class="h3">${ic("user-round-search")}Find a coach</span><span class="r"><span class="select">${ic("sliders-horizontal")}Filters</span></span></div>
          <div class="card-b col" style="gap:12px">${coaches.map(([n, sp, r, rev, price, tags, cur]) => `<div class="row" style="gap:14px;padding:14px;border:1px solid ${cur ? "var(--violet)" : "var(--line)"};border-radius:14px;align-items:flex-start;${cur ? "background:var(--violet-tint)" : ""}">${av(n, "lg")}<div style="flex:1;min-width:0"><div class="row between"><b style="font-size:14.5px">${n}</b>${cur ? `<span class="tag v">${ic("check")}Your coach</span>` : ""}</div><div class="faint" style="font-size:12px">${sp} · <span style="color:var(--amber)">★</span> ${r} (${rev})</div><div class="row wrap" style="gap:5px;margin-top:8px">${tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div></div><div class="col" style="gap:6px;align-items:flex-end"><b class="num">${price} <span class="faint" style="font-weight:500;font-size:11.5px">SAR / h</span></b><button class="btn sm ${cur ? "" : "primary"}">${cur ? "Book again" : "Request"}</button></div></div>`).join("")}
          <div><span class="eyebrow">Reem’s next open slots</span><div class="row wrap" style="gap:6px;margin-top:8px">${["Sat 18:00", "Sat 20:30", "Sun 17:00", "Mon 19:00", "Tue 21:00"].map((s, i) => `<button class="chip ${i === 1 ? "on" : ""}">${ic("clock")}${s}</button>`).join("")}</div></div></div></section>`;
      return `<div class="page fade-in">
        ${head("Dual Coach", "Train with both coaches", "AI coaching every day, a human coach when you want one. Both see the same plan.", `<div class="seg"><button class="${coachMode === "ai" ? "on" : ""}" data-cm="ai">${ic("sparkles")}AI Coach</button><button class="${coachMode === "human" ? "on" : ""}" data-cm="human">${ic("user-round")}Human Coach</button></div>`)}
        <div class="grid g-12">
          ${coachMode === "ai" ? ai : human}
          <div class="c-5 r-12 col" style="gap:16px">
            <section class="card"><div class="card-h"><span class="h3">${ic("target")}Plan progress</span><span class="r mono faint" style="font-size:11px">WEEK 3 OF 6</span></div>
              <div class="card-b row" style="gap:18px">${ring(71, { size: 108, stroke: 9, label: "71%", sub: "DONE" })}<div class="col" style="gap:10px;flex:1">${[["Aim & mechanics", 92, ""], ["Decision timing", 48, "e"], ["Communication", 66, "s"], ["Replay reviews", 80, "m"]].map(([a, p, c]) => `<div><div class="row between" style="font-size:12.5px"><span>${a}</span><span class="mono faint">${p}%</span></div><div class="meter thin ${c}" style="margin-top:5px"><i style="width:${p}%"></i></div></div>`).join("")}</div></div></section>
            <section class="card"><div class="card-h"><span class="h3">${ic("calendar-clock")}Upcoming session</span></div>
              <div class="card-b"><div class="row" style="gap:12px">${av("Reem Alqahtani", "")}<div style="flex:1"><b>Entry timing review</b><div class="faint" style="font-size:12px">with Reem · Wed 5 Nov, 20:00 · 45 min</div></div></div><div class="row" style="gap:8px;margin-top:14px"><button class="btn primary sm" style="flex:1">${ic("video")}Join call</button><button class="btn sm">${ic("calendar-x")}Reschedule</button></div></div></section>
            <section class="card"><div class="card-h"><span class="h3">${ic("message-square-quote")}Latest feedback</span></div>
              <div class="card-b"><p style="margin:0;font-size:13.5px;line-height:1.6">“Your crosshair height on Haven is now consistent. Next: stop re-peeking after a kill. Take the info and reposition.”</p><div class="row" style="gap:8px;margin-top:10px">${av("Reem Alqahtani", "sm")}<span class="faint" style="font-size:12px">Reem · 2 days ago</span></div></div></section>
          </div>
          <section class="card c-12"><div class="card-h"><span class="h3">${ic("calendar-days")}Training plan · this week</span><span class="r"><span class="legend hide-m" style="font-size:11.5px"><span><i></i>Mechanics</span><span><i style="background:var(--ember)"></i>Decision</span><span><i style="background:var(--sky)"></i>Play</span><span><i style="background:var(--mint)"></i>Review / rest</span></span><button class="btn sm">${ic("plus")}Add drill</button></span></div>
            <div class="card-b"><div class="week">${week.map(([d, n, items]) => `<div class="day ${d === "Sat" ? "today" : ""}"><div class="d"><span>${d}</span><span class="mono ${d === "Sat" ? "" : "faint"}" style="${d === "Sat" ? "color:var(--violet)" : ""}">${n}</span></div>${items.map(([t, s, c, done]) => `<div class="drill ${c} ${done ? "done" : ""}">${t}<span>${s}</span></div>`).join("")}</div>`).join("")}</div></div></section>
        </div>
      </div>`;
    },
    mount(root) { root.querySelectorAll("[data-cm]").forEach((b) => (b.onclick = () => { coachMode = b.dataset.cm; rerender(); })); },
  });

  /* =============== TALENT PASSPORT =============== */
  const passportCard = (o = {}) => {
    const { name = "Yara Hamami", tag = "NYX", game = "Valorant", role = "Duelist", pot = 92, id = "ST-10427", score = 82 } = o;
    return `<div class="passport">${guil(640, 420)}
      <div class="row between" style="position:relative"><span class="wm on-ink" style="height:18px"><img class="l" src="assets/wordmark-light.png"><img class="d" src="assets/wordmark-dark.png"></span><span class="row" style="gap:8px"><span class="lbl">Talent Passport</span><span class="tag" style="background:rgba(69,214,162,.14);color:#45D6A2">${ic("badge-check")}Verified</span></span></div>
      <div class="row" style="gap:18px;position:relative;align-items:flex-start">
        ${av(name, "xl")}
        <div style="flex:1;min-width:0"><div class="lbl">Player</div><b class="wide" style="font-size:34px;line-height:1;letter-spacing:-.02em">${tag}</b><div style="font-size:13px;color:rgba(241,238,249,.7);margin-top:4px">${name}</div></div>
        <div class="qr">${qr(tag, 96)}</div>
      </div>
      <div class="grid" style="grid-template-columns:repeat(4,1fr);gap:14px;position:relative;padding-top:14px;border-top:1px solid rgba(255,255,255,.08)">
        ${[["Game", `<span class="row" style="gap:6px">${K.brand("valorant", 14, "#FA4454")}${game}</span>`], ["Role", role], ["Server", "Jazan · KSA"], ["Rank", "Immortal 1"], ["SETA Score", score], ["Potential", `<span style="color:#B29BFF">${pot}</span>`], ["Matches", "412"], ["Since", "Mar 2024"]].map(([a, b]) => `<div><div class="lbl">${a}</div><div class="v">${b}</div></div>`).join("")}
      </div>
      <div class="mrz" style="position:relative;margin-top:auto">P&lt;SETA${tag}&lt;&lt;${name.toUpperCase().replace(/ /g, "&lt;")}&lt;&lt;&lt;&lt;&lt;&lt;<br>${id.replace("-", "")}&lt;KSA&lt;0503146&lt;VAL&lt;DUE&lt;${score}${pot}&lt;&lt;&lt;</div>
    </div>`;
  };
  K.passportCard = passportCard;
  S.push({
    id: "passport", part: "Part 6 · Passport & Discovery", title: "Talent Passport", kind: "app", nav: "passport", crumbs: ["Grow", "Talent Passport"],
    render() {
      return `<div class="page fade-in">
        ${head("Talent Passport · ST-10427", "Your verified player identity", "One card for scouts, coaches and tournament admins. You control who can open it.", `<button class="btn">${ic("download")}Save as image</button><button class="btn primary" onclick="toast('Passport link copied')">${ic("link")}Copy link</button>`)}
        <div class="grid g-12">
          <div class="c-7 r-12 col" style="gap:16px">${passportCard()}
            <section class="card"><div class="card-h"><span class="h3">${ic("hexagon")}Skill snapshot</span><span class="r faint mono" style="font-size:11px">VERIFIED FROM 40 MATCHES</span></div>
              <div class="card-b grid" style="grid-template-columns:repeat(6,1fr);gap:10px" id="skGrid">${SK.map((s, i) => { const v = [86, 78, 80, 83, 76, 83][i]; return `<div class="col" style="gap:6px;align-items:center;text-align:center">${ring(v, { size: 64, stroke: 5, label: v, color: i === 2 ? "var(--ember)" : "var(--violet)" })}<span class="faint" style="font-size:11.5px">${s}</span></div>`; }).join("")}</div></section>
          </div>
          <div class="c-5 r-12 col" style="gap:16px">
            <section class="card"><div class="card-h"><span class="h3">${ic("eye")}Who can see it</span></div>
              <div class="card-b col" style="gap:4px">${[["Public link", "Anyone with the link sees a limited card", false], ["Verified clubs", "Full profile, on request", true], ["Coaches I work with", "Full profile + BioSync summary", true], ["Tournament admins", "Identity and rank only", true]].map(([t, d, on]) => `<div class="li"><div class="grow"><div class="t" style="font-weight:600">${t}</div><div class="s">${d}</div></div><button class="switch ${on ? "on" : ""}" onclick="this.classList.toggle('on')"></button></div>`).join("")}</div></section>
            <section class="card"><div class="card-h"><span class="h3">${ic("shield-check")}Verification</span><span class="r"><span class="tag m mono">4 / 5</span></span></div>
              <div class="card-b"><div class="list">${[["Identity (Nafath)", true], ["Riot account ownership", true], ["Match history · 412 matches", true], ["University email", true], ["Club reference", false]].map(([t, ok]) => `<div class="li"><span style="color:${ok ? "var(--mint)" : "var(--text-3)"}">${ic(ok ? "circle-check" : "circle-dashed")}</span><span class="grow" style="${ok ? "" : "color:var(--text-3)"}">${t}</span>${ok ? "" : `<button class="btn sm">Request</button>`}</div>`).join("")}</div></div></section>
            <section class="card"><div class="card-h"><span class="h3">${ic("history")}Recent views</span><span class="r mono faint" style="font-size:11px">LAST 30 DAYS · 23</span></div>
              <div class="card-b"><div class="list">${[["Falcons", "Club · viewed full profile", "2h"], ["Coach Omar F.", "Coach · viewed skills", "1d"], ["Najd Esports", "Club · requested access", "3d"]].map(([n, d, t], i) => `<div class="li">${av(n, "sm", i + 3)}<div class="grow"><div class="t">${n}</div><div class="s">${d}</div></div><span class="mono faint" style="font-size:11px">${t}</span></div>`).join("")}</div></div></section>
          </div>
        </div>
      </div><style>@media (max-width:760px){#skGrid{grid-template-columns:repeat(3,1fr) !important}}</style>`;
    },
  });

  /* =============== DISCOVERY & COMPARISON =============== */
  const PL = [["Yara Hamami", "NYX", "Duelist", 20, 96, "KSA"], ["Khalid Asiri", "KAIRO", "Controller", 19, 92, "KSA"], ["Ziyad Qahtani", "ZETA", "Initiator", 21, 88, "KSA"], ["Rayan Malki", "RYN", "Sentinel", 18, 86, "KSA"], ["Nawaf Rashed", "NEOR", "Duelist", 20, 85, "KSA"], ["Saud Hakami", "HKM", "Initiator", 22, 83, "KSA"]];
  let cmp = new Set([0, 1]);
  S.push({
    id: "discovery", part: "Part 6 · Passport & Discovery", title: "Talent discovery & compare", kind: "app", nav: "discovery", crumbs: ["Network", "Discovery"],
    render() {
      const [a, b] = [...cmp].map((i) => PL[i]);
      const va = [95, 94, 92, 89, 88, 90], vb = [91, 89, 90, 87, 85, 88];
      return `<div class="page fade-in">
        ${head("Talent discovery", "Find the right player", "Verified passports only. Filter, shortlist and compare up to two players side by side.", `<button class="btn">${ic("bookmark")}Shortlist <span class="mono faint">4</span></button><button class="btn primary">${ic("bell-plus")}Save search</button>`)}
        <div class="card" style="padding:12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <label class="input sm" style="flex:1;min-width:220px">${ic("search")}<input placeholder="Search name, tag or passport ID"></label>
          <button class="select game-sel" data-pop="games">${K.game("VAL", 22, 6)}<b style="font-weight:600">Valorant</b>${ic("chevron-down")}</button>${[["crosshair", "Any role"], ["map-pin", "Jazan · KSA South"], ["sparkles", "Potential ≥ 85"], ["cake", "16 – 22"]].map(([i, t]) => `<span class="select">${ic(i)}${t}${ic("chevron-down")}</span>`).join("")}
          <button class="btn ghost sm">Reset</button>
        </div>
        <div class="grid g-12">
          <section class="card c-5 r-12"><div class="card-h"><span class="h3">${ic("users")}Players</span><span class="r mono faint" style="font-size:11px">SORT · POTENTIAL ↓</span></div>
            <div class="card-b" style="padding-top:6px"><div class="list">${PL.map(([n, t, r, age, p, c], i) => `<div class="li" style="cursor:pointer" data-cmp="${i}">${av(n, "", i)}<div class="grow"><div class="row" style="gap:6px"><b style="font-size:14px">${t}</b>${ic("badge-check", "i-sm")}</div><div class="s row" style="gap:5px">${K.brand("valorant", 11, "#FA4454")}${r} · ${age} · ${c}</div></div><div class="col" style="gap:4px;align-items:flex-end;width:70px"><b class="num wide" style="font-size:16px">${p}</b><div class="meter thin" style="width:60px"><i style="width:${p}%"></i></div></div><span class="check ${cmp.has(i) ? "on" : ""}" style="margin-inline-start:6px">${ic("check")}</span></div>`).join("")}</div>
            <div class="row between" style="margin-top:12px"><span class="faint" style="font-size:12px">Showing 6 of 24</span><div class="row" style="gap:4px">${["1", "2", "3", "4"].map((p, i) => `<button class="btn sm ${i === 0 ? "ink" : "ghost"}" style="width:30px;padding:0">${p}</button>`).join("")}</div></div></div></section>
          <section class="card c-7 r-12"><div class="card-h"><span class="h3">${ic("git-compare")}Compare</span><span class="r faint" style="font-size:12px">Pick two players</span></div>
            <div class="card-b col" style="gap:20px">
              <div class="grid" style="grid-template-columns:1fr auto 1fr;gap:14px;align-items:center">
                ${[a, b].map((p, k) => `<div class="row" style="gap:12px;${k ? "flex-direction:row-reverse;text-align: end" : ""}">${av(p[0], "lg", PL.indexOf(p))}<div><b class="wide" style="font-size:20px">${p[1]}</b><div class="faint" style="font-size:12px">${p[2]} · ${p[3]} · ${p[5]}</div><span class="tag ${k ? "e" : "v"} mono" style="margin-top:6px">POT ${p[4]}</span></div></div>`).join(`<span class="mono faint" style="font-size:12px;padding:8px;border:1px solid var(--line);border-radius:8px">VS</span>`)}
              </div>
              <div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:20px;align-items:center" id="cmpGrid">
                <div>${radar(SK, [{ data: va, color: "var(--violet)" }, { data: vb, color: "var(--ember)", fill: 0.08 }], { size: 270, labels: false })}<div class="legend" style="justify-content:center;margin-top:6px"><span><i></i>${a[1]}</span><span><i style="background:var(--ember)"></i>${b[1]}</span></div></div>
                <div class="col" style="gap:12px">${SK.map((s, i) => `<div><div class="row between" style="font-size:12px;margin-bottom:5px"><span class="mono" style="color:var(--violet)">${va[i]}</span><span class="muted">${s}</span><span class="mono" style="color:var(--ember)">${vb[i]}</span></div><div class="row" style="gap:3px"><div class="meter" style="flex:1;transform:scaleX(-1)"><i style="width:${va[i]}%"></i></div><div class="meter e" style="flex:1"><i style="width:${vb[i]}%"></i></div></div></div>`).join("")}</div>
              </div>
              <div class="row" style="gap:8px;justify-content:flex-end;flex-wrap:wrap"><button class="btn">${ic("id-card")}Open passports</button><button class="btn">${ic("bookmark-plus")}Add both to shortlist</button><button class="btn primary">${ic("send")}Invite ${a[1]} to trial</button></div>
            </div></section>
        </div>
      </div><style>@media (max-width:760px){#cmpGrid{grid-template-columns:1fr !important}}</style>`;
    },
    mount(root) { root.querySelectorAll("[data-cmp]").forEach((r) => (r.onclick = () => { const i = +r.dataset.cmp; if (cmp.has(i)) { if (cmp.size > 1) cmp.delete(i); } else { if (cmp.size >= 2) cmp.delete([...cmp][0]); cmp.add(i); } rerender(); })); },
  });

  /* =============== TEAM & CLUB =============== */
  let teamTab = "Overview";
  S.push({
    id: "team", part: "Part 7 · Team & Club", title: "Team & Club", kind: "app", nav: "team", crumbs: ["Network", "Team & Club"],
    render() {
      const roster = [["Yara Hamami", "NYX", "Duelist", 96, "c"], ["Khalid Asiri", "KAIRO", "Controller", 92, ""], ["Ziyad Qahtani", "ZETA", "Initiator", 88, ""], ["Rayan Malki", "RYN", "Sentinel", 86, ""], ["Saud Hakami", "HKM", "Flex", 83, "sub"]];
      return `<div class="page fade-in">
        <section class="card" style="overflow:hidden">
          <div style="position:absolute;inset:0;pointer-events:none;opacity:.6">${orbit({ w: 1400, h: 240, op: 0.5 })}</div>
          <div class="card-b row wrap" style="gap:22px;padding:22px;position:relative">
            ${K.clubAv("TF", 76, "lg")}
            <div style="flex:1;min-width:220px"><span class="eyebrow" data-noi18n>${K.isAr ? "نادٍ · الرياض · تأسس 2017" : "Club · Riyadh · est. 2017"}</span><h1 class="h1" style="margin-top:4px" data-noi18n>Team Falcons</h1><div class="row wrap" style="gap:6px;margin-top:8px"><span class="tag" style="background:color-mix(in srgb,#FA4454 14%,transparent);color:#FA4454">${K.brand("valorant", 12, "#FA4454")}Valorant</span><span class="tag" data-noi18n>${ic("trophy")}${K.isAr ? "بطل أندية EWC" : "EWC Club Champion"}</span><span class="tag m">${ic("badge-check")}Verified club</span></div></div>
            <div class="row hide-m" style="gap:0">${(K.isAr ? [["بطل الأندية", "2024 · 2025"], ["بطولات EWC 2026", "18"], ["تأسس", "2017"]] : [["Club champion", "2024 · 2025"], ["EWC 2026 events", "18"], ["Founded", "2017"]]).map(([a, b], i) => `<div style="padding:0 22px;${i ? "border-inline-start:1px solid var(--line)" : ""}"><div class="eyebrow" style="font-size:10px">${a}</div><b class="wide num" style="font-size:24px">${b}</b></div>`).join("")}</div>
            <button class="btn">${ic("settings-2")}Club settings</button>
          </div>
          <div style="padding:0 22px" class="tabs">${["Overview", "Roster", "Analysis", "Matches", "Training", "Strategy"].map((t) => `<button class="${teamTab === t ? "on" : ""}" data-tt="${t}">${t}</button>`).join("")}</div>
        </section>
        <div class="grid g-12 fade-in">
          <section class="card c-4 r-12"><div class="card-h"><span class="h3">${ic("gauge")}Team score</span><span class="r"><span class="select" style="height:30px;font-size:12px">30 days${ic("chevron-down")}</span></span></div>
            <div class="card-b row" style="gap:18px">${ring(89, { size: 116, stroke: 9, label: "89", sub: "+6 PTS" })}<div class="col" style="gap:10px;flex:1">${[["Teamwork", 92], ["Comms", 88], ["Consistency", 87], ["Strategy", 85], ["Adaptability", 84]].map(([a, p]) => `<div><div class="row between" style="font-size:12px"><span>${a}</span><span class="mono faint">${p}</span></div><div class="meter thin" style="margin-top:4px"><i style="width:${p}%"></i></div></div>`).join("")}</div></div></section>
          <section class="card c-5 r-12"><div class="card-h"><span class="h3">${ic("trending-up")}Win rate trend</span></div>
            <div class="card-b">${lines([{ data: [54, 58, 57, 61, 63, 62, 66, 68], area: true, dots: true }], ["Sep 14", "Sep 21", "Sep 28", "Oct 5", "Oct 12", "Oct 19", "Oct 26", "Nov 2"], { w: 520, h: 210, min: 50, max: 70, ticks: 4, unit: "%" })}</div></section>
          <section class="card c-3 r-12"><div class="card-h"><span class="h3">${ic("calendar")}Next up</span></div>
            <div class="card-b col" style="gap:10px">${[["Sat 8", "21:00", "vs Najd Vipers", "Premier · Bind", "e"], ["Mon 10", "19:00", "Team scrim", "Haven · Lotus", "s"], ["Wed 12", "20:00", "VOD review", "with Coach Reem", "m"]].map(([d, t, n, s, c]) => `<div class="drill ${c}" style="font-size:12.5px;padding:10px"><div class="row between"><span>${n}</span><span class="mono faint" style="font-size:10.5px">${d} · ${t}</span></div><span>${s}</span></div>`).join("")}</div></section>
          <section class="card c-7 r-12"><div class="card-h"><span class="h3">${ic("users")}Roster</span><span class="r"><button class="btn sm">${ic("user-plus")}Invite</button></span></div>
            <div class="card-b table-wrap" style="padding-top:6px"><table class="table"><thead><tr><th>Player</th><th>Role</th><th>Form</th><th style="width:28%">Score</th><th class="r hide-m">Readiness</th></tr></thead><tbody>${roster.map(([n, t, r, s, x], i) => `<tr><td><div class="row" style="gap:10px">${av(n, "sm", i)}<div><b>${t}</b> ${x === "c" ? `<span class="tag v mono" style="height:18px;font-size:9.5px">IGL</span>` : x === "sub" ? `<span class="tag mono" style="height:18px;font-size:9.5px">SUB</span>` : ""}<div class="faint" style="font-size:11.5px">${n}</div></div></div></td><td>${r}</td><td><span class="form">${"WWLWW,WLWWL,WWWLW,LWWLW,WLLWW".split(",")[i].split("").map((c) => `<i class="${c === "L" ? "l" : ""}"></i>`).join("")}</span></td><td><div class="row" style="gap:10px"><div class="meter" style="flex:1"><i style="width:${s}%"></i></div><b class="num" style="width:24px">${s}</b></div></td><td class="r hide-m"><span class="tag ${[74, 81, 62, 88, 70][i] > 70 ? "m" : "a"} mono">${[74, 81, 62, 88, 70][i]}</span></td></tr>`).join("")}</tbody></table></div></section>
          <section class="card c-5 r-12"><div class="card-h"><span class="h3">${ic("sparkles")}Key insights</span></div>
            <div class="card-b col" style="gap:10px">${[["arrow-up-right", "var(--mint)", "Trades within 2 s are up 14%", "Spacing on retakes has clearly improved."], ["triangle-alert", "var(--ember)", "Post-plant losses on B sites", "6 of 9 losses this month came after planting B."], ["message-circle", "var(--sky)", "Comms load is uneven", "NYX and KAIRO make 71% of calls. Spread it out."]].map(([i, c, t, d]) => `<div class="row" style="gap:12px;align-items:flex-start;padding:12px;border:1px solid var(--line);border-radius:12px"><span class="kind" style="width:30px;height:30px;border-radius:8px;display:grid;place-items:center;flex:none;background:color-mix(in srgb,${c} 15%,transparent);color:${c}">${ic(i, "i-sm")}</span><div><b style="font-size:13px">${t}</b><div class="faint" style="font-size:12px;margin-top:2px">${d}</div></div></div>`).join("")}
            <button class="btn primary" style="margin-top:4px">${ic("calendar-plus")}Create team training plan</button></div></section>
        </div>
      </div>`;
    },
    mount(root) { root.querySelectorAll("[data-tt]").forEach((b) => (b.onclick = () => { teamTab = b.dataset.tt; rerender(); })); },
  });

  /* =============== COACH EXPERIENCE =============== */
  S.push({
    id: "coachhub", part: "Part 7 · Team & Club", title: "Coach experience", kind: "app", role: "coach", nav: "coachhub", crumbs: ["Coaching", "Coach Hub"],
    render() {
      const players = [["Yara Hamami", "NYX", 82, 4, "Decision timing", "e"], ["Khalid Asiri", "KAIRO", 79, 2, "On track", "m"], ["Ziyad Qahtani", "ZETA", 74, -3, "Low readiness 3 days", "a"], ["Rayan Malki", "RYN", 77, 5, "On track", "m"], ["Saud Hakami", "HKM", 71, 1, "Missed 2 sessions", "r"]];
      return `<div class="page fade-in">
        ${head("Coach Hub · Sunday 8 November", "Good evening, Reem.", "6 replays waiting for review and 2 sessions today.", `<a class="btn" href="#/coach-sessions">${ic("calendar-plus")}New session</a><a class="btn primary" href="#/coach-plans">${ic("clipboard-plus")}Assign plan</a>`)}
        <div class="grid g-12">
          ${[["users", "Active players", "14", "+2 this month"], ["film", "Reviews pending", "6", "Oldest: 2 days"], ["calendar-check", "Sessions this week", "11", "3 remaining"], ["star", "Avg. rating", "4.9", "126 reviews"]].map(([i, l, v, s]) => `<section class="card c-3 r-6"><div class="kpi"><div class="top">${ic(i)}<span class="eyebrow">${l}</span></div><div class="val">${v}</div><span class="muted" style="font-size:12px">${s}</span></div></section>`).join("")}
          <section class="card c-7 r-12"><div class="card-h"><span class="h3">${ic("users")}My players</span><span class="r"><div class="seg"><button class="on">All</button><button>Needs attention <span class="mono" style="color:var(--ember)">3</span></button></div></span></div>
            <div class="card-b table-wrap" style="padding-top:6px"><table class="table"><thead><tr><th>Player</th><th>Score</th><th class="hide-m">7-day</th><th>Status</th><th></th></tr></thead><tbody>${players.map(([n, t, s, d, st, c], i) => `<tr><td><div class="row" style="gap:10px">${av(n, "sm", i)}<div><b>${t}</b><div class="faint" style="font-size:11.5px">${n}</div></div></div></td><td><b class="num wide" style="font-size:16px">${s}</b> ${delta(d)}</td><td class="hide-m">${spark([s - 6, s - 4, s - 5, s - 2, s - 3, s - 1, s].map((v, k) => v + (d < 0 ? (6 - k) : 0)), { w: 90, h: 26, color: d < 0 ? "var(--rose)" : "var(--violet)" })}</td><td><span class="tag ${c}">${st}</span></td><td class="r"><button class="btn sm ghost">${ic("message-square")}</button></td></tr>`).join("")}</tbody></table></div></section>
          <section class="card c-5 r-12"><div class="card-h"><span class="h3">${ic("calendar-days")}Today</span><span class="r mono faint" style="font-size:11px">SUN 8 NOV</span></div>
            <div class="card-b" style="position:relative">${[["17:00", "", "Free", "", ""], ["18:00", "NYX", "Entry timing review", "45 min · Video call", "e"], ["19:00", "", "Free", "", ""], ["20:00", "Team", "Falcons VOD", "60 min · Discord", "v"], ["21:00", "", "Premier match (watch)", "Bind", "s"]].map(([t, w, n, s, c]) => `<div class="row" style="gap:12px;align-items:stretch;min-height:56px;border-top:1px solid var(--line)"><span class="mono faint" style="font-size:11px;width:40px;padding-top:8px">${t}</span>${w ? `<div class="drill ${c === "v" ? "" : c}" style="flex:1;margin:6px 0;font-size:12.5px"><div class="row between"><span>${n}</span><span class="mono" style="font-size:10px">${w}</span></div><span>${s}</span></div>` : `<span class="faint" style="font-size:12px;padding-top:8px">${n === "Free" ? "" : n}</span>`}</div>`).join("")}</div></section>
          <section class="card c-12"><div class="card-h"><span class="h3">${ic("film")}Review queue</span><span class="r"><span class="tag e mono">6 PENDING</span></span></div>
            <div class="card-b grid" style="grid-template-columns:repeat(3,minmax(0,1fr));gap:12px" id="rqGrid">${[["NYX", "Bind · 8–13", "3 AI-flagged mistakes", "2d"], ["ZETA", "Lotus · 11–13", "Asked: \"why do we lose B retakes?\"", "1d"], ["KAIRO", "Haven · 13–10", "Smoke timing check", "5h"]].map(([p, m, d, t], i) => `<div class="card sunk" style="overflow:hidden"><div style="height:120px;position:relative;background:#0F0C18">${K.map().replace('width="100%" height="100%"', 'width="100%" height="120"')}<span class="tag mono" style="position:absolute;top:10px;left:10px;background:rgba(255,255,255,.1);color:#EDEAF4">${t} AGO</span></div><div style="padding:14px" class="col"><div class="row between"><b class="row" style="gap:8px">${K.game("VAL", 22, 6)}${p} · ${m}</b>${av(["Yara Hamami", "Ziyad Qahtani", "Khalid Asiri"][i], "sm", [0, 2, 1][i])}</div><span class="faint" style="font-size:12.5px">${d}</span><div class="row" style="gap:6px"><a class="btn primary sm" href="#/coach-review" style="flex:1">${ic("play")}Start review</a><button class="btn sm">${ic("clock")}Later</button></div></div></div>`).join("")}</div></section>
        </div>
      </div><style>@media (max-width:1080px){#rqGrid{grid-template-columns:1fr !important}}</style>`;
    },
  });

  /* =============== DESIGN SYSTEM =============== */
  S.push({
    id: "system", part: "Part 8 · Mobile & System", title: "Design system", kind: "full",
    render() {
      const sw = (n, v, hexL, hexD) => `<div class="swatch"><div class="c" style="background:var(${v})"></div><div class="m"><b>${n}</b><span>${v}</span><span>${hexL} / ${hexD}</span></div></div>`;
      const icons = ["layout-dashboard", "activity", "swords", "heart-pulse", "graduation-cap", "id-card", "radar", "shield", "film", "crosshair", "target", "trophy", "brain", "sparkles", "gauge", "hexagon", "users", "calendar-days", "bell", "search", "settings-2", "share-2", "badge-check", "triangle-alert"];
      return `<div class="canvas" style="max-width:1280px;margin:0 auto;width:100%">
        <div class="canvas-head" style="padding:0"><div><span class="eyebrow">SETA Interface System · v2</span><h1 class="h1" style="margin-top:8px;font-size:44px">Design system</h1><p>The rules behind every screen. One accent, a calm neutral base, and the 18° cut from the wordmark used as the only decoration.</p></div><div class="row" style="margin-inline-start: auto;gap:8px">${K.themeSwitch()}<a class="btn primary" href="#/landing">View screens ${ic("arrow-right")}</a></div></div>

        <section class="grid g-12">
          <div class="card c-7 r-12" style="padding:40px;display:grid;place-items:center;min-height:300px">${logo(150)}</div>
          <div class="card c-5 r-12" style="padding:40px;display:grid;place-items:center;background:#120D1F;border-color:#2A2245">${K.logo(120, "on-ink")}</div>
          <div class="card c-4 r-12" style="padding:22px" ><span class="eyebrow">Wordmark</span><div style="margin-top:18px">${wm(28)}</div><p class="faint" style="font-size:12.5px;margin:14px 0 0">Compact version for navigation and small sizes. Minimum height 14px.</p></div>
          <div class="card c-4 r-12" style="padding:22px"><span class="eyebrow">Brand glyph</span><div class="row" style="gap:14px;margin-top:14px;color:var(--violet)">${star(36)}${star(22)}${star(14)}</div><p class="faint" style="font-size:12.5px;margin:14px 0 0">The four-point star from the A. Used for the AI coach, collapsed nav and highlights.</p></div>
          <div class="card c-4 r-12" style="padding:22px"><span class="eyebrow">The 18° cut</span><div class="row" style="gap:12px;margin-top:14px"><span class="btn primary">Primary</span><span class="tag v">Tag</span><span class="res w">W</span><span class="form"><i></i><i></i><i class="l"></i></span></div><p class="faint" style="font-size:12.5px;margin:14px 0 0">Taken from the letter cuts. Only on primary buttons, tags and results. Never on cards.</p></div>
        </section>

        <section class="col" style="gap:14px"><div class="row between"><h2 class="h2">Color</h2><span class="faint" style="font-size:12.5px">Switch the theme to see both palettes</span></div>
          <span class="eyebrow">Neutrals</span>
          <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px">${[["Background", "--bg", "#F2F0EA", "#0E0C13"], ["Surface", "--surface", "#FBFAF6", "#15121C"], ["Surface 2", "--surface-2", "#F4F2EC", "#1B1824"], ["Line", "--line", "#E1DDD3", "#27232F"], ["Text", "--text", "#1B1726", "#EDEAF4"], ["Text 2", "--text-2", "#565064", "#A7A0B6"]].map((x) => sw(...x)).join("")}</div>
          <span class="eyebrow" style="margin-top:6px">Brand & signal</span>
          <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px">${[["Violet · brand", "--violet", "#5A2FCF", "#9677FF"], ["Ink · logo", "--ink", "#241046", "#F3F0FB"], ["Ember · focus", "--ember", "#D9531E", "#FF8550"], ["Mint · positive", "--mint", "#12895F", "#45D6A2"], ["Rose · negative", "--rose", "#C9374F", "#FF6B81"], ["Sky · body data", "--sky", "#1F78B4", "#63C3FF"], ["Amber · caution", "--amber", "#A86B00", "#F2BC4B"]].map((x) => sw(...x)).join("")}</div>
        </section>

        <section class="grid g-12">
          <div class="card c-7 r-12" style="padding:24px"><span class="eyebrow">Typography · Archivo + IBM Plex Mono</span>
            <div class="col" style="gap:14px;margin-top:18px">
              <div class="row between" style="align-items:baseline;border-bottom:1px solid var(--line);padding-bottom:12px"><span class="wide" style="font-size:56px;font-weight:680;line-height:1;letter-spacing:-.035em">Talent is data</span><span class="mono faint" style="font-size:11px">DISPLAY 56 · 125%</span></div>
              <div class="row between" style="align-items:baseline;border-bottom:1px solid var(--line);padding-bottom:12px"><span class="h1">Where your game stands</span><span class="mono faint" style="font-size:11px">H1 30 · 116%</span></div>
              <div class="row between" style="align-items:baseline;border-bottom:1px solid var(--line);padding-bottom:12px"><span class="h2">Skill breakdown</span><span class="mono faint" style="font-size:11px">H2 20 · 112%</span></div>
              <div class="row between" style="align-items:baseline;border-bottom:1px solid var(--line);padding-bottom:12px"><span>Six skills from 40 matches, compared with your tier.</span><span class="mono faint" style="font-size:11px">BODY 14 · 100%</span></div>
              <div class="row between" style="align-items:baseline"><span class="eyebrow" style="color:var(--text-2)">Recent matches · 82 · ST-10427</span><span class="mono faint" style="font-size:11px">LABEL 11 MONO</span></div>
            </div></div>
          <div class="card c-5 r-12" style="padding:24px"><span class="eyebrow">Numbers</span><div class="col" style="gap:8px;margin-top:18px"><span class="wide num" style="font-size:72px;font-weight:650;line-height:.95;letter-spacing:-.03em">82<span style="color:var(--text-3);font-size:28px">/100</span></span><p class="muted" style="margin:0;font-size:13px">Tabular figures everywhere, so columns line up and live values don’t jump. Wide width for headline numbers, to echo the wordmark.</p><div class="row" style="gap:8px;margin-top:8px">${delta(12, "%")}${delta(-6, "%")}<span class="tag v mono">TOP 18%</span></div></div></div>
        </section>

        <section class="grid g-12">
          <div class="card c-6 r-12" style="padding:24px"><span class="eyebrow">Controls</span>
            <div class="col" style="gap:16px;margin-top:18px">
              <div class="row wrap" style="gap:8px"><button class="btn primary">${ic("play")}Primary</button><button class="btn">Secondary</button><button class="btn ink">Ink</button><button class="btn ghost">Ghost</button><button class="btn sm">Small</button></div>
              <div class="row wrap" style="gap:8px"><div class="seg"><button class="on">7D</button><button>30D</button><button>90D</button></div><span class="select"><span class="k">Game</span>Valorant${ic("chevron-down")}</span><button class="switch on"></button><span class="check on">${ic("check")}</span><span class="radio on"></span></div>
              <div class="row wrap" style="gap:6px"><span class="tag v">Violet</span><span class="tag e">Ember</span><span class="tag m">Mint</span><span class="tag r">Rose</span><span class="tag s">Sky</span><span class="tag a">Amber</span><span class="chip on">${ic("check")}Selected</span><span class="chip">${ic("plus")}Chip</span></div>
              <div class="input">${ic("search")}<input placeholder="Input with icon"><span class="kbd">Ctrl K</span></div>
            </div></div>
          <div class="card c-6 r-12" style="padding:24px"><span class="eyebrow">Icons · Lucide, 1.6 stroke, no emoji</span>
            <div class="grid" style="grid-template-columns:repeat(8,1fr);gap:8px;margin-top:18px">${icons.map((i) => `<div title="${i}" style="aspect-ratio:1;border:1px solid var(--line);border-radius:10px;display:grid;place-items:center;color:var(--text-2)">${ic(i)}</div>`).join("")}</div></div>
        </section>

        <section class="card" style="padding:24px" data-noi18n dir="rtl" lang="ar" id="arType">
          <div class="row between wrap" style="gap:12px"><span class="eyebrow" style="font-family:var(--font-ui)">الطباعة العربية · خط ثمانية</span><span class="tag v mono">THMANYAH · RTL</span></div>
          <div class="k-sample" id="kDemo" style="font-size:clamp(40px,6vw,84px);margin:18px 0 6px">خط حي يجمّل أي شيء يكتبه</div>
          <div class="row wrap" style="gap:16px;align-items:center">
            <label class="row" style="gap:10px;font-size:13px;font-family:var(--font-ui)">الكشيدة <input type="range" min="0" max="3" value="1" id="kRange" style="accent-color:var(--violet);width:160px"><b class="num" id="kVal">1</b></label>
            <div class="row wrap" style="gap:6px" id="kFeats">${[["salt", "الأحرف المرسلة"], ["ss01", "ss01"], ["ss03", "الفتحة الممتدة 1"], ["ss04", "الفتحة الممتدة 2"], ["dlig", "ربطات"]].map(([f, l], i) => `<button class="chip ${i === 0 ? "on" : ""}" data-h data-feat="${f}" style="height:28px;font-size:12px;font-family:var(--font-ui)">${l}</button>`).join("")}</div>
          </div>
          <div class="grid" style="grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:20px" id="arFaces">
            ${[["Thmanyah Serif Display", "var(--font-display)", "للعناوين الكبيرة", "مركز القيادة"], ["Thmanyah Sans", "var(--font-ui)", "للواجهة والأزرار", "ابدأ الجلسة الآن"], ["Thmanyah Serif Text", "var(--font-read)", "للنصوص الطويلة", "التصويب هو الأفضل لك هذا الشهر."]].map(([n, f, d, ex]) => `<div class="card sunk" style="padding:16px"><div class="mono faint" style="font-size:10.5px;direction:ltr;text-align:start">${n}</div><div style="font-family:${f};font-size:24px;font-weight:700;margin:10px 0 4px;line-height:1.4">${ex}</div><div class="faint" style="font-size:12px;font-family:var(--font-ui)">${d}</div><div class="row" style="gap:10px;margin-top:10px;font-family:${f};font-size:18px">${[300, 400, 500, 700, 900].map((w) => `<span style="font-weight:${w}">أ</span>`).join("")}</div></div>`).join("")}
          </div>
          <div class="k-rules" style="font-family:var(--font-ui)">${[["ok", "الكشيدة المائلة", "بين الحرف الأخير وما يسبقه فقط (آخر موضع اتصال في الكلمة)."], ["no", "لا تتكرر", "لا تُستخدم أكثر من مرة في الكلمة الواحدة."], ["no", "لا تُمدّ لأقصاها", "الحد الأقصى هنا 3 وحدات."], ["no", "الأحرف المرسلة", "لا تُستخدم بكثرة في الجملة، ولا في كلمتين متجاورتين."]].map(([c, t, d]) => `<div><b class="${c}">${c === "ok" ? "✓" : "✕"}</b><span><b>${t}</b> — ${d}</span></div>`).join("")}</div>
          <p class="faint" style="font-size:12px;margin:14px 0 0;font-family:var(--font-ui)">المرجع: دليل جماليات خط ثمانية. يُعرض خط ثمانية من الخطوط المثبّتة على جهازك وفق ترخيصه. الزوّار الآخرون يرون بديلًا مفتوح الترخيص (IBM Plex Sans Arabic وNoto Naskh Arabic).</p>
        </section>
        <section class="card" style="padding:24px"><span class="eyebrow">Principles</span>
          <div class="grid" style="grid-template-columns:repeat(4,minmax(0,1fr));gap:24px;margin-top:18px" id="prGrid">${[["01", "Quiet base, one voice", "Neutrals do the work. Violet marks the one thing to look at."], ["02", "Numbers first", "Every card leads with its number. Charts support it, never replace it."], ["03", "Honest data", "Show the sample size and the comparison. BioSync never implies cause."], ["04", "Easy on the eyes", "Warm paper in light mode, ink (not black) in dark. Contrast AA or better."]].map(([n, t, d]) => `<div><span class="mono" style="color:var(--violet);font-size:11px">${n}</span><h3 class="h3" style="margin:8px 0 6px">${t}</h3><p class="faint" style="margin:0;font-size:13px">${d}</p></div>`).join("")}</div></section>
      </div><style>@media (max-width:760px){#prGrid{grid-template-columns:1fr 1fr !important}#arFaces{grid-template-columns:1fr !important}}</style>`;
    },
    mount(root) {
      const demo = root.querySelector("#kDemo"), range = root.querySelector("#kRange"), val = root.querySelector("#kVal");
      if (!demo) return;
      const base = demo.textContent;
      const feats = new Set(["salt"]);
      const paint = () => { const n = +range.value; val.textContent = n; const words = (n ? K.kashida(base, n, 1) : base).split(" "); const ki = words.findIndex((w) => w.includes("ـ")); const si = feats.has("salt") ? words.map((w, i) => i).filter((i) => Math.abs(i - (ki < 0 ? -9 : ki)) >= 2).pop() : -1; demo.innerHTML = words.map((w, i) => (i === si ? `<span style="font-feature-settings:'salt' 1">${w}</span>` : w)).join(" "); demo.style.fontFeatureSettings = [...feats].filter((f) => f !== "salt").map((f) => `"${f}" 1`).join(", ") || "normal"; };
      range.oninput = paint;
      root.querySelectorAll("[data-feat]").forEach((b) => (b.onclick = () => { const f = b.dataset.feat; feats.has(f) ? feats.delete(f) : feats.add(f); b.classList.toggle("on", feats.has(f)); paint(); }));
      paint();
    },
  });
})();
