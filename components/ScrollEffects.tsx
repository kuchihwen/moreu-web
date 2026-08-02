"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal], [data-draw]"));
    const parallaxTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      revealTargets.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    revealTargets.forEach((element) => observer.observe(element));

    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      parallaxTargets.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
        const distance = rect.top + rect.height / 2 - window.innerHeight / 2;
        const shift = Math.max(-58, Math.min(58, distance * -0.075));
        element.style.setProperty("--parallax-shift", `${shift.toFixed(2)}px`);
      });
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateParallax);
    };
    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove("motion-ready");
    };
  }, [pathname]);

  return null;
}
