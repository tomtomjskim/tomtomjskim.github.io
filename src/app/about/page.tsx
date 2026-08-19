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
    <div className="about-page section-shell">
      <header className="page-header">
        <p className="eyebrow">소개</p>
        <h1>소개와 작업 기준</h1>
        <p>경력 사례와 공개 개발 자료를 섞지 않고, 무엇을 판단했고 어디까지 검증했는지를 중심으로 정리합니다.</p>
      </header>

      <section className="about-section" id="backend">
        <div className="section-heading"><h2>백엔드 개발 관점</h2></div>
        <MarkdownDocument markdown={backend} />
      </section>

      <section className="about-section" id="ai">
        <div className="section-heading"><h2>AI 활용과 내부 도구</h2></div>
        <MarkdownDocument markdown={ai} />
      </section>

      <section className="about-section" id="public-evidence">
        <div className="section-heading"><h2>공개 근거와 해석 범위</h2></div>
        <MarkdownDocument markdown={evidence} skipFirstHeading />
      </section>

      <section className="about-section">
        <div className="section-heading"><h2>공개 범위</h2></div>
        <MarkdownDocument markdown={boundary} skipFirstHeading />
      </section>

      <section className="closing-cta about-cta">
        <div>
          <p className="eyebrow">원문</p>
          <h2>전체 원문과 변경 이력은 GitHub에서 확인할 수 있습니다.</h2>
        </div>
        <div className="hero-actions">
          <Link className="button button-primary" href="https://github.com/tomtomjskim/portfolio">포트폴리오 원문</Link>
          <Link className="button button-secondary" href="https://github.com/tomtomjskim">GitHub 프로필</Link>
        </div>
      </section>
    </div>
  );
}
