'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/behaviour-logging', label: 'Behaviour Log' },
    { href: '/productivity', label: 'Productivity' },
    { href: '/lifestyle', label: 'Lifestyle' },
    { href: '/mental-health', label: 'Mental Health' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <motion.nav
      className="glass sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary hover:opacity-80 transition">
          KIZASHI
        </Link>

        {user && (
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  pathname === item.href
                    ? 'bg-primary/20 text-primary'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium glass-sm hover:opacity-80 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium glass-sm hover:opacity-80 transition">
              Login
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
