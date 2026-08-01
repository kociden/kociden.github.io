document.documentElement.classList.add("js");

const copy = {
  ja: {
    skip: "本文へ移動", navAbout: "HAGとは", navMvp: "ゲームMVP", navSchedule: "当日の流れ", navPartners: "協賛・連携",
    locationLabel: "札幌開催", heroTitle: "<span>AIで、</span><span>1日ゲームを</span><span>つくる。</span>",
    heroLead: "経験ゼロから、遊べるゲームの核まで。AIと仲間でアイデアを形にする、札幌の1day制作イベント。",
    entrySoon: "参加募集は近日公開", sponsorCta: "協賛・連携について", dateLabel: "開催日", sat: "土", venueLabel: "会場",
    venueShort: "札幌・北海道大学 エンレイソウ1F", feeLabel: "参加費", free: "無料", capacityLabel: "定員", capacityValue: "40〜50名予定",
    aboutTitle: '<span class="title-desktop"><span class="heading-line">ゲームを作ったことがなくても、</span><span class="heading-line">その日に遊べるところまで。</span></span><span class="title-mobile"><span class="heading-line">ゲームを作ったことが</span><span class="heading-line">なくても、</span><span class="heading-line">その日に遊べる</span><span class="heading-line">ところまで。</span></span>',
    aboutBody1: "HAGは、AIを相棒にゲームを企画・制作し、発表と試遊まで行う1dayイベントです。プログラミングや絵の経験は問いません。",
    aboutBody2: "ひとり参加も、友人とのチーム参加も歓迎。制作経験者、AIを使って何か作りたい人、次の仲間を探している人が同じ場所で手を動かします。",
    teamImageAlt: "AIを使いながらチームでゲームを制作するイメージ", audience1Title: "はじめて作る", audience1Body: "AIの使い方と制作の進め方をサポート",
    audience2Title: "腕を試す", audience2Body: "限られた時間でゲーム性を研ぎ澄ます", audience3Title: "仲間と出会う", audience3Body: "AI・企画・ゲームに前のめりな人とつながる",
    mvpEyebrow: "完成度より、ゲーム性の核。", mvpTitle: '<span class="heading-line">作るのは、</span><span class="heading-line"><em>ゲームのMVP。</em></span>',
    mvpImageAlt: "ゲームの面白さの核を形にするイメージ",
    mvpBody: "壮大な設定や大量のステージではなく、「この操作が面白い」「もう一回遊びたい」と思える最小限のゲームを目指します。AIは、アイデアを遊べる形へ変えるための制作パートナーです。",
    mvpStep1: "面白さをひとつ決める", mvpStep1Body: "誰が、何をすると面白いのかを言葉にする。",
    mvpStep2: "AIと最短で実装する", mvpStep2Body: "機能を絞り、まず動いて遊べる状態をつくる。",
    mvpStep3: "見せて、遊んでもらう", mvpStep3Body: "狙いを発表してから試遊し、反応を確かめる。",
    scheduleTitle: '<span class="heading-line">1日で、企画から</span><span class="heading-line">発表・試遊まで。</span>', scheduleNote: "発表で各作品の面白さを知ってから、気になるゲームを実際に遊びます。時刻は運営状況により微調整する場合があります。",
    scheduleImageAlt: "時間内にゲームを完成へ運ぶイメージ",
    tt1: "開会・チームづくり", tt1Body: "趣旨説明、チーム編成、アイスブレイク", tt2: "ルール・審査基準", tt2Body: "MVP、提出方法、制作環境を確認",
    tt3: "企画・ゲーム制作", tt3Body: "面白さの核を決め、AIと一気に形にする", tt4: "MVP中間確認", tt4Body: "遊べる状態を確認し、必要なら機能を削る",
    tt5: "Code Freeze・提出", tt5Body: "ビルド、操作方法、作品説明を提出", tt6: "協賛企業LT", tt6Body: "企業・技術・キャリアのショートトーク",
    tt7: "10チーム発表", tt7Body: "面白さの核と、試してほしいポイントを紹介", tt8: "並行試遊・審査", tt8Body: "気になる作品を遊び、審査員が全作品を確認",
    tt9: "投票・審査集計", tt9Body: "観客投票、軽食配布、審査集計", tt10: "表彰・スポンサー賞", tt10Body: "受賞作品と選出理由を発表",
    tt11: "公式懇親会", tt11Body: "参加者、審査員、協賛企業が交流", tt12: "自由交流・自由試遊", tt12Body: "作品へのフィードバック、自由解散",
    tt13: "締め・集合写真", tt13Body: "22:30参加者退出、23:00撤収完了",
    partnersEyebrow: "企業・団体のみなさまへ", partnersTitle: '<span class="title-desktop"><span class="heading-line">北海道の次の作り手に、</span><span class="heading-line">最初の追い風を。</span></span><span class="title-mobile"><span class="heading-line">北海道の次の</span><span class="heading-line">作り手に、</span><span class="heading-line">最初の追い風を。</span></span>',
    partnersImageAlt: "学生と協賛企業がゲームを通じて出会うイメージ",
    partnersBody: "HAGでは、札幌のAI・ゲーム制作に前向きな学生や若手と企業が、作品と対話を通して出会える場をつくります。採用広報、技術発信、地域人材育成など、各社の目的に合わせて連携内容を設計します。",
    metricPeople: "参加者予定", metricTeams: "チーム予定", metricMvp: "企画からMVPまで", return1: "当日のLT・審査員参加", return2: "参加者との試遊・交流",
    return3: "公式サイト・SNS・開催レポート掲載", return4: "企業賞・AI/技術支援の共同設計", partnerStatus: "北海道大学内の関係組織との共催を調整中",
    partnerStatusBody: "会場：北海道大学 エンレイソウ1F（予定）", partnersButton: "協賛・連携について相談する",
    visionQuote: "作って終わりじゃない。<br />次のゲームを一緒に作る<br />仲間と出会う。", visionBody: "HAGは、北海道でゲームとAIに挑戦する人が継続的につながるコミュニティを目指します。",
    footerOrganizer: "企画・運営：HAG実行委員会",
  },
  en: {
    skip: "Skip to content", navAbout: "About", navMvp: "Game MVP", navSchedule: "Schedule", navPartners: "Partners",
    locationLabel: "SAPPORO, JAPAN", heroTitle: "<span>Build a game.</span><span>In one day,</span><span>with AI.</span>",
    heroLead: "From zero experience to a playable core. A one-day event in Sapporo where ideas become games with AI and new teammates.",
    entrySoon: "Registration opening soon", sponsorCta: "Partnerships", dateLabel: "Date", sat: "SAT", venueLabel: "Venue",
    venueShort: "Enreiso 1F, Hokkaido University, Sapporo", feeLabel: "Entry", free: "Free", capacityLabel: "Capacity", capacityValue: "40–50 planned",
    aboutTitle: '<span class="title-desktop"><span class="heading-line">No game-making experience?</span><span class="heading-line">Make something playable anyway.</span></span><span class="title-mobile"><span class="heading-line">No game-making</span><span class="heading-line">experience?</span><span class="heading-line">Make something</span><span class="heading-line">playable anyway.</span></span>',
    aboutBody1: "HAG is a one-day event where participants plan and build a game with AI, then pitch it and let everyone play. No programming or art background is required.",
    aboutBody2: "Join solo or with friends. Experienced creators, first-time AI builders, and people looking for their next teammates all make together in one place.",
    teamImageAlt: "A team building a game together with AI", audience1Title: "Build for the first time", audience1Body: "Get support with AI and the production workflow",
    audience2Title: "Test your skills", audience2Body: "Refine the game idea under a one-day deadline", audience3Title: "Meet teammates", audience3Body: "Connect with people serious about AI, ideas, and games",
    mvpEyebrow: "The core mechanic comes first.", mvpTitle: '<span class="heading-line">Build a</span><span class="heading-line"><em>game MVP.</em></span>',
    mvpImageAlt: "Turning the core fun of a game into a playable MVP",
    mvpBody: "Skip the epic lore and endless levels. Build the smallest game that makes someone say, ‘this interaction is fun’ and ‘one more try.’ AI is a production partner that turns an idea into something playable.",
    mvpStep1: "Choose one source of fun", mvpStep1Body: "Define who does what, and why the action is fun.", mvpStep2: "Implement fast with AI", mvpStep2Body: "Cut features and get to a playable state first.",
    mvpStep3: "Pitch it, then let people play", mvpStep3Body: "Explain the intent, watch players, and test the response.",
    scheduleTitle: '<span class="title-desktop"><span class="heading-line">From idea to pitch</span><span class="heading-line">and playtest in one day.</span></span><span class="title-mobile"><span class="heading-line">From idea to pitch</span><span class="heading-line">and playtest</span><span class="heading-line">in one day.</span></span>', scheduleNote: "Teams pitch the intended fun first, then everyone tries the games that caught their attention. Times may be adjusted slightly during operations.",
    scheduleImageAlt: "Taking a game from idea to a playable result within the day",
    tt1: "Opening and team formation", tt1Body: "Purpose, team matching, and icebreaker", tt2: "Rules and judging", tt2Body: "MVP, submission, and production setup",
    tt3: "Ideation and production", tt3Body: "Choose the core fun and build rapidly with AI", tt4: "MVP checkpoint", tt4Body: "Confirm it is playable and cut features if needed",
    tt5: "Code Freeze and submission", tt5Body: "Submit the build, controls, and game description", tt6: "Sponsor lightning talks", tt6Body: "Short talks on companies, technology, and careers",
    tt7: "Ten team pitches", tt7Body: "Share the core fun and what players should try", tt8: "Parallel playtest and judging", tt8Body: "Try interesting games while judges cover every entry",
    tt9: "Voting and judging", tt9Body: "Audience vote, snacks, and score aggregation", tt10: "Awards", tt10Body: "Winners, sponsor awards, and selection reasons",
    tt11: "Official networking", tt11Body: "Participants, judges, and partners connect", tt12: "Open play and conversation", tt12Body: "Feedback, connections, and optional departure",
    tt13: "Closing and group photo", tt13Body: "Participants leave by 22:30; teardown by 23:00",
    partnersEyebrow: "FOR COMPANIES AND ORGANIZATIONS", partnersTitle: '<span class="title-desktop"><span class="heading-line">Give Hokkaido\'s next creators</span><span class="heading-line">their first tailwind.</span></span><span class="title-mobile"><span class="heading-line">Give Hokkaido\'s</span><span class="heading-line">next creators</span><span class="heading-line">their first tailwind.</span></span>',
    partnersImageAlt: "Young creators and partner companies meeting through games",
    partnersBody: "HAG creates a place where companies meet students and young builders in Sapporo through working games and real conversation. Partnership options are tailored around recruiting, technical outreach, and regional talent development.",
    metricPeople: "planned participants", metricTeams: "planned teams", metricMvp: "from idea to MVP", return1: "Lightning talks and judging", return2: "Playtests and participant interaction",
    return3: "Website, social, and event-report coverage", return4: "Company awards and AI/technical support", partnerStatus: "Co-hosting is under discussion with a Hokkaido University organization",
    partnerStatusBody: "Planned venue: Enreiso 1F, Hokkaido University", partnersButton: "Discuss a partnership",
    visionQuote: "More than a finished game.<br />Meet the people you will build<br />the next one with.", visionBody: "HAG aims to grow a lasting community for people building with games and AI in Hokkaido.",
    footerOrganizer: "Planned and operated by the HAG Executive Committee",
  },
};

