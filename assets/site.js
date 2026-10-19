// Fetron Gradnja - interactions for the static concept site.
(function () {
  var hd = document.querySelector('.hd');
  var hero = document.querySelector('.hero');
  var menuBtn = document.querySelector('.menu-btn');
  var mnav = document.querySelector('.mnav');
  var inHero = true;
  var menuOpen = false;

  function paintHeader() {
    if (!hd) return;
    hd.classList.toggle('over', inHero && !menuOpen);
    hd.classList.toggle('solid', !(inHero && !menuOpen));
  }

  // Header sits over the hero image until the hero scrolls away.
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inHero = entries[entries.length - 1].isIntersecting;
      paintHeader();
    }, { rootMargin: '-80px 0px 0px 0px', threshold: 0 }).observe(hero);
  }

  // Phone menu
  function setMenu(open) {
    menuOpen = open;
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (mnav) mnav.classList.toggle('open', open);
    paintHeader();
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(!menuOpen); });

  // Desktop dropdowns
  var dds = Array.prototype.slice.call(document.querySelectorAll('.nav .dd'));
  function closeDropdowns(except) {
    dds.forEach(function (dd) {
      if (dd === except) return;
      dd.classList.remove('open');
      var b = dd.querySelector('.dd-btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  dds.forEach(function (dd) {
    var btn = dd.querySelector('.dd-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !dd.classList.contains('open');
      closeDropdowns(dd);
      dd.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.nav .dd')) closeDropdowns();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeDropdowns(); if (menuOpen) setMenu(false); }
  });
  Array.prototype.forEach.call(document.querySelectorAll('.dd-menu a, .mnav a'), function (a) {
    a.addEventListener('click', function () { closeDropdowns(); setMenu(false); });
  });

  // Home: apartment cards, one open; others open on hover, focus or tap
  var acc = document.querySelector('.acc');
  if (acc) {
    var items = Array.prototype.slice.call(acc.querySelectorAll('.car-item'));
    var setActive = function (i) {
      items.forEach(function (it, j) {
        it.classList.toggle('on', i === j);
        var h = it.querySelector('.car-head');
        if (h) h.setAttribute('aria-expanded', i === j ? 'true' : 'false');
      });
    };
    items.forEach(function (it, i) {
      it.addEventListener('mouseenter', function () { setActive(i); });
      var h = it.querySelector('.car-head');
      if (h) {
        h.addEventListener('click', function () { setActive(i); });
        h.addEventListener('focus', function () { setActive(i); });
      }
    });
    acc.addEventListener('mouseleave', function () { setActive(0); });
  }

  // Offer page: location filter
  var filters = Array.prototype.slice.call(document.querySelectorAll('.filters .fbtn'));
  if (filters.length) {
    var keys = ['sve', 'lg', 'vt'];
    var apts = Array.prototype.slice.call(document.querySelectorAll('.apt[data-key]'));
    var count = document.querySelector('.count');
    var empty = document.querySelector('.empty');
    var word = function (n) {
      if (n % 10 === 1 && n % 100 !== 11) return 'stan';
      if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) return 'stana';
      return 'stanova';
    };
    filters.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        var k = keys[i];
        var shown = 0;
        filters.forEach(function (b, j) {
          b.classList.toggle('on', j === i);
          b.setAttribute('aria-pressed', j === i ? 'true' : 'false');
        });
        apts.forEach(function (a) {
          var show = k === 'sve' || a.getAttribute('data-key') === k;
          a.hidden = !show;
          if (show) shown++;
        });
        if (count) count.textContent = 'Prikazano: ' + shown + ' ' + word(shown);
        if (empty) empty.hidden = shown !== 0;
      });
    });
  }

  // Contact page: map pins and location list
  var pins = Array.prototype.slice.call(document.querySelectorAll('.map-pin'));
  var mapItems = Array.prototype.slice.call(document.querySelectorAll('.map-item'));
  if (pins.length) {
    var pick = function (i) {
      pins.forEach(function (p, j) {
        p.classList.toggle('on', i === j);
        p.setAttribute('aria-pressed', i === j ? 'true' : 'false');
      });
      mapItems.forEach(function (li, j) {
        li.classList.toggle('on', i === j);
        var b = li.querySelector('.map-item-btn');
        if (b) b.setAttribute('aria-expanded', i === j ? 'true' : 'false');
      });
    };
    pins.forEach(function (p, i) { p.addEventListener('click', function () { pick(i); }); });
    mapItems.forEach(function (li, i) {
      var b = li.querySelector('.map-item-btn');
      if (b) b.addEventListener('click', function () { pick(i); });
    });
  }

  // Concept forms do not send anything yet
  Array.prototype.forEach.call(document.querySelectorAll('form[data-concept-form]'), function (form) {
    var status = document.createElement('p');
    status.className = 'form-status';
    status.setAttribute('role', 'status');
    status.hidden = true;
    form.appendChild(status);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = 'Ovo je koncept sajta i forma još ne šalje poruke. Pozovite prodaju: +381 62 875 8592.';
      status.hidden = false;
    });
  });
})();
