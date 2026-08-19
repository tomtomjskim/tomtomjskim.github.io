import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), 'out');
const required = [
  'index.html',
  'about/index.html',
  '404.html',
  'sitemap.xml',
  'robots.txt',
  'cases/commerce-change-impact/index.html',
  'cases/mes-requirement-modeling/index.html',
  'cases/practical-ai-automation/index.html',
  'cases/developer-internal-tooling/index.html'
];

for (const relative of required) {
  const target = path.join(root, relative);
  if (!fs.existsSync(target)) throw new Error(`정적 빌드 결과 없음: ${relative}`);
}

const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const text of ['대표 사례', '커머스·물류 변경 영향 분석', '제조 MES 요구사항 모델링', '실무형 AI 자동화']) {
  if (!home.includes(text)) throw new Error(`홈 화면 필수 문구 없음: ${text}`);
}

for (const file of required.filter((item) => item.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  if (html.includes('jsnetworkcorp-portfolio') || html.includes('dna_project')) {
    throw new Error(`공개 금지 문자열 발견: ${file}`);
  }
}

console.log(`확인 완료: 정적 페이지 ${required.length}개와 공개 범위가 정상입니다.`);
