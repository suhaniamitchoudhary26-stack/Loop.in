'use client';

import { Inter, Merriweather } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import ProfileDropdown from '@/components/layout/ProfileDropdown';
import NotificationDropdown from '@/components/layout/NotificationDropdown';
import TruncatedText from '@/components/common/TruncatedText';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-serif'
});

import { ToastProvider } from '@/context/ToastContext';

import CommandPalette from '@/components/search/CommandPalette';
import { getCurrentUser } from '@/lib/api';
import EnrollmentModal from '@/components/auth/EnrollmentModal';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeToggle from '@/components/common/ThemeToggle';
import { AuthProvider } from '@/context/AuthContext';

import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import { SocketProvider } from '@/context/SocketContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Auth & Enrollment State
  const [user, setUser] = useState<any>(null);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check current user status
    getCurrentUser().then(userData => {
      if (userData) {
        setUser({
          name: userData.full_name || userData.username || 'Student',
          initials: (userData.full_name || userData.email)[0].toUpperCase(),
          email: userData.email,
          ...userData
        });
        // if (!userData.enrollment_number) {
        //   setShowEnrollmentModal(true);
        // }
      }
    }).catch(() => {
      // Not logged in
    });
  }, [pathname]); // Re-check on route change if needed

  // Close on ESC keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Search with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }

      // Close on ESC
      if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        if (isSidebarOpen) setIsSidebarOpen(false);
        if (isProfileOpen) setIsProfileOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, isProfileOpen, isSearchOpen]);

  // Prevent body scroll when sidebar is open or search modal is active
  useEffect(() => {
    if (isSidebarOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSidebarOpen, isSearchOpen]);

  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable} ${merriweather.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              <ToastProvider>
                {/* ... children ... */}

                <div className="flex h-screen bg-[#FAFAF7] dark:bg-[#09090b] text-slate-900 dark:text-[#FAFAF7] overflow-hidden">
                  <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
                  {/* <EnrollmentModal isOpen={showEnrollmentModal} onSuccess={() => {
                  setShowEnrollmentModal(false);
                  window.location.reload(); // Refresh to update state
                }} /> */}

                  {/* Overlay for Mobile Sidebar */}
                  {isSidebarOpen && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-200 md:hidden"
                      onClick={() => setIsSidebarOpen(false)}
                      aria-hidden="true"
                    />
                  )}

                  {/* Mobile Top Header (Hamburger + Branding) */}
                  <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 z-30 flex items-center px-4 justify-between">
                    <button
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                      aria-label="Toggle menu"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    <span className="font-bold text-lg text-slate-800 dark:text-white">Loop.in</span>
                    {/* Placeholder for spacing, profile is handled in fixed top-right or different logic if needed */}
                    <div className="w-8"></div>
                  </div>


                  {/* Sidebar (Desktop & Mobile Drawer) */}
                  <Sidebar
                    isOpen={isSidebarOpen}
                    setIsOpen={setIsSidebarOpen}
                    setIsSearchOpen={setIsSearchOpen}
                  />

                  {/* Header / Top Right Actions (Desktop) */}
                  <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
                    <NotificationDropdown />

                    {user ? (
                      <div ref={profileRef} className="relative">
                        <button
                          onClick={() => setIsProfileOpen(!isProfileOpen)}
                          className="w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-md hover:bg-blue-700 transition-colors duration-150 ring-2 ring-white"
                          aria-label="Open profile menu"
                        >
                          {user.initials}
                        </button>

                        <ProfileDropdown
                          isOpen={isProfileOpen}
                          onClose={() => setIsProfileOpen(false)}
                          userInitials={user.initials}
                          userName={user.name}
                          userEmail={user.email}
                        />
                      </div>
                    ) : (
                      <Link
                        href="/login"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        Login
                      </Link>
                    )}
                  </div>

                  {/* Main Content */}
                  <main className="flex-1 overflow-y-auto h-full w-full pt-16 md:pt-0 pb-24 md:pb-0">
                    <div className="max-w-7xl mx-auto p-4 md:p-8">
                      {children}
                    </div>
                  </main>

                  {/* Mobile Bottom Navigation */}
                  <BottomNav />

                </div>

              </ToastProvider>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
