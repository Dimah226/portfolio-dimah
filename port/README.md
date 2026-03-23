# Portfolio Dimah — Magazine Luxe
## Robgo Abdul Hamid Al Haqq · ENSEA Abidjan

Stack : **Next.js 14** · **Tailwind CSS** · **Framer Motion** · **Firebase** · **Cloudinary** · **Claude API**

---

## 1. Créer le projet

```bash
npx create-next-app@latest portfolio-dimah --js --no-src-dir --app --tailwind --eslint --import-alias "@/*"
cd portfolio-dimah
```

## 2. Installer les dépendances

```bash
npm install firebase framer-motion react-icons next-cloudinary swiper react-countup
npm install clsx tailwind-merge tailwindcss-animate
npm install @radix-ui/react-visually-hidden

# shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button switch sheet scroll-area select tabs textarea input tooltip
```

## 3. Copier les fichiers

Copier l'intégralité du dossier dans le projet créé :
- `app/` → remplace le dossier `app/`
- `components/` → crée/remplace
- `context/` → crée
- `lib/` → crée
- `tailwind.config.js` → remplace
- `next.config.js` → remplace

## 4. Variables d'environnement (.env.local)

```env
# Firebase — ton NOUVEAU projet Firebase (pas celui d'ABC)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Chatbot IA — CHOISIR UN (les deux sont GRATUITS)
GROQ_API_KEY=gsk_...          # ← console.groq.com (gratuit, recommandé)
# GEMINI_API_KEY=AIza...      # ← aistudio.google.com (gratuit, alternative)
```

> ⚠️ Mets à jour `lib/firebase.js` avec ta config Firebase  
> ⚠️ `ANTHROPIC_API_KEY` → console.anthropic.com → API Keys

## 5. Firebase — Collections Firestore

| Collection  | Usage                                   |
|-------------|----------------------------------------|
| `admins`    | Ton UID Google pour l'accès admin       |
| `home`      | Textes éditables (intro, rôle…)        |
| `socials`   | Liens réseaux sociaux                   |
| `stats`     | Compteurs (années d'exp, projets…)      |
| `settings`  | Photo avatar + publicId Cloudinary      |
| `messages`  | Messages du formulaire contact          |

## 6. Accès au portail admin

- **Raccourci** : `Alt + Shift + A`  
- **Hotspot** : 5 clics rapides en bas à gauche  
- Se connecter avec Google → activer le mode **Admin** via le toggle

## 7. Ajouter ton UID admin

1. Se connecter via le portail
2. Copier ton UID affiché
3. Dans Firestore : créer `admins/<ton_uid>` → `{ role: "admin", email: "hamidrobgo009@gmail.com" }`

## 8. Personnaliser le contenu

**À personnaliser dans chaque page :**
- `app/work/page.jsx` → remplace les projets avec tes vraies descriptions
- `app/contact/page.jsx` → tes vrais liens LinkedIn/GitHub
- `app/services/page.jsx` → adapte si besoin
- `components/Stats.jsx` → via l'interface admin (éditable en temps réel)
- `components/Socials.jsx` → via l'interface admin

## 9. Chatbot IA

Le chatbot utilise Claude Haiku via l'API Anthropic.  
Route : `app/api/chat/route.js`  
Personnalise le `SYSTEM_PROMPT` dans `components/Chatbot.jsx` avec tes vraies infos.

## 10. Multilingue

Le système FR/EN/AR est dans `lib/i18n.js`.  
Le provider est dans `context/LangContext.jsx`.  
Le sélecteur de langue est dans le header (bande supérieure).  
L'arabe active automatiquement le mode RTL.

## 11. Lancer

```bash
npm run dev   # → http://localhost:3000
```

## 12. Déployer sur Vercel

```bash
npx vercel
```
Ajouter toutes les variables d'environnement dans le dashboard Vercel.

---

## Palette Magazine Luxe

| Variable            | Hex       | Usage            |
|---------------------|-----------|------------------|
| `--cream`           | `#F4EFE4` | Fond crème chaud |
| `--ink`             | `#0E0C08` | Noir d'encre     |
| `--rouge`           | `#B84A2F` | Accent rouge tuile |
| `--rouge-hover`     | `#D45739` | Rouge survol     |
| `--parchment`       | `#FAF7F2` | Header / chatbot |

Tout est modifiable en temps réel via le **ThemeColorPanel** (mode admin).

---

## Ce qui rend ce portfolio unique

- **Curseur custom** avec anneau fluide (lerp)
- **Grain texture** overlay sur toute la page
- **Ticker** défilant avec tes compétences clés
- **Typographie** Cormorant Garamond en display massif (~130px)
- **Header** style masthead de presse avec bande de date
- **Chatbot** IA propulsé par Claude Haiku — répond en FR/EN/AR
- **Multilingue** FR/EN/ع avec RTL automatique pour l'arabe
- **Timeline** CV style magazine à 2 colonnes
- **Footer** noir encre avec navigation en Cormorant italique
