// ═══════════════════════════════════════════════════════════════
//  Leeo Sites — Unified Google Analytics 4
//  Measurement ID: G-FG0Q3EQFWM
//
//  같은 파일을 세 레포에 복사해 사용합니다.
//   - LeeoNote                /LeeoNote/js/analytics.js
//   - swift-data-structures   /swift-data-structures/docs/assets/analytics.js
//   - cs-swiftUI              /cs-swiftUI/docs/assets/analytics.js
//
//  hostname 은 모두 m1zz.github.io. 프로젝트는 pathname 의
//  첫 세그먼트로 자동 식별됩니다.
//
//  하이어라키  (2026-08 사이트 구조 개편 반영)
//  ───────────────────────────────────────────────────────────────
//   L0 홈 (LeeoNote /)
//    ├─ L1 ABOUT ─ L2 여는 글
//    ├─ L1 생각 ─ L2 고찰 ─ L3 <노트 id>
//    ├─ L1 성장 프레임워크
//    │    ├─ L2 질문고리 학습 · 레버 찾기 · 망하지 않기   (세 축)
//    │    ├─ L2 성장 기술 열둘 · 학습 설계 · AI 학습 · 배움의 프로세스
//    │    └─ L2 필드 매뉴얼 ─ L3 삼각측량 · 야장 · 첫 말뚝
//    ├─ L1 도구
//    ├─ L1 직접 만들기 ─ L2 솔로 빌딩 노트 ─ L3 각 노트
//    ├─ L1 서재 · 편지함
//    └─ L1 아카데미
//         ├─ L2 Swift 자료구조   (swift-data-structures /)
//         │    └─ L3 학습 · 치트시트 · 문제 · 면접 · 가이드
//         └─ L2 CS × SwiftUI     (cs-swiftUI /)
//              ├─ L3 Stage 1 ─ L4 1-1 / 1-2 / 1-3 / 1-4
//              ├─ L3 Stage 2 ─ L4 2-1 / 2-2 / 2-3 / 2-4
//              ├─ L3 클론 코딩 ─ L4 projects/*
//              └─ L3 블로그 · 셋업 · 문법 · 컴포넌트 레퍼런스
// ═══════════════════════════════════════════════════════════════

