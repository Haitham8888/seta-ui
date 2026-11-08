/* PART 9 — Apple Health (HealthKit) integration: concept, flow, data, rules */
(function () {
  const { ic, star, ring } = K;
  const S = (window.SCREENS = window.SCREENS || []);

  /* generic health-hub tile (white tile, pink heart) — not Apple's artwork */
  const healthIcon = (s = 40) => `<span style="width:${s}px;height:${s}px;border-radius:${s * 0.24}px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.08);display:grid;place-items:center;flex:none"><svg width="${s * 0.62}" height="${s * 0.62}" viewBox="0 0 24 24"><defs><linearGradient id="hh${s}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF5E7E"/><stop offset="1" stop-color="#FF2D55"/></linearGradient></defs><path fill="url(#hh${s})" d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.2 5.3 3.1 1.7-1.9 3.2-3.1 5.3-3.1 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21z"/></svg></span>`;
  const setaIcon = (s = 40) => `<span style="width:${s}px;height:${s}px;border-radius:${s * 0.24}px;background:#120D1F;display:grid;place-items:center;flex:none;color:#B29BFF">${star(s * 0.5, "#B29BFF")}</span>`;
  K.healthIcon = healthIcon;

  const P = (inner) => K.phone(inner);
  const shot = K.mShot;

  S.push({
    id: "apple-health", part: "Part 9 · Watch", title: "Apple Health link", kind: "full",
    render() {
      /* ---------- phone screens ---------- */
      const why = `<div class="m-body">
          <div class="m-top">${ic("chevron-left")}<span style="font-weight:650">BioSync</span><span></span></div>
          <div class="row" style="gap:10px;justify-content:center;padding:14px 0 4px">${setaIcon(54)}<span class="faint">${ic("arrow-left-right")}</span>${healthIcon(54)}</div>
          <div style="text-align:center"><h2 class="m-title" style="font-size:24px">Connect Apple Health</h2><p class="m-sub">One permission covers every device that already saves to Health on your iPhone.</p></div>
          <div class="m-group">${[["heart-pulse", "Heart rate & HRV", "Readiness and in-match heart rate"], ["moon", "Sleep stages", "Recovery and wind-down time"], ["footprints", "Steps & energy", "Daily load (optional)"]].map(([i, t, d]) => `<div class="m-row"><span style="color:#FF2D55">${ic(i, "i-sm")}</span><div class="grow"><b style="font-size:12.5px">${t}</b><div class="s">${d}</div></div></div>`).join("")}</div>
          <div class="row" style="gap:8px;font-size:11.5px" ><span style="color:var(--mint)">${ic("lock", "i-sm")}</span><span class="faint">Read only · never used for ads · revoke any time</span></div>
          <span class="m-btn" style="margin-top:auto;margin-bottom:30px">Continue</span></div>`;

      const sheet = `<div style="flex:1;display:flex;flex-direction:column;background:var(--bg-sunk);padding:0 0 0">
          <div class="row between" style="padding:8px 16px;font-size:14px"><span style="color:#0A84FF">Don’t Allow</span><b style="font-size:14px">Health Access</b><span style="color:#0A84FF;font-weight:650">Allow</span></div>
          <div style="padding:6px 16px 0;overflow:hidden;display:flex;flex-direction:column;gap:10px">
            <div class="row" style="gap:8px;justify-content:center;padding-top:6px">${setaIcon(40)}${healthIcon(40)}</div>
            <p style="margin:0;text-align:center;font-size:12px;color:var(--text-2);line-height:1.4">“SETA” would like to access and update your Health data in the categories below.</p>
            <div style="background:var(--surface);border-radius:12px;padding:10px 14px;color:#0A84FF;font-size:13.5px">Turn On All</div>
            <div class="m-label" style="font-family:var(--font-ui);letter-spacing:.02em">ALLOW “SETA” TO READ</div>
            <div style="background:var(--surface);border-radius:12px;overflow:hidden">${[["Heart Rate", true], ["Heart Rate Variability", true], ["Resting Heart Rate", true], ["Sleep", true], ["Respiratory Rate", false], ["Steps", false]].map(([t, on], i) => `<div class="row between" style="padding:9px 14px;${i ? "border-top:1px solid var(--line)" : ""};font-size:13px"><span>${t}</span><span class="switch ${on ? "on" : ""}" style="${on ? "background:#34C759" : ""}"></span></div>`).join("")}</div>
            <p style="margin:0;font-size:10.5px;color:var(--text-3);line-height:1.4">App Explanation: SETA reads heart rate, HRV and sleep to show your readiness and your heart rate during matches. Data is never sold or used for advertising.</p>
          </div></div>`;

      const sources = `<div class="m-body">
          <div class="m-top">${ic("chevron-left")}<span style="font-weight:650">Apple Health</span><span class="tag m">${ic("check")}On</span></div>
          <div><h2 class="m-title" style="font-size:22px">Found in Health</h2><p class="m-sub">SETA picks the best source for each metric. Drag to change the order.</p></div>
          <span class="m-label">Heart rate</span>
          <div class="m-group">${[["apple", "Apple Watch", "Every 5 s in session · primary"], ["", "Oura Ring", "Every 5 min"]].map(([k, n, d], i) => `<div class="m-row"><span class="faint">${ic("grip-vertical", "i-sm")}</span><span class="brand-tile sm">${k ? K.brand(k, 15) : ic("circle", "i-sm")}</span><div class="grow"><b style="font-size:12.5px">${n}</b><div class="s">${d}</div></div><span class="mono faint" style="font-size:10.5px">${i + 1}</span></div>`).join("")}</div>
          <span class="m-label">Sleep</span>
          <div class="m-group">${[["", "Oura Ring", "Stages: deep, core, REM"], ["apple", "Apple Watch", "Stages: deep, core, REM"], ["garmin", "Garmin Connect", "Duration only"]].map(([k, n, d], i) => `<div class="m-row"><span class="faint">${ic("grip-vertical", "i-sm")}</span><span class="brand-tile sm">${k ? K.brand(k, 15) : ic("circle", "i-sm")}</span><div class="grow"><b style="font-size:12.5px">${n}</b><div class="s">${d}</div></div><span class="mono faint" style="font-size:10.5px">${i + 1}</span></div>`).join("")}</div>
          <span class="faint" style="font-size:11px;margin-top:auto;margin-bottom:30px">Any app that writes to Health shows up here automatically.</span></div>`;

      const sync = `<div class="m-body">
          <div class="m-top"><span></span><span style="font-weight:650">Importing</span><span></span></div>
          <div style="display:grid;place-items:center;padding:8px 0">${ring(68, { size: 130, stroke: 9, color: "#FF2D55", label: "68%", sub: "30 DAYS" })}</div>
          <div class="m-group">${[["Sleep", "30 nights", true], ["HRV", "214 readings", true], ["Resting HR", "30 days", true], ["Heart rate", "Summarising…", false]].map(([t, d, ok]) => `<div class="m-row"><span style="color:${ok ? "var(--mint)" : "var(--text-3)"}">${ic(ok ? "circle-check" : "loader", "i-sm")}</span><span class="grow">${t}</span><span class="faint" style="font-size:11.5px">${d}</span></div>`).join("")}</div>
          <div class="m-card" style="display:flex;gap:10px;background:var(--surface-2);padding:12px"><span style="color:var(--violet)">${ic("cpu", "i-sm")}</span><span class="muted" style="font-size:11.5px">Raw samples are summarised on your iPhone. Only summaries and session heart rate are uploaded.</span></div>
          <span class="m-btn alt" style="margin-top:auto;margin-bottom:30px">Continue in background</span></div>`;

      const manage = `<div style="flex:1;display:flex;flex-direction:column;background:var(--bg-sunk)">
          <div class="row" style="gap:6px;padding:8px 14px;color:#0A84FF;font-size:13.5px">${ic("chevron-left")}Data Access & Devices</div>
          <div style="padding:4px 16px;display:flex;flex-direction:column;gap:10px;overflow:hidden">
            <div class="row" style="gap:10px">${setaIcon(44)}<div><b style="font-size:17px">SETA</b><div class="faint" style="font-size:11.5px">iPhone Settings › Health</div></div></div>
            <div style="background:var(--surface);border-radius:12px;padding:10px 14px;color:#0A84FF;font-size:13.5px">Turn Off All</div>
            <div class="m-label" style="font-family:var(--font-ui);letter-spacing:.02em">ALLOW “SETA” TO READ</div>
            <div style="background:var(--surface);border-radius:12px;overflow:hidden">${[["Heart Rate", true], ["Heart Rate Variability", true], ["Resting Heart Rate", true], ["Sleep", true]].map(([t, on], i) => `<div class="row between" style="padding:9px 14px;${i ? "border-top:1px solid var(--line)" : ""};font-size:13px"><span>${t}</span><span class="switch on" style="background:#34C759"></span></div>`).join("")}</div>
            <div style="background:var(--surface);border-radius:12px;padding:10px 14px;color:#FF3B30;font-size:13.5px">Delete All Data from “SETA”</div>
            <p style="margin:0;font-size:11px;color:var(--text-3);line-height:1.4">Turning a category off stops SETA reading it straight away. To also delete what SETA already uploaded, use SETA › Me › Devices › Unlink.</p>
          </div></div>`;

      /* ---------- concept + tech ---------- */
      const hubSources = [["apple", "Apple Watch"], ["", "Oura"], ["garmin", "Garmin Connect"], ["fitbit", "Fitbit"], ["samsung", "Galaxy (via app)"], ["", "Whoop"]];
      const mapping = [
        ["HKQuantityType · heartRate", "Heart rate", "BioSync timeline, heart rate per round", "Session: 5 s · otherwise hourly"],
        ["HKQuantityType · heartRateVariabilitySDNN", "HRV", "Readiness (vs. your 30-day baseline)", "Each morning"],
        ["HKQuantityType · restingHeartRate", "Resting HR", "Readiness baseline", "Daily"],
        ["HKCategoryType · sleepAnalysis", "Sleep stages", "Readiness, wind-down reminder", "Each morning"],
        ["HKQuantityType · respiratoryRate", "Breathing rate", "Sleep quality (optional)", "Nightly"],
        ["HKQuantityType · stepCount", "Steps", "Daily load (optional)", "Hourly"],
      ];
      const steps = [
        ["hand", "Ask", "User taps Connect. SETA explains what it reads and why, then calls requestAuthorization with read types only."],
        ["history", "Backfill", "An anchored query pulls the last 30 days. Samples are summarised on the iPhone into nightly and hourly values."],
        ["bell-ring", "Stay in sync", "Observer queries with background delivery wake SETA when Health gets new sleep or HRV. No need to open the app."],
        ["watch", "Live in a match", "The SETA watch app runs a workout session, so the watch measures heart rate every few seconds and streams it to the phone."],
        ["git-merge", "Align", "SETA cloud lines heart rate up with Riot match timestamps, round by round, and updates readiness."],
      ];
      const weights = [["HRV vs. baseline", 40, "var(--sky)"], ["Sleep duration & stages", 35, "var(--violet)"], ["Resting HR vs. baseline", 15, "var(--rose)"], ["Yesterday’s play load", 10, "var(--amber)"]];

      return `<div class="canvas" style="gap:44px">
        ${K.mHead("BioSync · Apple Health (HealthKit)", "Linking with Apple Health", "On iPhone, SETA doesn’t connect to each device separately. It connects once to Apple Health, the place where the iPhone already collects data from your watch, ring and other health apps.", `<a class="btn" href="#/pair">${ic("arrow-left")} All watches</a><a class="btn primary" href="#/biosync">BioSync dashboard ${ic("arrow-right")}</a>`)}

        <section class="flow-row grid" style="grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:16px" id="ahTop">
          <div class="card" style="padding:24px;display:flex;flex-direction:column;gap:18px">
            <span class="eyebrow">The idea</span>
            <h2 class="h2" style="font-size:24px;line-height:1.15">One permission. Every device.</h2>
            <p class="muted" style="margin:0">Apple Health works as a hub. Apple Watch, Oura, Garmin Connect, Fitbit and many other apps already write into it. By reading from Health, SETA gets all of them through one permission screen, with no extra accounts.</p>
            <div class="row wrap" style="gap:14px;align-items:center">
              <div class="col" style="gap:6px">${hubSources.map(([k, n]) => `<div class="row" style="gap:8px;font-size:12.5px"><span class="brand-tile sm">${k ? K.brand(k, 14) : ic("circle", "i-sm")}</span>${n}</div>`).join("")}</div>
              <div class="arch" style="display:flex;flex:1;min-width:220px;align-items:center;gap:0"><div class="wire" style="flex:1"><span>write</span><i class="ln"></i></div>${healthIcon(56)}<div class="wire" style="flex:1"><span>read · with permission</span><i class="ln"></i></div>${setaIcon(56)}</div>
            </div>
          </div>
          <div class="card" style="padding:24px;display:flex;flex-direction:column;gap:14px">
            <span class="eyebrow">What it powers · readiness score</span>
            <div class="row" style="gap:18px">${ring(74, { size: 110, stroke: 9, color: "var(--mint)", label: "74", sub: "READY" })}<div class="col" style="gap:9px;flex:1">${weights.map(([t, w, c]) => `<div><div class="row between" style="font-size:12px"><span>${t}</span><span class="mono faint">${w}%</span></div><div class="meter thin" style="margin-top:4px"><i style="width:${w * 2.2}%;background:${c}"></i></div></div>`).join("")}</div></div>
            <p class="faint" style="margin:0;font-size:12px">Each input is compared with your own 30-day baseline, not with other people. Weights are a starting point the team can tune with real data.</p>
          </div>
        </section>

        ${K.mRow("Linking flow on iPhone", "From SETA to the iOS permission sheet and back", shot(P(why), "H1", "Explain first") + shot(P(sheet), "H2", "iOS Health Access sheet") + shot(P(sources), "H3", "Sources found") + shot(P(sync), "H4", "Importing 30 days") + shot(P(manage), "H5", "Manage in iPhone Settings"))}

        <section class="flow-row"><div class="row-h"><h2>How it works</h2><p>What the app does behind each screen</p></div>
          <div class="grid" style="grid-template-columns:repeat(5,minmax(0,1fr));gap:12px" id="ahSteps">${steps.map(([i, t, d], k) => `<div class="card" style="padding:18px;display:flex;flex-direction:column;gap:10px"><div class="row between"><span class="brand-tile" style="color:var(--violet)">${ic(i)}</span><span class="mono faint" style="font-size:11px">0${k + 1}</span></div><b>${t}</b><p class="faint" style="margin:0;font-size:12.5px">${d}</p></div>`).join("")}</div></section>

        <section class="flow-row"><div class="row-h"><h2>What SETA reads</h2><p>Read only. SETA never writes to Health.</p></div>
          <div class="card table-wrap"><table class="table"><thead><tr><th>HealthKit type</th><th>In SETA</th><th>Used for</th><th>How often</th></tr></thead><tbody>
            ${mapping.map(([a, b, c, d]) => `<tr style="cursor:default"><td class="mono" style="font-size:11.5px;color:var(--text-2)">${a}</td><td><b>${b}</b></td><td style="white-space:normal;min-width:220px">${c}</td><td class="faint" style="font-size:12px">${d}</td></tr>`).join("")}
          </tbody></table></div></section>

        <section class="flow-row grid" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:16px" id="ahRules">
          <div class="card" style="padding:22px"><span class="eyebrow">Apple’s rules SETA follows</span>
            <div class="list" style="margin-top:10px">${[["Health data is never used for ads, sold or shared with data brokers", "App Store Review 5.1.3"], ["A clear reason is shown before the iOS sheet appears", "NSHealthShareUsageDescription"], ["A public privacy policy explains health data use", "Required for HealthKit apps"], ["Health data is not stored in iCloud", "HealthKit guidelines"]].map(([t, s]) => `<div class="li"><span style="color:var(--mint)">${ic("circle-check", "i-sm")}</span><div class="grow"><div style="font-weight:600;font-size:13px;white-space:normal">${t}</div><div class="s mono" style="font-size:10.5px">${s}</div></div></div>`).join("")}</div></div>
          <div class="card" style="padding:22px"><span class="eyebrow">Details the build team must handle</span>
            <div class="list" style="margin-top:10px">${[["eye-off", "iOS never tells an app if read access was denied", "If no data comes back, show “No data yet” with a link to Settings, never an error."], ["smartphone", "Health data only exists on iPhone and Apple Watch", "iPad and Android users link through Health Connect or a Garmin / Fitbit account instead."], ["battery-medium", "Background delivery is limited by iOS", "Sleep and HRV arrive within hours. Live heart rate needs the SETA watch app."], ["stethoscope", "Not medical", "Readiness is a guide for practice, not a diagnosis."]].map(([i, t, d]) => `<div class="li" style="align-items:flex-start"><span class="faint" style="margin-top:2px">${ic(i, "i-sm")}</span><div class="grow"><div style="font-weight:600;font-size:13px;white-space:normal">${t}</div><div class="s" style="white-space:normal">${d}</div></div></div>`).join("")}</div></div>
        </section>
      </div><style>@media (max-width:1080px){#ahTop,#ahRules{grid-template-columns:1fr !important}#ahSteps{grid-template-columns:1fr 1fr !important}}@media (max-width:760px){#ahSteps{grid-template-columns:1fr !important}}</style>`;
    },
  });

  /* place right after "pair", keep design system last */
  const a = S.findIndex((s) => s.id === "apple-health"), p = S.findIndex((s) => s.id === "pair");
  if (a > -1 && p > -1) S.splice(p + 1, 0, S.splice(a, 1)[0]);
})();
