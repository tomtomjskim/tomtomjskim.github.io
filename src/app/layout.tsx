import type { Metadata } from 'next';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://tomtomjskim.github.io'),
  title: {
    default: '김정식 | 백엔드 개발 포트폴리오',
    template: '%s | 김정식'
  },
  description: 'PHP/MySQL 기반 커머스·물류·MES 업무시스템과 개발자 내부 도구 사례를 정리한 김정식의 개발 포트폴리오입니다.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://tomtomjskim.github.io',
    siteName: '김정식 개발 포트폴리오',
    title: '김정식 | 백엔드 개발 포트폴리오',
    description: '운영형 백엔드, 커머스·물류·MES, 내부 도구와 검증 가능한 AI 활용 사례',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: '김정식 백엔드 개발 포트폴리오' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: '김정식 | 백엔드 개발 포트폴리오',
    description: '운영형 백엔드, 커머스·물류·MES, 내부 도구와 검증 가능한 AI 활용 사례',
    images: ['/og-image.svg']
  },
  icons: { icon: '/favicon.svg' }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <a className="skip-link" href="#main-content">본문 바로가기</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
