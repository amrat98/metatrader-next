import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <>
      <div className="absolute w-full h-full z-[-1] overflow-hidden">
        <div className="absolute top-[-5rem] right-[-5rem] md:top-[-12vw] md:right-[-12vw] bg-primary pointer-events-none size-[36vw] min-h-75 min-w-75 rounded-full blur-[8rem] lg:blur-[12rem] opacity-40"></div>
      </div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="container max-w-2xl text-center px-4">
          <Image
            className="w-full max-w-40 xl:max-w-60 mx-auto mb-10"
            src="/logo.png"
            alt="IBC"
            width={336}
            height={80}
            priority
          />
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
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
