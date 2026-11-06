<div align="center">

<img src="public/logo.webp" width="120" alt="SamS logo" />

# SamS — Chat Frontend

**A ChatGPT-style web UI for your self-hosted chat API. Dark & light, animated, bilingual-friendly.**

🇬🇧 English · [🇮🇷 فارسی](README.fa.md) · [📖 Tutorial page](https://kiomaku.github.io/sams-frontend/) · [🔌 API guide](docs/API.md)

![License](https://img.shields.io/badge/license-MIT-1a8cff)
![Node](https://img.shields.io/badge/node-%E2%89%A518-339933?logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![HeroUI](https://img.shields.io/badge/HeroUI-2-000000)

<img src="https://skillicons.dev/icons?i=react,vite,tailwind,js,html,css,nodejs,npm,python,flask,git,github&perline=12" alt="tech stack icons" />

</div>

---

## ✨ What is SamS?

SamS is a complete **front end only** for a chatbot. It talks to a small JSON API (login, chat, sessions, status — see [docs/API.md](docs/API.md)) running on the same machine or any server you control. Clone it, point it at your backend, and you get a polished chat app with an admin panel.

## 🧩 Features

**💬 Chat**
- Markdown rendering (tables, lists, links, bold…) — sanitized with DOMPurify
- ChatGPT-style **code blocks**: language label, syntax highlighting, one-click **Copy** (works even on plain `http://`)
- Animated **thinking orbs** while the AI works (cycles *working → searching → solving → composing*)
- Friendly error messages + **Retry** button (busy queue, failed retries, expired session)
- Sidebar with recent chats: open, delete, collapse; mobile drawer
- Per-chat **personality / goals / red lines** and a *save to history* switch
- Copy any reply, auto-scroll, `Enter` to send, `Shift+Enter` for a new line
- **80 time-aware greetings** (morning, afternoon, evening, night, late night)

**🎨 Design**
- Dark & light mode with a black palette (`#111111`, `#151515`, `#20201f`), remembered per device
- 100 % [HeroUI](https://www.heroui.com) components, ChatGPT-like layout that fills the real browser height
- Smooth [Framer Motion](https://www.framer.com/motion/) animations (can be turned off in Settings)
- [Hugeicons](https://hugeicons.com) icon set, Apple-style emojis everywhere (swappable)
- Favicon, Apple touch icon, web manifest, Open Graph tags

**👤 Account & Settings**
- Register / login / logout with validation and session restore
- Settings page: profile & stats, theme, animations, chat defaults, *delete all chats*
- Funny random page titles 😄

**🛠 Admin panel**
- Live status every 3 s: workers alive/busy, queue depth, history count
- Workers table and your sessions with delete
- Shown only to emails listed in `VITE_ADMIN_EMAILS` (UI-only gate, see [Security](#-security-notes))

## 🚀 Quick start

```bash
git clone https://github.com/kiomaku/sams-frontend.git
cd sams-frontend
cp .env.example .env        # then edit .env
npm install
npm start                   # http://localhost:5173
```

Requirements: **Node.js ≥ 18** and a running backend (default `http://127.0.0.1:5000`).

| Script | What it does |
|---|---|
| `npm start` / `npm run dev` | dev server with `/api` proxied to your backend |
| `npm run build` | production build into `dist/` |
| `npm run start:prod` | build + preview on port 5173 |

## ⚙️ Configuration (`.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_APP_NAME` | `SamS` | name used in the UI |
| `VITE_ADMIN_EMAILS` | *(empty)* | comma-separated emails that see **Admin** (UI-only) |
| `VITE_API_BASE` | *(empty)* | empty = same-origin `/api`; or e.g. `https://api.example.com` (needs CORS + credentials) |
| `API_PROXY_TARGET` | `http://127.0.0.1:5000` | dev/preview proxy target |
| `DEV_PORT` | `5173` | dev server port |

> `.env` is git-ignored. **Only commit `.env.example`.** Anything named `VITE_*` ends up in public JS.

## 🗺 App views (routes)

SamS is a single-page app **without URL routing** — the address stays `/`, so any static host works (just serve `index.html`).

| View | How to open | Who |
|---|---|---|
| Login / Sign up | automatic when logged out | everyone |
| Chat (new / existing) | default, sidebar → *New chat* or a recent chat | logged in |
| Settings | account menu (bottom of sidebar) → *Settings* | logged in |
| Admin | sidebar → *Admin* | emails in `VITE_ADMIN_EMAILS` |

## 🔌 API routes

Full details in **[docs/API.md](docs/API.md)**.

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | – | create account |
| POST | `/api/auth/login` | – | log in (sets cookie) |
| POST | `/api/auth/logout` | ✔ | log out |
| GET | `/api/auth/me` | ✔ | restore login state |
| POST | `/api/chat` | ✔ | send a message (new session if no `session_id`) |
| GET | `/api/sessions` | ✔ | list chats |
| GET | `/api/sessions/<id>` | ✔ | chat history |
| DELETE | `/api/sessions/<id>` | ✔ | delete a chat |
| GET | `/api/status` | – | workers / queue (polled every 3 s) |

## 🏗 Deploy

```bash
npm run build      # → dist/
```

**Flask (same machine as your Python API):**

```python
app = Flask(__name__, static_folder="dist", static_url_path="")
@app.route("/")
def index(): return app.send_static_file("index.html")
```

**Nginx:**

```nginx
server {
  listen 80;
  root /var/www/sams/dist;
  location /api/ { proxy_pass http://127.0.0.1:5000; proxy_read_timeout 180s; }
  location / { try_files $uri /index.html; }
}
```

> Chat replies can take a while — keep `proxy_read_timeout` generous.

## 📖 Tutorial page

A beautiful, bilingual (EN/فارسی) step-by-step guide lives in [`docs/index.html`](docs/index.html).
Enable it on GitHub: **Settings → Pages → Source: GitHub Actions** (the workflow in `.github/workflows/pages.yml` publishes `docs/`).

## 📁 Project structure

```
sams-frontend/
├─ docs/                 tutorial page (GitHub Pages) + API.md
├─ public/               logo, favicons, manifest
├─ src/
│  ├─ App.jsx            auth gate, theme, online status
│  ├─ Chat.jsx           layout: sidebar, chat, composer, views
│  ├─ Auth.jsx           login / sign up
│  ├─ SettingsPage.jsx   profile & preferences
│  ├─ Admin.jsx          status dashboard
│  ├─ Markdown.jsx       sanitized markdown + code blocks
│  ├─ Thinking.jsx       thinking-orbs loaders
│  ├─ emoji.js · EmojiText.jsx   Apple-style emoji images
│  ├─ greetings.js · titles.js   funny copy (edit freely)
│  ├─ api.js · config.js         API client & env config
│  └─ icons.jsx          Hugeicons mapping
├─ .env.example · tailwind.config.js · vite.config.js
```

## 🎛 Customize

- **Colors:** `tailwind.config.js` (dark/light palettes)
- **Greetings / titles:** `src/greetings.js`, `src/titles.js`
- **Logo & favicon:** replace files in `public/`
- **Emoji set:** `BASE` in `src/emoji.js`

## 🔒 Security notes

- Never commit `.env`; never put secrets in `VITE_*` variables.
- The Admin tab gate is **cosmetic**. Enforce roles in the backend.
- AI replies are untrusted: they are sanitized before rendering. Keep that.

## 🙏 Credits & licenses

React, Vite, Tailwind CSS, [HeroUI](https://www.heroui.com), Framer Motion, marked, DOMPurify, highlight.js, [Hugeicons](https://hugeicons.com), [thinking-orbs](https://www.npmjs.com/package/thinking-orbs).
Emoji images are loaded from the `emoji-datasource-apple` package. **Apple's emoji artwork is Apple's property** — check the licensing before using it in a public/commercial product, or swap the set in `src/emoji.js`.

## 🤝 Contributing · 📄 License

See [CONTRIBUTING.md](CONTRIBUTING.md). Released under the [MIT License](LICENSE).
