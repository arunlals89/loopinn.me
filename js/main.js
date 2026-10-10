/* Loopinn landing page — interactions
   nav · reveal · hero phone · radar demo · match overlay · waitlist */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ───── demo people (placeholder photos — see docs/IMAGE_CREDITS.md) ───── */
  const IMG = (n) => `assets/img/${n}.webp`;
  const PEOPLE = {
    maya:   { name: 'Maya',   age: 24, dist: 250, img: IMG('av-maya'),   angle: 10,  bio: 'Coffee snob, amateur climber. New in town — show me the best flat white and a view worth the climb.', tags: ['Climbing', 'Film photography', 'Coffee'] },
    ava:    { name: 'Ava',    age: 27, dist: 300, img: IMG('av-priya'),  angle: 288, bio: 'Product designer by day, salsa by night. Ask me about my playlist.', tags: ['Salsa', 'Design', 'Street food'] },
    daniel: { name: 'Daniel', age: 29, dist: 400, img: IMG('av-daniel'), angle: 155, bio: 'Here for the gig. Ask me about vinyl, I will not shut up.', tags: ['Vinyl', 'Live music', 'Running'] },
    sofia:  { name: 'Sofia',  age: 25, dist: 550, img: IMG('av-sofia'),  angle: 199, bio: 'Architecture student. I will judge your skyline taste (kindly).', tags: ['Architecture', 'Sketching', 'Sunsets'] },
    leo:    { name: 'Leo',    age: 26, dist: 200, img: IMG('av-leo'),    angle: 233,  bio: 'Hiking, board games, questionable puns. Looking for a trail buddy.', tags: ['Hiking', 'Board games', 'Puns'] },
    zoe:    { name: 'Zoe',    age: 23, dist: 700, img: IMG('av-zoe'),    angle: 234, bio: 'Between flights and hungry for dumplings. Know a good place?', tags: ['Travel', 'Foodie', 'Night markets'] },
    theo:   { name: 'Theo',   age: 28, dist: 850, img: IMG('av-kofi'),   angle: 272, bio: 'Street-art walks and fresh mangoes. Happy to be your local guide.', tags: ['Street art', 'Football', 'Afrobeats'] },
    elena:  { name: 'Elena',  age: 26, dist: 950, img: IMG('av-elena'),  angle: 315, bio: 'Remote worker with too many browser tabs and a very good bookshelf.', tags: ['Books', 'Yoga', 'Remote work'] },
    ray:    { name: 'Ray',    age: 30, dist: 150, img: IMG('av-arjun'),  angle: 113,   bio: 'Tacos, tennis and terrible puns. Rally or lunch — your call.', tags: ['Tennis', 'Tacos', 'Podcasts'] },
    nora:   { name: 'Nora',   age: 22, dist: 600, img: IMG('av-nora'),   angle: 112, bio: 'Skater, poet, probably lost. Excellent at thrift stores.', tags: ['Skating', 'Poetry', 'Thrifting'] },
    sam:    { name: 'Sam',    age: 31, dist: 500, img: IMG('av-sam'),    angle: 42, bio: 'Chef who forgot to pack a map. Will cook for good company.', tags: ['Cooking', 'Cycling', 'Jazz'] },
    marcus: { name: 'Marcus', age: 33, dist: 800, img: IMG('av-marcus'), angle: 149,  bio: 'Boxing, brunch and bad karaoke — in that order.', tags: ['Boxing', 'Brunch', 'Karaoke'] }
  };
  const VIBES = { coffee: '☕ Coffee', walk: '🚶 Walk', dance: '🎶 Dance', food: '🍜 Food' };

  /* ───── nav ───── */
  const nav = $('#nav'), burger = $('#burger'), links = $('#nav-links');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 24);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  links.addEventListener('click', (e) => { if (e.target.closest('a')) { links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });

  /* ───── scroll reveal ───── */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add('in'));

  /* ───── hero phone tilt (desktop pointer only) ───── */
  const tilt = $('#tilt');
  if (tilt && !reduceMotion && matchMedia('(hover: hover) and (min-width: 1025px)').matches) {
    const host = $('.hero');
    host.addEventListener('pointermove', (e) => {
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      tilt.style.transform = `perspective(1100px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
    });
    host.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
  }

  /* ───── hero: tap avatars to swap the profile sheet ───── */
  const heroPins = $$('.hero-phone .pin');
  const hs = { img: $('#hs-img'), name: $('#hs-name'), meta: $('#hs-meta'), cta: $('#hs-cta') };
  let heroPerson = 'maya';
  const setHero = (id) => {
    const p = PEOPLE[id]; if (!p) return;
    heroPerson = id;
    heroPins.forEach((b) => b.classList.toggle('is-selected', b.dataset.person === id));
    hs.img.src = p.img;
    hs.name.textContent = `${p.name}, ${p.age}`;
    hs.meta.textContent = `≈ ${fuzzy(p.dist)} away · ${p.tags.slice(0, 2).join(', ')}`;
    resetCta(hs.cta, 'Loop them in');
    // keep the floating "looped you back" card in sync
    const fn = $('.f-notif'); if (fn) { $('img', fn).src = p.img; $('b', fn).textContent = `${p.name} looped you back`; }
    $$('.hero-phone .pin em').forEach((em) => em.remove());
    const sel = heroPins.find((b) => b.dataset.person === id);
    if (sel) { const em = document.createElement('em'); em.textContent = fuzzy(p.dist); sel.append(em); }
  };
  heroPins.forEach((b) => b.addEventListener('click', () => setHero(b.dataset.person)));

  /* never show an exact distance in the demo — round to a band, like the real app */
  const fuzzy = (m) => `${Math.round(m / 50) * 50} m`;

  /* ───── Loop CTA state ───── */
  const resetCta = (btn, label) => {
    btn.disabled = false;
    const sp = $('span', btn); if (sp) sp.textContent = label;
    const sv = $('.spin', btn); if (sv) sv.replaceWith(Object.assign(document.createElementNS('http://www.w3.org/2000/svg', 'svg'), { innerHTML: '<use href="#i-sparkles"/>' }));
    const ic = $('svg', btn); if (ic) ic.setAttribute('class', 'ico');
  };
  const sendLoop = (btn, id, vibe) => {
    const p = PEOPLE[id]; if (!p || btn.disabled) return;
    btn.disabled = true;
    const sp = $('span', btn); if (sp) sp.textContent = `Loop sent${vibe ? ' · ' + (VIBES[vibe] || '') : ''}…`;
    const ic = $('svg', btn); if (ic) { const s = document.createElement('i'); s.className = 'spin'; ic.replaceWith(s); }
    setTimeout(() => openMatch(p, () => resetCta(btn, 'Loop them in')), reduceMotion ? 200 : 1500);
  };
  hs.cta.addEventListener('click', () => sendLoop(hs.cta, heroPerson));

  /* ───── interactive radar demo ───── */
  const stage = $('#radar-demo'), pinsHost = $('#rd-pins');
  const range = $('#radius'), rangeOut = $('#radius-out b'), rangeEl = $('#rd-range'), countNum = $('#count-num');
  const card = { empty: $('#pcard-empty'), body: $('#pcard-body'), img: $('#pc-img'), name: $('#pc-name'), dist: $('#pc-dist'), bio: $('#pc-bio'), tags: $('#pc-tags'), loop: $('#pc-loop') };
  let active = null, vibe = 'coffee';

  const rdPins = Object.entries(PEOPLE).map(([id, p]) => {
    const b = document.createElement('button');
    b.className = 'rd-pin'; b.type = 'button'; b.dataset.person = id;
    b.setAttribute('aria-label', `${p.name}, ${p.age}, about ${fuzzy(p.dist)} away`);
    // polar → % position. Scale radial offset so nearby people don't sit on top of "You".
    const r = (.15 + .85 * (p.dist / 1000)) * 46, a = p.angle * Math.PI / 180;
    b.style.left = `${50 + r * Math.cos(a)}%`; b.style.top = `${50 + r * Math.sin(a)}%`;
    b.innerHTML = `<img src="${p.img}" alt="" loading="lazy"><span>${p.name} · ${fuzzy(p.dist)}</span>`;
    b.addEventListener('click', () => select(id));
    pinsHost.append(b);
    return b;
  });

  function applyRadius() {
    const m = +range.value;
    rangeOut.textContent = m >= 1000 ? '1 km' : `${m} m`;
    rangeEl.style.setProperty('--rr', `${m / 10}%`);
    range.style.setProperty('--fill', `${((m - 100) / 900) * 100}%`);
    let n = 0;
    rdPins.forEach((b) => { const out = PEOPLE[b.dataset.person].dist > m; b.classList.toggle('is-out', out); if (!out) n++; });
    countNum.textContent = n;
    if (active && PEOPLE[active].dist > m) clearSelection();
  }
  function clearSelection() {
    active = null;
    rdPins.forEach((b) => b.classList.remove('is-active'));
    card.empty.hidden = false; card.body.hidden = true;
  }
  function select(id) {
    const p = PEOPLE[id]; active = id;
    rdPins.forEach((b) => b.classList.toggle('is-active', b.dataset.person === id));
    card.img.src = p.img; card.img.alt = p.name;
    card.name.textContent = `${p.name}, ${p.age}`;
    card.dist.textContent = `≈ ${fuzzy(p.dist)} away · open to dating & friends`;
    card.bio.textContent = p.bio;
    card.tags.innerHTML = p.tags.map((t) => `<li>${t}</li>`).join('');
    card.empty.hidden = true; card.body.hidden = false;
    // replay the entrance animation
    card.body.style.animation = 'none'; void card.body.offsetWidth; card.body.style.animation = '';
    resetCta(card.loop, 'Loop them in');
  }
  range.addEventListener('input', applyRadius);
  $$('.vibe').forEach((v) => v.addEventListener('click', () => {
    $$('.vibe').forEach((o) => { o.classList.toggle('is-on', o === v); o.setAttribute('aria-checked', o === v); });
    vibe = v.dataset.vibe;
  }));
  card.loop.addEventListener('click', () => active && sendLoop(card.loop, active, vibe));
  applyRadius();

  /* ───── match overlay ───── */
  const match = $('#match'), confetti = $('#confetti');
  let lastFocus = null, onClose = null;
  function openMatch(p, cb) {
    lastFocus = document.activeElement; onClose = cb;
    $('#match-img').src = p.img; $('#match-img').alt = p.name;
    $('#match-sub').textContent = `You and ${p.name} are both in. Say hi before the moment passes.`;
    spawnConfetti();
    match.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => match.classList.add('open')));
    setTimeout(() => $('#match-hi').focus(), 1400);
  }
  function closeMatch() {
    match.classList.remove('open'); match.hidden = true;
    document.body.style.overflow = '';
    confetti.innerHTML = '';
    if (onClose) onClose(); onClose = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function spawnConfetti() {
    if (reduceMotion) { confetti.innerHTML = ''; return; }
    const cols = ['#9b5cff', '#41d8ff', '#ff6fb5', '#5b8cf9', '#ffffff'], glyphs = ['♥', '♥', '●', '✦'];
    confetti.innerHTML = Array.from({ length: 44 }, () => {
      const s = 12 + Math.random() * 26;
      return `<i style="--x:${Math.random() * 100}%;--s:${s}px;--c:${cols[(Math.random() * cols.length) | 0]};--d:${(.5 + Math.random() * 1.8).toFixed(2)}s;--t:${(3.2 + Math.random() * 2.6).toFixed(2)}s;--dx:${(Math.random() - .5) * 160}px;--r:${(Math.random() - .5) * 90}deg">${glyphs[(Math.random() * glyphs.length) | 0]}</i>`;
    }).join('');
  }
  match.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeMatch(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !match.hidden) closeMatch(); });

  /* ───── waitlist ───── */
  const cfg = window.LOOPINN_CONFIG || {};
  const isLocal = ['localhost', '127.0.0.1', ''].includes(location.hostname);
  const configured = () => cfg.supabaseUrl && cfg.supabaseAnonKey;

  async function saveToWaitlist({ email, city, source }) {
    if (!configured()) {
      if (isLocal) { console.info('[loopinn] waitlist is not wired to Supabase yet — demo success (local only).', { email, city, source }); return 'demo'; }
      throw new Error('not-configured');
    }
    const res = await fetch(`${cfg.supabaseUrl}/rest/v1/${cfg.waitlistTable || 'waitlist'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: cfg.supabaseAnonKey, Authorization: `Bearer ${cfg.supabaseAnonKey}`, Prefer: 'return=minimal' },
      body: JSON.stringify({ email, city: city || null, source })
    });
    if (res.status === 409) return 'duplicate';          // unique(lower(email)) violation → already on the list
    if (!res.ok) throw new Error(`http-${res.status}`);
    return 'ok';
  }

  $$('form[data-waitlist]').forEach((form) => {
    const msg = $('.form-msg', form), btn = $('button[type=submit]', form);
    const say = (text, kind) => { msg.textContent = text; msg.className = `form-msg ${kind || ''}`; };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      if (fd.get('company')) return;                       // honeypot: bots fill this
      const email = String(fd.get('email') || '').trim().toLowerCase();
      const city = String(fd.get('city') || '').trim().slice(0, 80);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { say('Please enter a valid email address.', 'err'); $('input[name=email]', form).focus(); return; }
      btn.disabled = true; say('Adding you…');
      try {
        const r = await saveToWaitlist({ email, city, source: form.dataset.source || 'site' });
        say(r === 'duplicate' ? "You're already on the list — we'll be in touch! 💜" : "You're in! Watch your inbox — we'll tell you the moment Loopinn is live. ✨", 'ok');
        form.reset();
      } catch (err) {
        say(err.message === 'not-configured' ? 'Sign-ups open very soon — please check back shortly!' : 'Something went wrong. Please try again in a moment.', 'err');
      } finally { btn.disabled = false; }
    });
  });

  /* ───── misc ───── */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
