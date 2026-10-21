/* ==========================================================
   Clinique Les Lilas — shared data layer
   Used by BOTH the public site (index, services, assistant,
   rendezvous) and admin.html (admin panel). Everything is
   stored in the browser's localStorage, so the admin and the
   public site must be served from the SAME origin to share
   data (same domain, or both through a local server like
   `python3 -m http.server`).
   ========================================================== */

const LILAS_KEYS = {
  services:    'lilas_services',
  contact:     'lilas_contact',
  messages:    'lilas_messages',
  appointments:'lilas_appointments',
  team:        'lilas_team',
  settings:    'lilas_settings',
  activity:    'lilas_activity',
  seeded:      'lilas_seeded_v3'
};

/* ---------------- default services ---------------- */
const LILAS_DEFAULT_SERVICES = [
  { id:'s1', title:'Médecin cardiologue', tag:'Cœur & circulation', eyebrow:'Cardiologie',
    icon:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
    desc:"Suivi du rythme cardiaque, de la tension et des facteurs de risque. Consultations, électrocardiogramme et échographie cardiaque pour prévenir et traiter les maladies cardiovasculaires." },
  { id:'s2', title:'Médecin gastrologue', tag:'Appareil digestif', eyebrow:'Gastro-entérologie',
    icon:'<path d="M8 3v4a4 4 0 0 0 4 4a4 4 0 0 0 4-4V3"/><path d="M8 11v3a5 5 0 0 0 5 5h0a5 5 0 0 0 5-5v-1"/><circle cx="8" cy="17" r="2.2"/>',
    desc:"Diagnostic et traitement des troubles digestifs : estomac, intestin, foie et pancréas. Prise en charge des douleurs abdominales chroniques et des maladies inflammatoires." },
  { id:'s3', title:'Médecin radiologue', tag:'Imagerie diagnostique', eyebrow:'Radiologie',
    icon:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>',
    desc:"Lecture et interprétation des examens d'imagerie — radiographie, échographie et scanner — pour poser un diagnostic précis en lien direct avec votre médecin traitant." },
  { id:'s4', title:'Médecine interne et diabète', tag:'Maladies chroniques', eyebrow:'Médecine interne',
    icon:'<path d="M3 12h4l2-7 4 14 2-7h6"/>',
    desc:"Suivi global des patients diabétiques et des maladies chroniques : équilibre glycémique, bilans réguliers et ajustement du traitement au long cours." },
  { id:'s5', title:'Médecin hématologue', tag:'Maladies du sang', eyebrow:'Hématologie',
    icon:'<path d="M12 2C8 8 5 11.5 5 15a7 7 0 0 0 14 0c0-3.5-3-7-7-13Z"/>',
    desc:"Exploration des troubles du sang : anémies, anomalies de la coagulation et suivi biologique fin, en coordination étroite avec notre laboratoire." },
  { id:'s6', title:'Médecine nucléaire', tag:'Imagerie fonctionnelle', eyebrow:'Médecine nucléaire',
    icon:'<circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="12" rx="9" ry="4"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)"/>',
    desc:"Scintigraphies et examens fonctionnels pour explorer le fonctionnement des organes, en complément de l'imagerie classique." },
  { id:'s7', title:'Médecin urologue', tag:'Appareil urinaire', eyebrow:'Urologie',
    icon:'<path d="M9 4C6 4 4.5 7 4.5 11c0 5 2.5 9 6 9c2 0 2.7-1.7 2.2-3.6c-.5-1.9-1.9-2.4-1.9-4.4c0-2.3 2.2-2.7 2.2-5.5C13 4.5 11.5 4 9 4Z"/><path d="M15 9c1.7 0 3 1.8 3 4.5S16.7 18 15 18"/>',
    desc:"Prise en charge des affections de l'appareil urinaire et du système reproducteur masculin, du dépistage au suivi post-traitement." },
  { id:'s8', title:'Pharmacienne biologiste', tag:'Analyses de laboratoire', eyebrow:'Biologie médicale',
    icon:'<path d="M9 3v6l-6 10a1 1 0 0 0 .9 1.5h16.2a1 1 0 0 0 .9-1.5L15 9V3"/><path d="M9 3h6M9 12h6"/>',
    desc:"Réalisation et validation des analyses biologiques du laboratoire, garantissant des résultats fiables transmis rapidement à votre médecin." }
];

