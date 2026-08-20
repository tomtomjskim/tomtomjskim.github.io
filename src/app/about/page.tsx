import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '소개',
  description: '김정식의 백엔드 개발 경력을 간단히 정리합니다.',
  alternates: { canonical: '/about/' }
};

export default function AboutPage() {
  return (
    <div className="document-page section-shell">
      <header className="page-intro">
        <p className="page-kicker">소개</p>
        <h1>김정식</h1>
        <p>PHP/MySQL 기반 커머스·물류·MES 업무시스템을 개발하고 운영해 온 백엔드 개발자입니다.</p>
      </header>

      <section className="document-section">
        <header className="document-section-heading"><span>01</span><h2>경력 요약</h2></header>
        <div className="document-section-body">
          <ul>
            <li>PHP / MySQL 기반 백엔드와 업무시스템</li>
            <li>커머스·오픈마켓, 물류·배송, 제조 MES</li>
            <li>상품·주문·배송·클레임·정산·관리자·외부 API</li>
            <li>현장 도입·교육·원격지원과 운영 문제 분석</li>
          </ul>
        </div>
      </section>

      <section className="document-links">
        <h2>관련 링크</h2>
        <div className="inline-links">
          <Link href="https://github.com/tomtomjskim/portfolio">포트폴리오 원문 ↗</Link>
          <Link href="https://github.com/tomtomjskim">GitHub 프로필 ↗</Link>
        </div>
      </section>
    </div>
  );
}
