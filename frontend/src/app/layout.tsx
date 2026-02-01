import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Loop.in',
  description: 'Verified Campus Community',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <h1 className="text-2xl font-bold text-blue-600">Loop.in ♾️</h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              <NavLink href="/" label="Home" emoji="🏠" />
              <NavLink href="/popular" label="Popular" emoji="🔥" />
              <NavLink href="/academics" label="Academics" emoji="📚" />
              <NavLink href="/events" label="Events" emoji="📅" />
              <NavLink href="/career" label="Career" emoji="💼" />
            </nav>

            <div className="p-4 border-t border-gray-100">
              <Link href="/login" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 p-2 rounded transition-colors">
                <span>👤</span>
                <span>Login / Register</span>
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

function NavLink({ href, label, emoji }: { href: string; label: string; emoji: string }) {
  return (
    <Link href={href} className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors font-medium">
      <span className="text-xl">{emoji}</span>
      <span>{label}</span>
    </Link>
  );
}
