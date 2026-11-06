import { useState } from "react";
import { emojiRegex, emojiSrc } from "./emoji";

function EmojiImg({ e }) {
  const [stage, setStage] = useState(0);
  if (stage > 1) return e;
  const src = emojiSrc(e);
  return (
    <img className="emoji" alt={e} draggable={false} loading="lazy"
      src={stage ? src.replace(/-fe0f/g, "") : src}
      onError={() => setStage(stage === 0 && /-fe0f/.test(src) ? 1 : 2)} />
  );
}

// Plain-text version for React strings (greetings, chat titles).
export default function EmojiText({ text }) {
  const out = [], re = emojiRegex();
  let m, last = 0;
  while ((m = re.exec(text || ""))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<EmojiImg key={m.index} e={m[0]} />);
    last = m.index + m[0].length;
  }
  if (last < (text || "").length) out.push(text.slice(last));
  return <>{out}</>;
}
