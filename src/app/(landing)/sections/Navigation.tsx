import { routes } from '@/lib/routes';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface NavigationProps {
  scrollY: number;
}

export function Navigation({ scrollY }: NavigationProps) {
  const isScrolled = scrollY > 50;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-950/95 backdrop-blur-lg shadow-lg shadow-blue-500/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-col gap-5 sm:flex-row">
        <Link href={routes.home} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-amber-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
            Metatrader Institute
          </span>
        </Link>

        <Link href={routes.login} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-amber-600 rounded-lg font-semibold hover:scale-105 transition-transform duration-200 shadow-lg shadow-blue-500/30">
          Get Started
        </Link>
      </div>
    </nav>
  );
}
