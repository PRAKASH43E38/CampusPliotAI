import React from 'react';

type MarkdownContentProps = {
  content: string;
};

function renderInlineText(text: string) {
  const segments: React.ReactNode[] = [];
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

  parts.forEach((part, index) => {
    if (!part) return;
    if (part.startsWith('`') && part.endsWith('`')) {
      segments.push(
        <code key={`${index}-${part}`} className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
      return;
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      segments.push(
        <strong key={`${index}-${part}`} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
      return;
    }

    segments.push(part);
  });

  return segments;
}

function renderCodeBlock(code: string, language?: string) {
  const keywordSets: Record<string, string[]> = {
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'import', 'from', 'export', 'async', 'await', 'class', 'new'],
    typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'import', 'from', 'export', 'async', 'await', 'class', 'type', 'interface'],
    python: ['def', 'return', 'import', 'from', 'class', 'if', 'elif', 'else', 'for', 'while', 'async', 'await', 'with'],
    sql: ['select', 'from', 'where', 'insert', 'update', 'delete', 'create', 'table', 'join', 'group', 'order', 'limit'],
  };

  const keywords = keywordSets[language?.toLowerCase() || ''] || keywordSets.typescript;
  const highlight = (line: string) => {
    let result: React.ReactNode[] = [line];

    keywords.forEach((keyword) => {
      const next: React.ReactNode[] = [];
      result.forEach((segment, segIndex) => {
        if (typeof segment !== 'string') {
          next.push(segment);
          return;
        }

        const pieces = segment.split(new RegExp(`\\b(${keyword})\\b`, 'g'));
        pieces.forEach((piece, pieceIndex) => {
          if (!piece) return;
          if (piece === keyword) {
            next.push(
              <span key={`${segIndex}-${pieceIndex}-${piece}`} className="text-sky-400 font-semibold">
                {piece}
              </span>
            );
          } else {
            next.push(piece);
          }
        });
      });
      result = next;
    });

    return result;
  };

  return (
    <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 text-slate-100 border border-slate-800">
      <div className="flex items-center justify-between px-4 py-2 text-[11px] text-slate-400 border-b border-slate-800">
        <span>{language || 'code'}</span>
      </div>
      <code className="block p-4 text-[12px] leading-6 font-mono">
        {code.split('\n').map((line, idx) => (
          <div key={`${idx}-${line}`} className="whitespace-pre">
            {highlight(line)}
          </div>
        ))}
      </code>
    </pre>
  );
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const blocks = content.split(/```([\w-]+)?\n([\s\S]*?)```/g);

  const rendered: React.ReactNode[] = [];
  let index = 0;
  while (index < blocks.length) {
    const text = blocks[index];
    const language = blocks[index + 1];
    const code = blocks[index + 2];

    if (code !== undefined) {
      rendered.push(
        <div key={`code-${index}`}>
          {text && <MarkdownParagraphs content={text} />}
          {renderCodeBlock(code.trimEnd(), language)}
        </div>
      );
      index += 3;
    } else {
      rendered.push(<MarkdownParagraphs key={`text-${index}`} content={text} />);
      index += 1;
    }
  }

  return <div className="space-y-2">{rendered}</div>;
}

function MarkdownParagraphs({ content }: MarkdownContentProps) {
  const lines = content.split('\n');
  const items: React.ReactNode[] = [];

  lines.forEach((line, idx) => {
    if (!line.trim()) {
      items.push(<div key={`blank-${idx}`} className="h-2" />);
      return;
    }

    const trimmed = line.trim();

    if (trimmed.startsWith('# ')) {
      items.push(
        <h3 key={`h1-${idx}`} className="text-base font-bold mt-3">
          {renderInlineText(trimmed.slice(2))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      items.push(
        <h4 key={`h2-${idx}`} className="text-sm font-semibold mt-2">
          {renderInlineText(trimmed.slice(3))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      items.push(
        <div key={`li-${idx}`} className="flex gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          <span className="flex-1">{renderInlineText(trimmed.slice(2))}</span>
        </div>
      );
      return;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      items.push(
        <div key={`ol-${idx}`} className="flex gap-2">
          <span className="min-w-5 text-right opacity-70">{trimmed.match(/^(\d+\.)/)?.[1] || ''}</span>
          <span className="flex-1">{renderInlineText(trimmed.replace(/^\d+\.\s/, ''))}</span>
        </div>
      );
      return;
    }

    items.push(
      <p key={`p-${idx}`} className="leading-7">
        {renderInlineText(trimmed)}
      </p>
    );
  });

  return <div className="space-y-1">{items}</div>;
}
