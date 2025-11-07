// components/FadeBlock.tsx
"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface FadeBlockProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  triggerAnimation?: boolean;
}

export const FadeBlock = ({
  children,
  delay = 0,
  direction = "up",
  className,
  triggerAnimation = true,
}: FadeBlockProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 0.5,
    once: true,
  });

  const controls = useAnimation();

  const getOffset = () => {
    switch (direction) {
      case "up": return { y: 40, x: 0 };
      case "down": return { y: -40, x: 0 };
      case "left": return { x: 40, y: 0 };
      case "right": return { x: -40, y: 0 };
      default: return { y: 40, x: 0 };
    }
  };

  useEffect(() => {
    if (isInView && triggerAnimation) {
      controls.start("visible");
    }
  }, [isInView, triggerAnimation, controls]);

  const offset = getOffset();

  return (
    <motion.div
      ref={ref}
      className={clsx(className)}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {
          opacity: 0,
          x: offset.x,
          y: offset.y,
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: 0.4,
            delay,
            ease: "easeOut",
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};
