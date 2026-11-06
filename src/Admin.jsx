import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, Tab, Button, Skeleton } from "@heroui/react";
import { Activity, Server, Inbox, History, Trash2 } from "./icons";
import { api } from "./api";
import { OrbLoader } from "./Thinking";
import EmojiText from "./EmojiText";
import { pickTitle } from "./titles";

const TONES = {};
const Stat = ({ icon, label, value, color }) => (
  <Card><CardBody className="flex-row items-center gap-3">
    <div className={`p-2 rounded-xl bg-content2 text-default-700`}>{icon}</div>
    <div><p className="text-xs text-default-500">{label}</p><p className="text-2xl font-semibold">{value}</p></div>
  </CardBody></Card>
);

export default function Admin() {
  const [st, setSt] = useState(null);
  const [stErr, setStErr] = useState(false);
  const [sessions, setSessions] = useState(null);
  const title = useMemo(() => pickTitle("admin"), []);

  useEffect(() => {
    let on = true;
    const tick = () => api.status().then((d) => on && (setSt(d), setStErr(false))).catch(() => on && setStErr(true));
    tick(); const t = setInterval(tick, 3000);
    return () => { on = false; clearInterval(t); };
  }, []);
  const load = () => api.sessions().then((d) => setSessions(d.sessions)).catch(() => setSessions([]));
  useEffect(() => { load(); }, []);

  const alive = st?.workers.filter((w) => w.alive).length ?? 0;
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold"><EmojiText text={title[0]} /></h1><p className="text-default-500 text-sm"><EmojiText text={title[1]} /></p></div>
        <Chip color={stErr ? "danger" : alive ? "success" : "warning"} variant="dot">{stErr ? "Server unreachable" : alive ? "Online" : "No workers alive"}</Chip>
      </div>

      {!st && !stErr ? <div className="flex justify-center py-10"><OrbLoader label="Fetching status…" /></div> : st && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat icon={<Server size={20} />} label="Workers alive" value={`${alive}/${st.workers.length}`} color="success" />
          <Stat icon={<Activity size={20} />} label="Busy" value={st.workers.filter((w) => w.busy).length} color="warning" />
          <Stat icon={<Inbox size={20} />} label="Queue depth" value={st.queue_depth} color="primary" />
          <Stat icon={<History size={20} />} label="History count" value={st.history_count} color="secondary" />
        </div>
      )}

      <Tabs aria-label="Admin sections">
        <Tab key="workers" title="Workers">
          <Table aria-label="Workers" removeWrapper>
            <TableHeader>
              <TableColumn>WORKER</TableColumn><TableColumn>STATE</TableColumn><TableColumn>TIMEZONE</TableColumn><TableColumn>USER AGENT</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No workers" items={st?.workers ?? []}>
              {(w) => (
                <TableRow key={w.worker}>
                  <TableCell>#{w.worker}</TableCell>
                  <TableCell><Chip size="sm" variant="flat" color={!w.alive ? "danger" : w.busy ? "warning" : "success"}>{!w.alive ? "Offline" : w.busy ? "Busy" : "Idle"}</Chip></TableCell>
                  <TableCell>{w.timezone}</TableCell>
                  <TableCell className="max-w-xs truncate">{w.user_agent}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Tab>
        <Tab key="sessions" title="My sessions">
          {sessions === null ? <Skeleton className="h-32 rounded-xl" /> : (
            <Table aria-label="Sessions" removeWrapper>
              <TableHeader><TableColumn>ID</TableColumn><TableColumn>TITLE</TableColumn><TableColumn>MESSAGES</TableColumn><TableColumn>CREATED</TableColumn><TableColumn> </TableColumn></TableHeader>
              <TableBody emptyContent="No sessions" items={sessions}>
                {(s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.id}</TableCell><TableCell className="max-w-xs truncate">{s.title}</TableCell>
                    <TableCell>{s.message_count}</TableCell><TableCell>{new Date(s.created_at).toLocaleString()}</TableCell>
                    <TableCell><Button isIconOnly size="sm" color="danger" variant="light" aria-label="Delete" onPress={() => api.del(s.id).then(load)}><Trash2 size={15} /></Button></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Tab>
      </Tabs>
    </div>
  );
}
