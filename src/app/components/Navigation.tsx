"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from 'next-intl';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { data: session, status } = useSession();
  const t = useTranslations('Navigation');

  // Debug logging
  console.log('Navigation - current locale:', locale);
  console.log('Navigation - current pathname:', pathname);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === `/${locale}${path}` || (path === "/" && pathname === `/${locale}`);
  };

  const getLocalizedPath = (path: string) => {
    return `/${locale}${path}`;
  };

  const navigationItems = [
    { name: t('home'), href: "/" },
    { name: t('login'), href: "/login", hideWhenAuthenticated: true },
    { name: t('register'), href: "/register", hideWhenAuthenticated: true },
    { 
      name: t('logout'), 
      href: "#", 
      showWhenAuthenticated: true, 
      action: () => signOut({ callbackUrl: "/" }),
      testId: "logout-button"
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={getLocalizedPath("/")} className="text-xl font-bold text-gray-900 dark:text-white">
              Moonshine Orchids
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              if (item.hideWhenAuthenticated && session?.user) {
                return null;
              }
              if (item.showWhenAuthenticated && !session?.user) {
                return null;
              }
              
              if (item.action) {
                return (
                  <button
                    key={item.name}
                    onClick={item.action}
                    {...(item.testId && { "data-testid": item.testId })}
                    className="bg-gray-700 dark:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-500 transition-colors"
                  >
                    {item.name}
                  </button>
                );
              }
              
              return (
                <Link
                  key={item.name}
                  href={getLocalizedPath(item.href)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            
            {/* Language Switcher */}
            <div className="flex items-center space-x-2 ml-4 border-l border-gray-300 dark:border-gray-600 pl-4">
              <Link
                href="/en"
                className={`px-2 py-1 text-xs font-medium rounded ${
                  locale === 'en'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                EN
              </Link>
              <Link
                href="/hu"
                className={`px-2 py-1 text-xs font-medium rounded ${
                  locale === 'hu'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                HU
              </Link>
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          {navigationItems.map((item) => {
            if (item.hideWhenAuthenticated && session?.user) {
              return null;
            }
            if (item.showWhenAuthenticated && !session?.user) {
              return null;
            }
            
            if (item.action) {
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action();
                    closeMenu();
                  }}
                  {...(item.testId && { "data-testid": item.testId })}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {item.name}
                </button>
              );
            }
            
            return (
              <Link
                key={item.name}
                href={getLocalizedPath(item.href)}
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          
          {/* Mobile Language Switcher */}
          <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 px-3">Language:</span>
            <Link
              href="/en"
              onClick={closeMenu}
              className={`px-2 py-1 text-xs font-medium rounded ${
                locale === 'en'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              EN
            </Link>
            <Link
              href="/hu"
              onClick={closeMenu}
              className={`px-2 py-1 text-xs font-medium rounded ${
                locale === 'hu'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              HU
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
