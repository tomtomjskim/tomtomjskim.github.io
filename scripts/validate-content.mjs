import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const candidates = [
  process.env.PORTFOLIO_SOURCE_DIR && path.resolve(cwd, process.env.PORTFOLIO_SOURCE_DIR),
  path.resolve(cwd, 'portfolio-source'),
  path.resolve(cwd, '../portfolio')
].filter(Boolean);

const source = candidates.find((candidate) => fs.existsSync(path.join(candidate, 'portfolio-manifest.json')));
if (!source) throw new Error(`포트폴리오 원문을 찾지 못했습니다: ${candidates.join(', ')}`);

const manifest = JSON.parse(fs.readFileSync(path.join(source, 'portfolio-manifest.json'), 'utf8'));
if (!Array.isArray(manifest.cases) || manifest.cases.length !== 4) {
  throw new Error('portfolio-manifest.json에는 4개 사례가 있어야 합니다.');
}

const slugs = new Set();
for (const item of manifest.cases) {
  if (!item.slug || slugs.has(item.slug)) throw new Error(`사례 slug가 없거나 중복됨: ${item.slug}`);
  slugs.add(item.slug);
  const file = path.join(source, item.file);
  if (!fs.existsSync(file)) throw new Error(`사례 원문 파일 없음: ${item.file}`);
  const text = fs.readFileSync(file, 'utf8');
  for (const heading of ['## 핵심 질문', '## 한눈에 보기', '## 문제', '## 판단', '## 검증과 실제 사용', '## 한계', '## 근거']) {
    if (!text.includes(heading)) throw new Error(`${item.file}: 필수 제목 없음: ${heading}`);
  }
}

console.log(`확인 완료: ${manifest.cases.length}개 사례와 원문 경로가 정상입니다.`);
