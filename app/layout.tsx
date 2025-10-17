import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "인생 설계 플래너",
  description: "커리어 · 결혼 · 부동산 · 자산관리 통합 플래너",
  keywords: ["인생설계", "커리어", "재무관리", "부동산", "목표설정", "플래너"],
  authors: [{ name: "Life Planner" }],
  creator: "Life Planner",
  publisher: "Life Planner",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://life-planner.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "인생 설계 플래너",
    description: "커리어 · 결혼 · 부동산 · 자산관리 통합 플래너",
    url: 'https://life-planner.vercel.app',
    siteName: 'Life Planner',
    images: [
      {
        url: '/LP_thumbnail.svg',
        width: 1200,
        height: 630,
        alt: '인생 설계 플래너',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "인생 설계 플래너",
    description: "커리어 · 결혼 · 부동산 · 자산관리 통합 플래너",
    images: ['/LP_thumbnail.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/LP_favicon.svg', sizes: '14x14', type: 'image/svg+xml' },
      { url: '/LP_favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/LP_favicon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/LP_favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/LP_favicon.svg" />
        <meta name="theme-color" content="#0500A1" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
