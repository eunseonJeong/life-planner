import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "인생 설계 플래너",
  description: "커리어 · 결혼 · 부동산 · 자산관리 통합 플래너"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
