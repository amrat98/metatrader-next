"use client";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { CheckCheck } from "lucide-react";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { FadeBlock } from "../fadeanimation";

export default function WorkSection() {
  return (
    <>
    <section className="py-8 xl:py-12">
        <div className="container">
          <FadeBlock delay={0.1} className="section_inner text-center md:text-right max-w-2xl ml-auto">
            <span className="font-michroma text-primary uppercase text-sm tracking-widest">At IBC</span>
            <p className="text-base mt-2 text-muted-foreground leading-6">
              Our PAMM-driven model lets you grow your wealth securely and passively while our experts manage your portfolio to achieve optimal returns.
            </p>
          </FadeBlock>
          <div className="flex flex-col lg:flex-row gap-5 items-center mt-10">
            <FadeBlock delay={0.2}  className="section_header text-left flex-1/2">
              <h2 className="font-michroma text-3xl">
                Why IBC PAMM is the Right Choice for Your Investments?
              </h2>
              <div className="flex gap-2">
                <CheckCheck className="text-primary size-8 min-w-8" />
                <div>
                  <h4 className="text-xl font-semibold">Effortless Passive Income:</h4>
                  <p className="text-muted-foreground mt-1">Earn without day-to-day trading involvement.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <CheckCheck className="text-primary size-8 min-w-8" />
                <div>
                  <h4 className="text-xl font-semibold">AI + Expert Trading:</h4>
                  <p className="text-muted-foreground mt-1">Automated intelligence backed by professional expertise.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <CheckCheck className="text-primary size-8 min-w-8" />
                <div>
                  <h4 className="text-xl font-semibold">Risk Management & Fund Protection:</h4>
                  <p className="text-muted-foreground mt-1">Advanced strategies built to protect your capital.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <CheckCheck className="text-primary size-8 min-w-8" />
                <div>
                  <h4 className="text-xl font-semibold">Diversified Markets:</h4>
                  <p className="text-muted-foreground mt-1">Trading across Forex, Commodities, Metals, and Cryptocurrencies.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <CheckCheck className="text-primary size-8 min-w-8" />
                <div>
                  <h4 className="text-xl font-semibold">No Hidden Charges:</h4>
                  <p className="text-muted-foreground mt-1">Fully transparent fee structure with no extra costs.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <CheckCheck className="text-primary size-8 min-w-8" />
                <div>
                  <h4 className="text-xl font-semibold">Flexible Withdrawals:</h4>
                  <p className="text-muted-foreground mt-1">Withdraw your profits conveniently every week.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 border-l-2 border-primary pl-4">
                <div className="flex flex-col gap-1">
                  <span className="font-michroma text-white text-3xl">
                    Secure<span className="size-1.5 inline-block ml-0.5 bg-primary"></span>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-michroma text-white text-3xl">
                    Stable<span className="size-1.5 inline-block ml-0.5 bg-primary"></span>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-michroma text-white text-3xl">
                    Profitable<span className="size-1.5 inline-block ml-0.5 bg-primary"></span>
                  </span>
                </div>
              </div>
              <div className="mt-10">
                <Link
                  href={routes.login}
                  className="inline-flex py-3 px-12 whitespace-nowrap items-center text-lg uppercase font-semibold border border-dashed bg-sky-400/10 text-primary border-primary relative hover:bg-sky-400/30"
                >
                  Start Investing
                  <div className="animate-corner size-2 border-t-2 border-l-2 border-primary absolute -top-[var(--corner)] -left-[var(--corner)]"></div>
                  <div className="animate-corner size-2 border-t-2 border-r-2 border-primary absolute -top-[var(--corner)] -right-[var(--corner)]"></div>
                  <div className="animate-corner size-2 border-b-2 border-l-2 border-primary absolute -bottom-[var(--corner)] -left-[var(--corner)]"></div>
                  <div className="animate-corner size-2 border-b-2 border-r-2 border-primary absolute -bottom-[var(--corner)] -right-[var(--corner)]"></div>
                </Link>
              </div>
            </FadeBlock>
            <FadeBlock delay={0.2}  className="flex-1/2">
              <Image
                className="w-full mx-auto lg:mr-0"
                src="/new/image-1.svg"
                alt="Forex Portfolio Management"
                width={760}
                height={760}
                priority
              />
            </FadeBlock>
          </div>
        </div>
    </section>
    <section className="py-8 xl:py-12">
      <div className="container">
        <FadeBlock delay={0.2} className="section_inner text-center md:text-right max-w-2xl ml-auto">
          <span className="font-michroma text-primary uppercase text-sm tracking-widest">At IBC</span>
          <p className="text-base mt-2 text-muted-foreground leading-6">
            Take the stress out of investing with IBC’s PAMM solution—automated, expertly managed, and focused on delivering steady, long-term growth for your portfolio.
          </p>
        </FadeBlock>
        <div className="flex flex-col lg:flex-row gap-5 items-center mt-10">
          <FadeBlock delay={0.2} className="flex-1/2">
            <Image
              className="w-full mx-auto lg:ml-0"
              src="/new/image-2.svg"
              alt="IBC PAMM Trading Solutions"
              width={760}
              height={760}
              priority
            />
          </FadeBlock>
          <FadeBlock delay={0.2} className="section_header text-right flex-1/2">
            <h2 className="font-michroma text-3xl">
              Why IBC PAMM Stands Out for Smart Investors
            </h2>

            <div className="flex gap-2 flex-row-reverse">
              <CheckCheck className="text-primary size-8 min-w-8" />
              <div>
                <h4 className="text-xl font-semibold">Hands-Free Earnings</h4>
                <p className="text-muted-foreground mt-1">Generate income effortlessly with expert-managed trades.</p>
              </div>
            </div>

            <div className="flex gap-2 flex-row-reverse">
              <CheckCheck className="text-primary size-8 min-w-8" />
              <div>
                <h4 className="text-xl font-semibold">AI + Human Expertise</h4>
                <p className="text-muted-foreground mt-1">Advanced technology combined with professional insights.</p>
              </div>
            </div>

            <div className="flex gap-2 flex-row-reverse">
              <CheckCheck className="text-primary size-8 min-w-8" />
              <div>
                <h4 className="text-xl font-semibold">Built-In Risk Protection</h4>
                <p className="text-muted-foreground mt-1">Strategic risk management for safer capital growth.</p>
              </div>
            </div>

            <div className="flex gap-2 flex-row-reverse">
              <CheckCheck className="text-primary size-8 min-w-8" />
              <div>
                <h4 className="text-xl font-semibold">Diverse Trading Assets</h4>
                <p className="text-muted-foreground mt-1">Access Forex, Metals, Commodities, and Cryptocurrencies.</p>
              </div>
            </div>

            <div className="flex gap-2 flex-row-reverse">
              <CheckCheck className="text-primary size-8 min-w-8" />
              <div>
                <h4 className="text-xl font-semibold">Clear & Fair Pricing</h4>
                <p className="text-muted-foreground mt-1">No hidden charges—just full transparency.</p>
              </div>
            </div>

            <div className="flex gap-2 flex-row-reverse">
              <CheckCheck className="text-primary size-8 min-w-8" />
              <div>
                <h4 className="text-xl font-semibold">Fast Weekly Withdrawals</h4>
                <p className="text-muted-foreground mt-1">Enjoy quick, stress-free access to your profits every week.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 border-r-2 border-primary pr-4 justify-end">
              <div className="flex flex-col gap-1">
                <span className="font-michroma text-white text-3xl">
                  Secure<span className="size-1.5 inline-block ml-0.5 bg-primary"></span>
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-michroma text-white text-3xl">
                  Stable<span className="size-1.5 inline-block ml-0.5 bg-primary"></span>
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-michroma text-white text-3xl">
                  Profitable<span className="size-1.5 inline-block ml-0.5 bg-primary"></span>
                </span>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href={routes.login}
                className="inline-flex py-3 px-12 whitespace-nowrap items-center text-lg uppercase font-semibold border border-dashed bg-sky-400/10 text-primary border-primary relative hover:bg-sky-400/30"
              >
                Start Investing Today
                <div className="animate-corner size-2 border-t-2 border-l-2 border-primary absolute -top-[var(--corner)] -left-[var(--corner)]"></div>
                <div className="animate-corner size-2 border-t-2 border-r-2 border-primary absolute -top-[var(--corner)] -right-[var(--corner)]"></div>
                <div className="animate-corner size-2 border-b-2 border-l-2 border-primary absolute -bottom-[var(--corner)] -left-[var(--corner)]"></div>
                <div className="animate-corner size-2 border-b-2 border-r-2 border-primary absolute -bottom-[var(--corner)] -right-[var(--corner)]"></div>
              </Link>
            </div>
          </FadeBlock>
        </div>
      </div>
    </section>
    </>
  );
}
