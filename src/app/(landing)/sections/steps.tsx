"use client";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { CheckCheck } from "lucide-react";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { FadeBlock } from "../fadeanimation";

export default function StepSection() {
  return (
    <>
    <section className="py-8 xl:py-12">
        <div className="container">
          <FadeBlock delay={0.1} className="section_inner text-center md:text-left max-w-2xl">
            <span className="font-michroma text-primary uppercase text-sm tracking-widest">How</span>
            <h2 className="font-michroma text-3xl">IBC Works</h2>
          </FadeBlock>

          <div className="flex flex-col gap-10 mt-10">
            <FadeBlock delay={0.1} direction={"left"} className="flex flex-col sm:flex-row max-w-3xl gap-8 items-start sm:items-center">
              <div className="py-5 px-10 bg-sky-600 text-white font-michroma text-2xl lg:text-3xl whitespace-nowrap relative">Step 1</div>
              <div>
                <h4 className="text-xl font-semibold">Create Your Account</h4>
                <p className="text-muted-foreground mt-1">
                  Sign up on the IBC platform and verify your profile to get started quickly and securely.
                </p>
              </div>
            </FadeBlock>

            <FadeBlock delay={0.1} direction={"left"} className="flex flex-col sm:flex-row max-w-3xl gap-8 items-start sm:items-center lg:ml-[5%]">
              <div className="py-5 px-10 bg-sky-600 text-white font-michroma text-2xl lg:text-3xl whitespace-nowrap relative">Step 2</div>
              <div>
                <h4 className="text-xl font-semibold">Link Your Trading Account</h4>
                <p className="text-muted-foreground mt-1">
                  Connect to our PAMM system—no direct fund transfers to IBC required.
                </p>
              </div>
            </FadeBlock>

            <FadeBlock delay={0.1} direction={"left"} className="flex flex-col sm:flex-row max-w-3xl gap-8 items-start sm:items-center lg:ml-[10%]">
              <div className="py-5 px-10 bg-sky-600 text-white font-michroma text-2xl lg:text-3xl whitespace-nowrap relative">Step 3</div>
              <div>
                <h4 className="text-xl font-semibold">Let Experts Trade For You</h4>
                <p className="text-muted-foreground mt-1">
                  Our AI-powered strategies and expert traders handle everything to maximize your returns.
                </p>
              </div>
            </FadeBlock>

            <FadeBlock delay={0.1} direction={"left"} className="flex flex-col sm:flex-row max-w-3xl gap-8 items-start sm:items-center lg:ml-[15%]">
              <div className="py-5 px-10 bg-sky-600 text-white font-michroma text-2xl lg:text-3xl whitespace-nowrap relative">Step 4</div>
              <div>
                <h4 className="text-xl font-semibold">Track & Withdraw Profits</h4>
                <p className="text-muted-foreground mt-1">
                  Monitor your performance in real-time and withdraw your earnings anytime with ease.
                </p>
              </div>
            </FadeBlock>
          </div>
        </div>
      </section>

      <FadeBlock delay={0.2} className="container pt-5 pb-8 xl:pb-12 flex justify-center items-center">
        <div className="w-full max-w-5xl border p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative bg-sky-400/10 backdrop-blur-xs">
          <div>
            <span className="font-michroma text-primary uppercase text-sm tracking-widest">
              Simple. Secure. Profitable.
            </span>
            <h2 className="text-3xl font-normal font-michroma">
              Kickstart Your Trading Journey with IBC Today!
            </h2>
          </div>
          <Link
            href={routes.login}
            className="px-6 py-3 border border-dashed border-primary bg-sky-400/5 relative text-lg font-semibold text-primary hover:bg-sky-400/30 whitespace-nowrap"
          >
            Join Now
            <div className="animate-corner size-2 border-t-2 border-l-2 border-primary absolute -top-[var(--corner)] -left-[var(--corner)]"></div>
            <div className="animate-corner size-2 border-t-2 border-r-2 border-primary absolute -top-[var(--corner)] -right-[var(--corner)]"></div>
            <div className="animate-corner size-2 border-b-2 border-l-2 border-primary absolute -bottom-[var(--corner)] -left-[var(--corner)]"></div>
            <div className="animate-corner size-2 border-b-2 border-r-2 border-primary absolute -bottom-[var(--corner)] -right-[var(--corner)]"></div>
          </Link>
          <div className="size-4 border-t-4 border-l-4 border-primary absolute -top-1 -left-1"></div>
          <div className="size-4 border-t-4 border-r-4 border-primary absolute -top-1 -right-1"></div>
          <div className="size-4 border-b-4 border-l-4 border-primary absolute -bottom-1 -left-1"></div>
          <div className="size-4 border-b-4 border-r-4 border-primary absolute -bottom-1 -right-1"></div>
        </div>
      </FadeBlock>

      <FadeBlock delay={0.2} className="container pt-5 pb-8 xl:pb-12 flex justify-center items-center">
        <div className="w-full max-w-5xl bg-card/60 backdrop-blur-xs border p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative">
          <div className="flex flex-col items-start">
            <span className="font-michroma text-primary uppercase text-sm tracking-widest">
              With IBC
            </span>
            <p className="text-base mt-4">
              Access expert-managed global forex markets, powered by AI-driven strategies and professional traders, delivering consistent and sustainable returns.
            </p>
            <Link
              href={routes.login}
              className="mt-8 px-6 py-3 border border-dashed border-primary bg-sky-400/5 relative text-lg font-semibold text-primary hover:bg-sky-400/30 whitespace-nowrap"
            >
              Start Now
              <div className="animate-corner size-2 border-t-2 border-l-2 border-primary absolute -top-[var(--corner)] -left-[var(--corner)]"></div>
              <div className="animate-corner size-2 border-t-2 border-r-2 border-primary absolute -top-[var(--corner)] -right-[var(--corner)]"></div>
              <div className="animate-corner size-2 border-b-2 border-l-2 border-primary absolute -bottom-[var(--corner)] -left-[var(--corner)]"></div>
              <div className="animate-corner size-2 border-b-2 border-r-2 border-primary absolute -bottom-[var(--corner)] -right-[var(--corner)]"></div>
            </Link>
          </div>
          <div className="size-4 border-t-4 border-l-4 border-primary absolute -top-1 -left-1"></div>
          <div className="size-4 border-t-4 border-r-4 border-primary absolute -top-1 -right-1"></div>
          <div className="size-4 border-b-4 border-l-4 border-primary absolute -bottom-1 -left-1"></div>
          <div className="size-4 border-b-4 border-r-4 border-primary absolute -bottom-1 -right-1"></div>
        </div>
      </FadeBlock>
    </>
  );
}
