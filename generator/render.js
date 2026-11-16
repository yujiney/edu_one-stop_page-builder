/* 데이터(JSON) → 6개 HTML 페이지 + sitemap/robots/vercel.json
   기존 사이트의 마크업·클래스를 그대로 사용하므로 styles.css 는 수정할 필요가 없습니다. */
(function (root) {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function list(a) {
    return (a || []).map(function (s) { return String(s).trim(); }).filter(Boolean);
  }
  function brs(s, cls) {
    return String(s == null ? "" : s).split("\n").map(function (t) { return esc(t.trim()); })
      .join("<br" + (cls ? ' class="' + cls + '"' : "") + "> ");
  }
  function oneLine(s) { return String(s == null ? "" : s).replace(/\s*\n\s*/g, " ").trim(); }

  /* 한국어 조사 */
  function hasBatchim(s) {
    var c = String(s).trim().slice(-1).charCodeAt(0);
    if (c < 0xAC00 || c > 0xD7A3) return false;
    return (c - 0xAC00) % 28 !== 0;
  }
  function ro(s) {
    var c = String(s).trim().slice(-1).charCodeAt(0);
    if (c < 0xAC00 || c > 0xD7A3) return "로";
    var j = (c - 0xAC00) % 28;
    return (j === 0 || j === 8) ? "로" : "으로";
  }
  function eul(s) { return hasBatchim(s) ? "을" : "를"; }

  /* "12:00 – 16:00" → "오후 12시 ~ 4시" */
  function koTime(t) {
    var m = String(t || "").match(/(\d{1,2}):(\d{2})\s*[–~\-]\s*(\d{1,2}):(\d{2})/);
    if (!m) return String(t || "");
    function part(h, mi, withPrefix) {
      var pre = h < 12 ? "오전 " : "오후 ";
      var h12 = h % 12 === 0 ? 12 : h % 12;
      return (withPrefix ? pre : "") + h12 + "시" + (mi ? " " + mi + "분" : "");
    }
    var h1 = +m[1], m1 = +m[2], h2 = +m[3], m2 = +m[4];
    return part(h1, m1, true) + " ~ " + part(h2, m2, (h1 < 12) !== (h2 < 12));
  }

  var PG = {
    program:   { file: "program.html",   label: "프로그램 소개",     sec: "SECTION 01", color: "yellow" },
    education: { file: "education.html", label: "교육 내용 및 일정", sec: "SECTION 02", color: "blue" },
    lineup:    { file: "lineup.html",    label: "라인업",           sec: "SECTION 03", color: "coral" },
    apply:     { file: "apply.html",     label: "신청 페이지",       sec: "SECTION 04", color: "purple" },
    goods:     { file: "goods.html",     label: "굿즈 소개",         sec: "SECTION 05", color: "green" }
  };
  var ORDER = ["program", "education", "lineup", "apply", "goods"];
  var NAV = ["program", "education", "lineup", "goods"];
  var ARROW = '<path stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7m0 0H8m9 0v9"/>';
  var LOCK = '<rect x="4" y="10.2" width="16" height="10.8" rx="2.6" stroke="currentColor" stroke-width="1.5"/><path d="M7.8 10.2V7.4a4.2 4.2 0 0 1 8.4 0v2.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="15.1" r="1.35" fill="currentColor"/><path d="M12 16.4v2.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>';

  function base(d) { return String(d.site.domain || "").replace(/\/+$/, ""); }

  /* ---------- 공통 조각 ---------- */
  function head(d, title, desc, path) {
    var url = base(d) + path;
    return '<!DOCTYPE html>\n<html lang="ko">\n<head>\n<meta charset="UTF-8">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      "<title>" + esc(title) + "</title>\n" +
      '<meta name="description" content="' + esc(desc) + '">\n' +
      '<link rel="canonical" href="' + esc(url) + '">\n\n' +
      '<meta name="robots" content="index, follow">\n' +
      '<meta property="og:type" content="website">\n' +
      '<meta property="og:site_name" content="' + esc(d.site.org) + '">\n' +
      '<meta property="og:title" content="' + esc(title) + '">\n' +
      '<meta property="og:description" content="' + esc(desc) + '">\n' +
      '<meta property="og:url" content="' + esc(url) + '">\n' +
      '<meta property="og:image" content="' + esc(base(d) + "/og-image.png") + '">\n' +
      '<meta property="og:locale" content="ko_KR">\n' +
      '<meta name="twitter:card" content="summary_large_image">\n\n' +
      '<link rel="stylesheet" as="style" crossorigin\n      href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">\n\n' +
      '<link rel="stylesheet" href="styles.css">\n</head>\n\n';
  }

  function header(d, active) {
    var dark = active === "index";
    var I = d.images;
    var hdr = dark ? "border-b bg-ink/80 border-white/10 backdrop-blur-md" : "border-b bg-white/20 border-black/10 backdrop-blur-md";
    var link = dark ? "text-white/60 hover:bg-white/10 hover:text-white" : "text-black/55 hover:bg-black/10 hover:text-ink";
    var on = "rounded-lg px-3.5 py-2 text-sm font-bold bg-black/10 text-ink";
    var cta = dark ? "bg-white text-ink hover:bg-white/85" : "bg-ink text-white hover:bg-ink/85";
    var btn = dark ? "text-white hover:bg-white/10" : "text-ink hover:bg-black/10";
    var mWrap = dark ? "border-t bg-ink border-white/10" : "border-t bg-white/50 border-black/10";
    var mLink = dark ? "text-white/80 hover:bg-white/10" : "text-black/75 hover:bg-black/10";
    var mCta = dark ? "bg-white text-ink" : "bg-ink text-white";

    var nav = NAV.map(function (k) {
      var p = PG[k];
      return k === active
        ? '      <a href="' + p.file + '" class="' + on + '">' + esc(p.label) + "</a>\n"
        : '      <a href="' + p.file + '" class="rounded-lg px-3.5 py-2 text-sm font-medium transition ' + link + '">' + esc(p.label) + "</a>\n";
    }).join("");
    var mob = ['      <a href="index.html" class="block rounded-lg px-3 py-3 text-[15px] font-medium transition ' + mLink + '">처음으로</a>\n']
      .concat(NAV.map(function (k) {
        return '      <a href="' + PG[k].file + '" class="block rounded-lg px-3 py-3 text-[15px] font-medium transition ' + mLink + '">' + esc(PG[k].label) + "</a>\n";
      })).join("");

    return '<header class="sticky top-0 z-50 ' + hdr + '">\n' +
      '  <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">\n' +
      '    <a href="index.html" class="site-logo" aria-label="' + esc(d.site.org) + ' 홈">\n' +
      '      <img src="' + esc(dark ? I.logoWhite : I.logoBlack) + '" alt="' + esc(d.site.org) + '">\n    </a>\n' +
      '    <nav class="hidden items-center gap-1 md:flex" aria-label="주요 메뉴">\n' + nav +
      '      <a href="apply.html" class="ml-2 rounded-lg px-4 py-2 text-sm font-bold transition ' + cta + '">신청하기</a>\n    </nav>\n' +
      '    <button id="menuBtn" type="button"\n            class="inline-flex h-10 w-10 items-center justify-center rounded-lg transition ' + btn + ' md:hidden"\n' +
      '            aria-controls="mobileMenu" aria-expanded="false" aria-label="메뉴 열기">\n' +
      '      <svg id="iconOpen" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"/></svg>\n' +
      '      <svg id="iconClose" class="hidden h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 18 18 6M6 6l12 12"/></svg>\n' +
      '    </button>\n  </div>\n' +
      '  <div id="mobileMenu" class="hidden ' + mWrap + ' md:hidden">\n' +
      '    <nav class="mx-auto max-w-6xl space-y-1 px-5 py-4 sm:px-6" aria-label="모바일 메뉴">\n' + mob +
      '      <a href="apply.html" class="mt-2 block rounded-lg px-3 py-3 text-center text-[15px] font-bold ' + mCta + '">신청하기</a>\n' +
      "    </nav>\n  </div>\n</header>\n\n";
  }

  function poster(d) {
    var I = d.images;
    return '  <section class="poster">\n    <picture>\n' +
      '      <source media="(min-width:640px)" srcset="' + esc(I.posterWide) + '">\n' +
      '      <img src="' + esc(I.posterTall) + '" alt="' + esc(I.posterAlt) + '" class="poster-img">\n' +
      "    </picture>\n  </section>\n\n";
  }

  function intro(key, desc) {
    var p = PG[key];
    var h1 = key === "program" ? p.label : p.label;
    return '  <section>\n    <div class="mx-auto max-w-6xl px-5 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">\n' +
      '      <a href="index.html" class="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white/40 px-4 py-2 text-[13.5px] font-semibold text-black/70 transition hover:border-black/50 hover:bg-white/70">\n' +
      '        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0 6-6m-6 6 6 6"/></svg>\n        처음으로\n      </a>\n' +
      '      <div class="mt-10 animate-fade-up">\n' +
      '        <p class="text-[12.5px] font-bold tracking-[.22em] text-black/45">' + p.sec + "</p>\n" +
      '        <h1 class="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">' + esc(h1) + "</h1>\n" +
      '        <p class="mt-6 max-w-2xl text-[16px] font-medium leading-relaxed text-black/60 sm:text-lg">' + esc(desc) + "</p>\n" +
      "      </div>\n    </div>\n  </section>\n\n";
  }

  function more(self) {
    var cards = ORDER.filter(function (k) { return k !== self; }).map(function (k) {
      var p = PG[k];
      return '        <a href="' + p.file + '" class="group flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white px-6 py-6 transition hover:-translate-y-1 hover:shadow-lg">\n' +
        "          <div>\n            <p class=\"text-[11.5px] font-bold tracking-[.18em] text-black/40\">" + p.sec + "</p>\n" +
        '            <p class="mt-2 text-lg font-bold">' + esc(p.label) + "</p>\n          </div>\n" +
        '          <span class="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-card-' + p.color + '">\n' +
        '            <svg class="h-4 w-4 text-black/70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24">' + ARROW + "</svg>\n          </span>\n        </a>\n";
    }).join("");
    return '  <section class="border-t border-black/10">\n    <div class="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">\n' +
      '      <p class="text-[13px] font-bold tracking-[.2em] text-black/40">MORE</p>\n' +
      '      <h2 class="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">다른 내용도 살펴보세요</h2>\n' +
      '      <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">\n' + cards + "      </div>\n    </div>\n  </section>\n\n";
  }

  function footer(d) {
    var S = d.site;
    var map = ORDER.map(function (k) {
      return '          <li><a href="' + PG[k].file + '" class="text-sm text-white/60 transition hover:text-white">' + esc(PG[k].label) + "</a></li>\n";
    }).join("");
    return '<footer class="bg-ink text-white">\n  <div class="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8">\n' +
      '    <div class="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-8">\n' +
      '      <div class="col-span-2 sm:col-span-1">\n        <div class="foot-logo">\n          <img src="' + esc(d.images.logoWhite) + '" alt="' + esc(S.org) + '">\n        </div>\n' +
      '        <p class="mt-4 text-sm leading-relaxed text-white/45">' + esc(S.address) + "<br>" + esc(S.org) + "</p>\n      </div>\n" +
      '      <div>\n        <h3 class="text-xs font-bold tracking-[.18em] text-white/35">사이트맵</h3>\n        <ul class="mt-4 space-y-3">\n' +
      '          <li><a href="program.html" class="text-sm text-white/60 transition hover:text-white">' + esc(PG.program.label) + "</a></li>\n" +
      map.replace(/^          <li><a href="program\.html"[^\n]*\n/, "") +
      "        </ul>\n      </div>\n" +
      '      <div>\n        <h3 class="text-xs font-bold tracking-[.18em] text-white/35">문의</h3>\n        <ul class="mt-4 space-y-3 text-sm text-white/60">\n' +
      "          <li>" + esc(S.team) + "</li>\n          <li>" + esc(S.phone) + "</li>\n" +
      '          <li><a href="mailto:' + esc(S.email) + '" class="transition hover:text-white">' + esc(S.email) + "</a></li>\n        </ul>\n      </div>\n    </div>\n" +
      '    <div class="mt-12 border-t border-white/10 pt-7">\n      <p class="text-xs text-white/30">© ' + esc(S.year) + " " + esc(S.orgEn) + ".</p>\n    </div>\n  </div>\n</footer>\n\n";
  }

  var SCRIPT = "<script>\n" +
    "  var btn=document.getElementById('menuBtn'), menu=document.getElementById('mobileMenu'),\n" +
    "      iO=document.getElementById('iconOpen'), iC=document.getElementById('iconClose');\n" +
    "  function setMenu(open){\n" +
    "    menu.classList.toggle('hidden',!open); iO.classList.toggle('hidden',open); iC.classList.toggle('hidden',!open);\n" +
    "    btn.setAttribute('aria-expanded',String(open)); btn.setAttribute('aria-label', open?'메뉴 닫기':'메뉴 열기');\n" +
    "  }\n" +
    "  btn.addEventListener('click',function(){ setMenu(menu.classList.contains('hidden')); });\n" +
    "  menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',function(){ setMenu(false); }); });\n" +
    "  window.matchMedia('(min-width: 768px)').addEventListener('change',function(e){ if(e.matches) setMenu(false); });\n" +
    "  document.addEventListener('keydown',function(e){\n" +
    "    if(e.key==='Escape' && !menu.classList.contains('hidden')) setMenu(false);\n" +
    "  });\n\n" +
    "  /* 터치 기기: 화면 중앙 카드 강조 */\n" +
    "  var noHover=window.matchMedia('(hover: none)').matches;\n" +
    "  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;\n" +
    "  if(noHover && !reduce && 'IntersectionObserver' in window){\n" +
    "    var io=new IntersectionObserver(function(es){\n" +
    "      es.forEach(function(e){ e.target.classList.toggle('is-on', e.isIntersecting); });\n" +
    "    },{ rootMargin:'-38% 0px -38% 0px' });\n" +
    "    document.querySelectorAll('.card').forEach(function(c){ io.observe(c); });\n" +
    "  }\n</script>\n</body>\n</html>\n";

  function wrap(d, key, title, desc, path, inner) {
    var bodyCls = key === "index" ? "bg-ink text-white" : "bg-card-" + PG[key].color + " text-ink";
    return head(d, title, desc, path) +
      '<body class="' + bodyCls + ' font-sans antialiased">\n\n' +
      header(d, key) + "<main>\n" + inner + "</main>\n\n" + footer(d) + SCRIPT;
  }

  function pageTitle(d, key) { return PG[key].label + " | " + d.site.name; }
  function statusOpen(s) { return s === "open"; }

  /* ---------- index ---------- */
  var CARDS = [
    ["program",   "--r:-2deg; --l:8%; --t:0px; --w:30%; --rd:-2deg; --z:20;",   "cardProgram"],
    ["education", "--r:2deg; --l:35%; --t:44px; --w:30%; --rd:1.5deg; --z:10;", "cardEducation"],
    ["lineup",    "--r:-1.5deg; --l:62%; --t:6px; --w:30%; --rd:2.5deg; --z:15;", "cardLineup"],
    ["apply",     "--r:2deg; --l:21%; --t:352px; --w:30%; --rd:-1.5deg; --z:30;", "cardApply"],
    ["goods",     "--r:-2deg; --l:48%; --t:392px; --w:30%; --rd:1deg; --z:40;", "cardGoods"]
  ];
  function pageIndex(d) {
    var H = d.home;
    var cards = CARDS.map(function (c, i) {
      var p = PG[c[0]];
      return "        <!-- 카드 0" + (i + 1) + " · " + esc(p.label) + " -->\n" +
        '        <a href="' + p.file + '" class="card group"\n           style="' + c[1] + '">\n' +
        '          <div class="card-head flex items-center justify-between gap-4 bg-card-' + p.color + ' px-6 pb-9 pt-6 sm:px-7">\n' +
        '            <span class="text-[19px] font-extrabold leading-snug tracking-tight text-black sm:text-[22px]">' + esc(p.label) + "</span>\n" +
        '            <svg class="h-6 w-6 flex-none text-black/70 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24">\n              ' + ARROW + "\n            </svg>\n          </div>\n" +
        '          <div class="card-body card-body--framed bg-card-' + p.color + '">\n            <img src="' + esc(d.images[c[2]]) + '" alt="' + esc(p.label) + '">\n          </div>\n        </a>\n\n';
    }).join("");
    var inner = poster(d) +
      '  <section id="program" class="bg-ink">\n    <div class="mx-auto max-w-4xl px-5 py-16 text-center sm:px-6 sm:py-20 lg:py-24">\n' +
      '      <p class="animate-fade-up text-[13px] font-bold tracking-[.22em] text-white/40">' + esc(H.kicker) + "</p>\n" +
      '      <p class="mt-6 animate-fade-up text-lg font-medium leading-relaxed text-white sm:text-2xl sm:leading-relaxed" style="animation-delay:.08s">\n        ' + brs(H.lead, "hidden sm:block") + "\n      </p>\n" +
      '      <p class="mx-auto mt-6 max-w-xl animate-fade-up text-[15px] leading-relaxed text-white/50 sm:text-base" style="animation-delay:.16s">\n        ' + esc(oneLine(H.sub)) + "\n      </p>\n    </div>\n  </section>\n\n" +
      '  <section id="cards" class="bg-ink pb-6">\n    <div class="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">\n\n' +
      '      <div class="collage grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12">\n\n' + cards + "      </div>\n    </div>\n  </section>\n\n" +
      '  <section class="bg-ink">\n    <div class="mx-auto max-w-6xl px-5 pb-24 pt-10 text-center sm:px-6 sm:pb-32">\n' +
      '      <p class="inline-block rounded-full bg-white/10 px-7 py-4 text-[15px] font-medium text-white/85 sm:text-base">\n        ' + esc(H.hint) + "\n      </p>\n    </div>\n  </section>\n\n";
    return wrap(d, "index", d.site.name + " | 한양대학교", H.metaDesc, "/", inner);
  }

  /* ---------- program ---------- */
  function pageProgram(d) {
    var P = d.program;
    var inner = poster(d) + intro("program", P.heroDesc) +
      '<section>\n    <div class="mx-auto max-w-6xl px-5 pb-16 sm:px-6 sm:pb-20 lg:px-8">\n' +
      '      <div class="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">\n' +
      '        <h2 class="text-2xl font-extrabold tracking-tight sm:text-3xl">' + esc(P.title) + '<br class="hidden lg:block"> <span class="pg-round">' + esc(P.round) + "</span></h2>\n" +
      '        <div class="max-w-3xl">\n          <p class="pg-tagline">' + esc(P.tagline) + "</p>\n\n" +
      '          <ul class="pg-ask">\n' + list(P.questions).map(function (q) { return "            <li>" + esc(q) + "</li>\n"; }).join("") + "          </ul>\n\n" +
      '          <div class="space-y-5 text-[16px] leading-relaxed text-black/70 sm:text-[17px]">\n' + list(P.paragraphs).map(function (q) { return "            <p>" + esc(q) + "</p>\n"; }).join("") + "          </div>\n" +
      "        </div>\n      </div>\n    </div>\n  </section>\n\n" + more("program");
    return wrap(d, "program", pageTitle(d, "program"), P.heroDesc, "/program.html", inner);
  }

  /* ---------- education ---------- */
  function lecturerFact(d) {
    var L = d.lecturer;
    return "<div><dt>강연</dt><dd>" + esc(L.org) + "<em>" + esc((L.name + " " + L.title).trim()) + "</em></dd></div>";
  }
  function pageEducation(d) {
    var P = d.program, E = d.education;
    var open = statusOpen(P.status);
    var ses = (E.sessions || []).map(function (s) {
      return '            <article class="edu-ses">\n              <div class="edu-ses__when">\n' +
        '                <p class="edu-ses__no">' + esc(s.no) + "</p>\n" +
        '                <p class="edu-ses__date">' + esc(s.date) + "</p>\n" +
        '                <p class="edu-ses__dow">' + esc(s.dow) + "</p>\n" +
        '                <p class="edu-ses__time">' + esc(s.time) + "</p>\n              </div>\n" +
        '              <div class="edu-ses__body">\n                <h4 class="edu-ses__title">' + esc(s.title) + "</h4>\n" +
        '                <p class="edu-ses__lead">' + esc(s.lead) + "</p>\n" +
        '                <ul class="edu-ses__items">\n' + list(s.items).map(function (t) { return "                  <li>" + esc(t) + "</li>\n"; }).join("") + "                </ul>\n" +
        "              </div>\n            </article>\n";
    }).join("");
    var locked = E.showLocked
      ? '        <article class="edu-card edu-card--locked">\n          <div class="edu-card__head">\n            <h3 class="edu-name">추후 공개</h3>\n' +
        '            <span class="edu-biglock"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' + LOCK + "</svg></span>\n          </div>\n        </article>\n"
      : "";
    var inner = poster(d) + intro("education", E.heroDesc) +
      '<section>\n    <div class="mx-auto max-w-6xl px-5 pb-16 sm:px-6 sm:pb-20 lg:px-8">\n' +
      '      <h2 class="text-2xl font-extrabold tracking-tight sm:text-3xl">' + esc(E.sectionTitle) + "</h2>\n\n" +
      '      <div class="mt-12 space-y-5">\n\n' +
      '        <article class="edu-card">\n          <div class="edu-card__head">\n            <div class="edu-card__title">\n' +
      '              <p class="edu-month">' + esc(P.month) + "<span>월</span></p>\n" +
      '              <h3 class="edu-name">' + esc(P.title) + "</h3>\n            </div>\n" +
      '            <span class="edu-badge' + (open ? " edu-badge--on" : "") + '">' + (open ? "접수 중" : "마감") + "</span>\n          </div>\n\n" +
      '          <div class="edu-card__body">\n            <p class="edu-intro">\n              ' + esc(oneLine(E.intro)) + "\n            </p>\n\n" +
      '            <div class="edu-sessions">\n\n' + ses + "            </div>\n\n" +
      '            <dl class="edu-facts">\n              ' + lecturerFact(d) + "\n" +
      "              <div><dt>장소</dt><dd>" + esc(P.venue) + "<em>" + esc(P.venueSub) + "</em></dd></div>\n" +
      "              <div><dt>대상</dt><dd>" + esc(P.audience) + "<em>" + esc(P.audienceSub) + "</em></dd></div>\n" +
      "              <div><dt>참가비</dt><dd>" + esc(P.fee) + "<em>" + esc(P.feeSub) + "</em></dd></div>\n            </dl>\n\n" +
      (open ? '            <a href="' + esc(d.apply.hylu) + '" target="_blank" rel="noopener" class="edu-cta">교육 신청하기</a>\n' : "") +
      "          </div>\n        </article>\n" + locked + "\n      </div>\n\n    </div>\n  </section>\n\n" + more("education");
    return wrap(d, "education", pageTitle(d, "education"), E.heroDesc, "/education.html", inner);
  }

  /* ---------- lineup ---------- */
  var ROWCOLOR = ["pink", "purple", "yellow", "mint"];
  function pageLineup(d) {
    var L = d.lecturer, U = d.lineup, P = d.program;
    var tutor = "";
    if (L.show) {
      var li = function (a) {
        return list(a.map(function (x) { return x.text; })).length
          ? a.filter(function (x) { return String(x.text).trim(); }).map(function (x) {
              return "                <li>" + esc(x.text) + (String(x.note || "").trim() ? " <em>" + esc(x.note) + "</em>" : "") + "</li>\n";
            }).join("")
          : "";
      };
      tutor = '      <p class="text-[13px] font-bold tracking-[.2em] text-black/40">LECTURER</p>\n' +
        '      <h2 class="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">' + esc(L.sectionTitle) + "</h2>\n\n" +
        '      <div class="tutor">\n\n        <div class="tutor__body">\n          <div class="tutor__head">\n' +
        '            <img class="tutor__logo" src="' + esc(L.logo) + '" alt="' + esc(L.org) + ' 로고">\n            <div>\n' +
        '              <p class="tutor__org">' + esc(L.org) + "</p>\n" +
        '              <h3 class="tutor__name">' + esc(L.name) + " <span>" + esc(L.title) + "</span></h3>\n            </div>\n          </div>\n" +
        '          <p class="tutor__lead">\n            ' + esc(oneLine(L.lead)) + "\n          </p>\n\n" +
        '          <div class="tutor__grid">\n            <div>\n              <h4>주요 경력</h4>\n              <ul>\n' + li(L.careers || []) + "              </ul>\n            </div>\n\n" +
        '            <div>\n              <h4>저서</h4>\n              <ul>\n' + li(L.books || []) + "              </ul>\n            </div>\n          </div>\n" +
        (list(L.projects).length
          ? '\n          <div class="tutor__proj">\n            <h4>대표 프로젝트</h4>\n            <p>\n              ' +
            list(L.projects).map(esc).join("<span>·</span>") + "\n            </p>\n          </div>\n"
          : "") +
        "        </div>\n      </div>\n";
    }
    var rows = (d.education.sessions || []).map(function (s, i) {
      var open = s.status === "open";
      var dowShort = String(s.dow || "").charAt(0);
      return '        <li class="lu-row lu-row--' + ROWCOLOR[i % 4] + (open ? " is-open" : "") + '">\n\n          <div class="lu-info">\n' +
        '            <div class="lu-top">\n              <span class="lu-no">' + esc(s.no) + "</span>\n" +
        (s.status === "none" ? "" : '              <span class="lu-status ' + (open ? "lu-status--on" : "lu-status--off") + '">' + (open ? "접수 중" : "마감") + "</span>\n") +
        "            </div>\n\n" +
        '            <p class="lu-date">\n              <span class="lu-date__num">' + esc(s.date) + "</span>\n" +
        '              <span class="lu-date__day">' + esc(dowShort + " · " + koTime(s.time)) + "</span>\n            </p>\n\n" +
        '            <h3 class="lu-title">' + esc(s.title) + "</h3>\n\n" +
        '            <ul class="lu-curric">\n' + list(s.items).map(function (t) { return "              <li>" + esc(t) + "</li>\n"; }).join("") + "            </ul>\n\n" +
        '            <dl class="lu-meta">\n              ' + lecturerFact(d) + "\n" +
        "              <div><dt>장소</dt><dd>" + esc(P.venue) + "<em>" + esc(P.venueSub) + "</em></dd></div>\n            </dl>\n          </div>\n\n        </li>\n";
    }).join("");
    var n = (d.education.sessions || []).length;
    var lockedRows = "";
    for (var i = 0; i < (+U.lockedCount || 0); i++) {
      lockedRows += '        <li class="lu-row lu-row--locked">\n          <div class="lu-info">\n            <div class="lu-top">\n              <span class="lu-no">' + (n + i + 1) + "회차</span>\n            </div>\n" +
        '            <p class="lu-date">\n              <span class="lu-date__num">?? . ??</span>\n            </p>\n            <h3 class="lu-title">추후 공개</h3>\n          </div>\n' +
        '          <span class="lu-biglock"><svg class="big-lock" viewBox="0 0 24 24" fill="none" aria-hidden="true">' + LOCK + "</svg></span>\n        </li>\n";
    }
    var open = statusOpen(P.status);
    var inner = poster(d) + intro("lineup", U.heroDesc) +
      '<section>\n    <div class="mx-auto max-w-6xl px-5 pb-16 sm:px-6 sm:pb-20 lg:px-8">\n' + tutor + "    </div>\n  </section>\n\n" +
      '  <section class="border-t border-black/10">\n    <div class="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">\n\n' +
      '      <p class="text-[13px] font-bold tracking-[.2em] text-black/40">SCHEDULE</p>\n      <h2 class="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">회차별 일정</h2>\n\n' +
      '      <ol class="lu-list">\n\n' + rows + lockedRows + "      </ol>\n\n" +
      (String(U.notice || "").trim() ? '      <p class="mt-8 text-[13px] text-black/50">\n        ' + esc(U.notice) + "\n      </p>\n\n" : "") +
      '      <div class="mt-10 flex flex-col gap-3 sm:flex-row">\n' +
      (open ? '        <a href="' + esc(d.apply.hylu) + '" target="_blank" rel="noopener" class="inline-flex w-full items-center justify-center rounded-xl bg-ink px-7 py-4 text-[15px] font-bold text-white transition hover:-translate-y-0.5 sm:w-auto">교육 신청하기</a>\n' : "") +
      '        <a href="education.html" class="inline-flex w-full items-center justify-center rounded-xl border-2 border-black/25 px-7 py-4 text-[15px] font-bold transition hover:-translate-y-0.5 hover:bg-black/5 sm:w-auto">커리큘럼 자세히 보기</a>\n' +
      "      </div>\n    </div>\n  </section>\n\n" + more("lineup");
    return wrap(d, "lineup", pageTitle(d, "lineup"), U.heroDesc, "/lineup.html", inner);
  }

  /* ---------- apply ---------- */
  function pageApply(d) {
    var A = d.apply, P = d.program;
    var open = statusOpen(P.status);
    var step3 = String(A.step3 || "").trim() ||
      "시작 10분 전까지 " + P.venue + " " + P.venueSub + ro(P.venueSub || P.venue) + " 오시면 됩니다.";
    var steps = [
      ["STEP 1", "HY-LU 접속", "한양대 비교과 통합관리 시스템(HY-LU)에 한양인 통합 계정으로 로그인합니다."],
      ["STEP 2", "프로그램 신청", "「" + P.title + "」" + eul(P.title) + " 찾아 신청합니다. 아래 QR로 바로 이동할 수 있습니다."],
      ["STEP 3", "교육 참여", step3]
    ].map(function (s) {
      return '        <li class="rounded-2xl border border-black/10 bg-white p-7">\n          <p class="text-[12px] font-bold tracking-[.2em] text-black/40">' + s[0] + "</p>\n" +
        '          <h3 class="mt-4 text-lg font-bold">' + s[1] + "</h3>\n" +
        '          <p class="mt-2 text-[14.5px] leading-relaxed text-black/55">' + esc(s[2]) + "</p>\n        </li>\n";
    }).join("");
    var inner = poster(d) + intro("apply", A.heroDesc) +
      '<section>\n    <div class="mx-auto max-w-6xl px-5 pb-16 sm:px-6 sm:pb-20 lg:px-8">\n' +
      '      <h2 class="text-2xl font-extrabold tracking-tight sm:text-3xl">세 단계로 끝납니다</h2>\n' +
      '      <ol class="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">\n' + steps + "      </ol>\n\n" +
      '      <div class="apply-route">\n        <div class="apply-route__text">\n          <p class="apply-route__label">신청 방법</p>\n' +
      '          <p class="apply-route__path">\n            한양대 비교과 통합관리 시스템 <strong>HY-LU</strong> 접속\n            <span aria-hidden="true">›</span>\n' +
      "            <strong>「" + esc(P.title) + "」</strong> 신청\n          </p>\n" +
      '          <p class="apply-route__sub">휴대폰으로 오른쪽 QR을 찍으면 신청 화면으로 바로 이동합니다.</p>\n' +
      '          <a class="apply-route__link" href="' + esc(A.hylu) + '" target="_blank" rel="noopener">HY-LU 신청 페이지 열기\n' +
      '            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7m0 0H8m9 0v9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>\n          </a>\n        </div>\n' +
      '        <figure class="apply-qr">\n          <img src="images/apply-qr.png" alt="' + esc(P.title) + ' 신청 QR 코드">\n          <figcaption>QR로 바로 신청</figcaption>\n        </figure>\n      </div>\n\n' +
      '      <div class="mt-12 rounded-3xl bg-ink px-7 py-12 text-center text-white sm:px-12 sm:py-14">\n' +
      '        <h3 class="text-2xl font-extrabold tracking-tight sm:text-3xl">' + (open ? "지금 신청할 수 있는 교육" : "교육 안내") + "</h3>\n" +
      '        <p class="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-white/60">\n          ' + esc(oneLine(A.note)) + "\n        </p>\n" +
      '        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">\n' +
      '          <a href="' + esc(A.hylu) + '" target="_blank" rel="noopener" class="inline-flex w-full items-center justify-center rounded-xl bg-card-purple px-7 py-4 text-[15px] font-bold text-ink transition hover:-translate-y-0.5 sm:w-auto">HY-LU에서 신청하기</a>\n' +
      '          <a href="education.html" class="inline-flex w-full items-center justify-center rounded-xl border-2 border-white/25 px-7 py-4 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10 sm:w-auto">교육 내용 보기</a>\n' +
      "        </div>\n      </div>\n    </div>\n  </section>\n\n" + more("apply");
    return wrap(d, "apply", pageTitle(d, "apply"), A.heroDesc, "/apply.html", inner);
  }

  /* ---------- goods ---------- */
  function pageGoods(d) {
    var G = d.goods;
    var items = (G.items || []).map(function (g, i) {
      var no = "GOODS " + (i < 9 ? "0" : "") + (i + 1);
      return '        <div class="goods-card overflow-hidden rounded-2xl bg-white">\n          <div class="aspect-[4/3] overflow-hidden">\n' +
        '            <img src="' + esc(g.img) + '" alt="' + esc(g.name) + '" class="h-full w-full object-cover">\n          </div>\n          <div class="p-6">\n' +
        '            <p class="text-[11.5px] font-bold tracking-[.18em] text-black/40">' + no + "</p>\n" +
        '            <h3 class="mt-3 text-lg font-bold">' + esc(g.name) + "</h3>\n" +
        '            <p class="mt-2 text-[14.5px] leading-relaxed text-black/55">' + esc(g.desc) + "</p>\n" +
        (String(g.cond || "").trim() ? '            <p class="goods-cond">' + esc(g.cond) + "</p>\n" : "") +
        "          </div>\n        </div>\n";
    }).join("");
    var inner = poster(d) + intro("goods", G.heroDesc) +
      '<section>\n    <div class="mx-auto max-w-6xl px-5 pb-16 sm:px-6 sm:pb-20 lg:px-8">\n' +
      '      <h2 class="text-2xl font-extrabold tracking-tight sm:text-3xl">' + brs(G.headline, "hidden sm:block") + "</h2>\n" +
      '      <div class="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">\n\n' + items + "      </div>\n    </div>\n  </section>\n\n" + more("goods");
    return wrap(d, "goods", pageTitle(d, "goods"), G.heroDesc, "/goods.html", inner);
  }

  /* ---------- SEO · 배포 설정 ---------- */
  function sitemap(d, date) {
    var b = base(d);
    var urls = [["/", "1.0"], ["/program.html", "0.8"], ["/education.html", "0.9"], ["/lineup.html", "0.8"], ["/apply.html", "0.9"], ["/goods.html", "0.7"]];
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.map(function (u) {
        return "  <url>\n    <loc>" + esc(b + u[0]) + "</loc>\n    <lastmod>" + date + "</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>" + u[1] + "</priority>\n  </url>\n";
      }).join("") + "</urlset>\n";
  }
  function robots(d) {
    return "User-agent: *\nAllow: /\n\nSitemap: " + base(d) + "/sitemap.xml\n";
  }
  var VERCEL = JSON.stringify({
    cleanUrls: true, trailingSlash: false,
    headers: [
      { source: "/images/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/styles.css", headers: [{ key: "Cache-Control", value: "public, max-age=604800" }] }
    ]
  }, null, 2) + "\n";

  function build(d, date) {
    var out = {};
    out["index.html"] = pageIndex(d);
    out["program.html"] = pageProgram(d);
    out["education.html"] = pageEducation(d);
    out["lineup.html"] = pageLineup(d);
    out["apply.html"] = pageApply(d);
    out["goods.html"] = pageGoods(d);
    out["sitemap.xml"] = sitemap(d, date);
    out["robots.txt"] = robots(d);
    out["vercel.json"] = VERCEL;
    return out;
  }

  var api = { build: build, pages: ["index", "program", "education", "lineup", "apply", "goods"] };
  if (typeof module !== "undefined") module.exports = api;
  root.SiteRender = api;
})(typeof window !== "undefined" ? window : globalThis);
