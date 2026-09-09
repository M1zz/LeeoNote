#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""data/apps.json 의 스토어 수치를 App Store 공개 API 로 갱신한다.

    python3 scripts/update-app-stats.py

건드리는 값 : rating · reviews · countries · since · version  (스토어가 아는 것)
건드리지 않는 값 : downloads  (App Store Connect 에만 있는 값이라 사람이 손으로 적는다)

평가 수는 스토어(국가)마다 따로 세므로 아래 목록을 다 돌아 합칩니다.
평점은 그 평가 수로 가중평균을 냅니다.

주의 — 이름이 헷갈리기 쉬운 두 가지:
  reviews   API 의 userRatingCount 다. 별점 수이지, 글로 쓴 리뷰 수가 아니다.
  countries 평가가 하나라도 온 나라 수다. **판매 국가 수가 아니다.**
            앱은 보통 이 목록보다 훨씬 많은 스토어에서 팔린다.
            (2026-09 확인: 클립키보드는 확인한 44곳 전부에서 판매 중이었고,
             평가가 온 곳은 그중 8곳이었다.)
"""
import json, os, sys, urllib.request, urllib.error
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, '..', 'data', 'apps.json')

STORES = ['kr','us','jp','gb','de','fr','ca','au','tw','hk','sg','cn',
          'in','id','th','vn','br','mx','es','it','nl','se','pl','tr']


def lookup(store_id, country):
    url = 'https://itunes.apple.com/lookup?id=%s&country=%s' % (store_id, country)
    try:
        with urllib.request.urlopen(url, timeout=15) as r:
            d = json.load(r)
    except (urllib.error.URLError, ValueError, TimeoutError):
        return None
    return d['results'][0] if d.get('resultCount') else None


def collect(store_id):
    total, weighted, hits, first = 0, 0.0, [], None
    for c in STORES:
        r = lookup(store_id, c)
        if not r:
            continue
        if first is None:
            first = r
        n = r.get('userRatingCount') or 0
        if n:
            total += n
            weighted += n * (r.get('averageUserRating') or 0)
            hits.append(c)
    if first is None:
        return None
    return {
        'reviews': total,
        'rating': round(weighted / total, 1) if total else None,
        'countries': len(hits),          # 판매국 아님. 평가가 온 나라 수.
        'since': (first.get('releaseDate') or '')[:7].replace('-', '.'),
        'version': first.get('version'),
        'name': first.get('trackName'),
    }


def main():
    with open(DATA, encoding='utf-8') as f:
        doc = json.load(f)

    for app in doc['apps']:
        sid = app.get('storeId')
        if not sid:
            print('  건너뜀 (storeId 없음):', app.get('name'))
            continue
        got = collect(sid)
        if not got:
            print('  못 찾음:', app.get('name'), sid)
            continue
        for k in ('rating', 'reviews', 'countries', 'since', 'version'):
            if got.get(k) is not None:
                app[k] = got[k]
        print('  %-14s ★%-4s 평가 %-4s %s개국에서 평가  %s부터  v%s' % (
            app.get('name'), app.get('rating'), app.get('reviews'),
            app.get('countries'), app.get('since'), app.get('version')))

    doc['_checkedAt'] = date.today().isoformat()
    with open(DATA, 'w', encoding='utf-8') as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print('\n저장했습니다 —', os.path.normpath(DATA))
    print("다운로드 수는 스토어 공개 API 에 없습니다. App Store Connect 값을 apps.json 의 downloads 에 직접 적으세요.")


if __name__ == '__main__':
    sys.exit(main())
