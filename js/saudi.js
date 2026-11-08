/* SETA — real Saudi esports data. Every figure below is taken from a public source (linked).
   Checked November 2026. Club logos from Liquipedia (trademarks of their owners). */
(function () {
  const K = (window.K = window.K || {});
  const S = {
    ewc25: "https://esportsworldcup.com/en/news/team-falcons-crowned-ewc2025-club-champions-after-seven-weeks-of-record-breaking-competition",
    ewcPrize: "https://esportsworldcup.com/en/news/ewc-2025-prizepool",
    an25: "https://www.arabnews.com/node/2611552/sport",
    an26: "https://www.arabnews.com/node/2650435/sport",
    tmWiki: "https://en.wikipedia.org/wiki/Twisted_Minds",
    tfWiki: "https://en.wikipedia.org/wiki/Team_Falcons",
    sefMou: "https://www.pocketgamer.biz/saudi-esports-federation-partners-with-roc-esports-and-team-stallion-to-strengthen-the-kingdoms-esports-ambitions",
    bcg: "https://www.arabnews.com/node/2173366/amp",
    savvy: "https://www.arabnews.com/node/2613296/amp",
    sef26: "https://www.arabnews.pk/node/2633681/sport",
    lqVal: "https://liquipedia.net/valorant/Category:Saudi_Arabian_Teams",
    lqR6: "https://liquipedia.net/rainbowsix/Category:Saudi_Arabian_Teams",
    lqRL: "https://liquipedia.net/rocketleague/Category:Saudi_Arabian_Teams",
    lol: "https://lol.fandom.com/wiki/Category:Saudi_Arabian_Teams",
    sef: "https://saudiesports.sa/",
    ewc26: "https://esportsworldcup.com/en/press-releases/agal-crowned-ewc26-club-champion",
  };
  K.SRC = S;

  /* national facts */
  K.SAUDI_FACTS = [
    { v: "23.5M", ar: "مهتم بالألعاب في السعودية (67% من السكان)", en: "gaming enthusiasts in Saudi Arabia (67% of the population)", src: S.bcg, by: "BCG" },
    { v: "$70M+", ar: "جوائز كأس العالم للرياضات الإلكترونية 2025، الأكبر في التاريخ", en: "Esports World Cup 2025 prize pool, the largest ever", src: S.ewcPrize, by: "EWC" },
    { v: "$1.19B", ar: "إيرادات الألعاب في السعودية 2024، الأعلى في المنطقة", en: "Saudi gaming revenue in 2024, highest in MENA", src: S.savvy, by: "Savvy" },
    { v: "39,000", ar: "وظيفة مستهدفة بحلول 2030 ضمن الاستراتيجية الوطنية للألعاب", en: "jobs targeted by 2030 under the national gaming strategy", src: S.bcg, by: "NGES" },
  ];

  /* clubs (Saudi-based organisations with active pro rosters) */
  K.SAUDI_CLUBS = [
    { id: "TF", en: "Team Falcons", ar: "Team Falcons", city: { ar: "الرياض", en: "Riyadh" }, year: 2017, color: "#12895F", games: ["CS2", "DOTA", "RL", "R6", "VAL"], tier: 1,
      facts: { ar: ["بطل الأندية في كأس العالم للرياضات الإلكترونية 2024 و2025", "بطل Overwatch 2 في EWC 2025 (فاز 4-0 على القادسية)", "تأهل إلى 18 بطولة في EWC 2026، الأكثر بين الأندية"], en: ["EWC Club Champion 2024 and 2025", "Overwatch 2 champion at EWC 2025 (4-0 over Al-Qadsiah)", "Qualified for 18 tournaments at EWC 2026, the most of any club"] }, src: [S.ewc25, S.an25, S.an26] },
    { id: "TM", en: "Twisted Minds", ar: "Twisted Minds", city: { ar: "السعودية", en: "Saudi Arabia" }, color: "#5A2FCF", games: ["PUBG", "LoL"], tier: 1,
      facts: { ar: ["بطل PUBG: Battlegrounds وCall of Duty: Warzone في EWC 2025", "بطل ESL Saudi Challenge في ديسمبر 2024 ويونيو 2025", "تأهل إلى 9 بطولات في EWC 2026"], en: ["PUBG: Battlegrounds and Call of Duty: Warzone champion at EWC 2025", "Won ESL Saudi Challenge in Dec 2024 and Jun 2025", "Qualified for 9 tournaments at EWC 2026"] }, src: [S.tmWiki, S.an26] },
    { id: "QA", en: "Al-Qadsiah Esports", ar: "القادسية للرياضات الإلكترونية", city: { ar: "الخبر", en: "Khobar" }, color: "#C9374F", games: [], tier: 2,
      facts: { ar: ["وصيف Overwatch 2 في EWC 2025"], en: ["Overwatch 2 runner-up at EWC 2025"] }, src: [S.an25] },
    { id: "ROC", en: "ROC Esports", ar: "ROC Esports", city: { ar: "السعودية", en: "Saudi Arabia" }, color: "#D9531E", games: [], tier: 2,
      facts: { ar: ["المركز الثاني في Apex Legends في EWC 2025 من بين 40 فريقًا", "مذكرة تفاهم مع الاتحاد السعودي للرياضات الإلكترونية (فبراير 2026)"], en: ["2nd in Apex Legends at EWC 2025, out of 40 teams", "MoU with the Saudi Esports Federation (Feb 2026)"] }, src: [S.an25, S.sefMou] },
    { id: "PW", en: "POWR Esports", ar: "POWR Esports", city: { ar: "السعودية", en: "Saudi Arabia" }, color: "#1F78B4", games: ["PUBG"], tier: 2,
      facts: { ar: ["المركز 12 في PUBG Mobile في EWC 2025"], en: ["12th in PUBG Mobile at EWC 2025"] }, src: [S.an25] },
    { id: "ST", en: "Team Stallions", ar: "Team Stallions", city: { ar: "السعودية", en: "Saudi Arabia" }, color: "#A86B00", games: [], tier: 2,
      facts: { ar: ["مذكرة تفاهم مع الاتحاد السعودي للرياضات الإلكترونية (فبراير 2026)"], en: ["MoU with the Saudi Esports Federation (Feb 2026)"] }, src: [S.sefMou] },
    { id: "R8", en: "R8 Esports", ar: "R8 Esports", city: { ar: "السعودية", en: "Saudi Arabia" }, color: "#3D4A9E", games: ["VAL", "RL"], tier: 3,
      facts: { ar: ["فرق نشطة في Valorant وRocket League"], en: ["Active rosters in Valorant and Rocket League"] }, src: [S.lqVal, S.lqRL] },
    { id: "TV", en: "Team Vision", ar: "Team Vision", city: { ar: "السعودية", en: "Saudi Arabia" }, color: "#2E6F6A", games: ["VAL", "R6"], tier: 3,
      facts: { ar: ["فرق نشطة في Valorant وRainbow Six"], en: ["Active rosters in Valorant and Rainbow Six"] }, src: [S.lqVal, S.lqR6] },
    { id: "GK", en: "Geekay Esports", ar: "Geekay Esports", city: { ar: "السعودية", en: "Saudi Arabia" }, color: "#A33A86", games: ["RL", "LoL"], tier: 3,
      facts: { ar: ["فرق نشطة في Rocket League وLeague of Legends"], en: ["Active rosters in Rocket League and League of Legends"] }, src: [S.lqRL, S.lol] },
    { id: "TE", en: "Triple Esports", ar: "Triple Esports", city: { ar: "السعودية", en: "Saudi Arabia" }, color: "#565064", games: ["R6", "LoL"], tier: 3,
      facts: { ar: ["فرق نشطة في Rainbow Six وLeague of Legends"], en: ["Active rosters in Rainbow Six and League of Legends"] }, src: [S.lqR6, S.lol] },
  ];

  /* official logos (from Liquipedia; trademarks of their owners). light/dark variants where the club has them */
  const LOGO = { TF: "TF", TM: "TM", QA: "QA", PW: "PW", ST: "ST", GK: "GK", TE: "TE", ROC: ["ROC-light", "ROC-dark"], R8: ["R8-light", "R8-dark"], TV: ["TV-light", "TV-dark"] };
  K.clubAv = (id, size = 44, extra = "") => {
    const f = LOGO[id]; if (!f) return "";
    const [l, d] = Array.isArray(f) ? f : [f, f];
    const c = (K.SAUDI_CLUBS || []).find((x) => x.id === id);
    return `<span class="club-av ${extra}" style="--s:${size}px" data-tip="${c ? c.en : id}"><img class="l" src="assets/clubs/${l}.png" alt="${c ? c.en : id}" loading="lazy"><img class="d" src="assets/clubs/${d}.png" alt="" aria-hidden="true" loading="lazy"></span>`;
  };
  const L = (o) => (K.isAr ? o.ar : o.en);
  const host = (u) => u.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];

  K.saudiTicker = () => K.SAUDI_FACTS.map((f) => `<div data-noi18n><span class="eyebrow">${L(f)}</span><div class="big num">${f.v}</div><a class="src-link" href="${f.src}" target="_blank" rel="noopener">${K.isAr ? "المصدر" : "Source"}: ${f.by}</a></div>`).join("");

  K.clubCard = (c) => `<article class="club-card" data-noi18n>
      <div class="row" style="gap:12px">
        ${K.clubAv(c.id, 48)}
        <div style="min-width:0"><b class="club-name">${L(c)}</b><div class="faint" style="font-size:12px">${L(c.city)}${c.year ? ` · ${K.isAr ? "تأسس" : "est."} ${c.year}` : ""}</div></div>
        ${c.tier === 1 ? `<span class="tag v" style="margin-inline-start:auto">${K.isAr ? "بطل عالمي" : "World champion"}</span>` : ""}
      </div>
      <ul class="club-facts">${L(c.facts).map((f) => `<li>${f}</li>`).join("")}</ul>
      <div class="row between" style="margin-top:auto;gap:8px;flex-wrap:wrap">
        <div class="row" style="gap:4px">${c.games.map((g) => K.game(g, 22, 6)).join("")}</div>
        <div class="row" style="gap:8px">${c.src.map((u) => `<a class="src-link" href="${u}" target="_blank" rel="noopener">${host(u)}</a>`).join("")}</div>
      </div>
    </article>`;

  K.clubsStrip = () => `<div class="games-strip clubs-strip" data-noi18n><span class="eyebrow">${K.isAr ? "أندية سعودية في المشهد العالمي" : "Saudi clubs on the world stage"}</span><div class="marquee"><div class="mq-track">${[0, 1].map(() => K.SAUDI_CLUBS.map((c) => `<span class="mq-item">${K.clubAv(c.id, 34)}<b>${K.isAr ? c.ar : c.en}</b></span>`).join("")).join("")}</div></div></div>`;
  K.clubsSection = () => `<section class="sec" style="padding-top:0" data-noi18n>
      <div class="sec-h"><div><span class="eyebrow">${K.isAr ? "المشهد السعودي" : "The Saudi scene"}</span><h2>${K.isAr ? "أندية سعودية<br>تنافس العالم." : "Saudi clubs<br>taking on the world."}</h2></div>
        <p>${K.isAr ? "أندية سعودية لها فرق احترافية نشطة. كل معلومة مرتبطة بمصدرها المنشور." : "Saudi-based organisations with active pro rosters. Every fact links to its published source."}</p></div>
      <a class="sef-card" href="${S.sef}" target="_blank" rel="noopener">
        <span class="sef-logo"><img class="l" src="assets/sef-light.png" alt="Saudi Esports"><img class="d" src="assets/sef-dark.png" alt="" aria-hidden="true"></span>
        <span class="grow"><span class="eyebrow">${K.isAr ? "الجهة الرسمية" : "Official body"}</span><b>${K.isAr ? "الاتحاد السعودي للرياضات الإلكترونية" : "Saudi Esports Federation"}</b><span class="faint">${K.isAr ? "البطولات الوطنية والأندية المعتمدة والأخبار الرسمية" : "National tournaments, registered clubs and official news"}</span></span>
        <span class="sef-go mono">saudiesports.sa ${K.ic("arrow-up-right", "i-sm")}</span>
      </a>
      <div class="clubs-grid">${K.SAUDI_CLUBS.map(K.clubCard).join("")}</div>
      <p class="faint" style="font-size:12px;margin:16px 0 0">${K.isAr ? "آخر تحقق: نوفمبر 2026. شعارات الأندية علامات تجارية لأصحابها، معروضة للتعريف بكل نادٍ (المصدر: Liquipedia). الموقع الرسمي للاتحاد: saudiesports.sa." : "Last checked November 2026. Club logos are trademarks of their owners, shown to identify each club (source: Liquipedia). Official federation: saudiesports.sa."}</p>
    </section>`;
})();
