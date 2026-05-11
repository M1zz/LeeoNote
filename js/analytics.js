// ═══════════════════════════════════════════════
//  리이오의 연습장 — Google Analytics 4
//  Measurement ID: G-FG0Q3EQFWM
// ═══════════════════════════════════════════════

(function () {
  var GA_ID = 'G-FG0Q3EQFWM';

  // 1) gtag.js 로드 (async 동작 — head에서 async 로 불러도 안전)
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  (document.head || document.documentElement).appendChild(s);

  // 2) dataLayer + gtag 준비
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());

  // 3) GitHub Pages 베이스 경로(`/LeeoNote/`) 제거한 깔끔한 page_path
  var rawPath = location.pathname + location.search;
  var cleanPath = rawPath.replace(/^\/LeeoNote(\/|$)/, '/');
  if (cleanPath === '/') cleanPath = '/';

  var project =
    location.pathname.indexOf('/LeeoNote') === 0 ? 'LeeoNote' :
    location.pathname.indexOf('/cs-swiftUI') === 0 ? 'cs-swiftUI' :
    'local';

  // 4) 초기 페이지뷰 — page_path / page_title 명시
  gtag('config', GA_ID, {
    page_path: cleanPath,
    page_title: document.title,
    transport_type: 'beacon',
    anonymize_ip: true
  });
  gtag('set', 'user_properties', { project: project });

  // 5) 외부 링크 클릭 (이탈 직전 beacon 으로 안정 전송)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.href || '';
    if (!href || href.indexOf('http') !== 0) return;
    if (href.indexOf(location.hostname) !== -1) return;
    gtag('event', 'outbound_click', {
      url: href,
      page_path: cleanPath,
      link_text: (a.textContent || '').trim().substring(0, 80),
      transport_type: 'beacon'
    });
  });

  // 6) 스크롤 깊이 — 25 / 50 / 75 / 100%
  var tracked = {};
  function onScroll() {
    var h = document.documentElement;
    var scrollable = h.scrollHeight - h.clientHeight;
    if (scrollable <= 0) return;
    var pct = Math.round((h.scrollTop / scrollable) * 100);
    [25, 50, 75, 100].forEach(function (t) {
      if (pct >= t && !tracked[t]) {
        tracked[t] = true;
        gtag('event', 'scroll_depth', {
          percent: t,
          page_path: cleanPath,
          transport_type: 'beacon'
        });
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // 7) 페이지 체류 시간 — 떠날 때 한 번
  var enteredAt = Date.now();
  function onLeave() {
    var seconds = Math.round((Date.now() - enteredAt) / 1000);
    if (seconds < 1) return;
    gtag('event', 'page_dwell', {
      seconds: seconds,
      page_path: cleanPath,
      transport_type: 'beacon'
    });
  }
  // pagehide 가 bfcache/iOS 에서 더 안정적
  window.addEventListener('pagehide', onLeave);
})();