const meta = {
  ja: { title: "HAG | AIで、1日ゲームをつくる。", description: "HAGは、AIを使って1日でゲームのMVPをつくる札幌発のイベントです。2026年9月19日、北海道大学エンレイソウ1Fで開催予定。参加無料・初心者歓迎。" },
  en: { title: "HAG | Build a game in one day with AI", description: "HAG is a one-day AI game MVP event in Sapporo on September 19, 2026. Free entry and beginners welcome." },
};

function setLanguage(language, remember = true) {
  const code = language === "ja" ? "ja" : "en";
  const dictionary = copy[code];
  document.documentElement.lang = code;
  document.title = meta[code].title;
  document.querySelector('meta[name="description"]').content = meta[code].description;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = dictionary[element.dataset.i18n];
    if (value) element.textContent = value;
  });
  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    const value = dictionary[element.dataset.i18nHtml];
    if (value) element.innerHTML = value;
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    const value = dictionary[element.dataset.i18nAlt];
    if (value) element.alt = value;
  });
  document.querySelectorAll("[data-lang]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.lang === code)));
  if (remember) localStorage.setItem("hag-language", code);
}

document.querySelectorAll("[data-lang]").forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.lang)));
const savedLanguage = localStorage.getItem("hag-language");
const browserLanguage = navigator.languages?.[0] || navigator.language || "en";
setLanguage(savedLanguage || (browserLanguage.toLowerCase().startsWith("ja") ? "ja" : "en"), false);

const revealTargets = document.querySelectorAll(
  ".section-label, .about-layout > *, .audience-band > div, .mvp-heading > *, .section-illustration, .mvp-steps > li, .schedule-heading > *, .day-timetable > li, .partners-heading > *, .partner-metrics > div, .partner-options > div, .partner-cta, .vision > *",
);

revealTargets.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.setProperty("--reveal-delay", `${(index % 3) * 70}ms`);
});

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -7%" },
  );
  revealTargets.forEach((element) => observer.observe(element));
}

requestAnimationFrame(() => document.body.classList.add("is-ready"));
