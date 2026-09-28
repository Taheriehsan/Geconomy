const API = "/api";
const fallbackLeadImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85";
const categories = {
  Markets: "بازارها",
  Economy: "اقتصاد",
  Business: "کسب‌وکار",
  Energy: "انرژی",
  Technology: "فناوری",
};
const copy = {
  en: {
    brand: "GLOBAL <b>ECONOMY</b>", homeLabel: "Global Economy home", globalMarkets: "GLOBAL MARKETS",
    searchPlaceholder: "Search markets & news", searchLabel: "Search markets and news", mainNavigation: "Main navigation",
    overview: "Overview", markets: "Markets", economy: "Economy", business: "Business", energy: "Energy", technology: "Technology",
    breaking: "BREAKING", nextHeadline: "Next breaking headline", briefing: "MONDAY BRIEFING <span>·</span> VOL. 09 / 2026",
    focus: "Markets in focus", lastUpdated: "LAST UPDATED", topStoryMarketWatch: "Top story and market watch",
    sampleData: "SAMPLE DATA", marketWatch: "Market watch", demo: "DEMO", marketCoverage: "View market coverage",
    theLatest: "THE LATEST", latestNews: "Latest news", filterNews: "Filter news", allStories: "All stories",
    noResults: "No stories match your search.", endBriefing: "END OF CURRENT BRIEFING",
    footerBrand: "GLOBAL ECONOMY <b>INTELLIGENCE</b>",
    footerDescription: "Independent perspective on the forces shaping markets.",
    illustrativeData: "ILLUSTRATIVE MARKET DATA · 2026", editorPick: "EDITOR'S PICK", readStory: "Read the story",
    readTime: "min read", minAgo: "min ago", hourAgo: "hour ago", hoursAgo: "hours ago", daysAgo: "days ago",
    feedsConnected: "feeds", cachedNews: "cached", sampleHeadlines: "sample headlines",
    pageTitle: "Global Economy | News & Markets", pageDescription: "Global economic news and market intelligence, all in one place.",
  },
  fa: {
    brand: "اقتصاد <b>جهانی</b>", homeLabel: "صفحهٔ اصلی اقتصاد جهانی", globalMarkets: "بازارهای جهانی",
    searchPlaceholder: "جست‌وجوی خبر و بازار", searchLabel: "جست‌وجوی خبر و بازار", mainNavigation: "ناوبری اصلی",
    overview: "نمای کلی", markets: "بازارها", economy: "اقتصاد", business: "کسب‌وکار", energy: "انرژی", technology: "فناوری",
    breaking: "خبر فوری", nextHeadline: "خبر فوری بعدی", briefing: "گزارش دوشنبه <span>·</span> شمارهٔ ۰۹ / ۲۰۲۶",
    focus: "بازارها در کانون توجه", lastUpdated: "آخرین به‌روزرسانی", topStoryMarketWatch: "خبر اصلی و دیده‌بان بازار",
    sampleData: "دادهٔ نمونه", marketWatch: "دیده‌بان بازار", demo: "آزمایشی", marketCoverage: "خبرهای بازار",
    theLatest: "تازه‌ترین‌ها", latestNews: "تازه‌ترین خبرها", filterNews: "دسته‌بندی خبرها", allStories: "همهٔ خبرها",
    noResults: "خبری با این جست‌وجو پیدا نشد.", endBriefing: "پایان گزارش فعلی",
    footerBrand: "اقتصاد جهانی <b>· دیدبان</b>",
    footerDescription: "نگاهی مستقل به نیروهای شکل‌دهندهٔ بازارها.",
    illustrativeData: "داده‌های نمایشی بازار · ۲۰۲۶", editorPick: "انتخاب سردبیر", readStory: "مشاهدهٔ خبر",
    readTime: "دقیقه مطالعه", minAgo: "دقیقه پیش", hourAgo: "ساعت پیش", hoursAgo: "ساعت پیش", daysAgo: "روز پیش",
    feedsConnected: "منبع متصل", cachedNews: "خبر ذخیره‌شده", sampleHeadlines: "خبر نمونه",
    pageTitle: "اقتصاد جهانی | خبر و بازار", pageDescription: "خبرهای اقتصادی جهان و اطلاعات بازار در یک نگاه.",
  },
};
const articleTranslations = {
  "lead-01": {
    title: "بانک‌های مرکزی با پایداری رشد اقتصادی، در کاهش نرخ بهره محتاط‌تر شدند",
    summary: "با تداوم فعالیت بخش خدمات و رشد دستمزدها در اقتصادهای بزرگ، سیاست‌گذاران رویکردی سنجیده‌تر نسبت به کاهش نرخ بهره در پیش گرفته‌اند.",
  },
  "markets-02": {
    title: "رشد سهام جهانی ادامه یافت؛ شرکت‌های تراشه‌ساز فناوری را بالا کشیدند",
    summary: "با ثبات بازده اوراق قرضه و در آستانه انتشار آمار مهم تورم، سرمایه‌گذاران دوباره به سهام رشدمحور روی آوردند.",
  },
  "business-03": {
    title: "تولیدکنندگان اروپایی سرمایه‌گذاری در زنجیره‌های تأمین منطقه‌ای را افزایش می‌دهند",
    summary: "یک نظرسنجی تازه از تغییر پایدار در هزینه‌کرد سرمایه‌ای شرکت‌ها برای تاب‌آوری بیشتر و کوتاه‌شدن زمان تحویل حکایت دارد.",
  },
  "energy-04": {
    title: "افزایش ظرفیت انرژی پاک، هزینه برق در جهان را دوباره به کانون توجه آورد",
    summary: "سرمایه‌گذاری در شبکه و ظرفیت ذخیره‌سازی، به محدودیت‌های اصلی پیش‌روی رشد سریع انرژی‌های تجدیدپذیر تبدیل شده‌اند.",
  },
  "tech-05": {
    title: "سرمایه‌گذاری هوش مصنوعی، تقاضای مراکز داده را زیر ذره‌بین برد",
    summary: "شرکت‌های برق و سرمایه‌گذاران بررسی می‌کنند ظرفیت تازه با چه سرعتی می‌تواند نیاز انرژی موج بعدی رایانش را تأمین کند.",
  },
  "economy-06": {
    title: "با کاهش شتاب دلار، سرمایه‌های تازه به بازارهای نوظهور وارد می‌شوند",
    summary: "کاهش نوسان ارز به برخی مدیران صندوق‌ها فرصت داده است در اقتصادهای منتخبِ درحال‌توسعه سرمایه‌گذاری کنند.",
  },
};
const breakingTranslations = [
  "وزیران دارایی گروه هفت برای هماهنگی در برابر فشارهای تازه بر زنجیرهٔ تأمین توافق کردند",
  "اعتماد مصرف‌کنندگان منطقهٔ یورو اندکی افزایش یافت و انتظار تورمی کاهش پیدا کرد",
  "با بررسی تازه‌ترین پیش‌بینی‌های تقاضا، نفت برنت به زیر ۷۵ دلار رسید",
];
let articles = [];
let activeCategory = "All";
let breaking = [];
let breakingIndex = 0;
let language = localStorage.getItem("global-economy-language") === "fa" ? "fa" : "en";
let sourceStatus = { mode: "sample", successful: 0, total: 0 };
let dataUpdatedAt = "";

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const persianDigits = value => String(value).replace(/\d/g, digit => "۰۱۲۳۴۵۶۷۸۹"[digit]);
const localizedArticle = article => ({ ...article, ...(language === "fa" ? articleTranslations[article.id] : {}) });
const localizedCategory = category => language === "fa" ? (categories[category] || category) : category;

