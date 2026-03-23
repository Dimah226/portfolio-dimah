// lib/i18n.js
export const LOCALES = ['fr', 'en', 'ar'];
export const LOCALE_LABELS = { fr: 'FR', en: 'EN', ar: 'ع' };
export const LOCALE_DIR = { fr: 'ltr', en: 'ltr', ar: 'rtl' };

export const t = {
  fr: {
    /* Nav */
    nav: { home: 'accueil', about: 'à propos', services: 'services', work: 'projets', resume: 'cv', contact: 'contact' },
    hire: 'Me contacter',

    /* Hero */
    hero: {
      label: 'Vol. I — Portfolio',
      subtitle: 'Statisticien · Économiste · Actuaire · Data Scientist',
      intro: 'Je transforme des données complexes en',
      intro2: 'décisions stratégiques.',
      cta_work: 'Voir mes projets',
      cta_cv: 'Télécharger le CV',
      scroll: 'Défiler',
    },

    /* About */
    about: {
      section: '01 · À propos',
      title: 'Qui\nsuis‑je ?',
      p1: 'Je m\'appelle Hamid, alias Dimah — statisticien de formation, passionné par la donnée sous toutes ses formes. Entre l\'actuariat, l\'économétrie et le machine learning, je navigue là où les mathématiques rencontrent les décisions réelles.',
      p2: 'Mon approche : partir des données brutes, construire des modèles robustes, et livrer des analyses que même les non‑mathématiciens comprennent.',
      p3: 'La statistique est un langage universel — il suffit de bien la traduire.',
      skills_title: 'Stack technique',
      domains_title: 'Domaines',
      values_title: 'Valeurs',
    },

    /* Services */
    services: {
      section: '02 · Services',
      title: 'Ce que\nje fais.',
      desc: 'De l\'analyse exploratoire aux modèles complexes de prévision, je couvre l\'ensemble de la chaîne de valeur de la donnée.',
      cta: 'Un projet ? Parlons-en →',
    },

    /* Work */
    work: {
      section: '03 · Projets',
      title: 'Mes\ntravaux.',
      live: 'Voir le projet',
      code: 'Code source',
      soon: 'Disponible bientôt',
    },

    /* Resume */
    resume: {
      section: '04 · Curriculum',
      title: 'Mon\nparcours.',
      experience: 'Expériences',
      education: 'Formation',
      hard: 'Compétences techniques',
      soft: 'Soft skills',
      dl: '↓ Télécharger PDF',
    },

    /* Contact */
    contact: {
      section: '05 · Contact',
      title: 'Travaillons\nensemble.',
      desc: 'Un projet data, une collaboration, une question ? Je réponds sous 24h.',
      name: 'Nom',
      email: 'Email',
      subject: 'Sujet',
      message: 'Message',
      send: 'Envoyer',
      sending: 'Envoi…',
      success: 'Message envoyé. À bientôt.',
      error: 'Erreur. Réessaie ou contacte par email.',
      available: 'Disponible',
      avail_desc: 'Ouvert aux missions freelance, collaborations et opportunités CDI.',
    },

    /* Chatbot */
    chatbot: {
      title: 'Demandez à Dimah',
      placeholder: 'Posez une question sur mon travail…',
      send: 'Envoyer',
      welcome: 'Bonjour ! Je suis l\'assistant de Hamid. Posez-moi vos questions sur ses compétences, projets ou disponibilités.',
    },

    /* Footer */
    footer: { rights: 'Tous droits réservés', tagline: 'Données → Décisions' },
  },

  en: {
    nav: { home: 'home', about: 'about', services: 'services', work: 'work', resume: 'résumé', contact: 'contact' },
    hire: 'Hire me',

    hero: {
      label: 'Vol. I — Portfolio',
      subtitle: 'Statistician · Economist · Actuary · Data Scientist',
      intro: 'I turn complex data into',
      intro2: 'strategic decisions.',
      cta_work: 'View my work',
      cta_cv: 'Download CV',
      scroll: 'Scroll',
    },

    about: {
      section: '01 · About',
      title: 'Who\nam I?',
      p1: 'My name is Hamid, alias Dimah — trained statistician, passionate about data in all its forms. Between actuarial science, econometrics and machine learning, I navigate where mathematics meets real decisions.',
      p2: 'My approach: start from raw data, build robust models, and deliver analyses that even non-mathematicians understand.',
      p3: 'Statistics is a universal language — it just needs to be translated well.',
      skills_title: 'Tech stack',
      domains_title: 'Domains',
      values_title: 'Values',
    },

    services: {
      section: '02 · Services',
      title: 'What\nI do.',
      desc: 'From exploratory analysis to complex forecasting models, I cover the entire data value chain.',
      cta: 'A project in mind? Let\'s talk →',
    },

    work: {
      section: '03 · Work',
      title: 'My\nprojects.',
      live: 'View project',
      code: 'Source code',
      soon: 'Coming soon',
    },

    resume: {
      section: '04 · Curriculum',
      title: 'My\njourney.',
      experience: 'Experience',
      education: 'Education',
      hard: 'Technical skills',
      soft: 'Soft skills',
      dl: '↓ Download PDF',
    },

    contact: {
      section: '05 · Contact',
      title: 'Let\'s work\ntogether.',
      desc: 'A data project, a collaboration, a question? I respond within 24h.',
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send',
      sending: 'Sending…',
      success: 'Message sent. Talk soon.',
      error: 'Error. Retry or contact by email.',
      available: 'Available',
      avail_desc: 'Open to freelance missions, collaborations and full-time opportunities.',
    },

    chatbot: {
      title: 'Ask Dimah',
      placeholder: 'Ask a question about my work…',
      send: 'Send',
      welcome: 'Hello! I\'m Hamid\'s assistant. Ask me about his skills, projects, or availability.',
    },

    footer: { rights: 'All rights reserved', tagline: 'Data → Decisions' },
  },

  ar: {
    nav: { home: 'الرئيسية', about: 'من أنا', services: 'الخدمات', work: 'المشاريع', resume: 'السيرة', contact: 'التواصل' },
    hire: 'تواصل معي',

    hero: {
      label: 'المجلد الأول — ملف الأعمال',
      subtitle: 'إحصائي · اقتصادي · اكتواري · عالم بيانات',
      intro: 'أحوّل البيانات المعقدة إلى',
      intro2: 'قرارات استراتيجية.',
      cta_work: 'مشاهدة أعمالي',
      cta_cv: 'تحميل السيرة الذاتية',
      scroll: 'تمرير',
    },

    about: {
      section: '٠١ · من أنا',
      title: 'من\nأنا ؟',
      p1: 'اسمي حامد، ولقبي ديماه — إحصائي بالتكوين، شغوف بالبيانات بجميع أشكالها. بين الاكتواريا والاقتصاد القياسي والتعلم الآلي، أتحرك حيث تلتقي الرياضيات بالقرارات الفعلية.',
      p2: 'نهجي: الانطلاق من البيانات الخام، وبناء نماذج متينة، وتقديم تحليلات يفهمها حتى غير المتخصصين.',
      p3: 'الإحصاء لغة عالمية — يكفي ترجمتها بشكل صحيح.',
      skills_title: 'المهارات التقنية',
      domains_title: 'المجالات',
      values_title: 'القيم',
    },

    services: {
      section: '٠٢ · الخدمات',
      title: 'ما\nأفعله.',
      desc: 'من التحليل الاستكشافي إلى نماذج التنبؤ المعقدة، أغطي سلسلة القيمة الكاملة للبيانات.',
      cta: 'لديك مشروع؟ لنتحدث →',
    },

    work: {
      section: '٠٣ · المشاريع',
      title: 'أعمالي\nومشاريعي.',
      live: 'عرض المشروع',
      code: 'الكود المصدري',
      soon: 'قريباً',
    },

    resume: {
      section: '٠٤ · السيرة الذاتية',
      title: 'مساري\nالمهني.',
      experience: 'الخبرات',
      education: 'التعليم',
      hard: 'المهارات التقنية',
      soft: 'المهارات الناعمة',
      dl: '↓ تحميل PDF',
    },

    contact: {
      section: '٠٥ · التواصل',
      title: 'لنعمل\nمعاً.',
      desc: 'مشروع بيانات، تعاون، سؤال؟ أرد خلال 24 ساعة.',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      subject: 'الموضوع',
      message: 'الرسالة',
      send: 'إرسال',
      sending: 'جارٍ الإرسال…',
      success: 'تم إرسال الرسالة. إلى اللقاء.',
      error: 'خطأ. حاول مرة أخرى أو تواصل بالبريد.',
      available: 'متاح',
      avail_desc: 'منفتح على مهام العمل الحر والتعاون والفرص بدوام كامل.',
    },

    chatbot: {
      title: 'اسأل ديماه',
      placeholder: 'اطرح سؤالاً حول أعمالي…',
      send: 'إرسال',
      welcome: 'مرحباً! أنا مساعد حامد. اسألني عن مهاراته ومشاريعه أو توفره.',
    },

    footer: { rights: 'جميع الحقوق محفوظة', tagline: 'البيانات → القرارات' },
  },
};
