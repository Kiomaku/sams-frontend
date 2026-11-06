const env = import.meta.env;
export const APP_NAME = env.VITE_APP_NAME || "SamS";
// UI-only gate for the Admin tab — real protection must live in your backend.
export const ADMIN_EMAILS = (env.VITE_ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
// Empty = same-origin "/api". Set for a cross-origin backend (needs CORS + credentials).
export const API_BASE = (env.VITE_API_BASE || "").replace(/\/$/, "");
