import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { TrendingUp } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <div className="absolute w-full h-full z-[-1] overflow-hidden">
        <div className="absolute top-[-5rem] right-[-5rem] md:top-[-12vw] md:right-[-12vw] bg-primary pointer-events-none size-[36vw] min-h-75 min-w-75 rounded-full blur-[8rem] lg:blur-[12rem] opacity-40"></div>
      </div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="container max-w-2xl text-center px-4">
        <div className="mb-14">
          <Link href={routes.home} className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-amber-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
                Billionaire's Blueprint
              </span>
            </Link>
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-amber-400 to-blue-400 bg-clip-text text-transparent">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href={routes.home}
              className={buttonVariants({
                variant: "primary",
                size: "xl",
                textSize: "xl",
                className: "border-0 text-white group px-8 py-4 bg-gradient-to-r from-blue-600 to-amber-600 rounded-lg font-bold text-lg hover:scale-105 transition-all duration-200 shadow-2xl shadow-blue-500/50 hover:shadow-amber-500/50"
              })}
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
