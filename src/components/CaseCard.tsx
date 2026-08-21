import Link from 'next/link';
import type { PortfolioCase } from '@/lib/portfolio';

const classificationLabel: Record<PortfolioCase['classification'], string> = {
  'sanitized-actual-work': '실무 사례',
  'sanitized-actual-work-with-public-rnd-support': '실무 적용 · 공개 자료',
  'private-personal-product': '개인 실사용 프로젝트',
  'public-rnd': '공개 개발 자료'
};

export function CaseCard({ portfolioCase }: { portfolioCase: PortfolioCase }) {
  return (
    <article className="case-index-item">
      <p className="case-index-kind">{classificationLabel[portfolioCase.classification]}</p>
      <div className="case-index-title">
        <h3><Link href={`/cases/${portfolioCase.slug}/`}>{portfolioCase.title}</Link></h3>
        <p>{portfolioCase.question}</p>
      </div>
      <Link className="case-index-link" href={`/cases/${portfolioCase.slug}/`} aria-label={`${portfolioCase.title} 보기`}>
        보기 →
      </Link>
    </article>
  );
}