function localizedTime(value) {
  if (language !== "fa") return value;
  return value
    .replace(" min ago", ` ${copy.fa.minAgo}`)
    .replace(" hour ago", ` ${copy.fa.hourAgo}`)
    .replace(" hours ago", ` ${copy.fa.hoursAgo}`)
    .replace(" days ago", ` ${copy.fa.daysAgo}`)
    .replace(/\d+/g, persianDigits);
}

function applyLanguage() {
  const isPersian = language === "fa";
  const dictionary = copy[language];
  document.documentElement.lang = language;
  document.documentElement.dir = isPersian ? "rtl" : "ltr";
  document.title = dictionary.pageTitle;
  document.querySelector('meta[name="description"]').content = dictionary.pageDescription;
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const value = dictionary[element.dataset.i18n];
    if (value !== undefined) element.innerHTML = value;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    element.placeholder = dictionary[element.dataset.i18nPlaceholder];
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach(element => {
    element.setAttribute("aria-label", dictionary[element.dataset.i18nAriaLabel]);
  });
  const toggle = document.querySelector("#language-toggle");
  toggle.textContent = isPersian ? "English" : "فارسی";
  toggle.setAttribute("aria-label", isPersian ? "Switch language to English" : "Switch language to Persian");
  const dateParts = Object.fromEntries(new Intl.DateTimeFormat(isPersian ? "fa-IR-u-ca-persian" : "en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Tehran",
  }).formatToParts(new Date()).map(part => [part.type, part.value]));
  document.querySelector("#date-label").textContent = isPersian
    ? `${dateParts.weekday}، ${dateParts.day} ${dateParts.month} ${dateParts.year}`
    : `${dateParts.weekday}, ${dateParts.day} ${dateParts.month} ${dateParts.year}`.toUpperCase();
  const updatedAt = document.querySelector("#updated-at");
  const updatedDate = dataUpdatedAt ? new Date(dataUpdatedAt) : null;
  const updatedTime = updatedDate && !Number.isNaN(updatedDate.getTime())
    ? new Intl.DateTimeFormat(isPersian ? "fa-IR" : "en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC", hour12: false }).format(updatedDate)
    : "--:--";
  updatedAt.textContent = `${updatedTime} UTC`;
  const connected = sourceStatus.successful || 0;
  const total = sourceStatus.total || 0;
  let statusText = sourceStatus.mode === "sample"
    ? dictionary.sampleHeadlines
    : connected
      ? `${isPersian ? persianDigits(connected) : connected}/${isPersian ? persianDigits(total) : total} ${dictionary.feedsConnected}`
      : dictionary.cachedNews;
  document.querySelector("#source-count").textContent = ` · ${statusText}`;
  renderBreaking();
  renderLead(articles.find(item => item.featured) || articles[0]);
  renderNews();
  tickClock();
}

