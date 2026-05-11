// ═══════════════════════════════════════════════
//  리이오의 연습장 — Google Analytics 4
//  Measurement ID: G-FG0Q3EQFWM
//
//  페이지 하이어라키
//  ───────────────────────────────────────────────
//  L0  홈 (리이오의 연습장)               /
//   ├─ L1  철학                           /philosophy.html
//   ├─ L1  서재                           /library.html
//   ├─ L1  생각                           /thoughts.html
//   ├─ L1  아카데미                       /academy.html
//   ├─ L1  도구                           /tools.html
//   ├─ L1  편지함                         /mentoring.html
//   └─ L1  혼자 만들기                    /join.html
//        └─ L2  솔로 빌딩 노트            /solo-builders/
//             ├─ L3  App Store 출시       /solo-builders/app-store-checklist.html
//             └─ L3  오래 만드는 일       /solo-builders/monetization-worksheet.html
// ═══════════════════════════════════════════════

(function () {
  var GA_ID = 'G-FG0Q3EQFWM';

  // 1) gtag.js 로드
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  (document.head || document.documentElement).appendChild(s);

  // 2) dataLayer + gtag 준비
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());

  // 3) 베이스 경로(`/LeeoNote/`) 제거한 깔끔한 page_path
  var rawPath = location.pathname + location.search;
  var cleanPath = rawPath.replace(/^\/LeeoNote(\/|$)/, '/');

  // 4) 페이지 하이어라키 분류
  function classify(path) {
    // 쿼리·해시 제거 + index.html → / 정규화
    var p = path.split('?')[0].split('#')[0].replace(/index\.html$/, '');

    if (p === '/' || p === '') {
      return {
        l1: '홈',
        title: '리이오의 연습장',
        depth: 0,
        parent: null,
        group: '홈'
      };
    }
    if (p === '/philosophy.html')
      return { l1: '철학', title: '철학', depth: 1, parent: '홈', group: '홈 > 철학' };
    if (p === '/library.html')
      return { l1: '서재', title: '서재', depth: 1, parent: '홈', group: '홈 > 서재' };
    if (p === '/thoughts.html')
      return { l1: '생각', title: '생각', depth: 1, parent: '홈', group: '홈 > 생각' };
    if (p === '/academy.html')
      return { l1: '아카데미', title: '아카데미', depth: 1, parent: '홈', group: '홈 > 아카데미' };
    if (p === '/tools.html')
      return { l1: '도구', title: '도구', depth: 1, parent: '홈', group: '홈 > 도구' };
    if (p === '/mentoring.html')
      return { l1: '편지함', title: '편지함', depth: 1, parent: '홈', group: '홈 > 편지함' };
    if (p === '/join.html' || p === '/join-career.html' || p === '/join-launcher.html')
      return { l1: '혼자 만들기', title: '혼자 만들기', depth: 1, parent: '홈', group: '홈 > 혼자 만들기' };

    if (p === '/solo-builders/' || p === '/solo-builders')
      return {
        l1: '혼자 만들기',
        l2: '솔로 빌딩 노트',
        title: '솔로 빌딩 노트',
        depth: 2,
        parent: '혼자 만들기',
        group: '홈 > 혼자 만들기 > 솔로 빌딩 노트'
      };
    if (p === '/solo-builders/app-store-checklist.html')
      return {
        l1: '혼자 만들기',
        l2: '솔로 빌딩 노트',
        l3: 'App Store 출시',
        title: 'App Store 출시 체크리스트',
        depth: 3,
        parent: '솔로 빌딩 노트',
        group: '홈 > 혼자 만들기 > 솔로 빌딩 노트 > App Store 출시'
      };
    if (p === '/solo-builders/monetization-worksheet.html')
      return {
        l1: '혼자 만들기',
        l2: '솔로 빌딩 노트',
        l3: '오래 만드는 일',
        title: '오래 만드는 일',
        depth: 3,
        parent: '솔로 빌딩 노트',
        group: '홈 > 혼자 만들기 > 솔로 빌딩 노트 > 오래 만드는 일'
      };

    return { l1: 'Other', title: document.title, depth: 99, parent: null, group: 'Other' };
  }

  var h = classify(cleanPath);

  // 5) 초기 설정 + 페이지뷰 (page_path / page_title + 하이어라키 메타데이터)
  gtag('config', GA_ID, {
    page_path: cleanPath,
    page_title: document.title,
    content_group: h.group,                  // GA4 콘텐츠 그룹: "홈 > 혼자 만들기 > 솔로 빌딩 노트"
    transport_type: 'beacon',
    anonymize_ip: true
  });

  gtag('set', 'user_properties', {
    project: 'LeeoNote'
  });

  // 모든 이벤트에 자동으로 따라붙을 공통 파라미터
  gtag('set', {
    section_l1: h.l1 || '(none)',
    section_l2: h.l2 || '(none)',
    section_l3: h.l3 || '(none)',
    page_depth: h.depth,
    page_parent: h.parent || '(root)'
  });

  // 6) 외부 링크 클릭
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.href || '';
    if (!href || href.indexOf('http') !== 0) return;
    if (href.indexOf(location.hostname) !== -1) return;
    gtag('event', 'outbound_click', {
      url: href,
      page_path: cleanPath,
      from_section: h.l1 || '(none)',
      link_text: (a.textContent || '').trim().substring(0, 80),
      transport_type: 'beacon'
    });
  });

  // 7) 내부 네비게이션 클릭 — 하이어라키 흐름 추적
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!href || href.indexOf('http') === 0 || href.indexOf('mailto:') === 0 || href.indexOf('#') === 0) return;
    // 상대/절대 내부 링크만
    try {
      var target = new URL(a.href, location.href);
      if (target.hostname !== location.hostname) return;
      var targetPath = target.pathname.replace(/^\/LeeoNote(\/|$)/, '/');
      var to = classify(targetPath);
      gtag('event', 'internal_nav', {
        from_path: cleanPath,
        from_section: h.l1 || '(none)',
        to_path: targetPath,
        to_section: to.l1 || '(none)',
        depth_delta: (to.depth ?? 99) - (h.depth ?? 0),
        transport_type: 'beacon'
      });
    } catch (_) { /* malformed URL — 무시 */ }
  });

  // 8) 스크롤 깊이
  var tracked = {};
  window.addEventListener('scroll', function () {
    var html = document.documentElement;
    var scrollable = html.scrollHeight - html.clientHeight;
    if (scrollable <= 0) return;
    var pct = Math.round((html.scrollTop / scrollable) * 100);
    [25, 50, 75, 100].forEach(function (t) {
      if (pct >= t && !tracked[t]) {
        tracked[t] = true;
        gtag('event', 'scroll_depth', {
          percent: t,
          page_path: cleanPath,
          section: h.l1 || '(none)',
          transport_type: 'beacon'
        });
      }
    });
  }, { passive: true });

  // 9) 페이지 체류 시간
  var enteredAt = Date.now();
  window.addEventListener('pagehide', function () {
    var seconds = Math.round((Date.now() - enteredAt) / 1000);
    if (seconds < 1) return;
    gtag('event', 'page_dwell', {
      seconds: seconds,
      page_path: cleanPath,
      section: h.l1 || '(none)',
      depth: h.depth,
      transport_type: 'beacon'
    });
  });
})();