const LILAS_DEFAULT_CONTACT = {
  address: "13, Zone des cliniques, Haï El Yasmine",
  phones: [
    { label:"Consultation", number:"0560 14 01 40" },
    { label:"Laboratoire",  number:"0560 12 04 20" },
    { label:"Imagerie",     number:"0560 12 02 20" }
  ]
};

/* ---------------- default team ---------------- */
const LILAS_DEFAULT_TEAM = [
  { id:'t1', name:'Dr. Amina Belkacem', role:'Cardiologue', group:'consultation', serviceId:'s1',
    bio:'Consultations, ECG et échographie cardiaque. Suivi des hypertendus et des post-infarctus.', room:'Salle 12 — 1er étage' },
  { id:'t2', name:'Dr. Karim Messaoudi', role:'Gastro-entérologue', group:'consultation', serviceId:'s2',
    bio:'Endoscopie digestive, échographie abdominale et prise en charge des maladies chroniques du foie.', room:'Salle 08 — rez-de-chaussée' },
  { id:'t3', name:'Dr. Yasmine Haddad', role:'Radiologue', group:'imagerie', serviceId:'s3',
    bio:'Lecture des radiographies, échographies et scanners. Résultats dictés le jour même.', room:'Pôle imagerie — sous-sol' },
  { id:'t4', name:'Dr. Sofiane Rahmani', role:'Médecine interne & diabète', group:'consultation', serviceId:'s4',
    bio:'Équilibre glycémique, bilans annuels et accompagnement des maladies chroniques.', room:'Salle 15 — 1er étage' },
  { id:'t5', name:'Dr. Nadia Cherif', role:'Hématologue', group:'consultation', serviceId:'s5',
    bio:'Exploration des anémies et des troubles de la coagulation, en lien direct avec le laboratoire.', room:'Salle 10 — 1er étage' },
  { id:'t6', name:'Dr. Reda Amrani', role:'Médecin nucléaire', group:'imagerie', serviceId:'s6',
    bio:'Scintigraphies et imagerie fonctionnelle thyroidienne et osseuse.', room:'Pôle imagerie — sous-sol' },
  { id:'t7', name:'Dr. Lamine Bouzid', role:'Urologue', group:'consultation', serviceId:'s7',
    bio:'Echographie rénale, dépistage prostatique et suivi des lithiases urinaires.', room:'Salle 06 — rez-de-chaussée' },
  { id:'t8', name:'Lynda Sekkouri', role:'Pharmacienne biologiste', group:'laboratoire', serviceId:'s8',
    bio:'Validation des analyses et contrôle qualité du pôle laboratoire.', room:'Pôle laboratoire — rez-de-chaussée' }
];

/* ---------------- default settings ---------------- */
const LILAS_DAYS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
const LILAS_DAYS_SHORT = ['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'];
const LILAS_MONTHS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];

