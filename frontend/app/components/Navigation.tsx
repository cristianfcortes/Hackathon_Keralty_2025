'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { handleActivation } from '@/lib/accessibility/keyboard';

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/chat_page', label: 'Chat' },
  { href: '/records', label: 'Records' },
  { href: '/directory', label: 'Directory' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const pathname = usePathname();

  const handleKeyDown = (e: React.KeyboardEvent, href: string) => {
    handleActivation(e.nativeEvent, () => {
      window.location.href = href;
    });
  };

  return (
    <nav role="navigation" aria-label="Main navigation">
      <ul className="flex gap-4 p-4 bg-white shadow">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`px-4 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActive ? 'bg-blue-100 font-semibold' : ''
                }`}
                aria-current={isActive ? 'page' : undefined}
                onKeyDown={(e) => handleKeyDown(e, item.href)}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