function renderLead(rawArticle) {
  if (!rawArticle) return;
  const article = localizedArticle(rawArticle);
  const category = localizedCategory(article.category);
  document.querySelector("#lead-story").innerHTML = `
    <img class="lead-image" src="${escapeHtml(article.image || fallbackLeadImage)}" alt="${language === "fa" ? "نمایی از منطقهٔ مالی" : "Financial district at dawn"}" onerror="this.src='${fallbackLeadImage}'">
    <div class="lead-copy"><div class="lead-kicker"><span></span> ${copy[language].editorPick} <span></span> ${escapeHtml(category)}</div>
    <h2>${escapeHtml(article.title)}</h2><p>${escapeHtml(article.summary)}</p>
    <div class="story-meta"><span class="source">${escapeHtml(article.source)}</span><span class="meta-dot">·</span><span>${escapeHtml(localizedTime(article.time))}</span><span class="meta-dot">·</span><span>${language === "fa" ? `${persianDigits(article.readTime.match(/\d+/)?.[0] || "")} ${copy.fa.readTime}` : escapeHtml(article.readTime)}</span></div>
    <a class="read-link" href="${escapeHtml(article.url)}" target="_blank" rel="noopener">${copy[language].readStory} <span>↗</span></a></div>`;
}

function renderMarkets(markets) {
  document.querySelector("#market-list").innerHTML = markets.items.map(item => `<div class="market-row"><span class="market-symbol">${escapeHtml(item.symbol)}</span><span class="market-value">${escapeHtml(item.value)}</span><span class="market-change ${item.direction === "up" ? "up" : "down"}">${escapeHtml(item.change)}</span></div>`).join("");
}

function renderBreaking() {
  if (!breaking.length) return;
  const visible = [0, 1].map(offset => breaking[(breakingIndex + offset) % breaking.length]);
  document.querySelector("#breaking-items").innerHTML = visible.map((item, index) => {
    const text = language === "fa" ? breakingTranslations[(breakingIndex + index) % breakingTranslations.length] : item.text;
    const time = language === "fa" ? persianDigits(item.time) : item.time;
    return `${index ? '<span class="breaking-separator"></span>' : ""}<span><span class="break-time">${escapeHtml(time)}</span>${escapeHtml(text)}</span>`;
  }).join("");
}

