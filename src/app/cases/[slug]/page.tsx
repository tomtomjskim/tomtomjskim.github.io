import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMarkdownHeadings, MarkdownDocument } from '@/lib/markdown';
import { getAllCases, getCaseBySlug, getCaseMarkdown, getSourceRepositoryUrl, removeMarkdownSection } from '@/lib/portfolio';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCases().map((portfolioCase) => ({ slug: portfolioCase.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const portfolioCase = getCaseBySlug(slug);
  if (!portfolioCase) return {};
  return {
    title: portfolioCase.title,
    description: portfolioCase.question,
    alternates: { canonical: `/cases/${portfolioCase.slug}/` },
    openGraph: {
      title: `${portfolioCase.title} | 김정식`,
      description: portfolioCase.question,
      url: `/cases/${portfolioCase.slug}/`
    }
  };
}

const privateOnlySections = [
  '핵심 질문',
  '면접 예상 질문',
  '인터뷰 예상 질문',
  'Interview Hooks',
  '면접 대응',
  '리허설'
];

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const portfolioCase = getCaseBySlug(slug);
  if (!portfolioCase) notFound();

  const allCases = getAllCases();
  const isPublicRnd = portfolioCase.classification === 'public-rnd';
  const markdown = privateOnlySections.reduce(
    (current, section) => removeMarkdownSection(current, section),
    getCaseMarkdown(portfolioCase)
  );
  const headings = getMarkdownHeadings(markdown).filter((heading) => heading.level === 2 && heading.text !== '한눈에 보기');
  const sourceUrl = `${getSourceRepositoryUrl()}/blob/main/${portfolioCase.file}`;
  const classification = isPublicRnd ? '공개 개발 자료' : '업무 사례';
  const backHref = isPublicRnd ? '/#public' : '/#work';
  const backLabel = isPublicRnd ? '공개 개발 자료' : '업무 사례';
  const relatedCases = isPublicRnd
    ? allCases.filter((item) => item.classification !== 'public-rnd')
    : allCases.filter((item) => item.classification !== 'public-rnd' && item.id !== portfolioCase.id);

  return (
    <div className="case-page section-shell">
      <header className="case-intro">
        <Link className="back-link" href={backHref}>← {backLabel}</Link>
        <p className="case-classification">{classification}</p>
        <h1>{portfolioCase.title}</h1>
        <p className="case-intro-question">{portfolioCase.question}</p>
        <p className="case-source-link"><Link href={sourceUrl}>GitHub 원문 ↗</Link></p>
      </header>

      <div className="case-layout">
        <aside className="case-toc" aria-label="사례 목차">
          <strong>목차</strong>
          <nav>
            {headings.map((heading) => <Link key={heading.id} href={`#${heading.id}`}>{heading.text}</Link>)}
          </nav>
        </aside>
        <article className="case-article">
          <MarkdownDocument markdown={markdown} skipFirstHeading />
        </article>
      </div>

      <nav className="case-next" aria-label="다른 업무 사례">
        <p>{isPublicRnd ? '업무 사례' : '다른 업무 사례'}</p>
        {relatedCases.map((item) => (
          <Link key={item.id} href={`/cases/${item.slug}/`}>
            <strong>{item.title}</strong>
            <span aria-hidden>→</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
