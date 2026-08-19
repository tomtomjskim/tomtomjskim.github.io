import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <strong>김정식 · TOM</strong>
          <p>복잡한 업무를 이해하고 운영하기 쉬운 시스템과 개발 도구로 바꿉니다.</p>
        </div>
        <div className="footer-links">
          <Link href="https://github.com/tomtomjskim/portfolio">원문 저장소</Link>
          <Link href="https://github.com/tomtomjskim">GitHub 프로필</Link>
        </div>
      </div>
    </footer>
  );
}
