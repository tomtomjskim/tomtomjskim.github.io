import Link from 'next/link';
import { CaseCard } from '@/components/CaseCard';
import {
  getAllCases,
  getPublicEngineeringEvidence,
  getSourceRepositoryUrl
} from '@/lib/portfolio';

export default function HomePage() {
  const cases = getAllCases();
  const workCases = cases.filter((item) => item.classification !== 'public-rnd');
  const evidence = getPublicEngineeringEvidence();

  return (
    <div className="home-page">
      <section className="home-intro section-shell">
        <p className="intro-kicker">김정식 · 백엔드 개발자</p>
        <h1>PHP/MySQL 기반 커머스·물류·MES 업무시스템을 개발하고 운영해 왔습니다.</h1>
        <div className="inline-links" aria-label="주요 링크">
          <Link href="#cases">업무 사례</Link>
          <Link href={getSourceRepositoryUrl()}>GitHub 원문 ↗</Link>
        </div>
      </section>

      <section className="home-section section-shell" id="cases">
        <header className="editorial-heading">
          <div>
            <h2>업무 사례</h2>
            <p>실제 업무 경험을 공개 가능한 범위로 정리한 문서입니다.</p>
          </div>
        </header>
        <div className="case-index">
          {workCases.map((portfolioCase) => <CaseCard key={portfolioCase.id} portfolioCase={portfolioCase} />)}
        </div>
      </section>

      <section className="home-section section-shell">
        <header className="editorial-heading">
          <div>
            <h2>공개 개발 자료</h2>
            <p>회사 실무와 구분되는 공개 코드·문서·검증 기록입니다.</p>
          </div>
        </header>
        <div className="evidence-list">
          {evidence.map((item, index) => (
            <article className="evidence-row" key={item.id}>
              <span className="evidence-number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <p className="evidence-kind">{item.kind}</p>
                <h3>{item.title}</h3>
              </div>
              <p>{item.shows}</p>
              {item.repository ? <Link href={item.repository}>저장소 보기 ↗</Link> : <span />}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
