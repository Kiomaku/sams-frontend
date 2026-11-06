import { useMemo, useState } from "react";
import { Button } from "@heroui/react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { Copy, Check } from "./icons";
import { emojify } from "./emoji";

marked.setOptions({ gfm: true, breaks: true });
DOMPurify.addHook("afterSanitizeAttributes", (n) => {
  if (n.tagName === "A") { n.setAttribute("target", "_blank"); n.setAttribute("rel", "noopener noreferrer"); }
});

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

// navigator.clipboard only exists on https/localhost, so fall back for plain http (e.g. http://IP:5173).
export async function copyText(t) {
  try {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(t); return true; }
  } catch {}
  const ta = document.createElement("textarea");
  ta.value = t; ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
  document.body.appendChild(ta); ta.select();
  let ok = false; try { ok = document.execCommand("copy"); } catch {}
  ta.remove(); return ok;
}

function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);
  const html = useMemo(() => {
    try {
      return lang && hljs.getLanguage(lang)
        ? hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
        : hljs.highlightAuto(code).value;
    } catch { return esc(code); }
  }, [code, lang]);

  async function copy() {
    if (await copyText(code)) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0c0c0c] text-[#e6edf3] my-1">
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#20201f] text-xs text-[#9da7b3]">
        <span className="font-mono lowercase">{lang || "code"}</span>
        <Button size="sm" variant="light" onPress={copy} aria-label="Copy code"
          className="h-7 min-w-0 px-2 text-xs text-[#9da7b3] data-[hover=true]:text-white"
          startContent={copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}>
          {copied ? "Copied!" : "Copy code"}
        </Button>
      </div>
      <pre className="m-0 p-4 overflow-x-auto text-[13px] leading-relaxed"><code className="hljs !bg-transparent !p-0" dangerouslySetInnerHTML={{ __html: html }} /></pre>
    </div>
  );
}

export default function Markdown({ text }) {
  const parts = useMemo(() => {
    const toks = marked.lexer(text || "");
    const out = []; let buf = [];
    const flush = () => {
      if (!buf.length) return;
      buf.links = toks.links;
      out.push({ html: emojify(DOMPurify.sanitize(marked.parser(buf))) });
      buf = [];
    };
    for (const t of toks) {
      if (t.type === "code") { flush(); out.push({ code: t.text, lang: (t.lang || "").trim().split(/\s+/)[0] }); }
      else buf.push(t);
    }
    flush();
    return out;
  }, [text]);

  return (
    <div className="md">
      {parts.map((p, i) => p.code !== undefined
        ? <CodeBlock key={i} code={p.code} lang={p.lang} />
        : <div key={i} dangerouslySetInnerHTML={{ __html: p.html }} />)}
    </div>
  );
}
