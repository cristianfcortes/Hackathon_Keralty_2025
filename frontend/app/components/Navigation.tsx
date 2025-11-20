'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { handleActivation } from '@/lib/accessibility/keyboard';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Inicio', icon: '🏠' },
  { href: '/chat_page', label: 'Chat', icon: '💬' },
  { href: '/records', label: 'Intercambio', icon: '🔄' },
  { href: '/directory', label: 'Directorio', icon: '📋' },
  { href: '/rewards', label: 'Recompensas', icon: '🎁' },
  { href: '/contact', label: 'Contacto', icon: '📞' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, href: string) => {
    handleActivation(e.nativeEvent, () => {
      window.location.href = href;
    });
  };

  const handleLogout = () => {
    // Implementar lógica de logout aquí
    console.log('Cerrando sesión...');
    // Por ahora, redirigir al login
    window.location.href = '/login';
  };

  return (
    <nav 
      role="navigation" 
      aria-label="Navegación principal"
      className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-white font-bold text-xl hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-white rounded-lg px-2 py-1"
              style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
            >
              <span className="text-2xl drop-shadow-lg">💙</span>
              <span className="hidden sm:inline">Keralty</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-white shadow-sm ${
                      isActive 
                        ? 'bg-white/40 shadow-lg backdrop-blur-md scale-105' 
                        : 'hover:bg-white/25 hover:shadow-md'
                    }`}
                    style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
                    aria-current={isActive ? 'page' : undefined}
                    onKeyDown={(e) => handleKeyDown(e, item.href)}
                  >
                    <span className="text-lg" aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* User Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/25 hover:bg-white/35 transition-all focus:outline-none focus:ring-2 focus:ring-white backdrop-blur-md shadow-lg"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
                aria-label="Menú de usuario"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg">
                  <span className="text-lg">👤</span>
                </div>
                <span 
                  className="hidden sm:inline text-white font-semibold"
                  style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
                >
                  Usuario
                </span>
                <svg
                  className={`w-4 h-4 text-white transition-transform drop-shadow-md ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-fade-in"
                  role="menu"
                  aria-orientation="vertical"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-md text-xl">
                        👤
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Usuario Demo</p>
                        <p className="text-sm text-gray-600">usuario@keralty.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      href="/preferences"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="text-xl">👤</span>
                      <span className="font-medium">Mi Perfil</span>
                    </Link>

                    <Link
                      href="/rewards"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="text-xl">🎁</span>
                      <span className="font-medium">Mis Recompensas</span>
                    </Link>

                    <Link
                      href="/preferences"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="text-xl">⚙️</span>
                      <span className="font-medium">Configuración</span>
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      role="menuitem"
                    >
                      <span className="text-xl">🚪</span>
                      <span className="font-medium">Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/25 hover:bg-white/35 transition-all focus:outline-none focus:ring-2 focus:ring-white shadow-lg backdrop-blur-md"
              aria-expanded={isMobileMenuOpen}
              aria-label="Abrir menú de navegación"
            >
              <svg
                className="w-6 h-6 text-white drop-shadow-md"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-slide-down">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white font-semibold transition-all ${
                        isActive 
                          ? 'bg-white/40 shadow-lg backdrop-blur-md' 
                          : 'hover:bg-white/25'
                      }`}
                      style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-xl" aria-hidden="true">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

