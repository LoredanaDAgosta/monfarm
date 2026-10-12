# MonFarm Experience — Sito Web

Sito Astro per **MonFarm Experience**, progetto di ritiri immersi nella natura del Monferrato.
Le pagine sono statiche; il form di contatto usa una funzione serverless su Vercel.

---

## Stack tecnico

| Tool | Versione / uso |
|------|----------------|
| Astro | 4.x, `output: 'hybrid'` |
| Adapter | `@astrojs/vercel/serverless` |
| Node.js | 20.x |
| CSS | Vanilla CSS + Custom Properties |
| Email | [Resend](https://resend.com) (form contatti) |
| Deploy | Vercel |

---

## Avvio rapido

```bash
# Installa le dipendenze
npm install

# Server di sviluppo (http://localhost:4321)
npm run dev

# Build di produzione
npm run build

# Preview della build
npm run preview
```

---

## Variabili d'ambiente

Il form di contatto non funziona senza queste variabili. In locale vanno in un file `.env`
nella radice del progetto (già escluso da Git); in produzione si impostano su Vercel in
*Settings → Environment Variables*, seguite da un nuovo deploy.

| Variabile | Obbligatoria | Descrizione |
|-----------|--------------|-------------|
| `RESEND_API_KEY` | sì | API key di Resend, con permesso di invio sul dominio `monfarmexperience.it` |
| `CONTACT_TO_EMAIL` | no | Destinatario dei messaggi del form. Se assente, usa `info@monfarmexperience.it` |

---

## Struttura del progetto

```
monfarm-astro/
├── public/
│   ├── favicon.svg
│   └── images/
│       ├── logo.svg, logo-symbol.svg, logo.png
│       ├── og-image.jpg                ← 1200×630px per le anteprime social
│       ├── *.svg                       ← decorazioni (diario, relazione, raggi, ecc.)
│       ├── icons/                      ← icone footer, social e "come si costruisce"
│       ├── home/                       ← immagini per pagina
│       ├── il-format/
│       ├── a-chi-e-rivolto/
│       ├── esperienze/
│       ├── collabora/
│       └── contatti/
├── src/
│   ├── components/
│   │   ├── Header.astro        ← navigazione + menu mobile a overlay
│   │   ├── Footer.astro        ← contatti, social, link privacy
│   │   ├── PageHeader.astro    ← titolo di pagina
│   │   ├── Section.astro       ← sezione con contenitore centrato
│   │   ├── SectionCenter.astro ← sezione con testo centrato su fondo colorato
│   │   ├── SectionDivider.astro
│   │   ├── FullImage.astro     ← immagine a tutta larghezza
│   │   ├── Button.astro        ← pulsante / link (apre in nuova scheda se esterno)
│   │   ├── ContactForm.astro   ← form con select personalizzato + privacy
│   │   └── ScrollToTop.astro   ← pulsante "torna su" (compare dopo lo scroll)
│   ├── layouts/
│   │   └── Layout.astro        ← meta SEO, Open Graph, Google Fonts, header/footer
│   ├── pages/
│   │   ├── index.astro
│   │   ├── il-format.astro
│   │   ├── a-chi-e-rivolto.astro
│   │   ├── esperienze.astro
│   │   ├── collabora.astro
│   │   ├── contatti.astro
│   │   ├── privacy-policy.astro
│   │   └── api/
│   │       └── contact.ts      ← endpoint serverless: invia l'email con Resend
│   └── styles/
│       ├── global.css          ← variabili, layout, componenti
│       └── typography.css      ← classi tipografiche
├── astro.config.mjs            ← `site`, output hybrid, adapter Vercel
├── vercel.json
└── package.json
```

---

## Palette colori

```css
--color-brown:       #715b43;   /* testo, titoli */
--color-cream:       #dfd3bd;   /* bordi, fasce, sfondi card */
--color-cream-bg:    #ede7d9;   /* sfondo pagina */
--color-olive:       #828259;   /* pulsanti, link, accenti */
--color-olive-light: #98926e;
--color-terracotta:  #c97642;   /* accento secondario, errori */
```

---

## Layout responsive

- **Mobile (< 768 px):** contenuto a tutta larghezza, contenitore max 390–480 px.
- **Tablet e PC (≥ 768 px):** header, contenuto e footer stanno in una colonna centrata
  di massimo `--page-max-width` (720 px), con margine laterale minimo di 2 rem.
  Il valore si regola in `src/styles/global.css`.

---

## Form contatti

1. `ContactForm.astro` invia i dati con `fetch` a `POST /api/contact`.
2. `src/pages/api/contact.ts` valida i campi, scarta i bot (campo honeypot `bot-field`)
   e invia l'email con Resend, con `replyTo` impostato sull'indirizzo dell'utente.
3. Il testo inserito dall'utente viene escapato prima di finire nell'email.

Per far funzionare l'invio:

1. Crea un account Resend e **verifica il dominio** `monfarmexperience.it`
   aggiungendo i record DNS (SPF/DKIM) su OVH.
2. Crea una API key e impostala come `RESEND_API_KEY` su Vercel.
3. Il mittente è `noreply@monfarmexperience.it`; il destinatario è `info@monfarmexperience.it`
   (o `CONTACT_TO_EMAIL`).

---

## Deploy e dominio

- Il sito è pubblicato su **Vercel**, collegato al repository GitHub: ogni push sul ramo
  `main` genera un nuovo deploy.
- Il dominio è registrato su **OVH**. In Vercel (*Settings → Domains*) si aggiunge
  `monfarmexperience.it` e `www`, poi si inseriscono i record DNS indicati da Vercel nella
  zona DNS su OVH (record `A` per `@`, `CNAME` per `www`). Non toccare MX e TXT delle email.

---

## Note

- I link ai social e a Instagram si aprono in `target="_blank"` con `rel="noopener noreferrer"`.
- Il pulsante dell'evento in corso in `esperienze.astro` rimanda a WhatsApp con un
  messaggio precompilato (`whatsappHref` in cima al file).
- "Accetto la privacy policy" nel form collega a `/privacy-policy` ed è obbligatorio.
- La privacy policy indica come titolare Beatrice Furia: va aggiornata se cambiano i dati
  o se si aggiungono strumenti come Google Analytics.
