#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""data/apps.json 의 downloads 를 App Store Connect 판매 리포트로 채운다.

    python3 scripts/update-app-downloads.py

update-app-stats.py 가 채우는 값(평점·평가·나라·출시·버전)은 스토어 공개 API 에
있지만, 다운로드 수는 거기 없다. App Store Connect 를 봐야 나온다.

세는 것 : 최초 다운로드 (Product Type Identifier 가 1 로 시작하는 줄의 Units 합)
안 세는 것 : 업데이트(7*), 인앱결제(IA*·FI*), 재다운로드
            App Store Connect ▸ 판매 및 동향의 '최초 다운로드' 와 같은 정의다.

필요한 것 (셋 다 레포 밖에 둔다. 여기에 적지 않는다):
  ASC_KEY_ID · ASC_ISSUER_ID · ASC_KEY_PATH
      ~/Documents/workspace/fastlane-shared/asc.env 에서 읽는다.
      ASC_ENV 로 다른 파일을 가리킬 수 있다.
  ASC_VENDOR_NUMBER
      App Store Connect ▸ 결제 및 재무 보고서 왼쪽 위의 여덟 자리.
      같은 asc.env 에 적어 두거나 환경변수로 준다.
      판매 리포트는 이 번호 단위로만 나온다. 앱 단위 조회가 없다.

키에 '판매 및 보고서' 또는 Admin 권한이 있어야 한다. 없으면 403 이 온다.

