import type { ReactNode } from 'react';
import Link from 'next/link';

export type HeadingItem = {
  level: number;
  text: string;
  id: string;
};

type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'code'; language: string; value: string }
  | { type: 'anchor'; id: string }
  | { type: 'rule' };

type DiagramNode = {
  id: string;
  label: string;
  kind: 'normal' | 'decision' | 'data';
};

export function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function getMarkdownHeadings(markdown: string): HeadingItem[] {
  return markdown
    .replace(/\r\n/g, '\n')
    .split('\n')
    .flatMap((line) => {
      const match = /^(#{2,3})\s+(.+)$/.exec(line);
      if (!match) return [];
      const text = match[2].trim();
      return [{ level: match[1].length, text, id: slugifyHeading(text) }];
    });
}

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isTableSeparator(line: string): boolean {
  const cells = parseTableRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const anchor = /^<a\s+id=["']([^"']+)["']\s*><\/a>$/.exec(line.trim());
    if (anchor) {
      blocks.push({ type: 'anchor', id: anchor[1] });
      index += 1;
      continue;
    }

    if (/^```/.test(line.trim())) {
      const language = line.trim().slice(3).trim();
      const body: string[] = [];
      index += 1;
      while (index < lines.length && !/^```/.test(lines[index].trim())) {
        body.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push({ type: 'code', language, value: body.join('\n') });
      continue;
    }

    const heading = /^(#{1,4})\s+(.+)$/.exec(line);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2].trim() });
      index += 1;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: 'rule' });
      index += 1;
      continue;
    }

    if (
      line.includes('|') &&
      index + 1 < lines.length &&
      lines[index + 1].includes('|') &&
      isTableSeparator(lines[index + 1])
    ) {
      const headers = parseTableRow(line);
      const rows: string[][] = [];
      index += 2;
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(parseTableRow(lines[index]));
        index += 1;
      }
      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    const unordered = /^\s*[-*]\s+(.+)$/.exec(line);
    const ordered = /^\s*\d+\.\s+(.+)$/.exec(line);
    if (unordered || ordered) {
      const isOrdered = Boolean(ordered);
      const items: string[] = [];
      while (index < lines.length) {
        const item = isOrdered
          ? /^\s*\d+\.\s+(.+)$/.exec(lines[index])
          : /^\s*[-*]\s+(.+)$/.exec(lines[index]);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      blocks.push({ type: 'list', ordered: isOrdered, items });
      continue;
    }

    const paragraph: string[] = [line.trim()];
    index += 1;
    while (index < lines.length) {
      const next = lines[index];
      if (!next.trim()) break;
      if (/^(#{1,4})\s+/.test(next) || /^```/.test(next.trim()) || /^---+$/.test(next.trim())) break;
      if (/^\s*[-*]\s+/.test(next) || /^\s*\d+\.\s+/.test(next)) break;
      if (
        next.includes('|') &&
        index + 1 < lines.length &&
        isTableSeparator(lines[index + 1])
      ) break;
      paragraph.push(next.trim());
      index += 1;
    }
    blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
  }

  return blocks;
}

function resolveMarkdownHref(href: string): string {
  if (/^(https?:|mailto:)/.test(href)) return href;

  const [rawPath, hash] = href.split('#', 2);
  const cleanPath = rawPath.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');
  const suffix = hash ? `#${hash}` : '';

  if (cleanPath.startsWith('cases/') && cleanPath.endsWith('.md')) {
    const slug = cleanPath.split('/').pop()?.replace(/\.md$/, '');
    return slug ? `/cases/${slug}/${suffix}` : '/';
  }
  if (cleanPath === 'EVIDENCE.md') return `/about/${suffix}`;
  if (cleanPath === 'PORTFOLIO.md') return '/about/#backend';
  if (cleanPath === 'PORTFOLIO-AX.md') return '/about/#ai';
  if (cleanPath === 'README.md' || cleanPath === '') return `/${suffix}`;

  return `https://github.com/tomtomjskim/portfolio/blob/main/${cleanPath}${suffix}`;
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const tokenPattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|<https?:\/\/[^>]+>)/g;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  let tokenIndex = 0;

  while ((match = tokenPattern.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${tokenIndex++}`;

    if (token.startsWith('**')) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`')) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith('[')) {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (link) {
        const href = resolveMarkdownHref(link[2]);
        const external = href.startsWith('http');
        nodes.push(
          <Link key={key} href={href} rel={external ? 'noreferrer' : undefined}>
            {link[1]}
          </Link>
        );
      }
    } else {
      const href = token.slice(1, -1);
      nodes.push(
        <Link key={key} href={href} rel="noreferrer">
          {href.replace(/^https?:\/\//, '')}
        </Link>
      );
    }

    cursor = match.index + token.length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function parseMermaid(value: string): { nodes: DiagramNode[]; layers: string[][] } | null {
  const lines = value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('flowchart'));

  const nodes = new Map<string, DiagramNode>();
  const edges: Array<[string, string]> = [];

  const collectNode = (id: string, dataShape?: string, normalShape?: string, decisionShape?: string) => {
    const label = (dataShape ?? normalShape ?? decisionShape ?? id).trim();
    const kind: DiagramNode['kind'] = dataShape
      ? 'data'
      : decisionShape
        ? 'decision'
        : 'normal';
    nodes.set(id, { id, label, kind });
  };

  for (const line of lines) {
    const nodePattern = /([A-Za-z0-9_]+)(?:\[\((.*?)\)\]|\[(.*?)\]|\{(.*?)\})/g;
    let nodeMatch: RegExpExecArray | null;
    while ((nodeMatch = nodePattern.exec(line)) !== null) {
      collectNode(nodeMatch[1], nodeMatch[2], nodeMatch[3], nodeMatch[4]);
    }

    const edgeMatch = /^([A-Za-z0-9_]+).*?-->.?\s*([A-Za-z0-9_]+)/.exec(line);
    if (edgeMatch) edges.push([edgeMatch[1], edgeMatch[2]]);
  }

  if (nodes.size === 0 || edges.length === 0) return null;

  const indegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();
  nodes.forEach((_node, id) => {
    indegree.set(id, 0);
    adjacency.set(id, []);
  });
  for (const [from, to] of edges) {
    if (!nodes.has(from) || !nodes.has(to)) continue;
    adjacency.get(from)?.push(to);
    indegree.set(to, (indegree.get(to) ?? 0) + 1);
  }

  let current = [...nodes.keys()].filter((id) => (indegree.get(id) ?? 0) === 0);
  const layers: string[][] = [];
  const visited = new Set<string>();

  while (current.length) {
    layers.push(current);
    const next: string[] = [];
    for (const id of current) {
      visited.add(id);
      for (const child of adjacency.get(id) ?? []) {
        indegree.set(child, (indegree.get(child) ?? 1) - 1);
        if (indegree.get(child) === 0) next.push(child);
      }
    }
    current = [...new Set(next)];
  }

  const unvisited = [...nodes.keys()].filter((id) => !visited.has(id));
  if (unvisited.length) layers.push(unvisited);

  return { nodes: [...nodes.values()], layers };
}

function FlowDiagram({ value }: { value: string }) {
  const graph = parseMermaid(value);
  if (!graph) return <pre className="code-block"><code>{value}</code></pre>;

  const nodeMap = new Map(graph.nodes.map((node) => [node.id, node]));
  return (
    <figure className="flow-diagram" aria-label="업무 흐름도">
      {graph.layers.map((layer, layerIndex) => (
        <div className="flow-layer-wrap" key={`layer-${layerIndex}`}>
          <div className="flow-layer">
            {layer.map((id) => {
              const node = nodeMap.get(id);
              if (!node) return null;
              return (
                <div className={`flow-node flow-node-${node.kind}`} key={id}>
                  {node.label}
                </div>
              );
            })}
          </div>
          {layerIndex < graph.layers.length - 1 ? <div className="flow-arrow" aria-hidden>↓</div> : null}
        </div>
      ))}
    </figure>
  );
}

export function MarkdownDocument({ markdown, skipFirstHeading = false }: { markdown: string; skipFirstHeading?: boolean }) {
  const blocks = parseBlocks(markdown);
  let skippedHeading = false;

  return (
    <div className="markdown-body">
      {blocks.map((block, index) => {
        if (block.type === 'anchor') return <span id={block.id} key={`anchor-${block.id}`} />;
        if (block.type === 'rule') return <hr key={`rule-${index}`} />;

        if (block.type === 'heading') {
          if (skipFirstHeading && block.level === 1 && !skippedHeading) {
            skippedHeading = true;
            return null;
          }
          const id = slugifyHeading(block.text);
          const children = renderInline(block.text, `heading-${index}`);
          if (block.level === 1) return <h1 id={id} key={id}>{children}</h1>;
          if (block.level === 2) return <h2 id={id} key={id}>{children}</h2>;
          if (block.level === 3) return <h3 id={id} key={id}>{children}</h3>;
          return <h4 id={id} key={id}>{children}</h4>;
        }

        if (block.type === 'paragraph') {
          return <p key={`paragraph-${index}`}>{renderInline(block.text, `paragraph-${index}`)}</p>;
        }

        if (block.type === 'list') {
          const Tag = block.ordered ? 'ol' : 'ul';
          return (
            <Tag key={`list-${index}`}>
              {block.items.map((item, itemIndex) => (
                <li key={`item-${index}-${itemIndex}`}>{renderInline(item, `item-${index}-${itemIndex}`)}</li>
              ))}
            </Tag>
          );
        }

        if (block.type === 'table') {
          return (
            <div className="table-scroll" key={`table-${index}`} tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    {block.headers.map((header, headerIndex) => (
                      <th key={`header-${index}-${headerIndex}`}>{renderInline(header, `header-${index}-${headerIndex}`)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`row-${index}-${rowIndex}`}>
                      {block.headers.map((_header, cellIndex) => (
                        <td key={`cell-${index}-${rowIndex}-${cellIndex}`}>
                          {renderInline(row[cellIndex] ?? '', `cell-${index}-${rowIndex}-${cellIndex}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'code') {
          if (block.language === 'mermaid') return <FlowDiagram value={block.value} key={`flow-${index}`} />;
          return (
            <pre className="code-block" key={`code-${index}`}>
              <code>{block.value}</code>
            </pre>
          );
        }

        return null;
      })}
    </div>
  );
}
