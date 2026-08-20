import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="site-brand" href="/" aria-label="김정식 포트폴리오 홈">
          <strong>김정식</strong>
          <span>백엔드 개발자</span>
        </Link>
        <nav className="site-nav" aria-label="주요 메뉴">
          <Link href="/#work">업무 사례</Link>
          <Link href="/#public">공개 자료</Link>
          <Link href="/about/">소개</Link>
        </nav>
      </div>
    </header>
  );
}