서명은 openssl 로 한다. pyjwt·cryptography 를 깔지 않는 이유는 이 레포의 다른
스크립트도 표준 라이브러리만으로 도는 편이 오래 가기 때문이다.
"""
import base64, calendar, gzip, io, json, os, re, subprocess, sys, time
import urllib.error, urllib.request
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, '..', 'data', 'apps.json')
ENV_FILE = os.environ.get('ASC_ENV', '~/Documents/workspace/fastlane-shared/asc.env')
API = 'https://api.appstoreconnect.apple.com/v1/salesReports'


# ── 인증 ────────────────────────────────────────────────

def b64u(raw):
    return base64.urlsafe_b64encode(raw).rstrip(b'=')


def read_env(path):
    """KEY=VALUE 파일을 읽는다. 없는 파일이면 빈 사전."""
    out = {}
    try:
        f = open(os.path.expanduser(path), encoding='utf-8')
    except OSError:
        return out
    with f:
        for line in f:
            m = re.match(r'\s*(?:export\s+)?([A-Z_][A-Z0-9_]*)\s*=\s*(.*)', line)
            if m:
                out[m.group(1)] = m.group(2).strip().strip('"').strip("'")
    return out


def der_to_raw(der):
    """openssl 이 주는 DER 서명을 JWT 가 원하는 r||s 64바이트로 편다."""
    if der[0] != 0x30:
        raise ValueError('DER SEQUENCE 가 아니다')
    i = 2 if der[1] < 0x80 else 2 + (der[1] & 0x7F)
    out = b''
    for _ in range(2):
        if der[i] != 0x02:
            raise ValueError('DER INTEGER 가 아니다')
        ln = der[i + 1]
        out += der[i + 2:i + 2 + ln].lstrip(b'\x00').rjust(32, b'\x00')
        i += 2 + ln
    return out


def make_token(env):
    head = {'alg': 'ES256', 'kid': env['ASC_KEY_ID'], 'typ': 'JWT'}
    now = int(time.time())
    body = {'iss': env['ASC_ISSUER_ID'], 'iat': now, 'exp': now + 1200,
            'aud': 'appstoreconnect-v1'}
    msg = (b64u(json.dumps(head, separators=(',', ':')).encode()) + b'.' +
           b64u(json.dumps(body, separators=(',', ':')).encode()))
    key = os.path.expanduser(env['ASC_KEY_PATH'])
    try:
        der = subprocess.run(['openssl', 'dgst', '-sha256', '-sign', key],
                             input=msg, capture_output=True, check=True).stdout
    except subprocess.CalledProcessError as e:
        raise SystemExit('키로 서명하지 못했습니다: %s' % e.stderr.decode()[:200])
    return (msg + b'.' + b64u(der_to_raw(der))).decode()


# ── 리포트 ──────────────────────────────────────────────

FIRST_DOWNLOAD = re.compile(r'^1')      # 1 · 1F · 1T · 1E …  업데이트(7*)와 인앱(IA*)은 뺀다


def fetch(token, vendor, frequency, report_date):
    """한 기간의 SUMMARY 리포트를 TSV 문자열로. 그 기간에 판매가 없으면 None."""
    url = ('%s?filter[frequency]=%s&filter[reportType]=SALES'
           '&filter[reportSubType]=SUMMARY&filter[vendorNumber]=%s'
           '&filter[reportDate]=%s&filter[version]=1_0'
           % (API, frequency, vendor, report_date))
    req = urllib.request.Request(url, headers={
        'Authorization': 'Bearer ' + token, 'Accept': 'application/a-gzip'})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            blob = r.read()
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None                 # 그 기간에 아무것도 안 팔렸다
        if e.code == 403:
            raise SystemExit('403 — 이 키에 판매 리포트 권한이 없습니다.\n'
                             'App Store Connect ▸ 사용자 및 액세스 ▸ 통합 에서 '
                             "이 키의 역할에 '판매 및 보고서'를 더해 주세요.")
        detail = e.read()[:300].decode('utf-8', 'replace')
        raise SystemExit('%s %s → HTTP %s %s' % (frequency, report_date, e.code, detail))
    try:
        return gzip.GzipFile(fileobj=io.BytesIO(blob)).read().decode('utf-8')
    except OSError:
        return blob.decode('utf-8', 'replace')


def add_units(tsv, into):
    """TSV 를 읽어 Apple Identifier 별 최초 다운로드 수를 into 에 더한다."""
    rows = tsv.splitlines()
    if not rows:
        return
    head = rows[0].split('\t')
    try:
        i_type = head.index('Product Type Identifier')
        i_unit = head.index('Units')
        i_id = head.index('Apple Identifier')
    except ValueError:
        raise SystemExit('리포트 형식이 예상과 다릅니다. 열: %s' % head[:12])
    for line in rows[1:]:
        col = line.split('\t')
        if len(col) <= max(i_type, i_unit, i_id):
            continue
        if not FIRST_DOWNLOAD.match(col[i_type].strip()):
            continue
        try:
            into[col[i_id].strip()] = into.get(col[i_id].strip(), 0) + int(col[i_unit])
        except ValueError:
            continue


def periods(first_year):
    """(빈도, 날짜) 목록. 지난 해는 통째로, 올해는 달로, 이번 달은 날로."""
    today = date.today()
    for y in range(first_year, today.year):
        yield 'YEARLY', '%04d' % y
    for m in range(1, today.month):
        yield 'MONTHLY', '%04d-%02d' % (today.year, m)
    for d in range(1, today.day + 1):
        yield 'DAILY', '%04d-%02d-%02d' % (today.year, today.month, d)


# ── 실행 ────────────────────────────────────────────────

def main():
    env = read_env(ENV_FILE)
    env.update({k: v for k, v in os.environ.items() if k.startswith('ASC_')})

    missing = [k for k in ('ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_KEY_PATH') if not env.get(k)]
    if missing:
        raise SystemExit('%s 에 %s 가 없습니다.' % (ENV_FILE, ' · '.join(missing)))
    vendor = env.get('ASC_VENDOR_NUMBER')
    if not vendor:
        raise SystemExit(
            'ASC_VENDOR_NUMBER 가 없습니다.\n'
            'App Store Connect ▸ 결제 및 재무 보고서 왼쪽 위의 여덟 자리를\n'
            '%s 에 ASC_VENDOR_NUMBER=... 로 적거나 환경변수로 주세요.' % ENV_FILE)

    with open(DATA, encoding='utf-8') as f:
        doc = json.load(f)

    first_year = min(int((a.get('since') or '9999')[:4]) for a in doc['apps'])
    token = make_token(env)

    units, empty = {}, 0
    todo = list(periods(first_year))
    for n, (freq, when) in enumerate(todo, 1):
        tsv = fetch(token, vendor, freq, when)
        if tsv is None:
            empty += 1
        else:
            add_units(tsv, units)
        sys.stdout.write('\r  읽는 중 %d/%d  (%s %s)   ' % (n, len(todo), freq, when))
        sys.stdout.flush()
    print('\r  기간 %d곳을 읽었습니다. 그중 %d곳은 비어 있었습니다.%s' % (len(todo), empty, ' ' * 12))

    print()
    for app in doc['apps']:
        got = units.get(str(app.get('storeId')))
        if got is None:
            print('  %-14s 리포트에 없음 (그대로 둡니다: %s)' % (app.get('name'), app.get('downloads')))
            continue
        app['downloads'] = got
        print('  %-14s 최초 다운로드 %s' % (app.get('name'), format(got, ',')))

    doc['_downloadsCheckedAt'] = date.today().isoformat()
    with open(DATA, 'w', encoding='utf-8') as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print('\n저장했습니다 —', os.path.normpath(DATA))


if __name__ == '__main__':
    sys.exit(main())
