"use client";
import Header from "./sections/header";
import Footer from "./sections/footer";
import HeroSection from "./sections/hero";
import StartupSection from "./sections/startup";


import VideoSection from "./sections/video";
import AboutSection from "./sections/about";
import WorkSection from "./sections/work";
import TradingSection from "./sections/trading";
import FaqSection from "./sections/faqs";
import ConnectSection from "./sections/connectus";
import StepSection from "./sections/steps";


import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {ArrowUp} from "lucide-react";
import Image from "next/image";
import { PageLoader } from "./PageLoader";
import { FadeBlock } from "./fadeanimation";


export default function Home() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [loaded, setLoaded] = useState(false);

  return (
    <>
     {!loaded && <PageLoader onComplete={() => setLoaded(true)} />}
      <div className="flex flex-col min-h-screen">
      <Image
        className="w-full h-full object-cover fixed -z-[1] top-0 left-0 opacity-20 mix-blend-difference"
        src="/new/image-5.jpg"
        alt="Mission and Vision"
        width={1000}
        height={760}
        priority
      />
      <FadeBlock delay={0} triggerAnimation={loaded}>
        <Header />
      </FadeBlock>
        <main className="flex-1 pt-20">
        <FadeBlock delay={0.1} triggerAnimation={loaded}>
          <HeroSection />
        </FadeBlock>
          <StartupSection />
          {/* <VideoSection /> */}
          <AboutSection />
          <WorkSection />
          <StepSection />
          {/* <TradingSection /> */}
          {/* <FaqSection /> */}
          {/* <ConnectSection /> */}
          {showScroll && (
            <Button
              onClick={scrollToTop}
              variant="primary"
              size="icon"
              className="fixed bottom-10 right-6 z-50 rounded-full p-1.5 w-auto h-auto hover:bg-background"
              aria-label="Scroll to top"
            >
              <ArrowUp className="size-6" />
            </Button>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
