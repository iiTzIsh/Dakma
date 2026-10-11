/* Interactive Sinhala Text Reader — R26-DS-002 */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  var toastEl = $('#toast'), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  /* ---------- theme ---------- */
  var themeBtn = $('#theme-toggle');
  function syncThemeLabel() {
    var dark = doc.getAttribute('data-theme') === 'dark';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  syncThemeLabel();
  themeBtn.addEventListener('click', function () {
    var next = doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    doc.setAttribute('data-theme', next);
    store('rdr-theme', next);
    syncThemeLabel();
  });

  /* ---------- mobile menu ---------- */
  var menuBtn = $('#menu-btn'), nav = $('#main-nav');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $all('a', nav).forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open menu');
    });
  });

  /* ---------- scroll progress ---------- */
  var bar = $('#progress-bar'), ticking = false;
  function onScroll() {
    var max = doc.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* ---------- active section in nav ---------- */
  function spy(links, offsetRatio) {
    var map = {};
    links.forEach(function (a) { var id = a.getAttribute('href').slice(1); var el = document.getElementById(id); if (el) map[id] = { a: a, el: el }; });
    function update() {
      var line = window.innerHeight * offsetRatio, active = null;
      Object.keys(map).forEach(function (id) {
        var r = map[id].el.getBoundingClientRect();
        if (r.top <= line) active = id;
      });
      links.forEach(function (a) { a.removeAttribute('aria-current'); });
      if (active) map[active].a.setAttribute('aria-current', 'true');
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
  spy($all('.main-nav a'), 0.35);


  /* ---------- domain: one sub-section at a time ---------- */
  var dLinks = $all('.domain-index a');
  var dSubs = dLinks.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  var dList = $('.domain-index ol');
  dList.setAttribute('role', 'tablist');
  dList.setAttribute('aria-orientation', 'vertical');
  dLinks.forEach(function (a, i) {
    a.setAttribute('role', 'tab');
    a.setAttribute('aria-controls', dSubs[i].id);
    a.id = 'tab-' + dSubs[i].id;
    a.parentNode.setAttribute('role', 'presentation');
    dSubs[i].setAttribute('role', 'tabpanel');
    dSubs[i].setAttribute('aria-labelledby', a.id);
    dSubs[i].setAttribute('tabindex', '-1');
    // previous / next links at the end of each panel
    var pager = document.createElement('div');
    pager.className = 'sub-pager';
    if (i > 0) pager.appendChild(pagerBtn(i - 1, 'prev'));
    if (i < dLinks.length - 1) pager.appendChild(pagerBtn(i + 1, 'next'));
    dSubs[i].appendChild(pager);
  });
  function pagerBtn(i, dir) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'pager-btn pager-' + dir;
    b.innerHTML = '<span class="pager-dir">' + (dir === 'prev' ? 'Previous' : 'Next') + '</span><span class="pager-name">' + dLinks[i].textContent + '</span>';
    b.addEventListener('click', function () { openTab(i, true, true); });
    return b;
  }
  function openTab(i, scroll, focusPanel) {
    dLinks.forEach(function (a, k) {
      var on = k === i;
      a.setAttribute('aria-selected', on ? 'true' : 'false');
      a.setAttribute('tabindex', on ? '0' : '-1');
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      dSubs[k].hidden = !on;
    });
    dSubs[i].classList.remove('enter'); void dSubs[i].offsetWidth; dSubs[i].classList.add('enter');
    if (scroll) {
      var top = $('.domain-grid').getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.5) $('.domain-grid').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
    if (focusPanel) dSubs[i].focus({ preventScroll: true });
    // the indexed tab strip scrolls sideways on phones
    if (dList.scrollWidth > dList.clientWidth) dList.scrollLeft = Math.max(0, dLinks[i].offsetLeft - dList.offsetLeft - 16);
  }
  dLinks.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); openTab(i, true, false); });
    a.addEventListener('keydown', function (e) {
      var k = e.key, n = dLinks.length, j = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') j = (i + 1) % n;
      if (k === 'ArrowUp' || k === 'ArrowLeft') j = (i - 1 + n) % n;
      if (k === 'Home') j = 0;
      if (k === 'End') j = n - 1;
      if (j !== null) { e.preventDefault(); openTab(j, false, false); dLinks[j].focus(); }
    });
  });
  function openFromHash() {
    var id = location.hash.slice(1);
    var i = dSubs.findIndex(function (el) { return el.id === id; });
    if (i >= 0) { openTab(i, false, false); $('.domain-grid').scrollIntoView(); }
  }
  openTab(0, false, false);
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  /* ---------- hero demo: OCR line corrected, then spoken ---------- */
  // Each segment is plain text or [as recognised, corrected].
  var LINES = [
    ['දෘෂ්ටි ආබාධිත ', ['ප', 'පා'], 'ඨකයන් ස', ['ද', 'ඳ'], 'හා'],
    ['සිංහල පුවත්පත් කිය', ['චී', 'වී'], 'ම']
  ];
  var lineEls = [$('#demo-line'), $('#demo-line-2')];
  var demo = $('.demo'), stateEl = $('#demo-state'), countEl = $('#demo-count');
  var timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function renderRaw() {
    var errs = [];
    LINES.forEach(function (segs, li) {
      var el = lineEls[li]; el.textContent = '';
      segs.forEach(function (s) {
        if (typeof s === 'string') { el.appendChild(document.createTextNode(s)); return; }
        var span = document.createElement('span');
        span.className = 'g'; span.textContent = s[0]; span.dataset.fix = s[1];
        el.appendChild(span); errs.push(span);
      });
    });
    return errs;
  }

  function runDemo() {
    timers.forEach(clearTimeout); timers = [];
    demo.classList.remove('is-fixed', 'is-speaking');
    stateEl.textContent = 'Text as recognised by OCR';
    countEl.textContent = 'Checking the line';
    var errs = renderRaw();

    if (reduceMotion) {
      errs.forEach(function (s) { s.textContent = s.dataset.fix; s.className = 'g fix'; });
      demo.classList.add('is-fixed');
      stateEl.textContent = 'Corrected text';
      countEl.textContent = '3 errors corrected';
      return;
    }
    errs.forEach(function (s, i) { later(function () { s.classList.add('err'); }, 500 + i * 260); });
    later(function () { countEl.textContent = errs.length + ' errors found'; }, 500 + errs.length * 260);
    var t = 2300;
    errs.forEach(function (s, i) {
      later(function () {
        stateEl.textContent = 'Correcting';
        countEl.textContent = 'Correcting ' + (i + 1) + ' of ' + errs.length;
        s.textContent = s.dataset.fix; s.className = 'g fix';
      }, t + i * 700);
    });
    t += errs.length * 700 + 300;
    later(function () {
      demo.classList.add('is-fixed', 'is-speaking');
      stateEl.textContent = 'Corrected text, read aloud';
      countEl.textContent = errs.length + ' errors corrected';
    }, t);
    later(function () { demo.classList.remove('is-speaking'); }, t + 3600);
  }
  $('#demo-replay').addEventListener('click', runDemo);

  if ('IntersectionObserver' in window) {
    var demoSeen = false;
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) { if (e.isIntersecting && !demoSeen) { demoSeen = true; runDemo(); obs.disconnect(); } });
    }, { threshold: 0.4 }).observe(demo);
  } else { runDemo(); }

  /* ---------- pipeline reveal (once) ---------- */
  var pipeline = $('#pipeline');
  if ('IntersectionObserver' in window && !reduceMotion) {
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) { if (e.isIntersecting) { pipeline.classList.add('in'); obs.disconnect(); } });
    }, { threshold: 0.35 }).observe(pipeline);
  } else { pipeline.classList.add('in'); }

  /* ---------- listen to summary ---------- */
  var listenBtn = $('#listen-btn');
  if (!('speechSynthesis' in window)) {
    listenBtn.hidden = true;
  } else {
    listenBtn.addEventListener('click', function () {
      var synth = window.speechSynthesis;
      if (synth.speaking) { synth.cancel(); return; }
      var u = new SpeechSynthesisUtterance($('#abstract-text').textContent.trim());
      u.lang = 'en-GB'; u.rate = 0.98;
      u.onstart = function () { listenBtn.setAttribute('aria-pressed', 'true'); listenBtn.querySelector('span').textContent = 'Stop reading'; };
      u.onend = u.onerror = function () { listenBtn.setAttribute('aria-pressed', 'false'); listenBtn.querySelector('span').textContent = 'Listen to this summary'; };
      synth.speak(u);
    });
  }

  /* ---------- milestones ---------- */
  var select = $('#ms-select');
  var trackBtns = $all('.ms-track button');
  function showMilestone(id, animate) {
    $all('.ms-panel').forEach(function (p) {
      var on = p.id === id;
      p.hidden = !on;
      if (on && animate) { p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); }
    });
    trackBtns.forEach(function (b) {
      if (b.dataset.target === id) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    select.value = id;
  }
  select.addEventListener('change', function () { showMilestone(select.value, true); });
  trackBtns.forEach(function (b) { b.addEventListener('click', function () { showMilestone(b.dataset.target, true); }); });
  showMilestone(select.value, false);

  /* ---------- contact form: opens the visitor's email app ---------- */
  var TEAM_EMAIL = 'r26ds002.research@gmail.com';
  var form = $('#contact-form'), errEl = $('#form-error');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var missing = [];
    $all('input, textarea', form).forEach(function (f) {
      var bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
      f.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad) missing.push(f.previousElementSibling.textContent.toLowerCase());
    });
    if (missing.length) {
      errEl.hidden = false;
      errEl.textContent = 'Enter a valid ' + missing.join(', ') + ' before sending.';
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    errEl.hidden = true;
    var body = form.message.value.trim() + '\n\n' + form.name.value.trim() + '\n' + form.email.value.trim();
    window.location.href = 'mailto:' + TEAM_EMAIL + '?subject=' + encodeURIComponent('[R26-DS-002] ' + form.subject.value.trim()) + '&body=' + encodeURIComponent(body);
    toast('Opening your email app');
  });
})();