function renderNews() {
  const query = document.querySelector("#search").value.trim().toLocaleLowerCase(language === "fa" ? "fa-IR" : "en");
  const list = articles.filter(item => !item.featured)
    .filter(item => activeCategory === "All" || item.category === activeCategory)
    .filter(item => {
      const translated = localizedArticle(item);
      const searchable = `${translated.title} ${translated.summary} ${item.title} ${item.summary} ${item.source} ${localizedCategory(item.category)}`;
      return !query || searchable.toLocaleLowerCase(language === "fa" ? "fa-IR" : "en").includes(query);
    });
  document.querySelector("#news-grid").innerHTML = list.map((rawArticle, index) => {
    const item = localizedArticle(rawArticle);
    const title = escapeHtml(item.title);
    return `<article class="news-card">
      <div class="card-image-wrap"><img class="card-image" src="${escapeHtml(item.image || fallbackLeadImage)}" alt="" loading="lazy" onerror="this.src='${fallbackLeadImage}'"><span class="image-index">0${index + 1} / ${String(list.length).padStart(2,"0")}</span></div>
      <div class="card-copy"><div class="card-category">${escapeHtml(localizedCategory(item.category))}</div><h3>${title}</h3><p>${escapeHtml(item.summary)}</p>
      <div class="card-footer"><span class="source">${escapeHtml(item.source)}</span><span>·</span><span>${escapeHtml(localizedTime(item.time))}</span><span class="push"></span><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener" aria-label="${escapeHtml(copy[language].readStory)}: ${title}">↗</a></div></div></article>`;
  }).join("");
  document.querySelector("#empty-state").hidden = list.length !== 0;
}

async function initialize() {
  let payload;
  try {
    const response = await fetch(`${API}/news`);
    if (!response.ok) throw new Error("API unavailable");
    payload = await response.json();
    const marketsResponse = await fetch(`${API}/markets`);
    renderMarkets(await marketsResponse.json());
  } catch {
    const response = await fetch("/data/news.json");
    payload = await response.json();
    renderMarkets(payload.markets);
  }
  articles = payload.articles;
  breaking = payload.breaking || [];
  sourceStatus = payload.sourceStatus || { mode: "sample", successful: 0, total: 0 };
  dataUpdatedAt = payload.updatedAt || "";
  applyLanguage();
}

document.querySelectorAll("[data-category]").forEach(control => control.addEventListener("click", event => {
  const category = control.dataset.category;
  event.preventDefault();
  activeCategory = category;
  document.querySelectorAll(".filter").forEach(button => button.classList.toggle("active", button.dataset.category === category));
  document.querySelectorAll(".nav-item").forEach(link => link.classList.toggle("active", link.dataset.category === category));
  renderNews();
  document.querySelector("#latest").scrollIntoView({ behavior: "smooth", block: "start" });
}));

document.querySelector("#language-toggle").addEventListener("click", () => {
  language = language === "en" ? "fa" : "en";
  localStorage.setItem("global-economy-language", language);
  applyLanguage();
});
document.querySelector("#search").addEventListener("input", renderNews);
document.querySelector("#breaking-next").addEventListener("click", () => { breakingIndex = (breakingIndex + 1) % Math.max(1, breaking.length); renderBreaking(); });
document.addEventListener("keydown", event => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    document.querySelector(".searchbox").classList.add("open");
    document.querySelector("#search").focus();
  }
  if (event.key === "Escape") { document.querySelector("#search").blur(); document.querySelector(".searchbox").classList.remove("open"); }
});

function tickClock() {
  const now = new Date();
  const time = new Intl.DateTimeFormat(language === "fa" ? "fa-IR" : "en-GB", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "UTC", hour12: false,
  }).format(now);
  document.querySelector("#clock").textContent = `${time} UTC`;
}

tickClock();
setInterval(tickClock, 1000);
initialize().catch(error => { console.error(error); document.querySelector("#empty-state").hidden = false; });
setInterval(() => initialize().catch(error => console.error(error)), 5 * 60 * 1000);
