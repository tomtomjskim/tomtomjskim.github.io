import Link from 'next/link';
import { CaseCard } from '@/components/CaseCard';
import { MarkdownDocument } from '@/lib/markdown';
import {
  extractMarkdownSections,
  getAllCases,
  getPublicEngineeringEvidence,
  getSourceRepositoryUrl,
  getViewMarkdown
} from '@/lib/portfolio';

export default function HomePage() {
  const cases = getAllCases();
  const problemSection = extractMarkdownSections(getViewMarkdown('general-backend'), ['해결하는 문제'])
    .replace(/^## 해결하는 문제\s*/u, '');
  const evidence = getPublicEngineeringEvidence();

  return (
    <div className="home-page">
      <section className="home-intro section-shell">
        <p className="intro-kicker">김정식 · 백엔드 개발자</p>
        <h1>운영 중인 업무시스템의 변경을 안전하게 설계하고 구현합니다.</h1>
        <p className="intro-lead">
          PHP/MySQL 기반 커머스·물류·MES 시스템을 개발·운영해 왔습니다.
          화면에 보이는 증상보다 상태·데이터·권한·관리자·배치·외부 연동이 실제로 연결되는 범위를 먼저 확인합니다.
        </p>
        <div className="inline-links" aria-label="주요 링크">
          <Link href="#cases">대표 사례 보기</Link>
          <Link href={getSourceRepositoryUrl()}>GitHub 원문 ↗</Link>
        </div>
        <dl className="intro-meta">
          <div><dt>주력</dt><dd>PHP / MySQL 백엔드</dd></div>
          <div><dt>업무 영역</dt><dd>커머스 · 물류 · MES</dd></div>
          <div><dt>작업 기준</dt><dd>변경 영향 분석과 검증</dd></div>
        </dl>
      </section>

      <section className="home-section section-shell" id="cases">
        <header className="editorial-heading">
          <span className="section-number">01</span>
          <div>
            <h2>대표 사례</h2>
            <p>각 사례는 문제, 판단, 근거 순서로 정리했습니다.</p>
          </div>
        </header>
        <div className="case-index">
          {cases.map((portfolioCase) => <CaseCard key={portfolioCase.id} portfolioCase={portfolioCase} />)}
        </div>
      </section>

      <section className="home-section section-shell">
        <header className="editorial-heading">
          <span className="section-number">02</span>
          <div>
            <h2>작업 기준</h2>
            <p>기술을 먼저 고르기보다 상태와 업무 흐름을 먼저 확인합니다.</p>
          </div>
        </header>
        <div className="method-layout">
          <div className="method-copy">
            <MarkdownDocument markdown={problemSection} />
          </div>
          <div className="principle-list">
            <article><span>01</span><div><h3>변경 영향 범위를 먼저 확인</h3><p>화면과 함수뿐 아니라 DB 상태, 권한, 관리자, batch/cron, 외부 API까지 확인합니다.</p></div></article>
            <article><span>02</span><div><h3>암묵적인 업무 규칙을 명시</h3><p>현업의 요청을 상태·데이터·권한·인터페이스 조건으로 바꿉니다.</p></div></article>
            <article><span>03</span><div><h3>자동화와 사람 판단을 분리</h3><p>규칙이 명확한 부분은 코드로 처리하고 업무 맥락과 최종 결정은 사람이 맡습니다.</p></div></article>
            <article><span>04</span><div><h3>완료 보고보다 실행 결과</h3><p>테스트·E2E·실행 결과와 운영 흐름을 근거로 완료 여부를 판단합니다.</p></div></article>
          </div>
        </div>
      </section>

      <section className="home-section section-shell">
        <header className="editorial-heading">
          <span className="section-number">03</span>
          <div>
            <h2>공개 개발 자료</h2>
            <p>실무 사례와 별개로 공개 코드와 검증 기록을 확인할 수 있는 자료입니다.</p>
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
        <div className="section-link-row">
          <Link href="/about/#public-evidence">공개 근거와 한계 보기 →</Link>
        </div>
      </section>

      <section className="home-end section-shell">
        <h2>기술 목록보다 판단 과정과 검증 범위를 보여줍니다.</h2>
        <div className="inline-links">
          <Link href="/about/">소개와 작업 기준</Link>
          <Link href="https://github.com/tomtomjskim">GitHub 프로필 ↗</Link>
        </div>
      </section>
    </div>
  );
}
