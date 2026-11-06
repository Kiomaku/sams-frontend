# SamS backend API · مستندات API

The frontend talks to a JSON API (default `http://127.0.0.1:5000`). Auth is **session-cookie based**: after login every request must carry the cookie (same-origin works automatically; cross-origin needs `credentials: "include"` + CORS).
فرانت‌اند با یک API از نوع JSON کار می‌کند. احراز هویت با **کوکی نشست** است.

## Auth

| Method | Route | Body | Success | Errors |
|---|---|---|---|---|
| POST | `/api/auth/register` | `{ email, password }` (email has `@` + dot, password ≥ 8) | `{ success, user:{id,email} }` | 400 invalid · 409 already registered |
| POST | `/api/auth/login` | `{ email, password }` | `{ success, user }` + sets cookie | 401 `Wrong email or password.` |
| POST | `/api/auth/logout` | – | `{ success:true }` | – |
| GET | `/api/auth/me` | – | `{ success, user }` | 401 not logged in |

## Chat 🔒

`POST /api/chat`

```json
{
  "message": "write me a python hello world",
  "session_id": 3,
  "personality": "chill casual friend",
  "goals": "be helpful",
  "red_lines": "stay respectful",
  "history": true
}
```

`message` is required. Omit `session_id` to start a new session. `personality / goals / red_lines` apply on the first message of a session. `history` (default `true`) saves to the session.

```json
{ "success": true, "message": "…", "response": "Here you go:\n```python\n…\n```", "worker": 3, "session_id": 3 }
```

`response` is **raw Markdown** — render it and **sanitize** it (the frontend uses marked + DOMPurify).

| Status | Meaning |
|---|---|
| 401 | not logged in |
| 400 | invalid body / empty message |
| 503 `stage: "queue_timeout"` | all workers busy — retry later |
| 502 `stage: "retries_exhausted"` | the worker failed after all retries |

## Sessions 🔒

| Method | Route | Returns |
|---|---|---|
| GET | `/api/sessions` | `{ sessions:[{ id, title, created_at, message_count }] }` (title = first message, 60 chars) |
| GET | `/api/sessions/<id>` | `{ session:{id,title,created_at}, messages:[{ role, content, ts }] }` · 404 if not yours |
| DELETE | `/api/sessions/<id>` | `{ success:true }` · 404 otherwise |

## System (public)

`GET /api/status` → `{ success, workers:[{ worker, alive, busy, conversation_used, user_agent, timezone }], queue_depth, history_count }` — polled every ~3 s for the Online dot (`workers.some(w => w.alive)`).

## Suggested frontend flow · جریان پیشنهادی

`GET /api/auth/me` → (401 → login screen) → `GET /api/sessions` → click a session → `GET /api/sessions/:id` → `POST /api/chat` (without `session_id` for a new chat; store the returned one) → poll `GET /api/status`.

> **Tip / نکته:** the answer must keep Markdown code fences (```` ``` ````) and line breaks, otherwise code blocks can't be rendered. / پاسخ باید فِنس‌های ``` و خط‌های جدید را حفظ کند.
