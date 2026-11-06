import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { api } from "./api";
import Auth from "./Auth";
import Chat from "./Chat";
import ThemeSwitch from "./ThemeSwitch";
import { OrbLoader } from "./Thinking";
import { ADMIN_EMAILS, APP_NAME } from "./config";

function useTheme() {
  const [dark, setDark] = useState(() => localStorage.getItem("sams-theme") ? localStorage.getItem("sams-theme") === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("sams-theme", dark ? "dark" : "light");
  }, [dark]);
  return [dark, setDark];
}

function usePref(key, def) {
  const [v, setV] = useState(() => { const s = localStorage.getItem(key); return s === null ? def : s === "1"; });
  useEffect(() => { localStorage.setItem(key, v ? "1" : "0"); }, [key, v]);
  return [v, setV];
}

function useOnline() {
  const [on, setOn] = useState(null);
  useEffect(() => {
    let live = true;
    const tick = () => api.status().then((d) => live && setOn(d.workers.some((w) => w.alive))).catch(() => live && setOn(false));
    tick(); const t = setInterval(tick, 3000);
    return () => { live = false; clearInterval(t); };
  }, []);
  return on;
}

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = checking
  const [dark, setDark] = useTheme();
  const online = useOnline();
  const [motionOn, setMotionOn] = usePref("sams-motion", true);
  useEffect(() => { document.documentElement.classList.toggle("no-motion", !motionOn); }, [motionOn]);

  useEffect(() => { api.me().then((d) => setUser(d.user)).catch(() => setUser(null)); }, []);

  if (user === undefined) return <div className="h-dvh flex items-center justify-center"><OrbLoader label={`Starting ${APP_NAME}…`} /></div>;
  if (!user) return (<><div className="fixed top-4 right-4 z-50"><ThemeSwitch dark={dark} setDark={setDark} /></div><Auth onAuth={setUser} /></>);

  return (
    <MotionConfig reducedMotion={motionOn ? "user" : "always"}>
      <div className="h-dvh overflow-hidden">
        <Chat user={user} isAdmin={ADMIN_EMAILS.includes(user.email.toLowerCase())} dark={dark} setDark={setDark} online={online}
          motionOn={motionOn} setMotionOn={setMotionOn}
          onLogout={async () => { await api.logout().catch(() => {}); setUser(null); }} />
      </div>
    </MotionConfig>
  );
}
