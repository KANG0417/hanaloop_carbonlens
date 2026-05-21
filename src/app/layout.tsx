import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/widgets/navbar';

export const metadata: Metadata = {
  title: 'CarbonLens',
  description: '탄소 배출량 추적 대시보드',
};

// Next.js App Router는 layout에 default export를 요구함 (프레임워크 예외)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
