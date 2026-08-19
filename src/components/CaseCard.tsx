import Link from 'next/link';
import type { PortfolioCase } from '@/lib/portfolio';

const classificationLabel: Record<PortfolioCase['classification'], string> = {
  'sanitized-actual-work': '실무 사례',
  'sanitized-actual-work-with-public-rnd-support': '실무 적용 + 공개 자료',
  'public-rnd': '공개 개발 자료'
};

export function CaseCard({ portfolioCase }: { portfolioCase: PortfolioCase }) {
  return (
    <article className="case-card">
      <div className="case-card-meta">
        <span className="case-number">{String(portfolioCase.order).padStart(2, '0')}</span>
        <span className="case-kind">{classificationLabel[portfolioCase.classification]}</span>
      </div>
      <h3><Link href={`/cases/${portfolioCase.slug}/`}>{portfolioCase.title}</Link></h3>
      <p className="case-question">{portfolioCase.question}</p>
      <dl className="case-summary">
        <div><dt>문제</dt><dd>{portfolioCase.card.problem}</dd></div>
        <div><dt>판단</dt><dd>{portfolioCase.card.decision}</dd></div>
        <div><dt>근거</dt><dd>{portfolioCase.card.evidence}</dd></div>
      </dl>
      <Link className="text-link" href={`/cases/${portfolioCase.slug}/`}>사례 자세히 보기 <span aria-hidden>→</span></Link>
    </article>
  );
}
