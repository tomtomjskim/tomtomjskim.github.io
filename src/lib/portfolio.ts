import fs from 'node:fs';
import path from 'node:path';

export type CaseClassification =
  | 'sanitized-actual-work'
  | 'sanitized-actual-work-with-public-rnd-support'
  | 'private-personal-product'
  | 'public-rnd';

export type PortfolioCase = {
  order: number;
  id: string;
  slug: string;
  title: string;
  file: string;
  classification: CaseClassification;
  tracks: string[];
  question: string;
  card: {
    problem: string;
    decision: string;
    evidence: string;
  };
  evidence_refs: string[];
};

export type PortfolioManifest = {
  schema_version: string;
  source_repository: string;
  views: Array<{
    id: string;
    file: string;
    primary_cases: string[];
    supporting_cases: string[];
  }>;
  cases: PortfolioCase[];
};

export type PublicEvidence = {
  id: string;
  title: string;
  kind: string;
  shows: string;
  repository?: string;
  boundary?: string;
};

let sourceRootCache: string | null = null;
let manifestCache: PortfolioManifest | null = null;

function resolveSourceRoot(): string {
  if (sourceRootCache) return sourceRootCache;

  const configured = process.env.PORTFOLIO_SOURCE_DIR;
  const candidates = [
    configured ? path.resolve(process.cwd(), configured) : null,
    path.resolve(process.cwd(), 'portfolio-source'),
    path.resolve(process.cwd(), '../portfolio')
  ].filter((candidate): candidate is string => Boolean(candidate));

  const sourceRoot = candidates.find((candidate) =>
    fs.existsSync(path.join(candidate, 'portfolio-manifest.json'))
  );

  if (!sourceRoot) {
    throw new Error(
      `포트폴리오 원문을 찾지 못했습니다. PORTFOLIO_SOURCE_DIR 또는 portfolio-source 경로를 확인하세요. 확인한 경로: ${candidates.join(', ')}`
    );
  }

  sourceRootCache = sourceRoot;
  return sourceRoot;
}

function resolveSafeSourcePath(relativePath: string): string {
  const root = resolveSourceRoot();
  const target = path.resolve(root, relativePath);
  const relative = path.relative(root, target);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`허용되지 않은 포트폴리오 경로입니다: ${relativePath}`);
  }

  return target;
}

function readSourceFile(relativePath: string): string {
  return fs.readFileSync(resolveSafeSourcePath(relativePath), 'utf8');
}

export function getPortfolioManifest(): PortfolioManifest {
  if (manifestCache) return manifestCache;

  const manifest = JSON.parse(readSourceFile('portfolio-manifest.json')) as PortfolioManifest;
  manifest.cases = [...manifest.cases].sort((a, b) => a.order - b.order);
  manifestCache = manifest;
  return manifest;
}

export function getAllCases(): PortfolioCase[] {
  return getPortfolioManifest().cases;
}

export function getCaseBySlug(slug: string): PortfolioCase | undefined {
  return getAllCases().find((item) => item.slug === slug);
}

export function getCaseMarkdown(portfolioCase: PortfolioCase): string {
  return readSourceFile(portfolioCase.file);
}

export function getSourceAssetDataUri(sourceFile: string, assetHref: string): string {
  if (/^(?:data:|https?:)/.test(assetHref)) return assetHref;

  const sourceDirectory = path.dirname(sourceFile);
  const normalized = path.normalize(path.join(sourceDirectory, assetHref));
  const target = resolveSafeSourcePath(normalized);
  const extension = path.extname(target).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  };
  const mimeType = mimeTypes[extension];
  if (!mimeType) throw new Error(`지원하지 않는 포트폴리오 이미지 형식입니다: ${assetHref}`);

  const encoded = fs.readFileSync(target).toString('base64');
  return `data:${mimeType};base64,${encoded}`;
}

export function getViewMarkdown(viewId: string): string {
  const view = getPortfolioManifest().views.find((item) => item.id === viewId);
  if (!view) throw new Error(`존재하지 않는 포트폴리오 관점입니다: ${viewId}`);
  return readSourceFile(view.file);
}

export function getEvidenceMarkdown(): string {
  return readSourceFile('EVIDENCE.md');
}

export function getPublicBoundaryMarkdown(): string {
  return readSourceFile('docs/PUBLIC-BOUNDARY.md');
}

export function stripFirstHeading(markdown: string): string {
  return markdown.replace(/^#\s+.+\r?\n+/, '');
}

export function removeMarkdownSection(markdown: string, heading: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const output: string[] = [];
  let skippingLevel: number | null = null;

  for (const line of lines) {
    const match = /^(#{2,4})\s+(.+)$/.exec(line);
    if (match) {
      const level = match[1].length;
      const title = match[2].trim();
      if (title === heading) {
        skippingLevel = level;
        continue;
      }
      if (skippingLevel !== null && level <= skippingLevel) {
        skippingLevel = null;
      }
    }
    if (skippingLevel === null) output.push(line);
  }

  return output.join('\n').trim();
}

export function extractMarkdownSections(markdown: string, headings: string[]): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const wanted = new Set(headings);
  const output: string[] = [];
  let activeLevel: number | null = null;

  for (const line of lines) {
    const match = /^(#{2,4})\s+(.+)$/.exec(line);
    if (match) {
      const level = match[1].length;
      const title = match[2].trim();

      if (wanted.has(title)) {
        activeLevel = level;
        output.push(line);
        continue;
      }

      if (activeLevel !== null && level <= activeLevel) {
        activeLevel = null;
      }
    }

    if (activeLevel !== null) output.push(line);
  }

  return output.join('\n').trim();
}

function cleanMarkdownValue(value: string): string {
  return value
    .replace(/^<(.+)>$/, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/`/g, '')
    .trim();
}

export function getPublicEngineeringEvidence(): PublicEvidence[] {
  const lines = getEvidenceMarkdown().replace(/\r\n/g, '\n').split('\n');
  const results: PublicEvidence[] = [];
  let inPublicSection = false;
  let current: PublicEvidence | null = null;

  const flush = () => {
    if (current) results.push(current);
    current = null;
  };

  for (const line of lines) {
    if (line === '## 공개 개발 자료') {
      inPublicSection = true;
      continue;
    }
    if (inPublicSection && /^##\s+/.test(line)) break;
    if (!inPublicSection) continue;

    const heading = /^###\s+(EV-[A-Z-]+)\s+—\s+(.+)$/.exec(line);
    if (heading) {
      flush();
      current = {
        id: heading[1],
        title: heading[2].trim(),
        kind: '',
        shows: ''
      };
      continue;
    }

    if (!current) continue;

    const item = /^-\s+\*\*(.+?):\*\*\s*(.+)$/.exec(line);
    if (!item) continue;

    const key = item[1];
    const value = cleanMarkdownValue(item[2]);
    if (key === '구분') current.kind = value;
    if (key === '보여주는 내용') current.shows = value;
    if (key === '저장소') current.repository = value;
    if (key === '증명하지 않는 것') current.boundary = value;
  }

  flush();
  return results;
}

export function getSourceRepositoryUrl(): string {
  return 'https://github.com/tomtomjskim/portfolio';
}
