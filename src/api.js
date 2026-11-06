import { API_BASE } from "./config";

async function j(url, opts = {}) {
  const r = await fetch(API_BASE + url, { credentials: "include", headers: { "Content-Type": "application/json" }, ...opts });
  const d = await r.json().catch(() => ({ success: false, error: "Server returned an invalid response." }));
  if (!r.ok || d.success === false) {
    throw Object.assign(new Error(d.error || "Request failed."), { status: r.status, stage: d.stage });
  }
  return d;
}
const post = (u, b) => j(u, { method: "POST", body: JSON.stringify(b) });
export const api = {
  me: () => j("/api/auth/me"),
  login: (b) => post("/api/auth/login", b),
  register: (b) => post("/api/auth/register", b),
  logout: () => post("/api/auth/logout", {}),
  chat: (b) => post("/api/chat", b),
  sessions: () => j("/api/sessions"),
  session: (id) => j(`/api/sessions/${id}`),
  del: (id) => j(`/api/sessions/${id}`, { method: "DELETE" }),
  status: () => j("/api/status"),
};
