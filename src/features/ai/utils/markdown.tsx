// src/features/ai/utils/markdown.tsx
// عارض ماركداون خفيف (بدون مكتبات خارجية) لعرض ردود المساعد الذكي:
// يدعم **bold**، عناوين #، فواصل ---، وقوائم نقطية -/*.
import type { ReactNode } from "react";

function splitLines(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  text.split("\n").forEach((part, i) => {
    if (i > 0) nodes.push(<br key={`${keyPrefix}-br${i}`} />);
    if (part) nodes.push(part);
  });
  return nodes;
}

function parseInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const boldRegex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(...splitLines(text.slice(lastIndex, match.index), `${keyPrefix}-t${i++}`));
    }
    nodes.push(<strong key={`${keyPrefix}-b${i++}`}>{match[1]}</strong>);
    lastIndex = boldRegex.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(...splitLines(text.slice(lastIndex), `${keyPrefix}-t${i++}`));
  }
  return nodes;
}

interface MarkdownTextProps {
  text: string;
}

export function MarkdownText({ text }: MarkdownTextProps) {
  const blocks = text.split(/\n{2,}/);

  return (
    <div className="space-y-2.5">
      {blocks.map((block, bi) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (/^-{3,}$/.test(trimmed)) {
          return <hr key={bi} className="my-1 border-current/10" />;
        }

        const headingMatch = trimmed.match(/^#{1,4}\s+(.*)$/);
        if (headingMatch) {
          return (
            <p key={bi} className="font-bold text-[14.5px]">
              {parseInline(headingMatch[1], `h${bi}`)}
            </p>
          );
        }

        const lines = trimmed.split("\n").filter(Boolean);
        const isList = lines.length > 0 && lines.every((l) => /^[-*]\s+/.test(l.trim()));
        if (isList) {
          return (
            <ul key={bi} className="list-disc ps-5 space-y-1">
              {lines.map((l, li) => (
                <li key={li}>
                  {parseInline(l.trim().replace(/^[-*]\s+/, ""), `li${bi}-${li}`)}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={bi} className="leading-relaxed">
            {parseInline(trimmed, `p${bi}`)}
          </p>
        );
      })}
    </div>
  );
}
