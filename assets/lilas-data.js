/* ==========================================================
   Clinique Les Lilas — shared data layer
   Used by BOTH clinique-experience.html (public site) and
   admin.html (admin panel). Everything is stored in the
   browser's localStorage, so admin.html and the public site
   must be served from the SAME origin to share data
   (e.g. both hosted on the same domain, or both opened
   through a local server like `python3 -m http.server`).
   Opening the two files directly as separate file:// pages
   may NOT share storage in every browser.
   ========================================================== */

const LILAS_KEYS = {
  services: 'lilas_services',
  contact:  'lilas_contact',
  messages: 'lilas_messages'
};

const LILAS_DEFAULT_SERVICES = [
  { id:'s1', title:'Médecin cardiologue', tag:'Cœur & circulation',
    icon:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
    desc:"Suivi du rythme cardiaque, de la tension et des facteurs de risque. Consultations, électrocardiogramme et échographie cardiaque pour prévenir et traiter les maladies cardiovasculaires." },
  { id:'s2', title:'Médecin gastrologue', tag:'Appareil digestif',
    icon:'<path d="M8 3v4a4 4 0 0 0 4 4a4 4 0 0 0 4-4V3"/><path d="M8 11v3a5 5 0 0 0 5 5h0a5 5 0 0 0 5-5v-1"/><circle cx="8" cy="17" r="2.2"/>',
    desc:"Diagnostic et traitement des troubles digestifs : estomac, intestin, foie et pancréas. Prise en charge des douleurs abdominales chroniques et des maladies inflammatoires." },
  { id:'s3', title:'Médecin radiologue', tag:'Imagerie diagnostique',
    icon:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>',
    desc:"Lecture et interprétation des examens d'imagerie — radiographie, échographie et scanner — pour poser un diagnostic précis en lien direct avec votre médecin traitant." },
  { id:'s4', title:'Médecine interne et diabète', tag:'Maladies chroniques',
    icon:'<path d="M3 12h4l2-7 4 14 2-7h6"/>',
    desc:"Suivi global des patients diabétiques et des maladies chroniques : équilibre glycémique, bilans réguliers et ajustement du traitement au long cours." },
  { id:'s5', title:'Médecin hématologue', tag:'Maladies du sang',
    icon:'<path d="M12 2C8 8 5 11.5 5 15a7 7 0 0 0 14 0c0-3.5-3-7-7-13Z"/>',
    desc:"Exploration des troubles du sang : anémies, anomalies de la coagulation et suivi biologique fin, en coordination étroite avec notre laboratoire." },
  { id:'s6', title:'Médecine nucléaire', tag:'Imagerie fonctionnelle',
    icon:'<circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="12" rx="9" ry="4"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)"/>',
    desc:"Scintigraphies et examens fonctionnels pour explorer le fonctionnement des organes, en complément de l'imagerie classique." },
  { id:'s7', title:'Médecin urologue', tag:'Appareil urinaire',
    icon:'<path d="M9 4C6 4 4.5 7 4.5 11c0 5 2.5 9 6 9c2 0 2.7-1.7 2.2-3.6c-.5-1.9-1.9-2.4-1.9-4.4c0-2.3 2.2-2.7 2.2-5.5C13 4.5 11.5 4 9 4Z"/><path d="M15 9c1.7 0 3 1.8 3 4.5S16.7 18 15 18"/>',
    desc:"Prise en charge des affections de l'appareil urinaire et du système reproducteur masculin, du dépistage au suivi post-traitement." },
  { id:'s8', title:'Pharmacienne biologiste', tag:'Analyses de laboratoire',
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

function lilasLoad(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    if(!raw) return JSON.parse(JSON.stringify(fallback));
    const parsed = JSON.parse(raw);
    if(Array.isArray(fallback) && (!Array.isArray(parsed) || parsed.length === 0)) return JSON.parse(JSON.stringify(fallback));
    return parsed;
  }catch(e){ return JSON.parse(JSON.stringify(fallback)); }
}
function lilasSave(key, val){
  try{ localStorage.setItem(key, JSON.stringify(val)); return true; }
  catch(e){ return false; }
}

function lilasGetServices(){ return lilasLoad(LILAS_KEYS.services, LILAS_DEFAULT_SERVICES); }
function lilasSetServices(list){ return lilasSave(LILAS_KEYS.services, list); }

function lilasGetContact(){ return lilasLoad(LILAS_KEYS.contact, LILAS_DEFAULT_CONTACT); }
function lilasSetContact(obj){ return lilasSave(LILAS_KEYS.contact, obj); }

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
