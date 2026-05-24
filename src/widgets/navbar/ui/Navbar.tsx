'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import hanaloopLogo from '@/assets/images/hanaloop_logo.jpg';

const NAV_ITEMS = [
  { label: '배출 현황',   href: '/'        },
  { label: '데이터 관리', href: '/input'   },
  { label: '배출계수 관리', href: '/factors' },
] as const;

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* 로고 */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src={hanaloopLogo}
            alt="Hanaloop"
            width={42}
            height={42}
            className="rounded-xl object-cover"
          />
          <span
            className="text-2xl font-extrabold tracking-tight"
            style={{
              background: 'linear-gradient(120deg, #6ee7d4 0%, #7dd3e8 50%, #93c5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Hanaloop
          </span>
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-6">
          {NAV_ITEMS.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`
                  relative pb-1 text-base font-semibold
                  transition-colors duration-200 ease-in-out
                  after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full
                  after:bg-cyan-500 after:transition-all after:duration-300 after:ease-in-out
                  ${isActive
                    ? 'text-cyan-600 after:w-full'
                    : 'text-gray-400 hover:text-gray-700 after:w-0 hover:after:w-full'
                  }
                `}
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
