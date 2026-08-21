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
  'cases/idea-workflow-automation/index.html'
];

for (const relative of required) {
  const target = path.join(root, relative);
  if (!fs.existsSync(target)) throw new Error(`정적 빌드 결과 없음: ${relative}`);
}

const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const text of [
  '업무 사례',
  '개인 실사용 프로젝트',
  '공개 개발 자료',
  '커머스·물류 변경 영향 분석',
  '제조 MES 요구사항 모델링',
  '실무형 AI 자동화',
  '아이디어 발굴·검토·기획 자동화'
]) {
  if (!home.includes(text)) throw new Error(`홈 화면 필수 문구 없음: ${text}`);
}

for (const text of ['대표 사례', '작업 방식', '작업 기준', '소개와 작업 기준']) {
  if (home.includes(text)) throw new Error(`홈 화면에 불필요한 내부·연출 문구가 남아 있음: ${text}`);
}

const ideaCase = fs.readFileSync(path.join(root, 'cases/idea-workflow-automation/index.html'), 'utf8');
for (const text of ['합성 데이터로 재현한 아이디어 분류 화면', '합성 데이터로 재현한 기획서 버전 관리 화면']) {
  if (!ideaCase.includes(text)) throw new Error(`개인 프로젝트 화면 설명 없음: ${text}`);
}
if (!ideaCase.includes('data:image/webp;base64,')) {
  throw new Error('개인 프로젝트 합성 화면이 정적 HTML에 포함되지 않음');
}

const privateOnlyTerms = [
  '면접 예상 질문',
  '인터뷰 예상 질문',
  'Interview Hooks',
  '면접 대응',
  '리허설 기록',
  'Role Adapter'
];

for (const file of required.filter((item) => item.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  if (html.includes('jsnetworkcorp-portfolio') || html.includes('dna_project') || html.includes('jsnetworkcorp.com')) {
    throw new Error(`공개 금지 문자열 발견: ${file}`);
  }
  for (const term of privateOnlyTerms) {
    if (html.includes(term)) throw new Error(`내부 전용 자료가 공개 화면에 포함됨: ${file} / ${term}`);
  }
}

console.log(`확인 완료: 정적 페이지 ${required.length}개와 개인 프로젝트 화면·공개 범위가 정상입니다.`);
