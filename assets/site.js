/* ==========================================================
   Clinique Les Lilas — shared front-end behavior
   Used by every public page (index, services, assistant,
   rendezvous). Handles the header, mobile menu, scroll
   reveal animations, active nav link, and all the shared
   "live" widgets driven by the data layer:
     [data-live]              → open/closed status pill
     [data-hero-slots]        → next slots inside the hero card
     [data-next-slots="N"]    → next N days of availability
     [data-hours]             → opening-hours table
     [data-team]              → team grid
     [data-ticker]            → specialty marquee
     [data-stats]             → hero statistics (animated)
     [data-testimonials]      → patient reviews
     [data-faq]               → FAQ accordion
     [data-address]/[data-phones] → contact info
   ========================================================== */

document.addEventListener('DOMContentLoaded', function(){
  const esc = (typeof escapeHtmlShared === 'function') ? escapeHtmlShared : (s=>String(s??''));

  /* ---------- header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  if(header){
    const onScroll = ()=> header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  /* ---------- nav active link + pill ---------- */
  const navLinks = document.querySelectorAll('.nav-link');
  const navPill = document.getElementById('navPill');
  const currentPage = document.body.dataset.page || 'home';

  function movePill(link){
    if(!link || !navPill) return;
    navPill.style.left = link.offsetLeft + 'px';
    navPill.style.width = link.offsetWidth + 'px';
  }
  function setActive(){
    let matched = null;
    navLinks.forEach(l=>{
      const isActive = l.dataset.target === currentPage;
      l.classList.toggle('active', isActive);
      if(isActive) matched = l;
    });
    movePill(matched);
  }
  setActive();
  window.addEventListener('load', setActive);
  window.addEventListener('resize', ()=> movePill(document.querySelector('.nav-link.active')));

  /* ---------- scroll progress bar ---------- */
  const prog = document.createElement('div');
  prog.id = 'scrollProgress';
  document.body.appendChild(prog);
  const onProg = ()=>{
    const h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + '%';
  };
  window.addEventListener('scroll', onProg, {passive:true});
  window.addEventListener('resize', onProg);
  onProg();

  /* ---------- back to top ---------- */
  const up = document.createElement('button');
  up.className = 'up-btn';
  up.type = 'button';
  up.setAttribute('aria-label', 'Revenir en haut');
  up.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(up);
  up.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
  window.addEventListener('scroll', ()=> up.classList.toggle('show', window.scrollY > 700), {passive:true});

  /* ---------- announcement bar (injecté dans le header) ---------- */
  try{
    const st = typeof lilasGetSettings === 'function' ? lilasGetSettings() : null;
    if(header && st && st.announcement && st.announcement.enabled && st.announcement.text
       && !sessionStorage.getItem('lilas_ann_closed')){
      const bar = document.createElement('div');
      bar.className = 'announce';
      bar.innerHTML = '<span class="dot"></span><span class="ann-text"></span>' +
        '<button class="ann-x" type="button" aria-label="Fermer l\'annonce"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';
      bar.querySelector('.ann-text').textContent = st.announcement.text;
      bar.querySelector('.ann-x').addEventListener('click', ()=>{
        bar.style.maxHeight = '0'; bar.style.opacity = '0';
        try{ sessionStorage.setItem('lilas_ann_closed','1'); }catch(e){}
      });
      header.insertBefore(bar, header.firstChild);
    }
  }catch(e){}

  /* ---------- reveal on scroll (safe fallback if IO is unavailable) ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  if(revealEls.length){
    if(typeof IntersectionObserver === 'function'){
      const revealObserver = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {threshold:0.15, rootMargin:'0px 0px -60px 0px'});
      revealEls.forEach(el=>revealObserver.observe(el));
    }else{
      revealEls.forEach(el=>el.classList.add('in'));
    }
  }

  /* ---------- mobile menu ---------- */
  const burger = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuBackdrop = document.getElementById('menuBackdrop');
  if(burger && mobileMenu && menuBackdrop){
    function toggleMenu(open){
      mobileMenu.classList.toggle('open', open);
      menuBackdrop.classList.toggle('open', open);
      document.body.classList.toggle('menu-lock', open);
    }
    burger.addEventListener('click', ()=>toggleMenu(!mobileMenu.classList.contains('open')));
    menuBackdrop.addEventListener('click', ()=>toggleMenu(false));
    document.querySelectorAll('.mm-link').forEach(a=>a.addEventListener('click', ()=>toggleMenu(false)));
  }

  /* ======================================================
     LIVE WIDGETS (driven by lilas-data.js)
     ====================================================== */
  if(typeof lilasGetSettings !== 'function') return;
  if(typeof lilasSeedDemo === 'function'){ try{ lilasSeedDemo(); }catch(e){} }
  const settings = lilasGetSettings();

  const PHONE_ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>';
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* --- open / closed status pills --- */
  function paintLive(){
    const s = lilasOpenStatus();
    document.querySelectorAll('[data-live]').forEach(el=>{
      el.classList.toggle('closed', !s.open);
      const label = el.querySelector('.live-label');
      if(label) label.textContent = s.label;
      else el.textContent = s.label;
    });
    document.querySelectorAll('[data-live-dot]').forEach(el=>{
      el.classList.toggle('closed', !s.open);
      const l = el.querySelector('.live-label');
      if(l) l.textContent = s.label;
    });
    document.querySelectorAll('[data-wait]').forEach(el=>{
      const w = lilasWaitEstimate();
      el.textContent = w.label;
      el.dataset.tone = w.tone;
    });
  }
  paintLive();
  setInterval(paintLive, 60000);

  /* --- next slots (hero card) --- */
  function renderHeroSlots(){
    const box = document.querySelector('[data-hero-slots]');
    if(!box) return;
    const slots = lilasNextSlots(3);
    const dateEl = document.querySelector('[data-hero-date]');
    if(dateEl) dateEl.textContent = slots.length ? lilasDateLabel(slots[0].date) : 'Sur appel';
    box.innerHTML = '';
    if(!slots.length){
      box.innerHTML = '<div style="grid-column:1/-1;font-size:.84rem;color:rgba(255,255,255,.7);padding:10px 0;">Aucun créneau en ligne pour l\'instant — appelez le ' +
        esc(((lilasGetContact().phones||[])[0]||{}).number || '') + ' pour convenir d\'une date.</div>';
      return;
    }
    slots.forEach(s=>{
      const a = document.createElement('a');
      a.className = 'bc-slot';
      a.href = 'rendezvous.html?date=' + encodeURIComponent(s.date) + '&time=' + encodeURIComponent(s.time);
      a.innerHTML = esc(s.time) + '<small>' + esc(lilasParseYmd(s.date).getDay() === new Date().getDay() ? "aujourd'hui" : lilasFormatDateFr(s.date).split(' ')[0]) + '</small>';
      box.appendChild(a);
    });
  }
  renderHeroSlots();

  /* --- next days availability grid --- */
  function renderNextSlots(){
    const box = document.querySelector('[data-next-slots]');
    if(!box) return;
    const count = parseInt(box.dataset.nextSlots, 10) || 4;
    const days = [];
    let d = lilasToday();
    let guard = 0;
    while(days.length < count && guard++ < 40){
      const slots = lilasHoursFor(d) ? lilasSlotsFor(d).filter(s=>!s.full && !s.past) : [];
      if(slots.length) days.push({date:d, slots:slots.slice(0,3), total:slots.length});
      d = lilasAddDays(d, 1);
    }
    box.innerHTML = '';
    if(!days.length){
      box.innerHTML = '<div class="bk-empty" style="grid-column:1/-1;">Aucun créneau disponible actuellement. Appelez la clinique au ' +
        esc(((lilasGetContact().phones||[])[0]||{}).number || '') + ' : nous ouvrirons des créneaux selon les demandes.</div>';
      return;
    }
    days.forEach(day=>{
      const el = document.createElement('div');
      el.className = 'slot-day reveal in';
      el.innerHTML =
        '<span class="sd-tag">' + esc(day.total > 3 ? day.total + ' créneaux' : 'disponible') + '</span>' +
        '<h4>' + esc(lilasDateLabel(day.date)) + '</h4>' +
        '<small>' + esc(lilasFormatDateFr(day.date)) + '</small>' +
        '<div class="slot-list"></div>';
      const list = el.querySelector('.slot-list');
      day.slots.forEach(s=>{
        const a = document.createElement('a');
        a.className = 'slot-time';
        a.href = 'rendezvous.html?date=' + encodeURIComponent(s.date) + '&time=' + encodeURIComponent(s.time);
        a.innerHTML = '<span>' + esc(s.time) + '</span><em>' + esc(s.free + ' place' + (s.free > 1 ? 's' : '')) + '</em>' + ARROW;
        list.appendChild(a);
      });
      box.appendChild(el);
    });
  }
  renderNextSlots();

  /* --- opening hours --- */
  function renderHours(){
    const box = document.querySelector('[data-hours]');
    if(!box) return;
    const today = new Date().getDay();
    box.innerHTML = '';
    const order = [1,2,3,4,5,6,0];
    order.forEach(i=>{
      const h = settings.hours[i];
      const row = document.createElement('div');
      row.className = 'hours-row' + (i === today ? ' today' : '');
      row.innerHTML = '<span>' + esc(lilasDaysFull(i)) + '</span><b>' +
        (h ? esc(h.open + ' – ' + h.close) + (h.brk ? ' <span style="opacity:.6;font-weight:500">(pause ' + esc(h.brk.replace('-', '–')) + ')</span>' : '')
            : '<span class="closed">Fermé</span>') + '</b>';
      box.appendChild(row);
    });
  }
  function lilasDaysFull(i){
    return ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'][i];
  }
  renderHours();

  /* --- team grid --- */
  function renderTeam(){
    const box = document.querySelector('[data-team]');
    if(!box) return;
    const team = (typeof lilasGetTeam === 'function' ? lilasGetTeam() : []).slice(0, 8);
    box.innerHTML = '';
    team.forEach(t=>{
      const card = document.createElement('div');
      card.className = 'team-card reveal';
      card.innerHTML =
        '<div class="team-av">' + esc(lilasInitials(t.name)) + '</div>' +
        '<h3>' + esc(t.name) + '</h3>' +
        '<div class="team-role">' + esc(t.role || '') + '</div>' +
        '<p class="team-bio">' + esc(t.bio || '') + '</p>' +
        (t.room ? '<div class="team-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>' + esc(t.room) + '</div>' : '');
      box.appendChild(card);
    });
  }
  renderTeam();

  /* --- specialty ticker --- */
  function renderTicker(){
    const box = document.querySelector('[data-ticker]');
    if(!box) return;
    const names = lilasGetServices().map(s => s.eyebrow || s.title);
    if(!names.length){ box.style.display = 'none'; return; }
    const half = names.map(n=>'<span class="ticker-item">' + esc(n) + '</span>').join('');
    box.innerHTML = '<div class="ticker-track">' + half + half + '</div>';
  }
  renderTicker();

  /* --- hero stats (with count-up) --- */
  function renderStats(){
    const box = document.querySelector('[data-stats]');
    if(!box) return;
    box.innerHTML = '';
    (settings.hero.stats || []).forEach(s=>{
      const el = document.createElement('div');
      el.className = 'stat';
      el.innerHTML = '<b data-target="' + esc(String(s.v)) + '">0</b><span>' + esc(s.l) + '</span>';
      box.appendChild(el);
    });
    const nums = box.querySelectorAll('b[data-target]');
    if(typeof IntersectionObserver !== 'function'){
      nums.forEach(n=>{
        const m = (n.dataset.target || '').match(/^(\d+)(.*)$/);
        n.textContent = m ? (m[1] + m[2]) : (n.dataset.target || '');
      });
      return;
    }
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(!e.isIntersecting) return;
        io.unobserve(e.target);
        const target = e.target;
        const raw = target.dataset.target || '';
        const m = raw.match(/^(\d+)(.*)$/);
        if(!m){ target.textContent = raw; return; }
        const end = parseInt(m[1], 10), suffix = m[2];
        const dur = 1200, t0 = performance.now();
        (function step(t){
          const p = Math.min(1, (t - t0) / dur);
          target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
          if(p < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, {threshold:.4});
    nums.forEach(n=>io.observe(n));
  }
  renderStats();

  /* --- testimonials --- */
  function renderTestimonials(){
    const box = document.querySelector('[data-testimonials]');
    if(!box) return;
    box.innerHTML = '';
    (settings.testimonials || []).forEach(t=>{
      const el = document.createElement('div');
      el.className = 'tst-card reveal';
      el.innerHTML =
        '<span class="q">“</span>' +
        '<div class="tst-stars">★★★★★</div>' +
        '<p>' + esc(t.text) + '</p>' +
        '<div class="tst-who"><b>' + esc(t.name) + '</b>' + (t.tag ? '<span>' + esc(t.tag) + '</span>' : '') + '</div>';
      box.appendChild(el);
    });
  }
  renderTestimonials();

  /* --- FAQ --- */
  function renderFaq(){
    const box = document.querySelector('[data-faq]');
    if(!box) return;
    box.innerHTML = '';
    (settings.faq || []).forEach((f, i)=>{
      const el = document.createElement('details');
      el.className = 'faq-item reveal';
      if(i === 0) el.open = true;
      el.innerHTML = '<summary>' + esc(f.q) + '</summary><div class="faq-a">' + esc(f.a) + '</div>';
      box.appendChild(el);
    });
  }
  renderFaq();

  /* --- address / phones --- */
  function renderContactBits(){
    const contact = lilasGetContact();
    document.querySelectorAll('[data-address]').forEach(el=> el.textContent = contact.address || '');
    document.querySelectorAll('[data-phones]').forEach(box=>{
      box.innerHTML = '';
      (contact.phones || []).forEach(p=>{
        const a = document.createElement('a');
        a.href = 'tel:' + String(p.number || '').replace(/\s+/g, '');
        a.innerHTML = PHONE_ICO + '<span>' + esc(p.label || '') + ' · ' + esc(p.number || '') + '</span>';
        box.appendChild(a);
      });
    });
    document.querySelectorAll('[data-map-link]').forEach(a=>{
      a.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(contact.address || 'Clinique Les Lilas');
    });
  }
  renderContactBits();

  /* --- hero live text fallbacks --- */
  document.querySelectorAll('[data-hero-title]').forEach(el=>{
    el.innerHTML = esc(settings.hero.title || '') + '<br><em>' + esc(settings.hero.titleEm || '') + '</em>';
  });
  document.querySelectorAll('[data-hero-eyebrow]').forEach(el=> el.textContent = settings.hero.eyebrow || '');
  document.querySelectorAll('[data-hero-lede]').forEach(el=> el.textContent = settings.hero.lede || '');

  /* --- footer extras injection --- */
  try{
    const footer = document.querySelector('footer');
    if(footer && !footer.querySelector('.foot-extras')){
      const contact = lilasGetContact();
      const extras = document.createElement('div');
      extras.className = 'wrap';
      const cols = [];
      const isHome = document.body.dataset.page === 'home';
      cols.push('<div class="foot-col">' +
        '<h5>Clinique Les Lilas</h5>' +
        '<p class="fc-lead">Clinique de diagnostic médical à Haï El Yasmine. Un diagnostic expliqué, jamais subi.</p></div>');
      cols.push('<div class="foot-col"><h5>Accès rapide</h5>' +
        '<a href="index.html">Accueil</a>' +
        '<a href="services.html">Spécialités</a>' +
        '<a href="rendezvous.html">Prendre rendez-vous</a>' +
        '<a href="rendezvous.html#suivi">Suivre mon rendez-vous</a>' +
        '<a href="assistant.html">Assistant d\'orientation</a></div>');
      /* hours + address already sit just above the footer on the homepage */
      if(!isHome){
        const val = i => { const h = settings.hours[i]; return h ? h.open + '–' + h.close : 'Fermé'; };
        const groups = [];
        [0,1,2,3,4,5,6].forEach(i=>{
          const last = groups[groups.length-1];
          if(last && last.v === val(i)) last.days.push(i); else groups.push({v: val(i), days:[i]});
        });
        const sh = i => lilasDaysFull(i).slice(0,3);
        const rows = groups.map(g=>'<p>' + (g.days.length > 1 ? sh(g.days[0]) + ' – ' + sh(g.days[g.days.length-1]) : sh(g.days[0])) + ' : ' + esc(g.v) + '</p>').join('');
        cols.push('<div class="foot-col"><h5>Horaires</h5>' + rows + '</div>');
        cols.push('<div class="foot-col"><h5>Adresse</h5><p>' + esc(contact.address || '') + '</p></div>');
      }
      extras.innerHTML = '<div class="foot-extras' + (isHome ? ' is-home' : '') + '">' + cols.join('') + '</div>';
      footer.insertBefore(extras, footer.firstChild);
    }
    const small = footer && footer.querySelector('.foot-grid small');
    if(small) small.innerHTML = '© ' + new Date().getFullYear() + ' Clinique de diagnostic médical Les Lilas — Haï El Yasmine. ' +
      '<span class="foot-admin">· <a href="/admin">Administration</a></span>';
  }catch(e){}
});

/* ---------- small shared helpers ---------- */
function escapeHtmlShared(str){
  return String(str ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
