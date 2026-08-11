# todo

## AI 시대 학습 프레임워크 사이트 반영 (2026-08-11)

### 콘텐츠 추가
- [x] `learning-design/` 디렉터리 생성, 원본 3종 배치
  - [x] `index.html` ← learning-design.html (본편 · 지형·경로·장비)
  - [x] `triangulation.html` ← 부록 A · 삼각측량
  - [x] `yajang.html` ← 부록 B · 야장
- [x] 3종 문서 상단에 사이트 바 삽입 (연습장 복귀 + 문서 간 상호 이동)
- [x] `ai-learning.html` 생성 — 사이트 톤(notebook.css)의 소개 페이지
  - [x] 세 단계(지형·경로·장비) 요약
  - [x] Gate Rule + 네 박자 AI 배치
  - [x] 질문고리 학습과의 비교표
  - [x] 원문 3종으로 연결
- [x] `philosophy.html` 여는 글 — “교육은 전달이 아니라 스스로 발생하는 것이다”
      × 핀켈 『침묵으로 가르치기』 × AI 시대의 침묵

### 사이트 개선
- [x] 전 페이지 topnav 통일 (14개 페이지 · 7개 항목)
  - `academy.html`에 빠져 있던 학습설계 복구
  - `solo-builders/` 의 철학 → 프레임워크, brand-mark 표기 통일
- [x] `sitemap.xml` 갱신 — 누락분(philosophy, monetization-worksheet) + 신규 4개
- [x] 전 페이지 og:url / og:image / twitter:card 보완 (14개 페이지)
- [x] `index.html` — AI학습 카드 추가, 여는 글로 가는 링크 추가
- [x] `framework.html` ↔ `ai-learning.html` ↔ `solo-learning.html` 상호 링크
- [x] `README.md` 표 · 디렉터리 트리 갱신

### 확인
- [x] 로컬 링크 192개 전수 검사 — 깨진 링크 없음
- [x] sitemap 17개 URL 전부 실제 파일과 일치
- [x] 로컬 서버 주요 페이지 200 응답

---

## learning-design 3종 디자인 결 맞추기 (2026-08-11)

- [x] 폰트 교체 — Gothic A1 / IBM Plex → Noto Sans KR / JetBrains Mono
- [x] 팔레트 리맵 — riso 필드매뉴얼(청록·형광주황) → 연습장 모노크롬
  - paper #E8ECE3 → #FFFFFF · ink #14312B → #0A0A0A · rule → #EAEAEA
  - fluoro #FF5B26 → #0A0A0A · teal #1E6055 → #6E6E6E · blue #2A4BA0 → #6E6E6E
- [x] 측량 그리드 배경 제거 (사이트의 흰 종이에 맞춤)
- [x] 리소 오버프린트(색 어긋남) 효과 해제 — 모노크롬에서는 번짐으로 보임
- [x] `mark` 형광 마커 → 연습장 반전 마커(검정 배경 + 흰 글자)
- [x] 금지 목록 박스 → 사이트 `.callout` 패턴(3px 좌측 먹선)
- [x] SVG 다이어그램 색·폰트 178건 치환 (등고선은 흐린 회색으로 후퇴)
- [x] 사이트 크롬 — sticky topbar(브랜드 + 7개 nav, AI학습 active) + 문서 바 + 푸터
- [x] 링크 215개 전수 재검사 · 팔레트 토큰 notebook.css와 일치 확인

---

## 남은 것 / 다음에

- [ ] `og-image.png` — 신규 페이지용 개별 OG 이미지 (현재는 사이트 공통 1장 공유)
- [ ] `philosophy.html`이 topnav에 없음 — 여는 글이 생겼으니 노출 위치 재검토
      (현재는 index 본문 링크로만 접근)
- [ ] learning-design 3종은 px 기반 메트릭 유지 중 (사이트는 rem).
      색·타이포·크롬은 맞췄고, 간격 체계까지 통일할지는 미결
