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
  const problemSection = extractMarkdownSections(getViewMarkdown('general-backend'), ['해결하는 문제']);
  const evidence = getPublicEngineeringEvidence();

  return (
    <>
      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow">백엔드 개발 · 업무시스템 · 개발자 도구</p>
          <h1>복잡한 업무를<br />운영 가능한 시스템으로 바꿉니다.</h1>
          <p className="hero-description">
            PHP/MySQL 기반 커머스·물류·MES 업무시스템을 개발·운영해 왔습니다.
            화면 증상만 고치기보다 상태·데이터·권한·관리자·배치·외부 연동이 연결되는 범위를 먼저 확인합니다.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="#cases">대표 사례 보기</Link>
            <Link className="button button-secondary" href={getSourceRepositoryUrl()}>GitHub 원문</Link>
          </div>
        </div>
        <aside className="hero-dossier" aria-label="핵심 경력 요약">
          <span className="dossier-label">업무 중심</span>
          <strong>운영형 백엔드</strong>
          <p>커머스·물류·MES의 상태와 업무 규칙, 외부 연동을 다룹니다.</p>
          <div className="dossier-list">
            <span>PHP / MySQL</span>
            <span>커머스 · 물류 · MES</span>
            <span>변경 영향 분석</span>
            <span>내부 도구 · AI 활용</span>
          </div>
        </aside>
      </section>

      <section className="section section-shell problem-section">
        <div className="section-heading">
          <p className="eyebrow">작업 방식</p>
          <h2>해결하는 문제</h2>
        </div>
        <MarkdownDocument markdown={problemSection} />
      </section>

      <section className="section section-shell" id="cases">
        <div className="section-heading section-heading-row">
          <div>
            <p className="eyebrow">사례</p>
            <h2>대표 사례</h2>
          </div>
          <p>문제 → 판단 → 근거 순서로 빠르게 읽을 수 있습니다.</p>
        </div>
        <div className="case-grid">
          {cases.map((portfolioCase) => <CaseCard key={portfolioCase.id} portfolioCase={portfolioCase} />)}
        </div>
      </section>

      <section className="section section-shell principles-section">
        <div className="section-heading">
          <p className="eyebrow">개발 기준</p>
          <h2>개발 원칙</h2>
        </div>
        <div className="principle-grid">
          <article><span>01</span><h3>변경 영향 범위를 먼저 확인</h3><p>화면과 함수뿐 아니라 DB 상태, 권한, 관리자, batch/cron, 외부 API까지 확인합니다.</p></article>
          <article><span>02</span><h3>암묵적인 업무 규칙을 명시</h3><p>현업의 요청을 상태·데이터·권한·인터페이스 조건으로 바꿉니다.</p></article>
          <article><span>03</span><h3>자동화와 사람 판단을 분리</h3><p>규칙이 명확한 부분은 코드로 처리하고 업무 맥락과 최종 결정은 사람이 맡습니다.</p></article>
          <article><span>04</span><h3>완료 보고보다 실행 결과</h3><p>테스트·E2E·실행 결과와 운영 흐름을 근거로 완료 여부를 판단합니다.</p></article>
        </div>
      </section>

      <section className="section section-shell">
        <div className="section-heading section-heading-row">
          <div>
            <p className="eyebrow">공개 개발 자료</p>
            <h2>공개 개발 자료</h2>
          </div>
          <Link className="text-link" href="/about/#public-evidence">근거와 한계 보기 <span aria-hidden>→</span></Link>
        </div>
        <div className="evidence-grid">
          {evidence.map((item) => (
            <article className="evidence-card" key={item.id}>
              <span>{item.kind}</span>
              <h3>{item.title}</h3>
              <p>{item.shows}</p>
              {item.repository ? <Link className="text-link" href={item.repository}>저장소 보기 <span aria-hidden>↗</span></Link> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="section section-shell closing-cta">
        <div>
          <p className="eyebrow">판단 과정</p>
          <h2>기술 목록보다 판단 과정과 검증 경계를 보여줍니다.</h2>
        </div>
        <div className="hero-actions">
          <Link className="button button-primary" href="/about/">소개와 작업 기준</Link>
          <Link className="button button-secondary" href="https://github.com/tomtomjskim">GitHub 프로필</Link>
        </div>
      </section>
    </>
  );
}