const LILAS_DEFAULT_SETTINGS = {
  announcement: {
    enabled: true,
    tone: 'info',
    text: "Prélèvements à jeun dès 7h30 — 6 places par créneau, résultats biologiques sous 48h."
  },
  hero: {
    eyebrow: 'Clinique Les Lilas · Haï El Yasmine',
    title: 'Le diagnostic,',
    titleEm: 'en toute confiance.',
    lede: "Consultation, laboratoire et imagerie réunis dans un même lieu, avec huit spécialités médicales et une équipe qui prend le temps de vous expliquer chaque étape.",
    stats: [
      { v:'8',  l:'spécialités médicales' },
      { v:'3',  l:'plateaux techniques' },
      { v:'48h',l:'délai moyen des résultats' }
    ]
  },
  /* hours indexed by JS day number (0 = dimanche). null = fermé */
  hours: {
    0: { open:'08:00', close:'17:00', brk:'12:00-13:30' },
    1: { open:'08:00', close:'17:00', brk:'12:00-13:30' },
    2: { open:'08:00', close:'17:00', brk:'12:00-13:30' },
    3: { open:'08:00', close:'17:00', brk:'12:00-13:30' },
    4: { open:'08:00', close:'17:00', brk:'12:00-13:30' },
    5: null,
    6: null
  },
  booking: {
    enabled: true,
    slotMinutes: 30,
    perSlot: 3,
    daysAhead: 30,
    leadHours: 2,
    closedDates: []   /* 'YYYY-MM-DD' */
  },
  testimonials: [
    { name:'Samira B.', text:"On m'explique enfin mes résultats au lieu de me les lire d'un trait. Le laboratoire est très rapide.", tag:'Suivi diabète' },
    { name:'Karim T.', text:"Rendez-vous pris en deux minutes sur le site, créneau confirmé par SMS le lendemain.", tag:'Cardiologie' },
    { name:'Nawel H.', text:"L'assistant m'a orientée vers le bon pôle avant même d'appeler. Tout s'est fait dans la journée.", tag:'Radiologie' }
  ],
  faq: [
    { q:"Faut-il une ordonnance pour prendre rendez-vous ?", a:"Non, vous pouvez réserver directement un créneau en ligne. En revanche, apportez vos ordonnances et anciens résultats à la consultation : ils font gagner du temps au diagnostic." },
    { q:"Quand récupère-t-on les résultats d'analyse ?", a:"La majorité des résultats biologiques sont disponibles sous 48h. Les comptes rendus d'imagerie sont dictés le jour même par le radiologue et remis à l'accueil." },
    { q:"Comment modifier ou annuler un rendez-vous ?", a:"Appelez le 0560 14 01 40 avec votre code de rendez-vous (format LL-XXXXX), ou passez à l'accueil. Aucun frais n'est appliqué en cas d'annulation prévenue la veille." },
    { q:"Le site propose-t-il les urgences ?", a:"Non. En cas de douleur thoracique, de trouble respiratoire ou de malaise, appelez le 14 ou dirigez-vous aux urgences les plus proches, sans attendre de rendez-vous." },
    { q:"Les examens sont-ils réalisés sur place ?", a:"Oui : consultation, laboratoire et imagerie sont réunis dans le même bâtiment, ce qui évite les allers-retours entre établissements." }
  ]
};

/* ================= generic storage ================= */
function lilasClone(v){ return JSON.parse(JSON.stringify(v)); }
function lilasLoad(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    if(!raw) return lilasClone(fallback);
    const parsed = JSON.parse(raw);
    if(parsed === null || parsed === undefined) return lilasClone(fallback);
    if(Array.isArray(fallback) && !Array.isArray(parsed)) return lilasClone(fallback);
    return parsed;
  }catch(e){ return lilasClone(fallback); }
}
function lilasSave(key, val){
  try{ localStorage.setItem(key, JSON.stringify(val)); return true; }
  catch(e){ return false; }
}

/* ================= services ================= */
function lilasGetServices(){ return lilasLoad(LILAS_KEYS.services, LILAS_DEFAULT_SERVICES); }
function lilasSetServices(list){ return lilasSave(LILAS_KEYS.services, list); }

/* ================= contact ================= */
function lilasGetContact(){ return lilasLoad(LILAS_KEYS.contact, LILAS_DEFAULT_CONTACT); }
function lilasSetContact(obj){ return lilasSave(LILAS_KEYS.contact, obj); }

/* ================= messages ================= */
function lilasGetMessages(){ return lilasLoad(LILAS_KEYS.messages, []); }
function lilasSetMessages(list){ return lilasSave(LILAS_KEYS.messages, list); }
function lilasAddMessage(msg){
  const list = lilasGetMessages();
  list.unshift(Object.assign({
    id: 'm' + Date.now() + Math.random().toString(16).slice(2),
    date: new Date().toISOString(),
    read: false
  }, msg));
  lilasSetMessages(list);
  return list;
}
function lilasUid(prefix){ return prefix + Date.now().toString(36) + Math.random().toString(16).slice(2,6); }

