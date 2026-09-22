"use client";

import { MotionConfig, useReducedMotion } from "framer-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user" skipAnimations={reducedMotion ?? false}>
      {children}
    </MotionConfig>
  );
}
