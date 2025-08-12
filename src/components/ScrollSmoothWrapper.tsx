"use client";

import { useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

export default function ScrollSmoothWrapper({ children }: { children: ReactNode }) {

  useEffect(() => {
    ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: window.innerWidth >= 768,
    });

  }, []);

  return (
    <div id="smooth-wrapper" >
      <div id="smooth-content">
        {children}
      </div>
    </div>
  );
}
