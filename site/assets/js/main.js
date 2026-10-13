/* The First Seven Years — site behaviour. No framework, no dependencies. */
(() => {
  document.documentElement.classList.remove('no-js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- sticky bar ---------- */
  const bar = $('.bar');
  const hero = $('.hero');
  if (bar) {
    const onScroll = () => {
      const y = window.scrollY;
      bar.classList.toggle('is-scrolled', y > 8);
      if (hero) bar.classList.toggle('is-visible', y > hero.offsetHeight * 0.55);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    // enable the slide only after first paint, so font swaps on load don't animate it
    window.addEventListener('load', () => requestAnimationFrame(() => bar.classList.add('is-ready')));
  }

  /* ---------- mobile drawer ---------- */
  const drawer = $('#drawer');
  const openBtns = $$('[data-open-menu]');
  if (drawer) {
    const close = () => {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      openBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
      document.body.style.overflow = '';
    };
    openBtns.forEach(b => b.addEventListener('click', () => {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      b.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      $('a, button', drawer)?.focus();
    }));
    $('[data-close-menu]', drawer)?.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('is-open')) close(); });
  }

  /* ---------- search shortcut buttons focus the nearest search ---------- */
  $$('[data-focus-search]').forEach(b => b.addEventListener('click', () => {
    const input = $('.qsearch input');
    if (input) { input.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); setTimeout(() => input.focus(), 350); }
    else location.href = '/search/';
  }));

  /* ---------- question search: rotating placeholder + typeahead ---------- */
  $$('.qsearch').forEach(box => {
    const input = $('input', box);
    const list = $('.qsearch__results', box);
    const scope = box.dataset.scope; // optional: "episode"
    const prompts = (box.dataset.prompts || '').split('|').filter(Boolean);
    let pi = 0, timer;

    if (prompts.length && !reduce) {
      timer = setInterval(() => {
        if (document.activeElement === input || input.value) return;
        input.classList.add('is-swapping');
        setTimeout(() => {
          pi = (pi + 1) % prompts.length;
          input.placeholder = prompts[pi];
          input.classList.remove('is-swapping');
        }, 240);
      }, 3200);
    }

    const index = (window.F7_INDEX || []).filter(d => !scope || d.k === scope);
    const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ');
    // plain-English synonyms, mirroring Shopify Search & Discovery
    const SYN = { "won't eat": 'picky eating', 'wont eat': 'picky eating', fussy: 'picky eating', poop: 'constipation gut', tummy: 'gut', rash: 'eczema skin', itchy: 'eczema skin', focus: 'adhd attention', hyper: 'adhd', vitamins: 'supplements', bugs: 'probiotics', germs: 'immune', cold: 'immune illness', sleep: 'sleep bedtime', tantrum: 'emotions behaviour', meltdown: 'emotions behaviour' };
    const expand = q => { let out = q; for (const k in SYN) if (q.includes(k)) out += ' ' + SYN[k]; return out; };
    const kindOrder = { answer: 0, topic: 1, episode: 2, expert: 3 };
    const labels = { answer: 'Answer', episode: 'Episode', topic: 'Topic', expert: 'Expert' };
    let active = -1;

    const render = q => {
      const terms = norm(expand(q.toLowerCase())).split(/\s+/).filter(t => t.length > 1);
      if (!terms.length) { list.hidden = true; input.setAttribute('aria-expanded', 'false'); return; }
      const scored = index.map(d => {
        const hay = norm(d.t + ' ' + (d.s || '') + ' ' + (d.x || ''));
        const title = norm(d.t);
        let score = 0;
        terms.forEach(t => { if (title.includes(t)) score += 3; else if (hay.includes(t)) score += 1; });
        return { d, score };
      }).filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score || kindOrder[a.d.k] - kindOrder[b.d.k])
        .slice(0, 8)
        .sort((a, b) => kindOrder[a.d.k] - kindOrder[b.d.k] || b.score - a.score);

      active = -1;
      list.innerHTML = scored.length
        ? scored.map((r, i) => `<li role="presentation"><a role="option" id="${list.id}-o${i}" href="${r.d.u}"><span class="kind kind--${r.d.k}">${labels[r.d.k]}</span><span class="t">${r.d.t}</span><span class="s">${r.d.s || ''}</span></a></li>`).join('')
        : `<li class="qsearch__empty">No answer yet for “${q.replace(/[<>&"]/g, '')}”. <a class="link-arrow" href="/ask-the-doctor/?q=${encodeURIComponent(q)}">Ask Dr. Murray instead</a></li>`;
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    };

    input.addEventListener('input', () => render(input.value.trim()));
    input.addEventListener('focus', () => input.value.trim() && render(input.value.trim()));
    input.addEventListener('keydown', e => {
      const opts = $$('[role="option"]', list);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!opts.length) return;
        active = (active + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length;
        opts.forEach((o, i) => o.setAttribute('aria-selected', i === active));
        input.setAttribute('aria-activedescendant', opts[active].id);
      } else if (e.key === 'Enter' && active > -1 && opts[active]) {
        e.preventDefault(); location.href = opts[active].getAttribute('href');
      } else if (e.key === 'Escape') { list.hidden = true; input.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('click', e => { if (!box.contains(e.target)) list.hidden = true; });
    box.querySelector('form')?.addEventListener('submit', e => {
      const first = $('[role="option"]', list);
      if (!input.value.trim()) { e.preventDefault(); input.focus(); return; }
      if (first) { e.preventDefault(); location.href = first.getAttribute('href'); }
    });
    // prefill from ?q=
    const q = new URLSearchParams(location.search).get('q');
    if (q && box.dataset.prefill !== undefined) { input.value = q; render(q); }
  });

  /* ---------- buddy: pupils follow the pointer ---------- */
  const pupils = $$('.pupil');
  if (pupils.length && !reduce && window.matchMedia('(pointer: fine)').matches) {
    let raf;
    window.addEventListener('pointermove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        pupils.forEach(p => {
          const r = p.parentElement.getBoundingClientRect();
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          const a = Math.atan2(e.clientY - cy, e.clientX - cx);
          const d = Math.min(r.width * 0.2, Math.hypot(e.clientX - cx, e.clientY - cy) / 20);
          p.style.setProperty('--px', `${Math.cos(a) * d}px`);
          p.style.setProperty('--py', `${Math.sin(a) * d}px`);
        });
      });
    }, { passive: true });
  }

  /* ---------- age tabs (WAI-ARIA tabs pattern) ---------- */
  $$('[role="tablist"]').forEach(tl => {
    const tabs = $$('[role="tab"]', tl);
    const select = t => {
      tabs.forEach(x => {
        const on = x === t;
        x.setAttribute('aria-selected', on);
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        const n = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!n) return;
        e.preventDefault();
        const next = tabs[(i + n + tabs.length) % tabs.length];
        next.focus(); select(next);
      });
    });
  });

  /* ---------- YouTube facade (privacy-enhanced, loads on click) ---------- */
  $$('.yt[data-id]').forEach(b => b.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.id}?autoplay=1&rel=0&modestbranding=1`;
    f.title = b.getAttribute('aria-label') || 'Video';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen = true;
    b.replaceChildren(f);
    b.removeAttribute('aria-label');
    if (window.gtag) gtag('event', 'video_play', { video_id: b.dataset.id });
  }, { once: true }));

  /* ---------- scroll reveals ---------- */
  const rv = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(el => io.observe(el));
  } else rv.forEach(el => el.classList.add('is-in'));

  /* ---------- simple email forms (newsletter / book waitlist) ---------- */
  $$('[data-email-form]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const input = $('input[type="email"]', f);
    const msg = f.parentElement.querySelector('.form-msg');
    if (!input.checkValidity()) { msg.textContent = 'Please enter a valid email address.'; input.focus(); return; }
    msg.textContent = f.dataset.success || 'Thank you — you’re on the list.';
    f.reset();
  }));

  /* ---------- Ask the Doctor form ---------- */
  const ask = $('#ask-form');
  if (ask) {
    const qField = $('#q', ask), count = $('#q-count');
    const pre = new URLSearchParams(location.search).get('q');
    if (pre) qField.value = pre;
    const upd = () => count.textContent = `${qField.value.length} / 1200`;
    qField.addEventListener('input', upd); upd();

    const RED = /(not breathing|can'?t breathe|unconscious|seizure|blue lips|choking|swallowed|poison|overdose|stiff neck|102|103|104|high fever|newborn fever)/i;
    const urgent = $('#urgent');
    qField.addEventListener('input', () => { urgent.hidden = !RED.test(qField.value); });

    const setErr = (el, text) => {
      const err = document.getElementById(el.getAttribute('aria-describedby').split(' ').find(id => id.endsWith('-err')));
      el.setAttribute('aria-invalid', text ? 'true' : 'false');
      err.textContent = text;
    };

    const topicOtherWrap = $('#topic-other-wrap', ask);
    const topicOther = $('#topic-other', ask);
    const topOtherCheck = $('#top-other', ask);
    const syncOtherTopic = () => {
      if (!topicOtherWrap) return;
      const isOther = topOtherCheck ? topOtherCheck.checked : false;
      topicOtherWrap.hidden = !isOther;
      if (isOther && topicOther) {
        topicOther.focus();
      } else if (topicOther) {
        topicOther.value = '';
        const oErr = $('#topic-other-err');
        if (oErr) oErr.textContent = '';
        topicOther.removeAttribute('aria-invalid');
      }
    };
    if (topOtherCheck) topOtherCheck.addEventListener('change', syncOtherTopic);
    if (topicOther) {
      topicOther.addEventListener('input', () => {
        const oErr = $('#topic-other-err');
        if (oErr && topicOther.value.trim()) {
          oErr.textContent = '';
          topicOther.removeAttribute('aria-invalid');
        }
      });
    }

    const captchaCheck = $('#g-recaptcha-check', ask);
    if (captchaCheck) {
      captchaCheck.addEventListener('change', () => {
        const cErr = $('#captcha-err');
        if (cErr && captchaCheck.checked) cErr.textContent = '';
      });
    }

    ask.addEventListener('submit', e => {
      e.preventDefault();
      let first = null;
      const checkedTopics = [...$$('input[name="topics"]:checked', ask)].map(c => c.value);
      const email = $('#email', ask), consent = $('#consent', ask);
      const checks = [
        [qField, qField.value.trim().length < 20 ? 'Tell us a little more — at least 20 characters helps the doctor answer well.' : ''],
        [email, !email.checkValidity() || !email.value ? 'Enter an email so we can tell you when it’s answered.' : ''],
        [consent, !consent.checked ? 'Please confirm you’ve read this before sending.' : ''],
      ];
      if (topOtherCheck && topOtherCheck.checked && topicOther) {
        checks.push([topicOther, !topicOther.value.trim() ? 'Please specify what topic your question is about.' : '']);
      }
      if (!$('input[name="age"]:checked', ask)) { $('#age-err').textContent = 'Select your child’s age.'; first = $('input[name="age"]', ask); }
      else $('#age-err').textContent = '';

      if (checkedTopics.length === 0) {
        $('#topic-err').textContent = 'Please select at least one topic.';
        if (!first) first = $('input[name="topics"]', ask);
      } else {
        $('#topic-err').textContent = '';
      }

      checks.forEach(([el, t]) => { setErr(el, t); if (t && !first) first = el; });

      let captchaPassed = false;
      if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse) {
        try {
          const resp = grecaptcha.getResponse();
          if (resp && resp.length > 0) captchaPassed = true;
        } catch (err) {}
      }
      const captcha = $('#g-recaptcha-check', ask);
      if (captcha && captcha.checked) captchaPassed = true;

      const cErr = $('#captcha-err');
      if (!captchaPassed) {
        if (cErr) cErr.textContent = 'Please confirm you are not a robot.';
        if (!first && captcha) first = captcha;
      } else {
        if (cErr) cErr.textContent = '';
      }

      if (first) { first.focus(); return; }
      const ageChecked = $('input[name="age"]:checked', ask);
      const fname = $('#fname', ask);
      const chosenTopic = (topOtherCheck && topOtherCheck.checked && topicOther && topicOther.value.trim())
        ? `Other: ${topicOther.value.trim()}`
        : (checkedTopics[0] || 'general');
      fetch('/api/ask-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: chosenTopic,
          topics: checkedTopics,
          other_topic: (topOtherCheck && topOtherCheck.checked && topicOther) ? topicOther.value.trim() : '',
          email: email.value,
          parent_name: fname ? fname.value.trim() : '',
          child_age: ageChecked ? (ageChecked.parentElement?.textContent?.trim() || ageChecked.value) : '',
          question: qField.value
        })
      }).catch(() => {});
      ask.hidden = true;
      const ok = $('#ask-success'); ok.hidden = false; ok.focus();
      if (window.gtag) gtag('event', 'ask_doctor_submit', { topic: chosenTopic, topics: checkedTopics });
    });
  }

})();
