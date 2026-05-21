'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: '대시보드', href: '/' },
  { label: '데이터 입력', href: '/input' },
  { label: '보고서', href: '/report' },
] as const;

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* 로고 */}
        <div className="flex items-center gap-2">
          <span className="text-green-500 text-xl font-black tracking-tight">
            Carbon<span className="text-gray-800">Lens</span>
          </span>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
