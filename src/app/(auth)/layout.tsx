import Link from "next/link";
import Image from "next/image";
import { routes } from "@/lib/routes";
import { Sparkles, Gem } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen overflow-x-hidden text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container py-12 lg:py-20 max-w-2xl">
          <div className="text-center">
            <div className="inline-block mb-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-brand-1 to-brand-2 flex items-center justify-center shadow-[0_0_20px_rgba(185,242,255,.15)]">
                <Gem className="w-10 h-10 text-black" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-brand-1 to-brand-2 bg-clip-text text-transparent">MetaTrader</span>
            </h1>
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <Sparkles className="size-4" />
              Premium Meta Trading Platform
              <Sparkles className="size-4" />
            </p>
          </div>
          <main className="my-5">{children}</main>
          <footer>
            <p className="text-xs md:text-sm text-muted-foreground mt-3">
              © 2025 MetaTrader. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-2 text-xs md:text-sm text-muted-foreground justify-center mt-3">
          <Link href={routes.privacy} className="hover:underline">Privacy Policy</Link>
          <span>|</span>
          <Link href={routes.terms} className="hover:underline">Terms &amp; Conditions</Link>
          <span>|</span>
          <Link href={routes.userAgreement} className="hover:underline">User Agreement</Link>
        </div>
          </footer>
        </div>
      </div>
    </>
  );
}
