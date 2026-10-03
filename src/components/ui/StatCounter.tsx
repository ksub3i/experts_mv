"use client";

import { useEffect, useRef, useState } from "react";
import type { Stat } from "@/lib/types";
import { cx } from "@/lib/utils";

/** Number that counts up once when scrolled into view (static under reduced motion). */
export function StatCounter({ stat, className, labelClassName }: { stat: Stat; className?: string; labelClassName?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(stat.value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1400;
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(Math.round(stat.value * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [stat.value]);

  return (
    <div ref={ref} className={className}>
      <p className="display text-[clamp(2.5rem,5vw,3.75rem)] tabular-nums">
        <span aria-hidden="true">
          {display}
          {stat.suffix}
        </span>
        <span className="sr-only">
          {stat.value}
          {stat.suffix}
        </span>
      </p>
      <p className={cx("eyebrow mt-2", labelClassName)}>{stat.label}</p>
    </div>
  );
}
