import { routes } from '@/lib/routes';
import Link from 'next/link';

export function Footer() {
  return (
    <section className="py-16 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center text-slate-500 text-sm transform">
          <p>© 2025 Metatrader Institute. All rights reserved.</p>
          <div className="flex flex-wrap gap-2 text-sm text-slate-500 justify-center mt-3">
          <Link href={routes.privacy} className="hover:underline">Privacy Policy</Link>
          <span>|</span>
          <Link href={routes.terms} className="hover:underline">Terms &amp; Conditions</Link>
          <span>|</span>
          <Link href={routes.userAgreement} className="hover:underline">User Agreement</Link>
        </div>
          <p className="mt-2">Building wealth through innovation, technology, and community.</p>
        </div>
      </div>
    </section>
  );
}
