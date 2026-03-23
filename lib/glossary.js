// lib/glossary.js
// Glossaire partagé client + serveur.
// Si un texte matche ici → zéro appel IA, zéro réseau.

export const GLOSSARY = {
  en: {
    'accueil': 'Home', 'à propos': 'About', 'a propos': 'About',
    'services': 'Services', 'projets': 'Work', 'cv': 'Résumé', 'contact': 'Contact',
    'expérience': 'Experience', 'expériences': 'Experience', 'experience': 'Experience',
    'formation': 'Education', 'compétences': 'Skills',
    'compétences techniques': 'Technical Skills', 'soft skills': 'Soft Skills',
    'stack technique': 'Tech Stack', 'domaines': 'Domains', 'valeurs': 'Values',
    'me contacter': 'Contact me', 'voir mes projets': 'View my work',
    'télécharger le cv': 'Download CV', 'télécharger pdf': 'Download PDF',
    '↓ télécharger pdf': '↓ Download PDF',
    'envoyer': 'Send', 'envoi…': 'Sending…',
    'voir le projet': 'View project', 'code source': 'Source code',
    'disponible bientôt': 'Coming soon', 'disponible bientot': 'Coming soon',
    'disponible': 'Available',
    'nom': 'Name', 'email': 'Email', 'sujet': 'Subject', 'message': 'Message',
    '01 · à propos': '01 · About', '02 · services': '02 · Services',
    '03 · projets': '03 · Work', '04 · curriculum': '04 · Résumé',
    '05 · contact': '05 · Contact',
    'ingénieur statisticien-économiste': 'Statistical Engineer-Economist',
    'données': 'Data', 'donnée': 'Data', 'tous droits réservés': 'All rights reserved',
    'données → décisions': 'Data → Decisions', 'défiler': 'Scroll',
    'localisation': 'Location',
  },
  ar: {
    'accueil': 'الرئيسية', 'à propos': 'نبذة', 'a propos': 'نبذة',
    'services': 'الخدمات', 'projets': 'الأعمال', 'cv': 'السيرة', 'contact': 'تواصل',
    'expérience': 'الخبرة', 'expériences': 'الخبرة', 'experience': 'الخبرة',
    'formation': 'التعليم', 'compétences': 'المهارات',
    'compétences techniques': 'المهارات التقنية', 'soft skills': 'المهارات الشخصية',
    'stack technique': 'التقنيات', 'domaines': 'المجالات', 'valeurs': 'القيم',
    'me contacter': 'تواصل معي', 'voir mes projets': 'مشاريعي',
    'télécharger le cv': 'تحميل السيرة', 'télécharger pdf': 'تحميل PDF',
    '↓ télécharger pdf': '↓ تحميل PDF',
    'envoyer': 'إرسال', 'envoi…': 'جارٍ الإرسال…',
    'voir le projet': 'عرض المشروع', 'code source': 'الكود المصدري',
    'disponible bientôt': 'قريباً', 'disponible bientot': 'قريباً', 'disponible': 'متاح',
    'nom': 'الاسم', 'email': 'البريد', 'sujet': 'الموضوع', 'message': 'الرسالة',
    '01 · à propos': '01 · نبذة', '02 · services': '02 · الخدمات',
    '03 · projets': '03 · الأعمال', '04 · curriculum': '04 · السيرة',
    '05 · contact': '05 · تواصل',
    'ingénieur statisticien-économiste': 'مهندس إحصائي-اقتصادي',
    'données': 'بيانات', 'donnée': 'بيانات', 'tous droits réservés': 'جميع الحقوق محفوظة',
    'données → décisions': 'بيانات → قرارات', 'défiler': 'اسحب للأسفل',
    'localisation': 'الموقع',
  },
};

export function normalizeKey(str = '') {
  return str.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function glossaryLookup(text, lang) {
  if (!text || !GLOSSARY[lang]) return null;
  const exact = GLOSSARY[lang][text.trim().toLowerCase()];
  if (exact !== undefined) return exact;
  return GLOSSARY[lang][normalizeKey(text)] ?? null;
}

export function isShortUiText(text = '') {
  const t = text.trim();
  return t.length > 0 && t.length <= 40 && t.split(/\s+/).filter(Boolean).length <= 4 && !/[.!?;:]/.test(t);
}