import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar, Button, Card, CardBody, Chip, Drawer, DrawerBody, DrawerContent, Dropdown, DropdownItem, DropdownMenu,
  DropdownTrigger, Input, Popover, PopoverContent, PopoverTrigger, ScrollShadow, Skeleton, Switch, Textarea, useDisclosure,
} from "@heroui/react";
import { Activity, ArrowUp, Check, Copy, Menu, MessageSquarePlus, RotateCcw, Settings2, Trash2 } from "./icons";
import { api } from "./api";
import Markdown, { copyText } from "./Markdown";
import ThemeSwitch from "./ThemeSwitch";
import Admin from "./Admin";
import { Thinking, OrbLoader } from "./Thinking";
import { APP_NAME } from "./config";
import { pickGreeting } from "./greetings";
import EmojiText from "./EmojiText";
import SettingsPage from "./SettingsPage";
import { AnimatePresence, motion } from "framer-motion";

function CopyMsg({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <Button isIconOnly size="sm" variant="light" radius="full" aria-label="Copy message" className="text-default-500"
      onPress={async () => { if (await copyText(text)) { setOk(true); setTimeout(() => setOk(false), 2000); } }}>
      {ok ? <Check size={16} /> : <Copy size={16} />}
    </Button>
  );
}

function Sidebar({ sessions, sid, view, isAdmin, user, onPick, onNew, onDelete, onAdmin, onSettings, onLogout, onCollapse }) {
  const row = "justify-start gap-3 px-3 h-10 w-full";
  return (
    <div className="flex flex-col h-full bg-content1 p-2 gap-1">
      <div className="flex items-center justify-between px-2 h-12">
        <div className="flex items-center gap-2 font-semibold text-lg"><img src="/logo.webp" alt="" className="h-7 w-7" />{APP_NAME}</div>
        {onCollapse && <Button isIconOnly size="sm" variant="light" aria-label="Close sidebar" onPress={onCollapse}><Menu size={18} /></Button>}
      </div>
      <Button variant="light" className={row} startContent={<MessageSquarePlus size={18} />} onPress={onNew}>New chat</Button>
      {isAdmin && <Button variant="light" className={`${row} ${view === "admin" ? "bg-content2" : ""}`} startContent={<Activity size={18} />} onPress={onAdmin}>Admin</Button>}
      <p className="text-xs text-default-500 px-3 pt-4 pb-1">Recents</p>
      <ScrollShadow className="flex-1 min-h-0">
        {sessions === null ? (
          <div className="flex flex-col gap-2 px-1">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-9 rounded-lg" />)}</div>
        ) : sessions.length === 0 ? (
          <p className="text-default-500 text-sm px-3">No chats yet</p>
        ) : sessions.map((s) => (
          <div key={s.id} className={`group flex items-center rounded-lg px-1 ${view === "chat" && s.id === sid ? "bg-content2" : "hover:bg-content2"}`}>
            <button className="flex-1 text-left text-sm truncate px-2 py-2" onClick={() => onPick(s.id)}><EmojiText text={s.title} /></button>
            <Button isIconOnly size="sm" variant="light" aria-label="Delete chat" className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-default-500" onPress={() => onDelete(s.id)}>
              <Trash2 size={15} />
            </Button>
          </div>
        ))}
      </ScrollShadow>
      <Dropdown placement="top-start">
        <DropdownTrigger>
          <button className="flex items-center gap-3 rounded-lg p-2 hover:bg-content2 text-left w-full">
            <Avatar size="sm" name={user.email[0].toUpperCase()} classNames={{ base: "bg-default-200 text-foreground shrink-0" }} />
            <span className="truncate text-sm">{user.email}</span>
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Account" onAction={(k) => (k === "out" ? onLogout() : k === "settings" && onSettings())}>
          <DropdownItem key="settings" startContent={<Settings2 size={16} />}>Settings</DropdownItem>
          <DropdownItem key="out" color="danger" className="text-danger">Log out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

export default function Chat({ user, isAdmin, onLogout, dark, setDark, online, motionOn, setMotionOn }) {
  const [sessions, setSessions] = useState(null);
  const [sid, setSid] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [view, setView] = useState("chat");
  const [side, setSide] = useState(true);
  const [cfg, setCfg] = useState(() => {
    const d = { personality: "", goals: "", red_lines: "", history: true };
    try { return { ...d, ...JSON.parse(localStorage.getItem("sams-cfg") || "{}") }; } catch { return d; }
  });
  useEffect(() => { localStorage.setItem("sams-cfg", JSON.stringify(cfg)); }, [cfg]);
  const [greetKey, setGreetKey] = useState(0);
  const greeting = useMemo(() => pickGreeting(), [greetKey]);
  const drawer = useDisclosure();
  const endRef = useRef(null);
  const lastMsg = useRef("");

  const refresh = useCallback(() => api.sessions().then((d) => setSessions(d.sessions)).catch(() => setSessions([])), []);
  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  async function open(id) {
    drawer.onClose(); setView("chat"); setSid(id); setErr(null); setLoadingMsgs(true);
    try { const d = await api.session(id); setMsgs(d.messages); }
    catch (e) { setErr(e.message); setMsgs([]); }
    finally { setLoadingMsgs(false); }
  }
  function newChat() { drawer.onClose(); setView("chat"); setGreetKey((k) => k + 1); setSid(null); setMsgs([]); setErr(null); }
  async function remove(id) {
    try { await api.del(id); if (id === sid) newChat(); refresh(); } catch (e) { setErr(e.message); }
  }

  async function removeAll() {
    try { await Promise.all((sessions || []).map((s) => api.del(s.id))); setSid(null); setMsgs([]); await refresh(); }
    catch (e) { setErr(e.message); }
  }

  async function send(message, retry = false) {
    message = message.trim();
    if (!message || busy) return;
    lastMsg.current = message; setErr(null); setBusy(true);
    if (!retry) { setMsgs((m) => [...m, { role: "user", content: message }]); setText(""); }
    const body = { message, history: cfg.history };
    if (sid) body.session_id = sid;
    else ["personality", "goals", "red_lines"].forEach((k) => cfg[k] && (body[k] = cfg[k]));
    try {
      const d = await api.chat(body);
      setMsgs((m) => [...m, { role: "assistant", content: d.response }]);
      if (!sid) setSid(d.session_id);
      refresh();
    } catch (e) {
      setErr(e.stage === "queue_timeout" ? "SamS is busy right now. Try again in a moment."
        : e.stage === "retries_exhausted" ? "SamS couldn't get a reply. Please retry."
        : e.status === 401 ? "Your session expired. Please log in again." : e.message);
    } finally { setBusy(false); }
  }

  const sideProps = { sessions, sid, view, isAdmin, user, onPick: open, onNew: newChat, onDelete: remove, onLogout, onAdmin: () => { drawer.onClose(); setView("admin"); }, onSettings: () => { drawer.onClose(); setView("settings"); } };
  const empty = !loadingMsgs && msgs.length === 0 && !busy && !err;

  const composer = (
    <div className="composer w-full">
      <div className="flex items-end gap-1 rounded-[28px] bg-content2 px-2 py-2">
        <Popover placement="top-start">
          <PopoverTrigger><Button isIconOnly radius="full" variant="light" aria-label="Chat settings"><Settings2 size={20} /></Button></PopoverTrigger>
          <PopoverContent className="w-80 p-4 flex flex-col gap-3 items-stretch">
            <p className="text-xs text-default-500">Personality, goals and red lines apply at the start of a new chat.</p>
            <Input size="sm" label="Personality" value={cfg.personality} onValueChange={(v) => setCfg({ ...cfg, personality: v })} isDisabled={!!sid} />
            <Input size="sm" label="Goals" value={cfg.goals} onValueChange={(v) => setCfg({ ...cfg, goals: v })} isDisabled={!!sid} />
            <Input size="sm" label="Red lines" value={cfg.red_lines} onValueChange={(v) => setCfg({ ...cfg, red_lines: v })} isDisabled={!!sid} />
            <Switch size="sm" color="default" isSelected={cfg.history} onValueChange={(v) => setCfg({ ...cfg, history: v })}>Save to history</Switch>
          </PopoverContent>
        </Popover>
        <Textarea aria-label="Message" minRows={1} maxRows={8} placeholder={`Message ${APP_NAME}`} value={text} onValueChange={setText}
          classNames={{ base: "flex-1", inputWrapper: "min-h-10 py-0 px-1 bg-transparent shadow-none data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent", innerWrapper: "items-center", input: "text-base leading-6 py-2" }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(text); } }} />
        <Button isIconOnly radius="full" aria-label="Send" className="bg-foreground text-background" isDisabled={!text.trim() || busy} onPress={() => send(text)}><ArrowUp size={18} /></Button>
      </div>
      <p className="text-center text-xs text-default-500 mt-2">{APP_NAME} can make mistakes. Check important info.</p>
    </div>
  );

  return (
    <div className="flex h-full">
      <AnimatePresence initial={false}>
        {side && (
          <motion.aside key="side" className="hidden md:block shrink-0 border-r border-divider overflow-hidden"
            initial={{ width: 0, opacity: 0 }} animate={{ width: 256, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.22, ease: "easeOut" }}>
            <div className="w-64 h-full"><Sidebar {...sideProps} onCollapse={() => setSide(false)} /></div>
          </motion.aside>
        )}
      </AnimatePresence>
      <Drawer isOpen={drawer.isOpen} onOpenChange={drawer.onOpenChange} placement="left" size="xs">
        <DrawerContent><DrawerBody className="p-0"><Sidebar {...sideProps} /></DrawerBody></DrawerContent>
      </Drawer>

      <section className="flex-1 flex flex-col min-w-0 min-h-0">
        <header className="h-14 shrink-0 flex items-center justify-between px-3">
          <div className="flex items-center gap-1">
            <Button isIconOnly size="sm" variant="light" aria-label="Open sidebar" className={side ? "md:hidden" : ""}
              onPress={() => (window.innerWidth >= 768 ? setSide(true) : drawer.onOpen())}><Menu size={18} /></Button>
            <span className="font-semibold text-lg ml-1">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-3">
            <Chip size="sm" variant="dot" color={online === null ? "default" : online ? "success" : "danger"}>{online === null ? "Checking" : online ? "Online" : "Offline"}</Chip>
            <ThemeSwitch dark={dark} setDark={setDark} />
          </div>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={view} className="flex-1 min-h-0 flex flex-col" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
            {view === "admin" ? (
              <div className="flex-1 min-h-0 overflow-auto"><Admin /></div>
            ) : view === "settings" ? (
              <div className="flex-1 min-h-0 overflow-auto">
                <SettingsPage user={user} dark={dark} setDark={setDark} motionOn={motionOn} setMotionOn={setMotionOn} cfg={cfg} setCfg={setCfg}
                  sessions={sessions} onDeleteAll={removeAll} onLogout={onLogout} />
              </div>
            ) : empty ? (
              <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-8 px-4 pb-16">
                <motion.div key={greetKey} className="text-center" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <h1 className="text-3xl font-semibold"><EmojiText text={greeting[0]} /></h1>
                  <p className="text-default-500 mt-2"><EmojiText text={greeting[1]} /></p>
                </motion.div>
                <motion.div className="w-full max-w-3xl" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }}>{composer}</motion.div>
              </div>
            ) : (
              <>
                <ScrollShadow className="flex-1 min-h-0 px-4">
                  <div className="max-w-3xl mx-auto flex flex-col gap-6 py-4">
                    {loadingMsgs ? (
                      <div className="flex justify-center mt-24"><OrbLoader label="Loading chat…" /></div>
                    ) : msgs.map((m, i) => m.role === "user" ? (
                      <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                        className="bubble self-end max-w-[80%] bg-content2 rounded-3xl px-5 py-2.5 break-words"><Markdown text={m.content} /></motion.div>
                    ) : (
                      <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="min-w-0">
                        <Markdown text={m.content} />
                        <div className="mt-1 -ml-2"><CopyMsg text={m.content} /></div>
                      </motion.div>
                    ))}
                    {busy && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Thinking /></motion.div>}
                    {err && (
                      <Card className="bg-content2 border border-danger/40" shadow="none"><CardBody className="flex-row items-center justify-between gap-3">
                        <span className="text-danger text-sm">{err}</span>
                        {lastMsg.current && <Button size="sm" color="danger" variant="flat" startContent={<RotateCcw size={14} />} onPress={() => send(lastMsg.current, true)}>Retry</Button>}
                      </CardBody></Card>
                    )}
                    <div ref={endRef} />
                  </div>
                </ScrollShadow>
                <div className="px-4 pb-3 max-w-3xl w-full mx-auto">{composer}</div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
