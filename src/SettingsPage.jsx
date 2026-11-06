import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Avatar, Button, Card, CardBody, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, Tab, Tabs, useDisclosure,
} from "@heroui/react";
import EmojiText from "./EmojiText";
import { pickTitle } from "./titles";

function Section({ i, title, desc, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 + i * 0.07 }}>
      <Card shadow="none" className="bg-content1 border border-divider">
        <CardBody className="gap-4 p-5">
          <div><h2 className="font-semibold">{title}</h2>{desc && <p className="text-sm text-default-500">{desc}</p>}</div>
          {children}
        </CardBody>
      </Card>
    </motion.div>
  );
}

export default function SettingsPage({ user, dark, setDark, motionOn, setMotionOn, cfg, setCfg, sessions, onDeleteAll, onLogout }) {
  const title = useMemo(() => pickTitle("settings"), []);
  const confirm = useDisclosure();
  const [deleting, setDeleting] = useState(false);
  const chats = sessions ? sessions.length : null;
  const msgs = sessions ? sessions.reduce((a, s) => a + (s.message_count || 0), 0) : null;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 flex flex-col gap-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold"><EmojiText text={title[0]} /></h1>
        <p className="text-default-500 text-sm"><EmojiText text={title[1]} /></p>
      </motion.div>

      <Section i={0} title="Profile">
        <div className="flex items-center gap-4">
          <Avatar size="lg" name={user.email[0].toUpperCase()} classNames={{ base: "bg-default-200 text-foreground shrink-0" }} />
          <div className="min-w-0">
            <p className="font-medium truncate">{user.email}</p>
            <p className="text-sm text-default-500">Account #{user.id}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[["Chats", chats], ["Messages", msgs]].map(([l, v]) => (
            <div key={l} className="rounded-xl bg-content2 p-3">
              <p className="text-xs text-default-500">{l}</p>
              <p className="text-2xl font-semibold">{v ?? "…"}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section i={1} title="Appearance" desc="Saved on this device.">
        <Tabs aria-label="Theme" selectedKey={dark ? "dark" : "light"} onSelectionChange={(k) => setDark(k === "dark")}>
          <Tab key="light" title="Light" /><Tab key="dark" title="Dark" />
        </Tabs>
        <Switch size="sm" color="default" isSelected={motionOn} onValueChange={setMotionOn}>Animations</Switch>
      </Section>

      <Section i={2} title="Chat defaults" desc="Used when you start a new chat. Saved on this device.">
        <Input label="Personality" value={cfg.personality} onValueChange={(v) => setCfg({ ...cfg, personality: v })} />
        <Input label="Goals" value={cfg.goals} onValueChange={(v) => setCfg({ ...cfg, goals: v })} />
        <Input label="Red lines" value={cfg.red_lines} onValueChange={(v) => setCfg({ ...cfg, red_lines: v })} />
        <Switch size="sm" color="default" isSelected={cfg.history} onValueChange={(v) => setCfg({ ...cfg, history: v })}>Save chats to history</Switch>
      </Section>

      <Section i={3} title="Account & data">
        <div className="flex flex-wrap gap-3">
          <Button variant="flat" onPress={onLogout}>Log out</Button>
          <Button color="danger" variant="flat" isDisabled={!chats} onPress={confirm.onOpen}>Delete all chats</Button>
        </div>
      </Section>

      <Modal isOpen={confirm.isOpen} onOpenChange={confirm.onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (<>
            <ModalHeader>Delete all chats?</ModalHeader>
            <ModalBody><p className="text-sm text-default-500">This permanently removes all {chats} chats. It can't be undone.</p></ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>Cancel</Button>
              <Button color="danger" isLoading={deleting} onPress={async () => { setDeleting(true); await onDeleteAll(); setDeleting(false); onClose(); }}>Delete</Button>
            </ModalFooter>
          </>)}
        </ModalContent>
      </Modal>
    </div>
  );
}
