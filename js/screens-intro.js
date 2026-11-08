/* PART 1 — Introduction & onboarding */
(function () {
  const { ic, wm, logo, star, orbit, av, spark, radar, ring, lines, qr } = K;
  const S = (window.SCREENS = window.SCREENS || []);
  const GAMES = Object.entries(K.GAME_META).map(([k, g]) => [k, g.name, g.genre, g.bg]);
  K.GAMES = GAMES;

  /* sign-in providers with official marks */
  K.ssoBlock = (compact = false) => `<div class="sso-wrap">
      <div class="sso">
        <button class="btn sso-btn" onclick="toast('Redirecting to Google…')">${K.brand("google", 18)}<span>${compact ? "Google" : "Continue with Google"}</span></button>
        <button class="btn sso-btn apple" onclick="toast('Redirecting to Apple…')">${K.brand("apple", 18)}<span>${compact ? "Apple" : "Continue with Apple"}</span></button>
      </div>
      <div class="sso-games">
        <span class="faint">${compact ? "Gaming ID" : "Or sign in with your gaming ID"}</span>
        <div class="row" style="gap:6px">${["riotgames", "steam", "discord", "playstation", "epicgames"].map((k) => `<button class="sso-ic" title="${K.BRANDS[k].name}" aria-label="Sign in with ${K.BRANDS[k].name}" onclick="toast('Linking ${K.BRANDS[k].name}…')">${K.brand(k, 18)}</button>`).join("")}</div>
      </div>
    </div>`;

  /* =============== 01 LANDING =============== */
  S.push({
    id: "landing", part: "Part 1 · Introduction", title: "Platform website", kind: "full",
    render() {
      const feats = [
        ["01", "gauge", "Command Center", "Every signal that matters, on one calm screen. Rearrange it your way.", K.spark([62, 64, 63, 68, 70, 69, 74, 78, 77, 82], { w: 260, h: 80 })],
        ["02", "film", "Replay Intelligence", "Key moments, mistakes and better lines, pinned to the exact second.", `<div class="scrub" style="height:80px"><div class="track" style="top:38px"></div><div class="fill" style="top:38px;width:62%"></div>${[12, 28, 41, 55, 73, 88].map((p, i) => `<i class="mk" style="left:${p}%;top:22px;background:${["var(--violet)", "var(--ember)", "var(--mint)", "var(--ember)", "var(--violet)", "var(--sky)"][i]}"></i>`).join("")}</div>`],
        ["03", "heart-pulse", "BioSync", "Recovery, sleep and heart rate next to your match times. Context, not diagnosis.", K.lines([{ data: [72, 74, 90, 118, 132, 126, 140, 121, 98, 84, 78], color: "var(--rose)", width: 1.6, end: false }], Array(11).fill(""), { w: 260, h: 80, min: 60, max: 150, ticks: 2, padL: 0, padB: 0, padT: 4, padR: 0 }).replace(/<text[^>]*>[^<]*<\/text>/g, "")],
        ["04", "graduation-cap", "Dual Coach", "An AI coach that never sleeps, and a human coach when it counts.", `<div class="row" style="height:80px;align-items:flex-end;gap:8px"><span class="coach-mark">${star(14)}</span><div class="msg ai"><div class="bub" style="font-size:12.5px">Your first-bullet accuracy drops 9% after round 15.</div></div></div>`],
        ["05", "id-card", "Talent Passport", "A verified, shareable identity scouts can actually trust.", `<div class="row" style="height:80px;gap:14px"><div class="qr" style="padding:5px">${qr("NYX", 66)}</div><div class="col" style="gap:4px"><span class="mono faint" style="font-size:11px">ST-10427</span><b class="wide" style="font-size:18px">NYX</b><span class="tag v">${ic("badge-check")}Verified</span></div></div>`],
        ["06", "radar", "Discovery", "Clubs filter by role, region and potential. Players get seen.", `<div class="row" style="height:80px;gap:6px;align-items:center">${["Yara Hamami", "Kairo", "Zeta Q", "Ryn M", "Neo R"].map((n, i) => K.av(n, "", i)).join("")}<span class="tag mono" style="margin-inline-start:6px">+2,340</span></div>`],
      ];
      return `<div class="land">
        <header class="land-nav">
          ${wm(22)}
          <nav><a href="#/landing">Platform</a><a href="#/landing">Players</a><a href="#/landing">Coaches</a><a href="#/landing">Clubs</a><a href="#/system">Design</a></nav>
          <div class="r">${K.langSwitch()}${K.themeSwitch()}<a class="btn ghost hide-m" href="#/auth">Sign in</a><a class="btn primary" href="#/auth">Get started</a></div>
        </header>
        <section class="hero">
          ${orbit({ w: 980, h: 560, op: 0.9 })}
          <span class="tag v mono">${star(10)} Smart Esports Talent Platform</span>
          <h1>Talent is data <br>you haven’t <em>read</em> yet.</h1>
          <p class="lede">SETA turns matches, replays and recovery into one clear picture of where a player is, and where they can go. Built for players, coaches and clubs.</p>
          <div class="ctas"><a class="btn primary lg" href="#/auth">Create your profile ${ic("arrow-right")}</a><a class="btn lg" href="#/command">${ic("play")} See the product</a></div>
          <div class="row" style="margin-top:28px;gap:18px;color:var(--text-3);font-size:12.5px;flex-wrap:wrap">
            <span class="row" style="gap:6px">${ic("shield-check", "i-sm")} Private by default</span>
            <span class="row" style="gap:6px">${ic("gamepad-2", "i-sm")} 8 titles supported</span>
            <span class="row" style="gap:6px">${ic("languages", "i-sm")} Arabic and English</span>
          </div>
          <div class="hero-stage"><div class="frame"><div class="bar"><i></i><i></i><i></i></div><div class="inner" id="heroShot"></div></div></div>
        </section>
        <div class="ticker">
          ${K.saudiTicker()}
        </div>
        <div class="games-strip"><span class="eyebrow">Titles supported at launch</span><div class="marquee"><div class="mq-track">${[0, 1].map(() => Object.keys(K.GAME_META).map((c) => `<span class="mq-item">${K.game(c, 34)}<b>${K.gameName(c)}</b></span>`).join("")).join("")}</div></div></div>
        ${K.clubsStrip()}
        ${K.clubsSection()}
        <section class="sec">
          <div class="sec-h"><div><span class="eyebrow">The platform</span><h2>Six tools. <br>One honest picture.</h2></div><p>Every module reads from the same match history, so the score you see on your dashboard is the same one a coach or scout sees. No vanity numbers.</p></div>
          <div class="feat-grid">${feats.map(([n, i, t, p, v]) => `<article class="feat"><div class="row between"><span class="n">${n}</span>${ic(i, "faint")}</div><div class="vis">${v}</div><h3>${t}</h3><p>${p}</p></article>`).join("")}</div>
        </section>
        <section class="sec" style="padding-top:0">
          <div class="sec-h"><div><span class="eyebrow">Three journeys</span><h2>Built around who <br>you are in the scene.</h2></div><p>Pick a role when you join. It decides your workspace, your permissions and what others can see.</p></div>
          <div class="roles">
            ${[["user", "Player", "Improve with evidence", ["Command Center and analytics", "Replay intelligence", "AI and human coaching", "Shareable Talent Passport"]],
               ["clipboard-list", "Coach", "Coach more players, better", ["Review queue with timestamps", "Training plans per player", "Session scheduling", "Progress reports"]],
               ["shield", "Club / Organization", "Find and build a roster", ["Talent discovery filters", "Side-by-side comparison", "Roster and team analytics", "Verified passports"]]]
              .map(([i, t, s, l], k) => `<div class="role-col ${k === 0 ? "" : ""}"><div class="row between"><span class="role-card" style="padding:0;border:0;background:none"><span class="ic" style="background:${k === 0 ? "var(--violet)" : "var(--surface-3)"};color:${k === 0 ? "var(--on-violet)" : "var(--text-2)"}">${ic(i)}</span></span><span class="mono faint" style="font-size:11px">0${k + 1}</span></div><div><h3 class="h2">${t}</h3><p class="muted" style="margin:6px 0 0">${s}</p></div><ul>${l.map((x) => `<li>${ic("check")}${x}</li>`).join("")}</ul><a class="link" href="#/auth" style="margin-top:auto">Join as ${t.split(" ")[0].toLowerCase()} ${ic("arrow-right")}</a></div>`).join("")}
          </div>
        </section>
        <section class="cta-band">
          ${orbit({ w: 900, h: 400, color: "#9677FF", op: 0.8 })}
          <span class="eyebrow" style="color:rgba(237,234,244,.5)">Season 2026 is open</span>
          <h2 style="margin-top:14px">Better data. <br>Stronger you.</h2>
          <div class="row" style="margin-top:28px;gap:10px;flex-wrap:wrap;position:relative"><a class="btn primary lg" href="#/auth" style="--on-violet:#fff;background:#9677FF;border-color:#9677FF;color:#0E0C13">Get started free ${ic("arrow-right")}</a><a class="btn lg" href="#/m-start" style="background:transparent;color:#EDEAF4;border-color:#3A3349">Watch the tour</a></div>
        </section>
        <footer class="land-foot">${wm(16)}<span>© 2026 SETA · Jazan University graduation project</span><span style="margin-inline-start: auto" class="row" style="gap:16px"><a href="https://saudiesports.sa/" target="_blank" rel="noopener" data-noi18n>${K.isAr ? "الاتحاد السعودي للرياضات الإلكترونية" : "Saudi Esports Federation"}</a> · <a href="#/system">Design system</a> · <a href="#/landing">Privacy</a> · <a href="#/landing">Terms</a></span></footer>
      </div>`;
    },
    mount(root) {
      const cmd = S.find((s) => s.id === "command");
      const el = root.querySelector("#heroShot");
      if (!cmd || !el) return;
      el.innerHTML = `<div class="shot" style="width:1440px;transform-origin:0 0;pointer-events:none">${K.shell({ ...cmd }, cmd.render())}</div>`;
      const fit = () => { const s = el.clientWidth / 1440; el.firstElementChild.style.transform = `scale(${s})`; };
      fit(); window.addEventListener("resize", fit, { once: true });
      lucide.createIcons();
    },
  });

  /* =============== 03 AUTH & ROLE =============== */
  let authTab = "up", role = "player", showPw = false;
  S.push({
    id: "auth", part: "Part 1 · Introduction", title: "Sign up / in & role", kind: "full",
    render() {
      const roles = [["player", "gamepad-2", "Player", "Track, improve, get scouted"], ["coach", "clipboard-list", "Coach", "Review and train players"], ["club", "shield", "Club", "Scout and manage rosters"]];
      return `<div class="split">
        <aside class="panel-ink">
          ${orbit({ w: 700, h: 900, color: "#9677FF", op: 0.7 })}
          <a href="#/landing" class="wm on-ink" style="height:22px;position:relative"><img class="l" src="assets/wordmark-light.png"><img class="d" src="assets/wordmark-dark.png"></a>
          <div style="margin-top:auto;position:relative;max-width:460px">
            <span class="eyebrow">From a SETA coach</span>
            <p class="wide" style="font-size:26px;line-height:1.25;font-weight:560;letter-spacing:-.01em;margin:14px 0 22px">“I stopped guessing what to fix. The replay timeline shows me the second it went wrong.”</p>
            <div class="row" style="gap:12px">${av("Reem Alqahtani", "")}<div style="line-height:1.3"><b style="font-size:13.5px">Reem Alqahtani</b><div style="font-size:12px;color:rgba(237,234,244,.55)">Head Coach, Falcons</div></div></div>
            <div class="row" style="gap:28px;margin-top:40px;padding-top:24px;border-top:1px solid #2A2245">
              ${[["23.5M", K.isAr ? "مهتم بالألعاب في السعودية" : "gaming enthusiasts in KSA"], ["$70M+", K.isAr ? "جوائز EWC 2025" : "EWC 2025 prize pool"], ["2×", K.isAr ? "Team Falcons بطل الأندية" : "Team Falcons club champion"]].map(([a, b]) => `<div data-noi18n><b class="wide num" style="font-size:24px">${a}</b><div style="font-size:12px;color:rgba(237,234,244,.5)">${b}</div></div>`).join("")}
            </div>
          </div>
        </aside>
        <main class="form-wrap">
          <div class="form-inner fade-in">
            <div class="row between"><div class="seg"><button class="${authTab === "up" ? "on" : ""}" data-tab="up">Create account</button><button class="${authTab === "in" ? "on" : ""}" data-tab="in">Sign in</button></div>${K.themeSwitch()}</div>
            <div><h1 class="h1">${authTab === "up" ? "Join SETA" : "Welcome back"}</h1><p class="muted" style="margin:8px 0 0">${authTab === "up" ? "Choose how you’ll use the platform. You can add a role later." : "Sign in to pick up where you left off."}</p></div>
            ${authTab === "up" ? `<div class="field"><label>I’m joining as</label><div class="grid" style="grid-template-columns:repeat(3,1fr);gap:8px">${roles.map(([k, i, t, d]) => `<button class="role-card ${role === k ? "on" : ""}" data-role="${k}"><span class="ic">${ic(i)}</span><span class="radio ${role === k ? "on" : ""}"></span><b style="font-size:13.5px">${t}</b><span class="faint" style="font-size:11.5px;line-height:1.35">${d}</span></button>`).join("")}</div></div>` : ""}
            ${K.ssoBlock()}
            <div class="or">or with email</div>
            ${authTab === "up" ? `<div class="field"><label>Full name</label><div class="input">${ic("user")}<input value="Yara Hamami"></div></div>` : ""}
            <div class="field"><label>Email</label><div class="input">${ic("at-sign")}<input value="yara@jazanu.edu.sa" type="email"></div></div>
            <div class="field"><div class="row between"><label>Password</label>${authTab === "in" ? `<a class="link" href="#/auth">Forgot?</a>` : ""}</div><div class="input">${ic("lock")}<input type="${showPw ? "text" : "password"}" value="seta-season-26"><button data-pw title="Show password">${ic(showPw ? "eye-off" : "eye")}</button></div>${authTab === "up" ? `<div class="segbar" style="margin-top:4px"><i class="on"></i><i class="on"></i><i class="on"></i><i></i></div><span class="hint">Strong. Add a symbol to make it excellent.</span>` : ""}</div>
            <a class="btn primary lg block" href="#/${authTab === "up" ? (role === "coach" ? "coach-setup" : role === "club" ? "team" : "setup") : role === "coach" ? "coachhub" : "command"}">${authTab === "up" ? "Create account" : "Sign in"} ${ic("arrow-right")}</a>
            <p class="faint" style="font-size:12px;margin:0;text-align:center">By continuing you agree to SETA’s <a class="link" style="font-size:12px">Terms</a> and <a class="link" style="font-size:12px">Privacy Policy</a>.</p>
          </div>
        </main>
      </div>`;
    },
    mount(root) {
      root.querySelectorAll("[data-tab]").forEach((b) => (b.onclick = () => { authTab = b.dataset.tab; rerender(); }));
      root.querySelectorAll("[data-role]").forEach((b) => (b.onclick = () => { role = b.dataset.role; rerender(); }));
      const pw = root.querySelector("[data-pw]"); if (pw) pw.onclick = () => { showPw = !showPw; rerender(); };
    },
  });

  /* =============== 04 PLAYER SETUP =============== */
  let step = 0; const picked = new Set(["VAL"]); const goals = new Set(["Aim consistency", "Get scouted"]);
  let prefs = { bio: true, ai: true, scouts: true, weekly: false };
  S.push({
    id: "setup", part: "Part 1 · Introduction", title: "Player profile setup", kind: "full",
    render() {
      const steps = ["Games", "Identity", "Goals", "Privacy"];
      const main = GAMES.find((g) => picked.has(g[0])) || GAMES[0];
      let body = "";
      if (step === 0) body = `<div><span class="eyebrow">Step 1</span><h1 class="h1" style="margin-top:6px">What do you play?</h1><p class="muted" style="margin:8px 0 0">Pick one or more. Your first pick becomes your main title.</p></div>
        <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px">${GAMES.map(([k, n, t, c]) => `<button class="game-tile ${picked.has(k) ? "on" : ""}" data-g="${k}">${K.game(k, 40)}<span class="check ${picked.has(k) ? "on" : ""}">${ic("check")}</span><div><b>${n}</b><br><span>${t}</span></div></button>`).join("")}</div>
        <div class="grid" style="grid-template-columns:1fr 1fr 1fr;gap:12px"><div class="field"><label>Current rank</label><div class="input">${ic("trophy")}<select><option>Immortal 1</option><option>Diamond 3</option><option>Ascendant 2</option></select>${ic("chevron-down", "i-sm")}</div></div><div class="field"><label>Main role</label><div class="input">${ic("crosshair")}<select><option>Duelist</option><option>Initiator</option><option>Controller</option><option>Sentinel</option></select>${ic("chevron-down", "i-sm")}</div></div><div class="field"><label>Server region</label><div class="input">${ic("globe-2")}<select><option selected>Jazan · KSA South (base)</option><option>Riyadh · KSA Central</option><option>Jeddah · KSA West</option><option>Dammam · KSA East</option></select>${ic("chevron-down", "i-sm")}</div></div></div>`;
      if (step === 1) body = `<div><span class="eyebrow">Step 2</span><h1 class="h1" style="margin-top:6px">How should we show you?</h1><p class="muted" style="margin:8px 0 0">This is what coaches and scouts see first.</p></div>
        <div class="row" style="gap:16px">${av("Yara Hamami", "xl")}<div class="col" style="gap:6px"><div class="row" style="gap:8px"><button class="btn sm">${ic("upload")} Upload photo</button><button class="btn sm ghost">Use initials</button></div><span class="hint">PNG or JPG, at least 400 × 400.</span></div></div>
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label>Gamer tag</label><div class="input"><span class="mono faint">@</span><input value="NYX"><span class="tag m">${ic("check")}Available</span></div></div><div class="field"><label>Riot ID</label><div class="input">${ic("link-2")}<input value="NYX#KSA1"></div></div><div class="field"><label>Date of birth</label><div class="input">${ic("calendar")}<input value="14 / 03 / 2005"></div></div><div class="field"><label>City</label><div class="input">${ic("map-pin")}<input value="Jazan, Saudi Arabia"></div></div></div>
        <div class="field"><label>Short bio</label><div class="input" style="height:auto;padding:12px 14px;align-items:flex-start"><textarea rows="3" style="border:0;outline:none;background:transparent;width:100%;resize:none">Entry duelist. Aggressive on attack, learning to slow down on defense. Looking for a semi-pro roster for 2026.</textarea></div><span class="hint" style="text-align: end">118 / 200</span></div>`;
      if (step === 2) body = `<div><span class="eyebrow">Step 3</span><h1 class="h1" style="margin-top:6px">What are you working toward?</h1><p class="muted" style="margin:8px 0 0">We use this to shape your Command Center and coaching plan.</p></div>
        <div class="row wrap" style="gap:8px">${["Aim consistency", "Better decisions", "Communication", "Climb ranked", "Join a team", "Get scouted", "Go pro", "Healthier routine", "Mental resilience"].map((g) => `<button class="chip ${goals.has(g) ? "on" : ""}" data-goal="${g}">${goals.has(g) ? ic("check") : ic("plus")}${g}</button>`).join("")}</div>
        <div class="field"><label>Weekly practice time</label><div class="card sunk" style="padding:18px"><div class="row between"><span class="muted">Hours per week</span><b class="wide num" style="font-size:22px">14 h</b></div><div class="meter" style="margin-top:12px;height:8px"><i style="width:47%"></i></div><div class="row between faint mono" style="font-size:10.5px;margin-top:8px"><span>0</span><span>10</span><span>20</span><span>30+</span></div></div></div>
        <div class="field"><label>Target rank this season</label><div class="seg">${["Ascendant", "Immortal", "Radiant"].map((r, i) => `<button class="${i === 1 ? "on" : ""}">${r}</button>`).join("")}</div></div>`;
      if (step === 3) body = `<div><span class="eyebrow">Step 4</span><h1 class="h1" style="margin-top:6px">You decide who sees what.</h1><p class="muted" style="margin:8px 0 0">Change any of this later in Settings.</p></div>
        <div class="card"><div class="list" style="padding:4px 18px">${[["bio", "heart-pulse", "Connect a wearable", "Garmin, Whoop, Apple Health, Fitbit. Data stays private unless you share it."], ["ai", "sparkles", "AI Coach suggestions", "Personal drills and match notes after every session."], ["scouts", "radar", "Visible in Talent Discovery", "Verified clubs can find your passport. You approve every request."], ["weekly", "mail", "Weekly progress email", "A short Monday summary of your week."]].map(([k, i, t, d]) => `<div class="li" style="padding:16px 0"><span class="role-card" style="padding:0;border:0;background:none"><span class="ic">${ic(i)}</span></span><div class="grow"><div class="t">${t}</div><div class="s">${d}</div></div><button class="switch ${prefs[k] ? "on" : ""}" data-pref="${k}" aria-label="${t}"></button></div>`).join("")}</div></div>
        <div class="row" style="gap:10px;padding:12px 14px;border-radius:var(--r-md);background:var(--sky-soft);color:var(--sky);font-size:12.5px">${ic("info")}<span>BioSync shows patterns next to your matches. It is not a medical device and does not diagnose anything.</span></div>`;

      const sel = [...picked].map((k) => GAMES.find((g) => g[0] === k));
      return `<div class="full" style="display:flex;flex-direction:column">
        <header class="land-nav" style="height:64px">${wm(18)}<span class="faint mono hide-m" style="font-size:11px">Player setup</span><div class="r">${K.themeSwitch()}<a class="btn ghost" href="#/landing">${ic("x")} Exit</a></div></header>
        <div style="flex:1;display:grid;grid-template-columns:minmax(0,1fr) 400px;gap:0" class="setup-grid">
          <main style="padding:36px clamp(16px,5vw,72px) 32px;display:flex;flex-direction:column;gap:26px;max-width:860px;width:100%;margin:0 auto">
            <div class="stepper">${steps.map((s, i) => `<div class="st ${i < step ? "done" : i === step ? "on" : ""}"><i></i><span>${i < step ? "✓ " : ""}${s}</span></div>`).join("").replace(/✓ /g, "")}</div>
            <div class="col fade-in" style="gap:22px">${body}</div>
            <div class="row between" style="margin-top:auto;padding-top:20px;border-top:1px solid var(--line)"><button class="btn ghost" data-back ${step === 0 ? 'style="visibility:hidden"' : ""}>${ic("arrow-left")} Back</button><span class="mono faint" style="font-size:11px">${step + 1} of 4</span><button class="btn primary" data-next>${step === 3 ? "Finish setup" : "Continue"} ${ic("arrow-right")}</button></div>
          </main>
          <aside class="hide-m" style="border-inline-start:1px solid var(--line);background:var(--bg-sunk);padding:36px 28px;display:flex;flex-direction:column;gap:16px">
            <span class="eyebrow">Live preview</span>
            <div class="passport" style="min-height:0;gap:14px">${K.guil(360, 300)}
              <div class="row between" style="position:relative"><span class="wm on-ink" style="height:14px"><img class="l" src="assets/wordmark-light.png"><img class="d" src="assets/wordmark-dark.png"></span><span class="lbl">Draft passport</span></div>
              <div class="row" style="gap:12px;position:relative">${av("Yara Hamami", "lg")}<div><b class="wide" style="font-size:22px">NYX</b><div class="lbl" style="margin-top:2px">${main[1]} · Duelist</div></div></div>
              <div class="row wrap" style="gap:6px;position:relative">${sel.map((g) => `<span class="tag" style="background:rgba(255,255,255,.08);color:#EDEAF4">${K.brand(K.GAME_META[g[0]].k, 11, "#EDEAF4")}${g[1]}</span>`).join("")}</div>
              <div class="grid" style="grid-template-columns:1fr 1fr 1fr;gap:10px;position:relative"><div><div class="lbl">Rank</div><div class="v">Immortal 1</div></div><div><div class="lbl">Server</div><div class="v">Jazan</div></div><div><div class="lbl">Age</div><div class="v">21</div></div></div>
              <div class="mrz" style="position:relative">P&lt;SETA&lt;NYX&lt;&lt;HAMAMI&lt;YARA&lt;&lt;&lt;&lt;</div>
            </div>
            <div class="card" style="padding:16px"><div class="row between"><b style="font-size:13px">Profile strength</b><span class="mono" style="font-size:12px;color:var(--violet)">${[35, 60, 80, 96][step]}%</span></div><div class="meter" style="margin-top:10px"><i style="width:${[35, 60, 80, 96][step]}%"></i></div><p class="faint" style="font-size:12px;margin:10px 0 0">Complete profiles get 3× more coach replies.</p></div>
          </aside>
        </div>
      </div>
      <style>@media (max-width:1080px){.setup-grid{grid-template-columns:1fr !important}}</style>`;
    },
    mount(root) {
      root.querySelectorAll("[data-g]").forEach((b) => (b.onclick = () => { const k = b.dataset.g; picked.has(k) && picked.size > 1 ? picked.delete(k) : picked.add(k); rerender(); }));
      root.querySelectorAll("[data-goal]").forEach((b) => (b.onclick = () => { const k = b.dataset.goal; goals.has(k) ? goals.delete(k) : goals.add(k); rerender(); }));
      root.querySelectorAll("[data-pref]").forEach((b) => (b.onclick = () => { prefs[b.dataset.pref] = !prefs[b.dataset.pref]; rerender(); }));
      root.querySelector("[data-next]").onclick = () => { if (step < 3) { step++; rerender(); } else { step = 0; location.hash = "#/complete"; } };
      root.querySelector("[data-back]").onclick = () => { step = Math.max(0, step - 1); rerender(); };
    },
  });

  /* =============== 05 SETUP COMPLETE =============== */
  S.push({
    id: "complete", part: "Part 1 · Introduction", title: "Setup complete", kind: "full",
    render() {
      const done = [["user-check", "Account created"], ["gamepad-2", "Valorant linked"], ["target", "3 goals set"], ["heart-pulse", "Garmin connected"], ["shield-check", "Privacy chosen"]];
      return `<div class="full" style="position:relative;overflow:hidden;display:flex;flex-direction:column">
        ${orbit({ w: 1400, h: 700, op: 0.55 })}
        <header class="land-nav" style="height:64px;border:0;position:relative">${wm(18)}<div class="r">${K.themeSwitch()}</div></header>
        <main class="fade-in" style="position:relative;flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:40px 16px 56px;gap:18px">
          <div style="position:relative;width:104px;height:104px;display:grid;place-items:center">
            ${ring(100, { size: 104, stroke: 3, color: "var(--violet)" })}
            <span style="position:absolute;inset:14px;border-radius:50%;background:var(--violet);color:var(--on-violet);display:grid;place-items:center">${ic("check", "i-lg")}</span>
          </div>
          <span class="tag v mono">${star(10)} Setup complete</span>
          <h1 class="wide" style="font-size:clamp(34px,5vw,60px);line-height:1;margin:0;font-weight:680;letter-spacing:-.03em">You’re in, Nyx.</h1>
          <p class="muted" style="max-width:520px;margin:0;font-size:16px">Your Command Center is ready. We pulled your last 40 Valorant matches, so your first score is already waiting.</p>
          <div class="row wrap" style="gap:8px;justify-content:center;margin-top:6px">${done.map(([i, t]) => `<span class="chip on" style="cursor:default">${ic(i)}${t}</span>`).join("")}</div>
          <div class="row" style="gap:10px;margin-top:10px;flex-wrap:wrap;justify-content:center"><a class="btn primary lg" href="#/command">Open Command Center ${ic("arrow-right")}</a><a class="btn lg" href="#/command">${ic("compass")} Take the 60-second tour</a></div>
          <div class="grid" style="grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;max-width:980px;width:100%;margin-top:36px;text-align: start" id="nextGrid">
            ${[["01", "activity", "Your first SETA Score", "82", "Top 18% of Immortal duelists in Saudi Arabia.", "#/performance"],
               ["02", "film", "Review your worst round", "8:42", "Round 14 on Haven. One wide peek cost the half.", "#/replay"],
               ["03", "graduation-cap", "Meet your AI coach", "3 drills", "A 25-minute plan is ready for today.", "#/coach"]].map(([n, i, t, big, d, h]) => `<a class="card" href="${h}" style="padding:20px;display:flex;flex-direction:column;gap:14px;transition:border-color .15s" onmouseover="this.style.borderColor='var(--violet)'" onmouseout="this.style.borderColor=''"><div class="row between"><span class="mono faint" style="font-size:11px">${n}</span>${ic(i, "faint")}</div><b class="wide num" style="font-size:30px;line-height:1">${big}</b><div><div class="h3">${t}</div><p class="faint" style="margin:4px 0 0;font-size:12.5px">${d}</p></div><span class="link">Open ${ic("arrow-right")}</span></a>`).join("")}
          </div>
        </main>
      </div><style>@media (max-width:760px){#nextGrid{grid-template-columns:1fr !important}}</style>`;
    },
  });
})();
