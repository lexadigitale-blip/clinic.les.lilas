/* ==========================================================
   Clinique Les Lilas — shared front-end behavior
   Used by every public page (index, services, assistant,
   rendezvous). Handles the header, mobile menu, scroll
   reveal animations, and which nav link is "active" —
   based on <body data-page="..."> rather than scroll
   position, since the site is now split into real pages.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function(){

  /* ---------- header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  if(header){
    const onScroll = ()=> header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
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

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  if(revealEls.length){
    const revealObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold:0.15, rootMargin:'0px 0px -60px 0px'});
    revealEls.forEach(el=>revealObserver.observe(el));
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
});

/* ---------- small shared helpers ---------- */
function escapeHtmlShared(str){
  return String(str ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
