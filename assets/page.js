// Interacoes das paginas de servico (nao-SPA): navegacao, menu mobile,
// reveal em scroll, contadores e barra de progresso de leitura.
(function () {
  var BASE = '../../index.html';

  document.querySelectorAll('[data-page]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var page = el.getAttribute('data-page');
      if (!page) return;
      e.preventDefault();
      var hash = el.getAttribute('data-anchor') || page;
      window.location.href = BASE + '#' + hash;
    });
  });

  var toggle = document.getElementById('menuMobileToggle');
  var drawer = document.getElementById('menuMobileContent');
  var icon = document.getElementById('menuMobileIcon');
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = drawer.classList.toggle('open');
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.classList.toggle('menu-open', open);
      document.body.classList.toggle('overflow-hidden', open);
      if (icon) {
        icon.classList.toggle('ph-x', open);
        icon.classList.toggle('ph-list', !open);
      }
    });
  }

  var progress = document.getElementById('readingProgress');
  window.addEventListener('scroll', function () {
    if (!progress) return;
    var h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progress.style.width = ((document.documentElement.scrollTop / h) * 100) + '%';
  }, { passive: true });

  function animateCounter(el, target, duration) {
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var start = performance.now();
    duration = duration || 1400;
    function step(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      var counter = entry.target.querySelector('.counter[data-count]');
      if (counter && !counter.dataset.running) {
        counter.dataset.running = '1';
        counter.textContent = (counter.getAttribute('data-prefix') || '') + '0' + (counter.getAttribute('data-suffix') || '');
        animateCounter(counter, parseFloat(counter.getAttribute('data-count')));
        setTimeout(function () { delete counter.dataset.running; }, 1600);
      }
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.metric-reveal').forEach(function (el) { observer.observe(el); });

  // Sanfona: fechamento animado
  document.querySelectorAll('details.faq-item').forEach(function (d) {
    var s = d.querySelector('summary');
    if (!s) return;
    s.addEventListener('click', function (e) {
      if (d.classList.contains('closing')) { e.preventDefault(); return; }
      if (!d.open) return;
      e.preventDefault();
      d.classList.add('closing');
      setTimeout(function () { d.classList.remove('closing'); d.open = false; }, 240);
    });
  });

  // Parallax do watermark no hero das paginas de servico
  var wm = document.getElementById('heroWatermark');
  if (wm) {
    var wmTick = false;
    window.addEventListener('scroll', function () {
      if (wmTick) return;
      wmTick = true;
      requestAnimationFrame(function () {
        wm.style.transform = 'translate3d(0,' + Math.min(window.scrollY * 0.12, 90) + 'px,0)';
        wmTick = false;
      });
    }, { passive: true });
  }
})();