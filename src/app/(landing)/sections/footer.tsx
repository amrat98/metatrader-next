"use client";
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/lib/routes";
import { FadeBlock } from "../fadeanimation";

export default function Footer() {
  return (
    <footer className="bg-slate-800 py-10">
      <div className="container mb-20 flex flex-col lg:flex-row gap-5 justify-between">
        <div>
          <h3 className="text-lg text-primary">Connect</h3>
          <h4 className="text-2xl font-michroma mb-4">Let's Stay Connected</h4>
          <Link href={routes.home}>
            <Image
              className="w-full max-w-50 lg:max-w-100 "
              src="/new-logo.png"
              alt="IBC"
              width={660}
              height={115}
            />
          </Link>
        </div>
        <div className="lg:max-w-1/2">
        <h3 className="text-lg mb-2 font-semibold">Have questions or eager to know more?</h3>
        <p className="text-muted-foreground">Connect with us. We're here to guide you through the exciting world of IBC.</p>
        </div>
      </div>
      <div className="container flex flex-wrap flex-col sm:flex-row sm:flex-nowrap gap-3 justify-between items-center">
        <p className="text-xs md:text-sm text-muted-foreground">
          © 2025 IBC, All rights reserved.
        </p>
        <div className="flex gap-2 flex-wrap justify-center sm:justify-end text-xs md:text-sm text-muted-foreground">
          <Link href={routes.privacy} className="hover:underline">Privacy Policy</Link>
          <span>|</span>
          <Link href={routes.terms} className="hover:underline">Terms &amp; Conditions</Link>
          <span>|</span>
          <Link href={routes.userAgreement} className="hover:underline">User Agreement</Link>
        </div>
      </div>
    </footer>
  );
}
