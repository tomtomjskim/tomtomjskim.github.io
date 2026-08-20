import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="not-found section-shell">
      <p className="page-kicker">404</p>
      <h1>페이지를 찾지 못했습니다.</h1>
      <p>주소가 바뀌었거나 아직 공개되지 않은 페이지입니다.</p>
      <div className="inline-links"><Link href="/">홈으로 돌아가기 →</Link></div>
    </section>
  );
}
