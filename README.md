# Bodol Landing

Marketing site for [Bodol](https://app.bodolbd.com/) — a marketplace for buying and selling Facebook pages, YouTube channels, and Telegram groups. Static multi-page site in colloquial Bangla.

**Stack:** HTML · Tailwind CSS (CDN) · GSAP · vanilla JS

## Preview

```bash
npx --yes serve .
```

Then open the URL shown in the terminal (usually `http://localhost:3000`).

## Pages

| Page | File |
|------|------|
| Home | `index.html` |
| About | `about.html` |
| Team | `team.html` |
| FAQ | `faq.html` |
| Terms | `terms.html` |
| Privacy | `privacy.html` |
| Dispute | `dispute.html` |

## Project structure

```
├── index.html          # Home
├── about.html …        # Other pages
├── css/site.css        # Shared styles
├── js/
│   ├── site.js         # Nav, app links, GSAP scroll animations
│   ├── hero-scene.js   # Home hero visuals
│   ├── faq.js          # FAQ content
│   └── team.js         # Team roster
└── assets/             # Icons, favicon, images
```

## App links

“লগ ইন” and “শুরু করুন” point to `https://app.bodolbd.com/`. Change the URL in `js/site.js` (`appUrl`).
