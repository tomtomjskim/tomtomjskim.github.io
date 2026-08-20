import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublicEngineeringEvidence } from '@/lib/portfolio';

export const metadata: Metadata = {
  title: '소개',
  description: '김정식의 백엔드 개발 경력과 공개 개발 자료를 간단히 정리합니다.',
  alternates: { canonical: '/about/' }
};

export default function AboutPage() {
  const evidence = getPublicEngineeringEvidence();

  return (
    <div className="document-page section-shell">
      <header className="document-intro">
        <h1>소개</h1>
        <p>PHP/MySQL 기반 커머스·물류·MES 업무시스템을 개발하고 운영해 왔습니다.</p>
      </header>

      <section className="document-section">
        <header className="document-section-heading"><h2>경력 요약</h2></header>
        <div className="document-section-body">
          <p>
            사용자 화면과 관리자 기능, DB 상태, batch/cron, 외부 API가 함께 움직이는 운영형 시스템을 주로 다뤘습니다.
            공개 포트폴리오에는 실제 업무 경험을 비식별화한 문서와 별도로 확인할 수 있는 공개 개발 자료만 정리합니다.
          </p>
          <ul>
            <li>PHP / MySQL 기반 백엔드와 업무시스템</li>
            <li>커머스·오픈마켓, 물류·배송, 제조 MES</li>
            <li>상품·주문·배송·클레임·정산·관리자·외부 연동</li>
            <li>현장 도입·교육·원격지원과 운영 문제 분석</li>
          </ul>
        </div>
      </section>

      <section className="document-section" id="public-evidence">
        <header className="document-section-heading"><h2>공개 개발 자료</h2></header>
        <div className="document-section-body evidence-list">
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
      </section>

      <footer className="document-links">
        <h2>관련 링크</h2>
        <p>
          <Link href="https://github.com/tomtomjskim/portfolio">포트폴리오 원문 ↗</Link>
          {' · '}
          <Link href="https://github.com/tomtomjskim">GitHub 프로필 ↗</Link>
        </p>
      </footer>
    </div>
  );
}
