/* PART 9 — Watch app + linking a watch */
(function () {
  const { ic, star, av, ring, lines } = K;
  const S = (window.SCREENS = window.SCREENS || []);
  const PART = "Part 9 · Watch";
  const W = (inner, round = false) => `<div class="watch ${round ? "round" : ""}"><div class="ws">${inner}</div></div>`;
  K.watch = W;
  const cap = (code, t) => `<div class="caption"><span class="mono">${code}</span>${t}</div>`;
  const wring = (pct, o) => ring(pct, { track: "#1E1B25", ...o }).replace(/fill:var\(--text\)/g, "fill:#F4F2F8").replace(/fill:var\(--text-3\)/g, "fill:#8A8396").replace(/var\(--surface\)/g, "#000");
  const top = (t = "9:41", app = "SETA") => `<div class="w-top"><span class="app">${star(10, "#B29BFF")}${app}</span><span>${t}</span></div>`;
  const hrPath = (data, w = 170, h = 44, color = "#FF6B81") => lines([{ data, color, area: true, width: 1.8 }], Array(data.length).fill(""), { w, h, min: Math.min(...data) - 6, max: Math.max(...data) + 4, ticks: 1, padL: 0, padB: 0, padT: 2, padR: 4 }).replace(/<text[^>]*>[^<]*<\/text>/g, "").replace(/<g class="grid">.*?<\/g>/, "").replace(/var\(--surface\)/g, "#000");

  /* =============== WATCH APP =============== */
  S.push({
    id: "watch", part: PART, title: "Watch app", kind: "full",
    render() {
      const face = `<div style="display:flex;flex-direction:column;height:100%;gap:4px">
          <div class="row between" style="font-size:10.5px;color:#8A8396"><span>SUN 8</span><span class="row" style="gap:3px;color:#45D6A2">${ic("heart", "i-sm")}58</span></div>
          <div class="w-big" style="font-size:58px;text-align: start;letter-spacing:-.04em">9:41</div>
          <div class="row" style="gap:6px;margin-top:auto">
            <div style="position:relative;width:52px;height:52px">${wring(74, { size: 52, stroke: 5, color: "#45D6A2", label: "74" })}</div>
            <div style="flex:1;background:#14121A;border-radius:14px;padding:7px 9px"><div class="w-lbl" style="color:#B29BFF">${star(8, "#B29BFF")} Next</div><div class="row" style="gap:4px;font-weight:650;font-size:11.5px;line-height:1.2;margin-top:2px">${K.brand("valorant", 10, "#FA4454")}Premier · Bind</div><div style="font-size:10.5px;color:#8A8396">21:00</div></div>
          </div></div>`;
      const ready = `${top()}<div class="row" style="gap:10px;margin-top:2px"><div style="width:72px;height:72px">${wring(74, { size: 72, stroke: 7, color: "#45D6A2", label: "74" })}</div><div><div class="w-lbl">Readiness</div><div style="font-weight:650;font-size:13px;line-height:1.2;margin-top:2px">Good day for ranked</div></div></div>
          <div class="grid" style="grid-template-columns:1fr 1fr;gap:6px;margin-top:auto">${[["moon", "7h40", "#9677FF"], ["activity", "68 ms", "#63C3FF"]].map(([i, v, c]) => `<div style="background:#14121A;border-radius:12px;padding:7px 8px" class="row"><span style="color:${c}">${ic(i, "i-sm")}</span><b style="font-size:12px">${v}</b></div>`).join("")}</div>`;
      const live = `<div class="w-top"><span class="app" style="color:#FF8550"><span class="dot live" style="width:6px;height:6px"></span>Session</span><span>1:42</span></div>
          <div class="row" style="align-items:baseline;gap:4px;margin-top:2px"><span class="w-big" style="color:#FF6B81">128</span><span style="font-size:11px;color:#8A8396">bpm</span></div>
          <div class="row" style="gap:2px;height:5px">${["#45D6A2", "#45D6A2", "#F2BC4B", "#F2BC4B", "#FF8550", "#1E1B25"].map((c, i) => `<i style="flex:1;border-radius:2px;background:${c};${i === 4 ? "outline:1.5px solid #fff;outline-offset:1px" : ""}"></i>`).join("")}</div>
          <div style="margin:2px -4px 0">${hrPath([96, 110, 122, 131, 120, 104, 112, 124, 133, 128], 160, 40)}</div>
          <div class="row between" style="margin-top:auto;font-size:11px"><span class="w-pill">${ic("swords")}3 · 2W</span><span class="w-pill" style="color:#F2BC4B">${ic("coffee")}12m</span></div>`;
      const breathe = `${top("Between matches", "Reset")}<div style="flex:1;display:grid;place-items:center;position:relative">
            <svg width="118" height="118" viewBox="0 0 118 118"><circle cx="59" cy="59" r="54" fill="none" stroke="#1E1B25" stroke-width="2"/><circle cx="59" cy="59" r="42" fill="#9677FF" fill-opacity=".12"/><circle cx="59" cy="59" r="30" fill="#9677FF" fill-opacity=".22"/><circle cx="59" cy="59" r="54" fill="none" stroke="#9677FF" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="220 400" transform="rotate(-90 59 59)"/></svg>
            <div style="position:absolute;text-align:center"><div style="font-weight:650;font-size:14px">Breathe in</div><div class="w-lbl" style="margin-top:2px">4 · 4 · 6</div></div></div>
          <div class="row between" style="font-size:11px;color:#8A8396"><span>0:22 left</span><span class="row" style="gap:3px;color:#45D6A2">${ic("heart", "i-sm")}128 → 102</span></div>`;
      const nudge = `${top()}<span style="width:40px;height:40px;border-radius:12px;background:#352A15;color:#F2BC4B;display:grid;place-items:center;margin-top:4px">${ic("coffee")}</span>
          <div style="font-weight:650;font-size:15px;line-height:1.2">2h 50m played.<br>Take 10?</div><div style="font-size:11px;color:#8A8396">Heart rate is recovering slower than usual.</div>
          <div class="grid" style="grid-template-columns:1fr 1fr;gap:6px;margin-top:auto"><span class="w-btn dim">Later</span><span class="w-btn" style="background:#F2BC4B">Break</span></div>`;
      const result = `${top("Haven", "Match")}<div class="row" style="gap:5px;font-size:10.5px;color:#8A8396;margin-top:2px">${K.brand("valorant", 11, "#FA4454")}Valorant · Competitive</div><div style="margin-top:4px"><span class="w-pill" style="background:#15302A;color:#45D6A2">Victory</span></div>
          <div class="w-big" style="font-size:46px;margin-top:2px">13–7</div>
          <div class="grid" style="grid-template-columns:1fr 1fr;gap:6px">${[["RR", "+18", "#45D6A2"], ["SETA", "+2", "#B29BFF"]].map(([a, b, c]) => `<div style="background:#14121A;border-radius:12px;padding:6px 8px"><div class="w-lbl">${a}</div><b style="color:${c};font-size:15px">${b}</b></div>`).join("")}</div>
          <span class="w-btn dim" style="margin-top:auto">${ic("smartphone")}Debrief on phone</span>`;
      const sleep = `${top("Tonight", "Recovery")}<div class="w-lbl" style="margin-top:4px">Wind down at</div><div class="w-big" style="font-size:44px">23:30</div>
          <div style="font-size:11.5px;color:#C9C3D6;line-height:1.35">Premier tomorrow at 21:00. Aim for 8 hours.</div>
          <div class="row" style="height:28px;gap:2px;align-items:flex-end;margin-top:auto">${"DLLRDDLLRRLLDLLRRRLA".split("").map((s) => `<i style="flex:1;border-radius:2px;height:${{ D: 35, L: 60, R: 85, A: 100 }[s]}%;background:${{ D: "#9677FF", L: "#4B3F78", R: "#63C3FF", A: "#F2BC4B" }[s]}"></i>`).join("")}</div>`;
      const pair = `${top("Setup", "Pair")}<div style="margin-top:6px;font-weight:650;font-size:14px;line-height:1.2">Enter this code<br>in SETA on your phone</div>
          <div class="row" style="gap:4px;justify-content:center;margin-top:auto">${"482913".split("").map((d, i) => `<b style="width:24px;height:32px;border-radius:7px;background:#1E1B25;display:grid;place-items:center;font-size:17px;font-stretch:118%;${i === 2 ? "margin-inline-end:6px" : ""}">${d}</b>`).join("")}</div>
          <div class="w-lbl" style="text-align:center;margin-top:6px">Expires in 4:52</div>`;
      const rReady = `<div class="w-lbl">SETA · Readiness</div><div style="width:96px;height:96px;margin:6px 0">${wring(74, { size: 96, stroke: 8, color: "#45D6A2", label: "74" })}</div><div style="font-size:11.5px;font-weight:600">Good for ranked</div>`;
      const rLive = `<div class="w-lbl" style="color:#FF8550">● Session 1:42</div><div class="row" style="gap:4px;align-items:baseline;margin-top:6px"><span class="w-big" style="color:#FF6B81;font-size:50px">128</span></div><div style="font-size:11px;color:#8A8396">bpm · zone 4</div><div style="width:140px;margin-top:6px">${hrPath([96, 110, 122, 131, 120, 104, 112, 124, 133, 128], 140, 30)}</div>`;
      return `<div class="canvas" style="gap:44px">
        ${K.mHead("SETA for watchOS & Wear OS", "The watch does the work while you play", "During a match you can’t look at your phone. The watch tracks your heart rate, tells you when to take a break, and helps you reset between games, with one glance or one haptic tap.", `<a class="btn" href="#/m-grow">${ic("arrow-left")} Mobile</a><a class="btn primary" href="#/pair">How to link a watch ${ic("arrow-right")}</a>`)}
        <section class="flow-row grid" style="grid-template-columns:repeat(4,minmax(0,1fr));gap:14px" id="wFeat">
          ${[["heart-pulse", "Live heart rate", "Recorded only while a session is running, then matched to each round."], ["coffee", "Break nudges", "A soft haptic when you’ve played long or recovery slows down."], ["wind", "30-second reset", "Guided breathing between matches to bring your heart rate down."], ["moon", "Sleep & readiness", "Last night’s sleep and HRV turn into a readiness score each morning."]].map(([i, t, d]) => `<div class="card" style="padding:18px"><span class="brand-tile" style="color:var(--violet)">${ic(i)}</span><b style="display:block;margin-top:12px">${t}</b><p class="faint" style="margin:4px 0 0;font-size:12.5px">${d}</p></div>`).join("")}
        </section>
        <section class="flow-row"><div class="row-h"><h2>Apple Watch</h2><p>watchOS app with a watch-face complication</p></div>
          <div class="watch-grid fade-in" style="justify-content:flex-start">
            ${[[face, "W1", "Face + complications"], [ready, "W2", "Morning readiness"], [live, "W3", "Session live"], [breathe, "W4", "Reset between matches"], [nudge, "W5", "Break nudge"], [result, "W6", "Match result"], [sleep, "W7", "Wind-down"], [pair, "W8", "Pairing code"]].map(([w, c, t]) => `<div>${W(w)}${cap(c, t)}</div>`).join("")}
          </div></section>
        <section class="flow-row"><div class="row-h"><h2>Wear OS</h2><p>Galaxy Watch and Pixel Watch, round layout</p></div>
          <div class="watch-grid" style="justify-content:flex-start"><div>${W(rReady, true)}${cap("R1", "Readiness tile")}</div><div>${W(rLive, true)}${cap("R2", "Session live")}</div></div></section>
      </div><style>@media (max-width:1080px){#wFeat{grid-template-columns:1fr 1fr !important}}@media (max-width:760px){#wFeat{grid-template-columns:1fr !important}}</style>`;
    },
  });

  /* =============== LINK A WATCH =============== */
  S.push({
    id: "pair", part: PART, title: "Linking a watch", kind: "full",
    render() {
      const P = K.phone, shot = K.mShot;
      const empty = `<div class="m-body">
          <div class="m-top">${ic("chevron-left")}<span style="font-weight:650">BioSync</span><span></span></div>
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:12px">
            <div style="position:relative;width:120px;height:120px;display:grid;place-items:center"><svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" fill="none" stroke="var(--line-2)" stroke-dasharray="3 5"/><circle cx="60" cy="60" r="40" fill="var(--violet-tint)"/></svg><span style="position:absolute;color:var(--violet)">${ic("watch", "i-lg")}</span></div>
            <h2 class="m-title" style="font-size:22px">No watch linked yet</h2><p class="m-sub" style="max-width:230px">Link a watch to see sleep, recovery and heart rate next to your matches.</p></div>
          <span class="m-btn" style="margin-bottom:30px">${ic("plus")}Link a watch</span></div>`;
      const devices = [["apple", "Apple Watch", "SETA app + Apple Health"], ["samsung", "Galaxy Watch", "SETA app + Health Connect"], ["wearos", "Pixel / Wear OS", "SETA app + Health Connect"], ["garmin", "Garmin", "Sign in to Garmin Connect"], ["fitbit", "Fitbit", "Sign in to Fitbit"], ["huawei", "Huawei Watch", "Huawei Health Kit"]];
      const choose = `<div class="m-body">
          <div class="m-top">${ic("x")}<div class="m-steps" style="width:120px"><i class="on"></i><i></i><i></i><i></i></div><span></span></div>
          <div><h2 class="m-title" style="font-size:24px">Which watch?</h2><p class="m-sub">We’ll show the right steps for it.</p></div>
          <div class="m-group">${devices.map(([k, n, d], i) => `<div class="m-row" style="${i === 0 ? "background:var(--violet-tint)" : ""}"><span class="brand-tile">${K.brand(k, 18)}</span><div class="grow"><b>${n}</b><div class="s">${d}</div></div>${i === 0 ? `<span class="radio on"></span>` : `<span class="radio"></span>`}</div>`).join("")}</div>
          <span class="m-btn" style="margin-top:auto;margin-bottom:30px">Continue ${ic("arrow-right")}</span></div>`;
      const perm = [["heart", "Heart rate", true], ["activity", "Heart rate variability", true], ["moon", "Sleep", true], ["heart-handshake", "Resting heart rate", true], ["footprints", "Steps", false]];
      const perms = `<div class="m-body">
          <div class="m-top">${ic("chevron-left")}<div class="m-steps" style="width:120px"><i class="on"></i><i class="on"></i><i></i><i></i></div><span></span></div>
          <div class="row" style="gap:10px"><span class="brand-tile">${K.brand("apple", 18)}</span><div><b>Apple Health</b><div class="faint" style="font-size:11.5px">SETA would like to read</div></div></div>
          <div class="m-group">${perm.map(([i, t, on]) => `<div class="m-row"><span style="color:var(--rose)">${ic(i, "i-sm")}</span><span class="grow">${t}</span><span class="switch ${on ? "on" : ""}"></span></div>`).join("")}</div>
          <div class="m-card" style="display:flex;gap:10px;background:var(--surface-2);padding:12px"><span style="color:var(--mint)">${ic("lock", "i-sm")}</span><span class="muted" style="font-size:11.5px">Read only. SETA never writes to Health, and never reads location or medical records.</span></div>
          <span class="m-btn" style="margin-top:auto;margin-bottom:30px">Allow</span></div>`;
      const code = `<div class="m-body">
          <div class="m-top">${ic("chevron-left")}<div class="m-steps" style="width:120px"><i class="on"></i><i class="on"></i><i class="on"></i><i></i></div><span></span></div>
          <div><h2 class="m-title" style="font-size:24px">Open SETA on your watch</h2><p class="m-sub">It shows a 6-digit code. Type it here.</p></div>
          <div style="display:grid;place-items:center;padding:6px 0;transform:scale(.62);margin:-46px 0">${W(`${`<div class="w-top"><span class="app">${star(10, "#B29BFF")}Pair</span><span>9:41</span></div>`}<div style="margin-top:8px;font-weight:650;font-size:14px">Your code</div><div class="row" style="gap:4px;justify-content:center;margin-top:auto">${"482913".split("").map((d, i) => `<b style="width:24px;height:32px;border-radius:7px;background:#1E1B25;display:grid;place-items:center;font-size:17px;${i === 2 ? "margin-inline-end:6px" : ""}">${d}</b>`).join("")}</div><div class="w-lbl" style="text-align:center;margin-top:8px">4:52</div>`)}</div>
          <div class="code-box">${"4829".split("").map((d) => `<b>${d}</b>`).join("")}<b class="on"></b><b></b></div>
          <div class="row" style="gap:8px;justify-content:center;font-size:12px" class="faint"><span class="dot live" style="background:var(--violet);box-shadow:0 0 0 3px var(--violet-tint)"></span><span class="faint">Watch found nearby · Bluetooth</span></div>
          <span class="faint" style="font-size:11.5px;text-align:center;margin-top:auto;margin-bottom:30px">No code? Install SETA from the App Store on your watch.</span></div>`;
      const done = `<div class="m-body">
          <div class="m-top"><span></span><div class="m-steps" style="width:120px"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></div><span></span></div>
          <div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding-top:10px">
            <span style="width:64px;height:64px;border-radius:50%;background:var(--mint);color:#fff;display:grid;place-items:center">${ic("check", "i-lg")}</span>
            <h2 class="m-title" style="font-size:24px">Apple Watch linked</h2><p class="m-sub" style="margin:0">Importing the last 30 days now.</p></div>
          <div class="m-card col" style="gap:8px"><div class="row between" style="font-size:12px"><span class="muted">First sync</span><span class="mono faint">68%</span></div><div class="meter"><i style="width:68%;background:var(--mint)"></i></div><div class="faint" style="font-size:11px">Sleep ✓ · HRV ✓ · Heart rate…</div></div>
          <div class="m-group">${[["Start session when a match begins", "Detected from your Riot account", true], ["Break nudges on watch", "Soft haptic, no sound", true]].map(([t, d, on]) => `<div class="m-row"><div class="grow"><b style="font-size:12.5px">${t}</b><div class="s">${d}</div></div><span class="switch ${on ? "on" : ""}"></span></div>`).join("")}</div>
          <span class="m-btn" style="margin-top:auto;margin-bottom:30px">Done</span></div>`;
      const nodes = [
        ["watch", "1 · Watch", "Sensors record heart rate, HRV and sleep. During a session the SETA watch app samples heart rate every 5 s."],
        ["heart-pulse", "2 · Health platform", "Apple Health, Health Connect, Garmin Connect or Fitbit store the data on your account."],
        ["smartphone", "3 · SETA app", "Reads only the types you allowed, then uploads them with the session’s start and end time."],
        ["cloud", "4 · SETA cloud", "Lines heart rate up with Riot match timestamps, round by round. Shows up in BioSync on web and phone."],
      ];
      const wires = [["Bluetooth", "on device"], ["OS permission", "read only"], ["TLS 1.3", "encrypted"]];
      const table = [
        ["apple", "Apple Watch", "Install SETA on the watch, allow Apple Health on the phone, enter the pairing code", "Yes", "Every 5 s in session"],
        ["samsung", "Galaxy Watch", "Install SETA from Galaxy Store / Play, allow Health Connect, enter the code", "Yes", "Every 5 s in session"],
        ["wearos", "Pixel / Wear OS", "Same as Galaxy: SETA Wear OS app + Health Connect", "Yes", "Every 5 s in session"],
        ["garmin", "Garmin", "Sign in to Garmin Connect from SETA (OAuth). No watch app needed", "After sync", "When Garmin Connect syncs"],
        ["fitbit", "Fitbit", "Sign in to your Fitbit / Google account from SETA (OAuth)", "After sync", "When Fitbit syncs"],
        ["huawei", "Huawei Watch", "Allow Huawei Health Kit from SETA", "After sync", "When Huawei Health syncs"],
      ];
      return `<div class="canvas" style="gap:44px">
        ${K.mHead("BioSync · Device linking", "How a watch links to SETA", "Two ways to link. Apple, Galaxy and Pixel watches run a small SETA app and pair with a code, so they can stream heart rate during play. Garmin, Fitbit and Huawei link by signing in, and their data arrives after the watch syncs.", `<a class="btn" href="#/watch">${ic("arrow-left")} Watch app</a><a class="btn primary" href="#/apple-health">${K.brand("apple", 15)} Apple Health in detail ${ic("arrow-right")}</a>`)}
        <section class="flow-row"><div class="row-h"><h2>How the data travels</h2><p>From the sensor on your wrist to the BioSync chart</p></div>
          <div class="arch">${nodes.map(([i, t, d], k) => `<div class="node"><span class="ic2">${ic(i)}</span><b>${t}</b><p>${d}</p></div>${k < 3 ? `<div class="wire"><span>${wires[k][0]}</span><i class="ln"></i><span>${wires[k][1]}</span></div>` : ""}`).join("")}</div></section>
        ${K.mRow("Linking flow", "Apple Watch shown. About a minute.", shot(P(empty), "P1", "BioSync, empty") + shot(P(choose), "P2", "Choose watch") + shot(P(perms), "P3", "Health permissions") + shot(P(code), "P4", "Pairing code") + shot(P(done), "P5", "Linked"))}
        <section class="flow-row"><div class="row-h"><h2>Supported watches</h2><p>What linking looks like for each one</p></div>
          <div class="card table-wrap"><table class="table"><thead><tr><th>Watch</th><th>How it links</th><th>Live in a match</th><th>Heart rate updates</th></tr></thead><tbody>
            ${table.map(([k, n, h, l, f]) => `<tr style="cursor:default"><td><div class="row" style="gap:10px"><span class="brand-tile sm">${K.brand(k, 15)}</span><b>${n}</b></div></td><td style="white-space:normal;min-width:260px;color:var(--text-2)">${h}</td><td>${l === "Yes" ? `<span class="tag m">${ic("check")}Live</span>` : `<span class="tag">${l}</span>`}</td><td class="mono" style="font-size:12px;color:var(--text-2)">${f}</td></tr>`).join("")}
          </tbody></table></div></section>
        <section class="flow-row grid" style="grid-template-columns:repeat(3,minmax(0,1fr));gap:14px" id="pPriv">
          ${[["unlink", "Unlink any time", "Settings › Devices › Unlink. Imported body data is deleted within 24 hours."], ["users", "You choose who sees it", "Body data is private by default. Coaches only see it if you turn it on for them."], ["stethoscope", "Not a medical device", "BioSync shows patterns next to your matches. It never diagnoses or gives medical advice."]].map(([i, t, d]) => `<div class="card" style="padding:18px;display:flex;gap:12px"><span class="brand-tile" style="color:var(--violet)">${ic(i)}</span><div><b>${t}</b><p class="faint" style="margin:4px 0 0;font-size:12.5px">${d}</p></div></div>`).join("")}
        </section>
      </div><style>@media (max-width:1080px){#pPriv{grid-template-columns:1fr !important}}</style>`;
    },
  });

  /* keep the design system as the last screen */
  const i = S.findIndex((s) => s.id === "system");
  if (i > -1) { S.push(S.splice(i, 1)[0]); S[S.length - 1].part = "Design system"; }
})();
