import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="site-brand" href="/" aria-label="김정식 포트폴리오 홈">
          <span className="brand-mark">T</span>
          <span>
            <strong>김정식</strong>
            <small>백엔드 개발자</small>
          </span>
        </Link>
        <nav className="site-nav" aria-label="주요 메뉴">
          <Link href="/#cases">사례</Link>
          <Link href="/about/">소개</Link>
          <Link href="https://github.com/tomtomjskim" rel="noreferrer">GitHub</Link>
        </nav>
      </div>
    </header>
  );
}
