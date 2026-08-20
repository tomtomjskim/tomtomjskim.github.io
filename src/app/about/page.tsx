import type { Metadata } from 'next';
import Link from 'next/link';
import { MarkdownDocument } from '@/lib/markdown';
import {
  extractMarkdownSections,
  getEvidenceMarkdown,
  getPublicBoundaryMarkdown,
  getViewMarkdown
} from '@/lib/portfolio';

export const metadata: Metadata = {
  title: '소개와 작업 기준',
  description: '김정식의 백엔드 개발 관점, AI 활용 기준, 공개 근거와 공개 범위를 정리합니다.',
  alternates: { canonical: '/about/' }
};

export default function AboutPage() {
  const backend = extractMarkdownSections(getViewMarkdown('general-backend'), ['30초 요약', '사례에서 드러나는 개발 판단']);
  const ai = extractMarkdownSections(getViewMarkdown('ai-assisted-internal-tools'), ['AI·일반 코드·사람의 책임', '완료 판단 기준']);
  const evidence = getEvidenceMarkdown();
  const boundary = getPublicBoundaryMarkdown();

  return (
    <div className="document-page section-shell">
      <header className="document-intro">
        <h1>소개와 작업 기준</h1>
        <p>경력 사례와 공개 개발 자료를 구분하고, 확인 가능한 범위만 설명합니다.</p>
      </header>

      <section className="document-section" id="backend">
        <header className="document-section-heading"><h2>백엔드 개발 관점</h2></header>
        <div className="document-section-body"><MarkdownDocument markdown={backend} /></div>
      </section>

      <section className="document-section" id="ai">
        <header className="document-section-heading"><h2>AI 활용과 내부 도구</h2></header>
        <div className="document-section-body"><MarkdownDocument markdown={ai} /></div>
      </section>

      <section className="document-section" id="public-evidence">
        <header className="document-section-heading"><h2>공개 근거와 해석 범위</h2></header>
        <div className="document-section-body"><MarkdownDocument markdown={evidence} skipFirstHeading /></div>
      </section>

      <section className="document-section">
        <header className="document-section-heading"><h2>공개 범위</h2></header>
        <div className="document-section-body"><MarkdownDocument markdown={boundary} skipFirstHeading /></div>
      </section>

      <footer className="document-links">
        <h2>원문과 변경 이력</h2>
        <p>
          <Link href="https://github.com/tomtomjskim/portfolio">포트폴리오 원문 ↗</Link>
          {' · '}
          <Link href="https://github.com/tomtomjskim">GitHub 프로필 ↗</Link>
        </p>
      </footer>
    </div>
  );
}
