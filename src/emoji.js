// Renders every emoji as a small lazy-loaded Apple-style PNG so they look the same on every device.
// Change VER / BASE to swap the emoji set (any set that names files by lowercase hex codepoints works).
const VER = "15.1.2";
export const BASE = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@${VER}/img/apple/64/`;

const SRC =
  String.raw`\p{Regional_Indicator}{2}|[#*0-9]\uFE0F\u20E3|(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F)\p{Emoji_Modifier}?(?:\u200D(?:\p{Emoji_Presentation}|\p{Extended_Pictographic})(?:\uFE0F|\p{Emoji_Modifier})?)*`;
export const emojiRegex = () => new RegExp(SRC, "gu");

export const emojiSrc = (s) => BASE + [...s].map((c) => c.codePointAt(0).toString(16)).join("-") + ".png";

// Fallback chain: exact file -> file without FE0F -> plain text emoji.
if (typeof window !== "undefined") {
  window.__emojiErr = (img) => {
    if (!img.dataset.r && /-fe0f/.test(img.src)) { img.dataset.r = "1"; img.src = img.src.replace(/-fe0f/g, ""); return; }
    img.replaceWith(document.createTextNode(img.alt));
  };
}

// Turns emoji in already-sanitized HTML into <img>. Skips code and pre.
export function emojify(html) {
  if (!/[\u2190-\u{10FFFF}]/u.test(html)) return html;
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const n of nodes) {
    if (n.parentElement?.closest("code,pre")) continue;
    const t = n.nodeValue, re = emojiRegex();
    let m, last = 0, frag = null;
    while ((m = re.exec(t))) {
      frag ||= doc.createDocumentFragment();
      if (m.index > last) frag.append(t.slice(last, m.index));
      const img = doc.createElement("img");
      img.className = "emoji"; img.alt = m[0]; img.loading = "lazy"; img.draggable = false;
      img.src = emojiSrc(m[0]);
      img.setAttribute("onerror", "window.__emojiErr&&window.__emojiErr(this)");
      frag.append(img);
      last = m.index + m[0].length;
    }
    if (frag) { if (last < t.length) frag.append(t.slice(last)); n.replaceWith(frag); }
  }
  return doc.body.innerHTML;
}