/* Pôle (consultation / imagerie / laboratoire) used to group services on the public site */
const LILAS_GROUPS = { s1:'consultation', s2:'consultation', s3:'imagerie', s4:'consultation', s5:'consultation', s6:'imagerie', s7:'consultation', s8:'laboratoire' };
function lilasGroupOf(s){ return s.group || LILAS_GROUPS[s.id] || 'consultation'; }

/* ================= team ================= */
function lilasGetTeam(){ return lilasLoad(LILAS_KEYS.team, LILAS_DEFAULT_TEAM); }
function lilasSetTeam(list){ return lilasSave(LILAS_KEYS.team, list); }
function lilasInitials(name){
  return String(name||'').replace(/^Dr\.?\s*/i,'').split(/[\s.]+/).filter(Boolean).slice(0,2)
    .map(w=>w[0].toUpperCase()).join('') || 'LL';
}

/* ================= settings ================= */
function lilasGetSettings(){
  const s = lilasLoad(LILAS_KEYS.settings, LILAS_DEFAULT_SETTINGS);
  /* guard against partially saved settings from older versions */
  if(!s.hours) s.hours = lilasClone(LILAS_DEFAULT_SETTINGS.hours);
  if(!s.booking) s.booking = lilasClone(LILAS_DEFAULT_SETTINGS.booking);
  if(!s.hero) s.hero = lilasClone(LILAS_DEFAULT_SETTINGS.hero);
  if(!s.announcement) s.announcement = lilasClone(LILAS_DEFAULT_SETTINGS.announcement);
  return s;
}
function lilasSetSettings(obj){ return lilasSave(LILAS_KEYS.settings, obj); }
function lilasResetSettings(){ try{ localStorage.removeItem(LILAS_KEYS.settings); }catch(e){} }

/* ================= activity journal (admin) ================= */
function lilasGetActivity(){ return lilasLoad(LILAS_KEYS.activity, []); }
function lilasAddActivity(text, kind){
  const list = lilasGetActivity();
  list.unshift({ id: lilasUid('a'), date: new Date().toISOString(), text: String(text||''), kind: kind||'info' });
  lilasSave(LILAS_KEYS.activity, list.slice(0, 120));
}
function lilasClearActivity(){ return lilasSave(LILAS_KEYS.activity, []); }

