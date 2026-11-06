import { useEffect, useState } from "react";
import { ThinkingOrb } from "thinking-orbs";
const STEPS = [
  ["working", "SamS is working on it…"],
  ["searching", "Searching for the best answer…"],
  ["solving", "Working it out…"],
  ["composing", "Writing the reply…"],
];
export function Thinking() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % STEPS.length), 3500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center gap-3">
      <ThinkingOrb state={STEPS[i][0]} size={64} />
      <span className="text-default-500 text-sm">{STEPS[i][1]}</span>
    </div>
  );
}
export const OrbLoader = ({ state = "connecting", size = 64, label }) => (
  <div className="flex flex-col items-center gap-2">
    <ThinkingOrb state={state} size={size} />
    {label && <span className="text-sm text-default-500">{label}</span>}
  </div>
);
