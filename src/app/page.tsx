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
            화면에 보이는 증상보다 상태·데이터·권한·관리자·배치·외부 연동이 실제로 연결되는 범위를 먼저 확인합니다.
          </p>
          <dl>
            <div><dt>주력</dt><dd>PHP / MySQL 백엔드</dd></div>
            <div><dt>업무 영역</dt><dd>커머스 · 물류 · MES</dd></div>
            <div><dt>작업 기준</dt><dd>변경 영향 분석 · 검증</dd></div>
          </dl>
          <nav className="profile-links" aria-label="외부 링크">
            <Link href="/about/">소개와 작업 기준</Link>
            <Link href={getSourceRepositoryUrl()}>포트폴리오 원문 ↗</Link>
            <Link href="https://github.com/tomtomjskim">GitHub ↗</Link>
          </nav>
        </div>
      </header>

      <section className="index-section section-shell" id="work">
        <header className="index-section-heading">
          <h2>업무 사례</h2>
          <p>실제 업무에서 다룬 문제와 판단을 공개 가능한 범위로 정리했습니다.</p>
        </header>
        <div className="case-index">
          {workCases.map((portfolioCase) => (
            <CaseCard key={portfolioCase.id} portfolioCase={portfolioCase} />
          ))}
        </div>
      </section>

      <section className="index-section section-shell" id="method">
        <header className="index-section-heading">
          <h2>작업 방식</h2>
          <p>기술이나 화면부터 정하지 않고 실제 상태와 업무 흐름을 먼저 확인합니다.</p>
        </header>
        <ol className="method-steps">
          <li><strong>현재 동작 확인</strong><span>AS-IS 코드, DB 읽기·쓰기 경로, 상태 변경 주체를 확인합니다.</span></li>
          <li><strong>영향 범위 확인</strong><span>권한, 관리자 처리, batch/cron, 외부 API와 후속 작업을 함께 봅니다.</span></li>
          <li><strong>변경 범위 결정</strong><span>정상 흐름과 예외를 분리하고 필요한 경계만 수정합니다.</span></li>
          <li><strong>검증</strong><span>코드·데이터 상태·E2E·수동 업무 흐름으로 실제 결과를 확인합니다.</span></li>
        </ol>
      </section>

      <section className="index-section section-shell" id="public">
        <header className="index-section-heading">
          <h2>공개 개발 자료</h2>
          <p>회사 실무 사례와 구분되는 공개 코드·문서·검증 기록입니다.</p>
        </header>

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
        <p className="section-note">
          공개 자료의 확인 가능한 범위와 한계는 <Link href="/about/#public-evidence">소개 페이지</Link>에 따로 정리했습니다.
        </p>
      </section>
    </div>
  );
}