(function () {
  var GA_ID = 'G-FG0Q3EQFWM';

  // 1) gtag.js 로드
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  (document.head || document.documentElement).appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());

  // ─────────────────────────────────────────────────────────────
  //  분류기
  // ─────────────────────────────────────────────────────────────

  function detectProject(pathname) {
    if (/^\/LeeoNote(\/|$)/.test(pathname)) return 'LeeoNote';
    if (/^\/swift-data-structures(\/|$)/.test(pathname)) return 'sds';
    if (/^\/cs-swiftUI(\/|$)/.test(pathname)) return 'cs';
    return 'local';
  }

  function stripPrefix(pathname) {
    return pathname.replace(/^\/(LeeoNote|swift-data-structures|cs-swiftUI)/, '') || '/';
  }

  function normalize(path) {
    return path.split('?')[0].split('#')[0].replace(/\/index\.html$/, '/') || '/';
  }

  function classify(absolutePath) {
    var project = detectProject(absolutePath);
    var path = normalize(stripPrefix(absolutePath));

    if (project === 'LeeoNote') return classifyLeeoNote(path);
    if (project === 'sds')      return classifySDS(path);
    if (project === 'cs')       return classifyCS(path);
    return { l1: 'Other', depth: 99, group: 'Other', project: project };
  }

  // ── LeeoNote ───────────────────────────────────────────────────
  function classifyLeeoNote(p) {
    if (p === '/' || p === '') return mk('LeeoNote', { l1: '홈', depth: 0, parent: null });

    // L1 — 상단 내비게이션과 같은 층
    var topMap = {
      '/about.html':         { l1: 'ABOUT',          parent: '홈' },
      '/thoughts.html':      { l1: '생각',            parent: '홈' },
      '/frameworks.html':    { l1: '성장 프레임워크',  parent: '홈' },
      '/tools.html':         { l1: '도구',            parent: '홈' },
      '/join.html':          { l1: '직접 만들기',      parent: '홈' },
      '/join-career.html':   { l1: '직접 만들기',      parent: '홈' },
      '/join-launcher.html': { l1: '직접 만들기',      parent: '홈' },
      '/academy.html':       { l1: '아카데미',        parent: '홈' },
      '/library.html':       { l1: '서재',            parent: '홈' },
      '/mentoring.html':     { l1: '편지함',          parent: '홈' }
    };
    if (topMap[p]) return mk('LeeoNote', Object.assign({ depth: 1 }, topMap[p]));

    // ABOUT 하위 — 여는 글
    if (p === '/philosophy.html') return mk('LeeoNote',
      { l1: 'ABOUT', l2: '여는 글', depth: 2, parent: 'ABOUT' });

    // 성장 프레임워크 하위
    var fw = {
      '/framework.html':        { name: '질문고리 학습',   axis: '푸는 축' },
      '/lever-loop.html':       { name: '레버 찾기',       axis: '고르는 축' },
      '/no-fail.html':          { name: '망하지 않기',     axis: '지키는 축' },
      '/skills.html':           { name: '성장 기술 열둘',  axis: '능력 축' },
      '/solo-learning.html':    { name: '학습 설계',       axis: '응용' },
      '/ai-learning.html':      { name: 'AI 학습',        axis: '응용' },
      '/learning-process.html': { name: '배움의 프로세스', axis: '운영 · 구상' }
    };
    if (fw[p]) {
      var hf = mk('LeeoNote',
        { l1: '성장 프레임워크', l2: fw[p].name, depth: 2, parent: '성장 프레임워크' });
      hf.axis = fw[p].axis;
      return hf;
    }

    // 필드 매뉴얼과 부록
    if (p === '/learning-design/') return mk('LeeoNote',
      { l1: '성장 프레임워크', l2: '필드 매뉴얼', depth: 2, parent: '성장 프레임워크' });
    var annex = {
      '/learning-design/triangulation.html': '삼각측량',
      '/learning-design/yajang.html':        '야장',
      '/learning-design/malttuk.html':       '첫 말뚝'
    };
    if (annex[p]) return mk('LeeoNote',
      { l1: '성장 프레임워크', l2: '필드 매뉴얼', l3: annex[p], depth: 3, parent: '필드 매뉴얼' });

    // 생각 하위 — 고찰 노트
    var mn = p.match(/^\/notes\/([^/]+)\.html$/);
    if (mn && mn[1].charAt(0) !== '_') return mk('LeeoNote',
      { l1: '생각', l2: '고찰', l3: mn[1], depth: 3, parent: '고찰' });

    // 직접 만들기 하위 — 솔로 빌딩 노트
    if (p === '/solo-builders/') return mk('LeeoNote',
      { l1: '직접 만들기', l2: '솔로 빌딩 노트', depth: 2, parent: '직접 만들기' });
    var sb = {
      '/solo-builders/app-store-checklist.html':   'App Store 출시',
      '/solo-builders/monetization-worksheet.html': '오래 만드는 일',
      '/solo-builders/recording-safety.html':       '공개 녹화 점검'
    };
    if (sb[p]) return mk('LeeoNote',
      { l1: '직접 만들기', l2: '솔로 빌딩 노트', l3: sb[p], depth: 3, parent: '솔로 빌딩 노트' });

    return mk('LeeoNote', { l1: 'Other', depth: 99, parent: null });
  }

  // ── swift-data-structures (아카데미 하위) ────────────────────────
  function classifySDS(p) {
    if (p === '/' || p === '') return mk('sds',
      { l1: '아카데미', l2: 'Swift 자료구조', depth: 2, parent: '아카데미' });

    var pages = {
      '/learn.html':         '학습',
      '/cheatsheet.html':    '치트시트',
      '/problems.html':      '문제',
      '/interview.html':     '면접',
      '/swift-ds-guide.html':'가이드',
      '/book.html':          '책'
    };
    if (pages[p]) return mk('sds',
      { l1: '아카데미', l2: 'Swift 자료구조', l3: pages[p], depth: 3, parent: 'Swift 자료구조' });

    // /products/* — 자료
    var m = p.match(/^\/products\/([^/]+)\.html$/);
    if (m) return mk('sds',
      { l1: '아카데미', l2: 'Swift 자료구조', l3: '자료', l4: m[1], depth: 4, parent: '자료' });

    return mk('sds',
      { l1: '아카데미', l2: 'Swift 자료구조', l3: 'Other', depth: 99, parent: 'Swift 자료구조' });
  }

  // ── cs-swiftUI (아카데미 하위) ────────────────────────────────────
  function classifyCS(p) {
    // /en/ 언어판 → 동일 분류 + lang 태그
    var lang = 'ko';
    if (/^\/en\//.test(p)) { lang = 'en'; p = p.replace(/^\/en/, ''); }

    if (p === '/' || p === '') {
      var h = mk('cs', { l1: '아카데미', l2: 'CS × SwiftUI', depth: 2, parent: '아카데미' });
      h.lang = lang; return h;
    }

    // 스테이지 허브
    var hub = { '/stage1.html': 'Stage 1', '/stage2.html': 'Stage 2', '/clone-coding.html': '클론 코딩' };
    if (hub[p]) {
      var hh = mk('cs', { l1: '아카데미', l2: 'CS × SwiftUI', l3: hub[p], depth: 3, parent: 'CS × SwiftUI' });
      hh.lang = lang; return hh;
    }

    // 챕터 1-1 ~ 1-4
    var m1 = p.match(/^\/1-(\d)\.html$/);
    if (m1) {
      var h1 = mk('cs', { l1: '아카데미', l2: 'CS × SwiftUI', l3: 'Stage 1', l4: '1-' + m1[1], depth: 4, parent: 'Stage 1' });
      h1.lang = lang; return h1;
    }
    var m2 = p.match(/^\/2-(\d)\.html$/);
    if (m2) {
      var h2 = mk('cs', { l1: '아카데미', l2: 'CS × SwiftUI', l3: 'Stage 2', l4: '2-' + m2[1], depth: 4, parent: 'Stage 2' });
      h2.lang = lang; return h2;
    }

    // 프로젝트 가이드
    var mp = p.match(/^\/projects\/([^/]+)\.html$/);
    if (mp) {
      var hp = mk('cs', { l1: '아카데미', l2: 'CS × SwiftUI', l3: '클론 코딩', l4: mp[1], depth: 4, parent: '클론 코딩' });
      hp.lang = lang; return hp;
    }

    // 단일 자료 페이지
    var single = {
      '/blog.html':          '블로그',
      '/setup.html':         '셋업',
      '/swift-grammar.html': 'Swift 문법',
      '/component-ref.html': '컴포넌트 레퍼런스'
    };
    if (single[p]) {
      var hs = mk('cs', { l1: '아카데미', l2: 'CS × SwiftUI', l3: single[p], depth: 3, parent: 'CS × SwiftUI' });
      hs.lang = lang; return hs;
    }

    var ho = mk('cs', { l1: '아카데미', l2: 'CS × SwiftUI', l3: 'Other', depth: 99, parent: 'CS × SwiftUI' });
    ho.lang = lang; return ho;
  }

  function mk(project, fields) {
    var root = (project === 'LeeoNote') ? ['홈'] : ['홈', '아카데미'];
    var added = [];
    if (fields.l1 && root[root.length - 1] !== fields.l1) added.push(fields.l1);
    if (fields.l2) added.push(fields.l2);
    if (fields.l3) added.push(fields.l3);
    if (fields.l4) added.push(fields.l4);
    var group = root.concat(added).join(' > ');
    return Object.assign({ project: project, group: group }, fields);
  }

  // ─────────────────────────────────────────────────────────────
  //  현재 페이지 분류 → 초기 설정
  // ─────────────────────────────────────────────────────────────

  var rawPath = location.pathname + location.search;
  var cleanPath = rawPath.replace(/^\/(LeeoNote|swift-data-structures|cs-swiftUI)(\/|$)/, '/');
  var h = classify(location.pathname);

  gtag('config', GA_ID, {
    page_path: cleanPath,
    page_title: document.title,
    content_group: h.group,
    transport_type: 'beacon',
    anonymize_ip: true
  });

  gtag('set', 'user_properties', {
    project: h.project
  });

  gtag('set', {
    section_l1: h.l1 || '(none)',
    section_l2: h.l2 || '(none)',
    section_l3: h.l3 || '(none)',
    section_l4: h.l4 || '(none)',
    page_depth: h.depth,
    page_parent: h.parent || '(root)',
    page_lang: h.lang || 'ko',
    fw_axis: h.axis || '(none)'
  });

  // ─────────────────────────────────────────────────────────────
  //  이벤트
  // ─────────────────────────────────────────────────────────────

  // 외부 링크
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.href || '';
    if (!href || href.indexOf('http') !== 0) return;
    // 같은 호스트(m1zz.github.io 안의 형제 프로젝트)는 internal_nav 로 잡힘
    try {
      var u = new URL(href);
      if (u.hostname === location.hostname) return;
    } catch (_) {}
    gtag('event', 'outbound_click', {
      url: href,
      from_section: h.l1 || '(none)',
      from_project: h.project,
      link_text: (a.textContent || '').trim().substring(0, 80),
      transport_type: 'beacon'
    });
  });

  // 내부 네비게이션 — 같은 호스트(형제 프로젝트 포함)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!href || href.indexOf('mailto:') === 0 || href.indexOf('#') === 0) return;
    try {
      var target = new URL(a.href, location.href);
      if (target.hostname !== location.hostname) return;
      var to = classify(target.pathname);
      var crossesProject = to.project !== h.project;
      gtag('event', 'internal_nav', {
        from_path: cleanPath,
        from_section: h.l1 || '(none)',
        from_project: h.project,
        to_path: target.pathname,
        to_section: to.l1 || '(none)',
        to_project: to.project,
        crosses_project: crossesProject,
        depth_delta: (to.depth ?? 99) - (h.depth ?? 0),
        transport_type: 'beacon'
      });
    } catch (_) {}
  });

  // ─────────────────────────────────────────────────────────────
  //  LeeoNote 전용 — 개편된 구조에 맞춘 상호작용
  //  (다른 프로젝트에서는 선택자가 없어 아무 일도 일어나지 않는다)
  // ─────────────────────────────────────────────────────────────

  function txt(el, sel) {
    if (!el) return '';
    var t = sel ? el.querySelector(sel) : el;
    return t ? (t.textContent || '').trim().replace(/\s+/g, ' ').substring(0, 80) : '';
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;

    // ① 홈 라우터 — 어떤 트랙 탭을 여는가
    var tab = e.target.closest('.track-tab');
    if (tab) {
      gtag('event', 'router_tab', {
        track: tab.getAttribute('data-track') || '(none)',
        tab_label: txt(tab, '.track-verb'),
        transport_type: 'beacon'
      });
      return;
    }

    // ② 홈 라우터 — 15개 증상 문장 중 무엇이 눌리는가 (안 눌리는 문장 = 잘못 쓴 문장)
    var sym = e.target.closest('.symptom');
    if (sym) {
      var panel = sym.closest('[data-track]');
      gtag('event', 'router_symptom', {
        track: panel ? panel.getAttribute('data-track') : '(none)',
        slot: txt(sym, '.symptom-num'),
        symptom: txt(sym, '.symptom-say'),
        destination: sym.getAttribute('href') || '',
        transport_type: 'beacon'
      });
      return;
    }

    // ③ 도구 — 읽고 가는가, 바로 받으러 가는가
    var btn = e.target.closest('.tool-btn');
    if (btn) {
      var card = btn.closest('.tool-card');
      gtag('event', 'tool_cta', {
        intent: btn.classList.contains('tool-btn--go') ? 'read_first' : 'get_tool',
        tool: txt(card, '.tool-name'),
        url: btn.href || '',
        transport_type: 'beacon'
      });
      return;
    }

    // ④ 프레임워크 — 세 축 중 무엇을 여는가
    var card = e.target.closest('.fw-card, .fw-core, .fw-index');
    if (card) {
      gtag('event', 'framework_open', {
        framework: txt(card, '.fw-name') || txt(card, '.fw-core-title') || txt(card, '.fw-index-k'),
        kind: card.classList.contains('fw-core') ? 'engine' :
              (card.classList.contains('fw-index') ? 'side' : 'framework'),
        url: card.href || '',
        transport_type: 'beacon'
      });
      return;
    }

    // ⑤ 고찰 — 어떤 글이 열리고, 어떤 태그로 걸러 보는가
    var row = e.target.closest('.nt-row');
    if (row) {
      gtag('event', 'note_open', {
        note_title: txt(row, '.nt-title'),
        status: txt(row, '.nt-badge'),
        external: /^https?:/.test(row.getAttribute('href') || '') ? 'yes' : 'no',
        transport_type: 'beacon'
      });
      return;
    }
    var chip = e.target.closest('.nt-chip');
    if (chip) {
      gtag('event', 'note_filter', { tag: txt(chip), transport_type: 'beacon' });
      return;
    }

    // ⑥ 같은 페이지 안의 칸 이동 — 로드맵 일곱 칸 · 도구 카테고리 · 프레임워크 층
    var jump = e.target.closest('.map-nav a, .kit-nav a, .fw-stack .go a, a[href^="#"]');
    if (jump) {
      var hash = (jump.getAttribute('href') || '').replace(/^.*#/, '');
      if (!hash) return;
      gtag('event', 'anchor_jump', {
        target_id: hash,
        label: txt(jump),
        page_path: cleanPath,
        section: h.l1 || '(none)',
        transport_type: 'beacon'
      });
    }
  });

  // 로드맵 · 관문처럼 긴 페이지에서 어떤 칸까지 실제로 내려갔는가
  (function () {
    var marks = document.querySelectorAll('.stagebox[id], .gate[id], .step, .layer');
    if (!marks.length || !('IntersectionObserver' in window)) return;
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var key = el.id || txt(el, '.stage-name') || txt(el, '.gate-name') ||
                  txt(el, '.step-name') || txt(el, '.layer-name');
        if (!key || seen[key]) return;
        seen[key] = true;
        gtag('event', 'section_view', {
          block: key,
          block_label: txt(el, '.stage-name') || txt(el, '.gate-name') ||
                       txt(el, '.step-name') || txt(el, '.layer-name'),
          page_path: cleanPath,
          section: h.l1 || '(none)',
          transport_type: 'beacon'
        });
        io.unobserve(el);
      });
    }, { threshold: 0.45 });
    Array.prototype.forEach.call(marks, function (el) { io.observe(el); });
  })();

  // 스크롤 깊이
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
          project: h.project,
          transport_type: 'beacon'
        });
      }
    });
  }, { passive: true });

  // 체류 시간
  var enteredAt = Date.now();
  window.addEventListener('pagehide', function () {
    var seconds = Math.round((Date.now() - enteredAt) / 1000);
    if (seconds < 1) return;
    gtag('event', 'page_dwell', {
      seconds: seconds,
      page_path: cleanPath,
      section: h.l1 || '(none)',
      project: h.project,
      depth: h.depth,
      transport_type: 'beacon'
    });
  });
})();
