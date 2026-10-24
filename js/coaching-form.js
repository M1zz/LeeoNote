// 코칭 신청 폼. action 이 비어 있으면 메일 앱으로 보낸다.
// 폼 수신 서비스(Formspree 등)를 쓰려면 form 의 action 에 URL 을 넣으면 된다.
(function () {
  var f = document.querySelector('.coach-form');
  if (!f) return;
  var ok = f.querySelector('.ok'), err = f.querySelector('.err');

  function sync() {
    var type = f.elements.namedItem('type');
    if (type) f.classList.toggle('is-org', type.value === '운영사');
  }
  f.addEventListener('change', sync);
  sync();

  f.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!f.checkValidity()) { f.reportValidity(); return; }
    var fd = new FormData(f);
    var action = f.getAttribute('action');

    if (!action) {
      var body = '';
      fd.forEach(function (v, k) { body += k + ': ' + v + '\n'; });
      location.href = 'mailto:' + f.dataset.mailto +
        '?subject=' + encodeURIComponent(f.dataset.subject + ' - ' + fd.get('name')) +
        '&body=' + encodeURIComponent(body);
      ok.style.display = 'block';
      return;
    }

    fd.append('_subject', f.dataset.subject + ' - ' + fd.get('name'));
    fetch(action, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw 0;
        // 예약 링크가 있으면 메일을 기다리지 않고 바로 시간을 고르게 한다
        if (f.dataset.booking) {
          var go = document.createElement('a');
          go.href = f.dataset.booking;
          go.target = '_blank';
          go.rel = 'noopener';
          go.className = 'ok-booking';
          go.textContent = '기다리지 않고 지금 바로 시간 고르기 →';
          ok.appendChild(go);
        }
        ok.style.display = 'block';
        err.style.display = 'none';
        f.querySelector('button[type="submit"]').disabled = true;
        // GA4 전환, 신청 수를 센다
        if (window.gtag) gtag('event', 'generate_lead', { form: f.dataset.lead || '(none)', transport_type: 'beacon' });
      })
      .catch(function () {
        err.style.display = 'block';
        if (window.gtag) gtag('event', 'form_error', { form: f.dataset.lead || '(none)', transport_type: 'beacon' });
      });
  });
})();
