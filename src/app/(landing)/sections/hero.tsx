"use client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { routes } from "@/lib/routes";

import Spline from "@splinetool/react-spline"
import { FadeBlock } from "../fadeanimation";
import LightRays from '../LightRays';

export default function HeroSection() {
  return (
    <>
    <div className="fixed top-0 w-full h-dvh z-10 pointer-events-none">
      <LightRays
        raysOrigin="top-center"
        raysColor="#00ffff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="custom-rays"
      />
    </div>
    <section className="container pt-5 pb-8 xl:pb-12 min-h-[50vh] flex flex-col lg:flex-row justify-center items-center">
      <FadeBlock delay={0.1} direction="right" className="relative z-[1] text-center lg:text-left">
        <h2 className="text-3xl lg:text-4xl/12 font-michroma">
          Your Trusted <span className="text-primary">Global PAMM & Portfolio</span> Management Partner
        </h2>
      </FadeBlock>
      <FadeBlock delay={0.2} className="min-w-2/5 aspect-square relative lg:-right-[10%] pointer-events-none">
      <Spline
        scene="https://prod.spline.design/G2CMubq6VcssT1gZ/scene.splinecode" 
      />
      </FadeBlock>
      <FadeBlock delay={0.1} direction="left" className="text-center lg:text-right ml-auto relative z-[1]">
      <p className="text-base text-foreground font-semibold uppercase mt-4">
            Smarter Trading. Faster Growth. Secure Investments.
          </p>
          <p className="text-sm mt-4 text-foreground leading-6">
            Unlock the power of AI-driven trading precision and expert portfolio management with FX. 
            Our advanced PAMM model blends automated strategies with human expertise to deliver 
            consistent returns while keeping your capital safe and accessible.
          </p>
      </FadeBlock>
    </section>



    {/* <section className="container pt-5 pb-8 xl:pb-12 min-h-dvh flex justify-center">
      <FadeBlock delay={0.4} className="min-w-1/2 aspect-square">
      <Spline
        scene="https://prod.spline.design/G2CMubq6VcssT1gZ/scene.splinecode" 
      />
      </FadeBlock>
      <div className="">
        <h2 className="text-4xl/12 lg:text-5xl/14 xl:text-6xl/18 font-michroma text-center">
          Your Trusted <span className="text-primary">Global PAMM & Portfolio</span> Management Partner
        </h2>
        <div className="text-center md:text-right md:max-w-2/3 lg:max-w-1/2 ml-auto">
          <p className="text-base text-muted-foreground font-semibold uppercase mt-4">
            Smarter Trading. Faster Growth. Secure Investments.
          </p>
          <p className="text-sm mt-4 text-muted-foreground leading-6">
            Unlock the power of AI-driven trading precision and expert portfolio management with FX. 
            Our advanced PAMM model blends automated strategies with human expertise to deliver 
            consistent returns while keeping your capital safe and accessible. With no direct deposits 
            required, you retain full control of your funds while our professional traders work to 
            maximize your earnings. Enjoy seamless withdrawals, risk-mitigated strategies, and a 
            transparent investment experience designed for your financial success.
          </p>
        </div>
      </div>
    </section> */}
      <section className="container flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-8 text-center md:text-left">
      <FadeBlock delay={0.1} className="flex flex-col gap-1">
        <span className="font-michroma text-muted-foreground uppercase text-sm">Intelligent</span>
        <span className="font-michroma text-white text-3xl">
          Trading<span className="size-1.5 inline-block ml-0.5 bg-primary"></span>
        </span>
      </FadeBlock>
      <FadeBlock delay={0.1} className="flex flex-col gap-1">
        <span className="font-michroma text-muted-foreground uppercase text-sm">Reliable</span>
        <span className="font-michroma text-white text-3xl">
          Growth<span className="size-1.5 inline-block ml-0.5 bg-primary"></span>
        </span>
      </FadeBlock>
      <FadeBlock delay={0.1} className="flex flex-col gap-1">
        <span className="font-michroma text-muted-foreground uppercase text-sm">Optimized</span>
        <span className="font-michroma text-white text-3xl">
          Returns<span className="size-1.5 inline-block ml-0.5 bg-primary"></span>
        </span>
      </FadeBlock>
      <FadeBlock delay={0.2} className="mt-10 lg:mt-0 lg:ml-20">
        <Link
          href={routes.login}
          className="flex py-3 px-12 whitespace-nowrap items-center text-lg uppercase font-semibold border border-dashed bg-sky-400/10 text-primary border-primary relative hover:bg-sky-400/30"
        >
          Start Your PAMM Journey
          <div className="animate-corner size-2 border-t-2 border-l-2 border-primary absolute -top-[var(--corner)] -left-[var(--corner)]"></div>
          <div className="animate-corner size-2 border-t-2 border-r-2 border-primary absolute -top-[var(--corner)] -right-[var(--corner)]"></div>
          <div className="animate-corner size-2 border-b-2 border-l-2 border-primary absolute -bottom-[var(--corner)] -left-[var(--corner)]"></div>
          <div className="animate-corner size-2 border-b-2 border-r-2 border-primary absolute -bottom-[var(--corner)] -right-[var(--corner)]"></div>
        </Link>
      </FadeBlock>
    </section>
    {/*
    <section className="pt-5 pb-8 xl:pb-12">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 xl:gap-10 items-center">
          <div className="section_header lg:text-left flex-1/2">
            <h2 className="text-4xl/12 lg:text-5xl/14 xl:text-6xl/18 font-bold ">
              Welcome to <span className="text-primary">IBC</span> Grow Your
              Wealth with Confidence
            </h2>
            <p className="text-lg xl:text-xl font-semibold mt-4">
              Join a next-generation platform that combines Human expertise, and
              secure infrastructure to grow your money, passively and
              predictably.
            </p>
            <Link
              href={routes.register}
              className={buttonVariants({
                variant: "primary",
                size: null,
                textSize: null,
                className:
                  "max-w-fit mx-auto mt-3 lg:ml-0 h-14 xl:h-18 rounded-md px-8 xl:px-14 text-lg xl:text-2xl",
              })}
            >
              Start Investing Now
            </Link>
          </div>
          <div className="flex-1/2 relative">
            <Image
              className="w-full absolute scale-[1.35] top-[20%] right-[-22%]"
              src="/bull-bg.png"
              alt="Bull bg"
              width={1024}
              height={1024}
              priority
            />
            <Image
              className="w-full mx-auto lg:mr-0 relative z-[1]"
              src="/bull.png"
              alt="IBC Bull coin"
              width={1024}
              height={1024}
              priority
            />
          </div>
        </div>
      </div>
    </section>
    */}
    </>
  );
}
