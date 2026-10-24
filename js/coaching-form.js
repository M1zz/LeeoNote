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
        ok.style.display = 'block';
        err.style.display = 'none';
        f.querySelector('button[type="submit"]').disabled = true;
      })
      .catch(function () { err.style.display = 'block'; });
  });
})();
