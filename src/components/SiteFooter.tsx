import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-copy">
          <strong>김정식 · TOM</strong>
          <span>백엔드 개발 · 업무시스템 · 개발자 도구</span>
        </div>
        <nav className="footer-links" aria-label="하단 링크">
          <Link href="https://github.com/tomtomjskim/portfolio">포트폴리오 원문 ↗</Link>
          <Link href="https://github.com/tomtomjskim">GitHub 프로필 ↗</Link>
        </nav>
      </div>
    </footer>
  );
}