/* ================= dates ================= */
function lilasYmd(d){
  d = new Date(d);
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function lilasParseYmd(s){
  const p = String(s||'').split('-').map(Number);
  return new Date(p[0], (p[1]||1)-1, p[2]||1);
}
function lilasToday(){ return lilasYmd(new Date()); }
function lilasAddDays(ymd, n){
  const d = lilasParseYmd(ymd); d.setDate(d.getDate()+n); return lilasYmd(d);
}
function lilasMin(hhmm){
  const p = String(hhmm||'00:00').split(':').map(Number);
  return (p[0]||0)*60 + (p[1]||0);
}
function lilasFormatDateFr(ymd, opts){
  const d = lilasParseYmd(ymd);
  const base = LILAS_DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + LILAS_MONTHS[d.getMonth()];
  return (opts && opts.short) ? base : base + (d.getFullYear() !== new Date().getFullYear() ? ' ' + d.getFullYear() : '');
}
function lilasDateLabel(ymd){
  const t = lilasToday();
  if(ymd === t) return "Aujourd'hui";
  if(ymd === lilasAddDays(t,1)) return 'Demain';
  if(ymd === lilasAddDays(t,2)) return 'Après-demain';
  return lilasFormatDateFr(ymd);
}

/* ================= appointments ================= */
function lilasGetAppointments(){ return lilasLoad(LILAS_KEYS.appointments, []); }
function lilasSetAppointments(list){ return lilasSave(LILAS_KEYS.appointments, list); }
function lilasRefCode(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for(let i=0;i<5;i++) out += chars[Math.floor(Math.random()*chars.length)];
  return 'LL-' + out;
}
function lilasNewRef(){
  const list = lilasGetAppointments().map(a=>a.ref);
  let ref = lilasRefCode();
  let guard = 0;
  while(list.includes(ref) && guard++ < 40) ref = lilasRefCode();
  return ref;
}
function lilasFindAppointment(ref){
  const r = String(ref||'').trim().toUpperCase();
  return lilasGetAppointments().find(a => a.ref.toUpperCase() === r) || null;
}
function lilasAddAppointment(appt){
  const list = lilasGetAppointments();
  const full = Object.assign({
    id: lilasUid('rdv'),
    ref: lilasNewRef(),
    date: lilasToday(),
    time: '09:00',
    name: '', phone: '', email: '',
    service: 'Consultation générale',
    team: '',
    note: '',
    reminder: 'tel',
    status: 'nouveau',
    source: 'site',
    createdAt: new Date().toISOString()
  }, appt);
  list.unshift(full);
  lilasSetAppointments(list);
  return full;
}
function lilasUpdateAppointment(id, patch){
  const list = lilasGetAppointments();
  const a = list.find(x=>x.id === id);
  if(!a) return null;
  Object.assign(a, patch);
  lilasSetAppointments(list);
  return a;
}
function lilasDeleteAppointment(id){
  lilasSetAppointments(lilasGetAppointments().filter(x=>x.id !== id));
}
const LILAS_STATUS = {
  nouveau:  { label:'À confirmer', tone:'new' },
  confirme: { label:'Confirmé',     tone:'ok' },
  termine:  { label:'Terminé',      tone:'done' },
  annule:   { label:'Annulé',       tone:'cancel' }
};

/* ================= opening hours / slots ================= */
function lilasHoursFor(ymd){
  const st = lilasGetSettings();
  const day = lilasParseYmd(ymd).getDay();
  if((st.booking.closedDates||[]).includes(ymd)) return null;
  return st.hours[day] || null;
}

/* All slots of one day, with availability computed from appointments. */
function lilasSlotsFor(ymd, ignoreLead){
  const st = lilasGetSettings();
  const h = lilasHoursFor(ymd);
  if(!h || !st.booking.enabled) return [];
  const step = Math.max(10, +st.booking.slotMinutes || 30);
  const brk = (h.brk && h.brk.indexOf('-') > -1) ? h.brk.split('-') : null;
  const out = [];
  for(let t = lilasMin(h.open); t + step <= lilasMin(h.close); t += step){
    const time = String(Math.floor(t/60)).padStart(2,'0') + ':' + String(t%60).padStart(2,'0');
    if(brk && t < lilasMin(brk[1]) && t + step > lilasMin(brk[0])) continue;
    out.push({ date: ymd, time: time, taken: 0, total: st.booking.perSlot, full: false, past: false });
  }
  lilasGetAppointments().forEach(a=>{
    if(a.status === 'annule' || a.date !== ymd) return;
    const s = out.find(x=>x.time === a.time);
    if(s) s.taken++;
  });
  const cutoff = new Date(Date.now() + (+st.booking.leadHours||0) * 3600000);
  out.forEach(s=>{
    s.full = s.taken >= s.total;
    s.past = !ignoreLead && (lilasParseYmd(ymd).getTime() + lilasMin(s.time)*60000) < cutoff.getTime();
    s.free = Math.max(0, s.total - s.taken);
  });
  return out;
}

/* Next n free slots, starting from a given day (defaults to today). */
function lilasNextSlots(count, fromYmd){
  const st = lilasGetSettings();
  const out = [];
  let d = fromYmd || lilasToday();
  const end = lilasAddDays(d, Math.max(1, +st.booking.daysAhead || 30));
  let guard = 0;
  while(d <= end && out.length < count && guard++ < 60){
    if(lilasHoursFor(d)){
      lilasSlotsFor(d).forEach(s=>{ if(!s.full && !s.past && out.length < count) out.push(s); });
    }
    d = lilasAddDays(d, 1);
  }
  return out;
}

/* Is the clinic open right now? Used by the live status pill. */
function lilasOpenStatus(now){
  const st = lilasGetSettings();
  now = now || new Date();
  const day = now.getDay();
  const mins = now.getHours()*60 + now.getMinutes();
  const h = st.hours[day];
  if(h && mins >= lilasMin(h.open) && mins < lilasMin(h.close)){
    return { open:true, label:'Ouvert · jusqu\'à ' + h.close, day:day };
  }
  for(let i=0;i<=7;i++){
    const d = (day + i) % 7;
    const hd = st.hours[d];
    if(!hd) continue;
    if(i === 0 && mins < lilasMin(hd.open)) return { open:false, label:'Fermé · ouvre à ' + hd.open, day:d };
    if(i === 0) continue; /* déjà passé la fermeture aujourd'hui : on cherche le prochain jour ouvré */
    const when = i === 1 ? 'demain' : LILAS_DAYS[d];
    return { open:false, label:'Fermé · ouvre ' + when + ' à ' + hd.open, day:d };
  }
  return { open:false, label:'Fermé', day:day };
}

/* Rough "you will be seen around" estimate for the waiting-time widget. */
function lilasWaitEstimate(){
  const st = lilasGetSettings();
  const now = new Date();
  const slots = lilasSlotsFor(lilasToday()).filter(s=>!s.past);
  const current = slots.filter(s=>lilasMin(s.time) <= now.getHours()*60 + now.getMinutes()).pop();
  if(!current) return { label:'Sans attente', minutes:0, tone:'low' };
  const load = current.taken / Math.max(1, current.total);
  const minutes = Math.round(10 + load * 45);
  return { label:'≈ ' + minutes + ' min d\'attente', minutes:minutes, tone: load > .8 ? 'high' : (load > .45 ? 'mid' : 'low') };
}

/* ================= demo seed (first visit only) ================= */
function lilasSeedDemo(force){
  try{
    if(!force && localStorage.getItem(LILAS_KEYS.seeded)) return false;
    localStorage.setItem(LILAS_KEYS.seeded, '1');
  }catch(e){ return false; }

  let seed = 20261021;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  const pick = a => a[Math.floor(rnd()*a.length)];

  const services = LILAS_DEFAULT_SERVICES;
  const first = ['Samira','Karim','Nawel','Yacine','Lila','Mohamed','Imene','Farid','Sarah','Riad','Amel','Bilal','Nesrine','Walid','Meriem','Anis'];
  const last  = ['Benali','Messai','Hadj','Boukhalfa','Slimani','Cherif','Zerrouki','Belaid','Ouali','Taleb','Guerroudj','Lounis','Saidi','Mansouri'];
  const notes = ['Bilan annuel','Douleurs au ventre depuis 3 jours','Contrôle tension','Prise de sang à jeun','Suivi diabète — HbA1c','Échographie de contrôle','Palpitations occasionnelles','Résultats à retirer','Courbe glycmique','Rendez-vous de prévention'];

  if(!localStorage.getItem(LILAS_KEYS.messages)){
    const seedMsgs = [
      { name:'Samira Benali', phone:'0661 22 41 08', service:'Médecine interne et diabète', message:'Bonjour, je souhaite un rendez-vous pour un bilan de suivi du diabète, de préférence en fin de journée.', source:'form' },
      { name:'Yacine Messai', phone:'0555 78 12 90', service:'Médecin cardiologue', message:'Orientation : Cardiologie. Motif décrit par le patient : « palpitations le soir depuis une semaine ».', source:'assistant' },
      { name:'Nawel Hadj', phone:'0770 55 63 21', service:'Médecin radiologue', message:'Peut-on passer une échographie abdominale sans rendez-vous le matin ?', source:'form' },
      { name:'Farid Cherif', phone:'0660 14 90 77', service:'Pharmacienne biologiste', message:'Je viens de faire une prise de sang, sous quel délai vais-je recevoir les résultats ?', source:'form' },
      { name:'Lila Zerrouki', phone:'0540 33 18 64', service:'Médecin gastrologue', message:'Douleurs gastriques depuis 4 jours après les repas, je préfère être orientée.', source:'assistant' }
    ];
    seedMsgs.forEach((m,i)=>{
      m.id = 'mseed' + i;
      m.date = new Date(Date.now() - (i*7 + 1) * 3600000 * 5).toISOString();
      m.read = i > 2;
    });
    lilasSetMessages(seedMsgs);
  }

  if(!localStorage.getItem(LILAS_KEYS.appointments)){
    const appts = [];
    const statuses = ['termine','termine','termine','confirme','confirme','nouveau','nouveau','annule'];
    for(let off = -6; off <= 9; off++){
      const day = lilasAddDays(lilasToday(), off);
      const h = lilasHoursFor(day);
      if(!h) continue;
      const slots = lilasSlotsFor(day, true).filter(s=>!s.past || off < 0);
      const n = Math.min(slots.length, 1 + Math.floor(rnd()*4));
      for(let i=0;i<n;i++){
        const s = pick(slots);
        if(!s) break;
        const svc = pick(services);
        const member = LILAS_DEFAULT_TEAM.filter(t=>t.serviceId === svc.id)[0];
        appts.push({
          id: lilasUid('rdv'),
          ref: 'LL-' + ['K4P2M','X7T9R','B3N8L','Q5W1D','H2J6C','V9M4K','T8R3F','Z1L7P','N6C2S','Y4G8B'][Math.floor(rnd()*10)] + Math.floor(rnd()*90+10),
          date: day, time: s.time,
          name: pick(first) + ' ' + pick(last),
          phone: '0' + pick(['5','6','7']) + String(Math.floor(rnd()*90000000)+10000000).slice(0,8),
          email: '',
          service: svc.title,
          team: member ? member.name : '',
          note: pick(notes),
          reminder: pick(['tel','sms','email']),
          status: off < 0 ? (rnd() < .85 ? 'termine' : 'annule') : pick(statuses.slice(3)),
          source: rnd() < .75 ? 'site' : 'admin',
          createdAt: new Date(Date.now() - (Math.abs(off)+1) * 86400000).toISOString(),
          demo: true
        });
      }
    }
    lilasSetAppointments(appts.sort((a,b)=> (b.date+b.time).localeCompare(a.date+a.time)));
  }

  if(!localStorage.getItem(LILAS_KEYS.activity)){
    lilasSave(LILAS_KEYS.activity, [
      { id:lilasUid('a'), date:new Date(Date.now()-3600000*2).toISOString(), text:'3 demandes de rendez-vous reçues depuis le site', kind:'rdv' },
      { id:lilasUid('a'), date:new Date(Date.now()-3600000*6).toISOString(), text:'Créneau de 10h30 confirmé par téléphone', kind:'rdv' },
      { id:lilasUid('a'), date:new Date(Date.now()-3600000*20).toISOString(), text:'Spécialité « Médecin urologue » mise à jour', kind:'svc' },
      { id:lilasUid('a'), date:new Date(Date.now()-3600000*30).toISOString(), text:'Coordonnées du pôle laboratoire modifiées', kind:'contact' }
    ]);
  }
  return true;
}

/* ================= csv / file helpers (admin) ================= */
function lilasToCsv(rows){
  return rows.map(r => r.map(c => {
    const v = String(c == null ? '' : c);
    return /[";\n]/.test(v) ? '"' + v.replace(/"/g,'""') + '"' : v;
  }).join(';')).join('\r\n');
}
function lilasDownload(filename, content, mime){
  const blob = new Blob(['\ufeff' + content], { type: (mime || 'text/csv') + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1500);
}
function lilasBackupAll(){
  const dump = { exportedAt: new Date().toISOString() };
  [LILAS_KEYS.services, LILAS_KEYS.contact, LILAS_KEYS.messages, LILAS_KEYS.appointments,
   LILAS_KEYS.team, LILAS_KEYS.settings, LILAS_KEYS.activity].forEach(k=>{
    try{ dump[k] = JSON.parse(localStorage.getItem(k) || 'null'); }catch(e){ dump[k] = null; }
  });
  return JSON.stringify(dump, null, 2);
}
function lilasRestoreAll(json){
  const dump = JSON.parse(json);
  Object.keys(dump).forEach(k=>{
    if(k === 'exportedAt') return;
    if(dump[k] === null || dump[k] === undefined) return;
    localStorage.setItem(k, JSON.stringify(dump[k]));
  });
}
