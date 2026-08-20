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
  const publicCases = cases.filter((item) => item.classification === 'public-rnd');
  const evidence = getPublicEngineeringEvidence();

  return (
    <div className="home-page">
      <header className="profile-index section-shell">
        <div className="profile-identity">
          <h1>김정식</h1>
          <p>백엔드 개발자</p>
        </div>
        <div className="profile-summary">
          <p>
            PHP/MySQL 기반 커머스·물류·MES 업무시스템을 개발하고 운영해 왔습니다.
            상태·데이터·권한·관리자·배치·외부 연동이 함께 움직이는 기능을 주로 다룹니다.
          </p>
          <nav className="profile-links" aria-label="주요 링크">
            <Link href="#work">업무 사례</Link>
            <Link href="#public">공개 개발 자료</Link>
            <Link href={getSourceRepositoryUrl()}>GitHub 원문 ↗</Link>
          </nav>
        </div>
      </header>

      <section className="index-section section-shell" id="work">
        <header className="index-section-heading">
          <h2>업무 사례</h2>
          <p>실제 업무 경험을 공개 가능한 범위로 정리한 문서입니다.</p>
        </header>
        <div className="case-index">
          {workCases.map((portfolioCase) => (
            <CaseCard key={portfolioCase.id} portfolioCase={portfolioCase} />
          ))}
        </div>
      </section>

      <section className="index-section section-shell" id="public">
        <header className="index-section-heading">
          <h2>공개 개발 자료</h2>
          <p>회사 실무와 구분되는 공개 코드·문서·검증 기록입니다.</p>
        </header>

        <div className="index-section-body">
          {publicCases.length ? (
            <div className="case-index public-case-index">
              {publicCases.map((portfolioCase) => (
                <CaseCard key={portfolioCase.id} portfolioCase={portfolioCase} />
              ))}
            </div>
          ) : null}

          <div className="evidence-list">
            {evidence.map((item) => (
              <article className="evidence-row" key={item.id}>
                <div>
                  <p className="evidence-kind">{item.kind}</p>
                  <h3>{item.title}</h3>
                </div>
                <p>{item.shows}</p>
                {item.repository ? <Link href={item.repository}>저장소 ↗</Link> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
