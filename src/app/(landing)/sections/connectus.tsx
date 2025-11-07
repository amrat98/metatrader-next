"use client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { routes } from "@/lib/routes";

export default function ConnectSection() {
  return (
    <>
    <section className="container pt-5 pb-8 xl:pb-12 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-card border p-10 flex flex-wrap items-center justify-between gap-4 relative">
        <div>
          <h2 className="text-3xl font-normal font-michroma">Connect with the community!</h2>
          <p className="text-base mt-4">Feel free to ask questions, report issues, and meet new people.</p>
        </div>
        <Link href={routes.login} className="px-6 py-3 border border-dashed border-primary bg-sky-400/5 relative text-lg font-semibold text-primary hover:bg-sky-400/30">
        Join the #IBC Community!
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
    </section>
    </>
  );
}
