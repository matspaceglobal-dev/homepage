/* =========================================================
   공통 헤더 · 메뉴 · 푸터 · 언어 전환(KO/EN) · 수정하지 않아도 돼요
   메뉴 항목은 config.js 의 services 에서 바꿔요.
   영어 문구는 각 페이지 HTML 의 data-en="..." 안에 있어요.
   ========================================================= */
(function () {
  const CFG = window.MATSPACE_CONFIG || {};
  const body = document.body;
  const ROOT = body.dataset.root || "";
  const PREVIEW = !!window.__PREVIEW__;
  const link = p => (PREVIEW ? "#/" + p : ROOT + (p || "./"));
  const img = f => (window.__ASSETS__ && window.__ASSETS__[f]) || ROOT + "images/" + f;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const services = CFG.services || [];
  const esc = s => String(s).replace(/"/g, "&quot;");
  // 한국어/영어 두 가지를 가진 텍스트 조각
  const t = (ko, en, tag = "span", attrs = "") => `<${tag} ${attrs} data-en="${esc(en)}">${ko}</${tag}>`;

  const logo = `
    <span class="logo-mark"><img src="${img("logo-symbol.svg")}" alt="" /></span>
    <img class="logo-word" src="${img("logo-wordmark.svg")}" alt="Mat Space" />`;
  const langBtn = `<button class="lang-btn" data-lang-toggle aria-label="Language / 언어"><span data-l="ko">KO</span><span data-l="en">EN</span></button>`;

  /* ---------- 헤더 ---------- */
  $("#site-header").outerHTML = `
  <header class="header" id="header">
    <div class="container header-inner">
      <a data-link="" class="logo" aria-label="Mat Space">${logo}</a>
      <nav class="nav" aria-label="Menu">
        ${t("회사소개", "About", "a", 'data-link="#about" data-nav="home"')}
        <div class="nav-drop">
          <button class="nav-drop-btn" aria-haspopup="true" data-nav="service">${t("서비스", "Services")} <span class="arrow" aria-hidden="true">▾</span></button>
          <div class="nav-drop-menu">
            ${services.map(s => t(s.name, s.nameEn || s.name, "a", `data-link="${s.path}"`)).join("")}
          </div>
        </div>
        ${t("오늘 내 상태 확인하기", "Check My Vibe Today", "a", 'data-link="today/index.html" data-nav="today"')}
        ${t("공고", "Notice", "a", 'data-link="notice/" data-nav="notice"')}
        ${t("문의하기", "Contact", "a", `href="mailto:${CFG.email}"`)}
      </nav>
      <div class="header-right">
        ${langBtn}
        ${t("사주일기 시작하기", "Start Saju Diary", "a", 'class="btn btn-yellow btn-sm app-link header-cta" target="_blank" rel="noopener"')}
        <button class="menu-btn" id="menuBtn" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>
      </div>
    </div>
  </header>
  <div class="mobile-menu" id="mobileMenu" hidden>
    <nav class="container">
      ${t("회사소개", "About", "a", 'data-link="#about"')}
      ${t("서비스", "Services", "p", 'class="mm-group"')}
      ${services.map(s => t("└ " + s.name, "└ " + (s.nameEn || s.name), "a", `class="mm-sub" data-link="${s.path}"`)).join("")}
      ${t("오늘 내 상태 확인하기", "Check My Vibe Today", "a", 'data-link="today/index.html"')}
      ${t("공고", "Notice", "a", 'data-link="notice/"')}
      ${t("문의하기", "Contact", "a", `href="mailto:${CFG.email}"`)}
      ${t("사주일기 시작하기", "Start Saju Diary", "a", 'class="btn btn-yellow btn-block app-link" target="_blank" rel="noopener"')}
    </nav>
  </div>`;

  /* ---------- 푸터 ---------- */
  $("#site-footer").outerHTML = `
  <footer class="footer">
    <div class="container footer-inner">
      <div>
        <a data-link="" class="logo">${logo}</a>
        ${t("나를 이해하는 웰니스, 맛스페이스", "Wellness for understanding yourself — Mat Space", "p", 'class="footer-desc"')}
      </div>
      <div class="footer-cols">
        <div>
          ${t("서비스", "Services", "p", 'class="footer-key"')}
          ${services.map(s => t(s.name, s.nameEn || s.name, "a", `data-link="${s.path}"`)).join("")}
          ${t("오늘 내 상태 확인하기", "Check My Vibe Today", "a", 'data-link="today/index.html"')}
        </div>
        <div>
          ${t("회사", "Company", "p", 'class="footer-key"')}
          ${t("회사소개", "About", "a", 'data-link="#about"')}
          ${t("공고", "Notice", "a", 'data-link="notice/"')}
        </div>
        <div>
          <p class="footer-key">Contact us</p>
          <a href="mailto:${CFG.email}">${CFG.email}</a>
          <a class="insta-link" target="_blank" rel="noopener">Instagram @matspace.official</a>
        </div>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>© <span class="year"></span> Mat Space. All rights reserved.<br />
        ${t("이 사이트의 모든 콘텐츠에 대한 권리는 맛스페이스(Mat Space)에 있습니다.", "All rights to the content of this site belong to Mat Space.")}</p>
      ${t("관리자", "Admin", "a", 'class="admin-link" id="btnAdmin" data-link="notice/#admin"')}
    </div>
  </footer>`;

  /* ---------- 링크 채우기 ---------- */
  $$("[data-link]").forEach(a => {
    const v = a.dataset.link;
    if (v.startsWith("#")) a.href = link("") + v;
    else { const [p, hash] = v.split("#"); a.href = link(p) + (hash ? "#" + hash : ""); }
  });
  $$(".app-link").forEach(a => (a.href = CFG.appStoreUrl));
  $$(".insta-link").forEach(a => (a.href = CFG.instagramUrl));
  $$(".year").forEach(el => (el.textContent = new Date().getFullYear()));

  /* ---------- 언어 전환 ---------- */
  const store = {
    get() { try { return localStorage.getItem("matspace-lang"); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem("matspace-lang", v); } catch (e) {} }
  };
  const titleKo = document.title;
  function applyLang(lang) {
    document.documentElement.lang = lang;
    $$("[data-en]").forEach(el => {
      if (el.dataset.ko === undefined) el.dataset.ko = el.innerHTML;
      el.innerHTML = lang === "en" ? el.dataset.en : el.dataset.ko;
    });
    $$("[data-en-placeholder]").forEach(el => {
      if (el.dataset.koPlaceholder === undefined) el.dataset.koPlaceholder = el.placeholder;
      el.placeholder = lang === "en" ? el.dataset.enPlaceholder : el.dataset.koPlaceholder;
    });
    document.title = lang === "en" && body.dataset.titleEn ? body.dataset.titleEn : titleKo;
    $$("[data-lang-toggle] span").forEach(s => s.classList.toggle("on", s.dataset.l === lang));
    window.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }
  window.MATSPACE_LANG = () => document.documentElement.lang === "en" ? "en" : "ko";
  window.MATSPACE_APPLY_LANG = () => applyLang(window.MATSPACE_LANG());
  const urlLang = new URLSearchParams(location.search).get("lang");
  const browserEn = !/^ko/i.test(navigator.language || "ko");
  applyLang(urlLang || store.get() || (browserEn ? "en" : "ko"));
  document.addEventListener("click", e => {
    if (!e.target.closest("[data-lang-toggle]")) return;
    const next = window.MATSPACE_LANG() === "en" ? "ko" : "en";
    store.set(next);
    applyLang(next);
  });

  /* ---------- 헤더 스크롤 / 모바일 메뉴 ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const menu = $("#mobileMenu");
  const menuBtn = $("#menuBtn");
  const setMenu = open => {
    menu.hidden = !open;
    menuBtn.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open);
    body.classList.toggle("no-scroll", open);
  };
  menuBtn.addEventListener("click", () => setMenu(menu.hidden));
  menu.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });

  const drop = $(".nav-drop");
  $(".nav-drop-btn").addEventListener("click", e => { e.stopPropagation(); drop.classList.toggle("open"); });
  document.addEventListener("click", () => drop.classList.remove("open"));

  /* ---------- 스크롤 등장 효과 ---------- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 })
    : null;
  const reveal = () => $$(".reveal:not(.in)").forEach(el => (io ? io.observe(el) : el.classList.add("in")));

  const markNav = () => {
    const page = body.dataset.page;
    $$("[data-nav]").forEach(a => a.classList.toggle("active",
      (a.dataset.nav === "service" && page.startsWith("service")) || a.dataset.nav === page));
  };

  /* ---------- 미리보기 전용: 페이지 전환 ---------- */
  if (PREVIEW) {
    const route = () => {
      const h = decodeURIComponent(location.hash.slice(2));
      const [path, anchor] = h.split("#");
      let found = false;
      $$(".pv-page").forEach(p => { const on = p.dataset.path === path; p.hidden = !on; if (on) { found = true; body.dataset.page = p.dataset.page; } });
      if (!found) { $$(".pv-page").forEach(p => (p.hidden = p.dataset.path !== "")); body.dataset.page = "home"; }
      markNav(); reveal(); onScroll();
      if (anchor === "admin") { window.scrollTo(0, 0); window.openAdminLogin && window.openAdminLogin(); }
      else if (anchor && $("#" + anchor)) setTimeout(() => $("#" + anchor).scrollIntoView(), 30);
      else window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", route);
    route();
  } else {
    markNav(); reveal();
  }
})();
