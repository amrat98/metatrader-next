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
      <div className="flex flex-col items-center justify-center min-h-screen overflow-x-hidden text-center bg-muted">
        <div className="container py-12 lg:py-20 max-w-[34rem]">
          <div className="text-center">
            <div className="inline-block mb-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-brand-5 to-brand-3 flex items-center justify-center animate-float diamond-glow">
                <Gem className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-brand-3 to-brand-5 bg-clip-text text-transparent">MetaTrader</span>
            </h1>
            <p className="text-slate-500 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Premium Diamond Trading Platform
            </p>
          </div>
          {/* <header>
            <Link
              href={routes.home}
              className="inline-block"
            >
              <Image
                className="inline-block max-h-18 w-auto"
                src="/logo.png"
                alt="IBC"
                width={540}
                height={300}
                priority
              />
            </Link>
            
          </header> */}
          <main className="my-5">{children}</main>
          <footer>
            {/* <Image
              className="w-full max-w-25 inline-block"
              src="/footer-logo.png"
              alt="IBC"
              width={84}
              height={20}
              priority
            /> */}
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
