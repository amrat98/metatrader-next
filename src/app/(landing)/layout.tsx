"use client";

import { useEffect, useState } from "react";
import { Navigation } from './sections/navigation';
import { Footer } from './sections/footer';

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <>
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
        <Navigation scrollY={scrollY} />
        { children }
        <Footer />
    </div>
    </>
  );
}