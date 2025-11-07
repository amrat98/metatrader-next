// components/PageLoader.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export const PageLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const start = Date.now();

    const handleLoad = () => {
      const now = Date.now();
      const elapsed = now - start;
      const remaining = Math.max(3000 - elapsed, 0); // minimum 5s

      setTimeout(() => {
        setLoaded(true);
        onComplete();
      }, remaining);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, [onComplete]);

  if (!loaded) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col gap-10 items-center justify-center bg-background">
        <Image
        className="w-full h-full object-cover fixed -z-[1] top-0 left-0 opacity-20 mix-blend-difference"
        src="/new/image-5.jpg"
        alt="Mission and Vision"
        width={1000}
        height={760}
        priority
      />
        <div className="animate-spin h-12 w-12 border-t-2 border-sky-400 rounded-full" />
        <Image
              className="w-full max-w-50 "
              src="/new-logo.png"
              alt="IBC"
              width={660}
              height={115}
            />
      </div>
    );
  }

  return null;
};
