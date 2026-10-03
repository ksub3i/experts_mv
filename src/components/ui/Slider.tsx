"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { cx } from "@/lib/utils";

type SliderApi = { prev: () => void; next: () => void; index: number; count: number };
const SliderContext = createContext<SliderApi | null>(null);

/**
 * Accessible, user-driven carousel (no auto-rotation).
 * Slides are stacked in one grid cell so the region keeps the tallest height
 * and cross-fades between them. Arrow keys work when focus is inside.
 *
 * Controls: place <SliderControls /> anywhere inside a slide (inactive slides
 * are inert, so only the visible copy is reachable), or leave
 * `controlsClassName` set to render a default pair after the slides.
 *
 * Pass `ids` to make slides deep-linkable: visiting `#<id>` opens that slide.
 */
export function Slider({
  slides,
  label,
  ids,
  controlsClassName,
  className,
}: {
  slides: React.ReactNode[];
  label: string;
  ids?: string[];
  controlsClassName?: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const regionRef = useRef<HTMLElement>(null);
  const count = slides.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  // Deep-linking: open the slide matching the URL hash.
  useEffect(() => {
    if (!ids) return;
    let frame = 0;
    const sync = () => {
      const target = ids.indexOf(decodeURIComponent(window.location.hash.slice(1)));
      if (target < 0) return;
      setIndex(target);
      // Native hash scrolling is unreliable on first load (it's reset during
      // hydration), so scroll explicitly after the next frame.
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        requestAnimationFrame(() => regionRef.current?.scrollIntoView({ block: "start", behavior: "instant" })),
      );
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", sync);
    };
  }, [ids]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  return (
    <SliderContext.Provider value={{ prev, next, index, count }}>
      <section
        ref={regionRef}
        aria-roledescription="carousel"
        aria-label={label}
        onKeyDown={onKeyDown}
        className={cx("relative", className)}
      >
        {/* Anchor targets for deep links, so the browser scrolls to the slider. */}
        {ids?.map((id) => (
          <span key={id} id={id} className="absolute top-0" aria-hidden="true" />
        ))}

        <div className="grid grid-cols-1">
          {slides.map((slide, i) => {
            const active = i === index;
            return (
              <div
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={!active}
                inert={!active}
                className={cx(
                  "col-start-1 row-start-1 transition-opacity duration-500 ease-out",
                  active ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                {slide}
              </div>
            );
          })}
        </div>

        {controlsClassName && <SliderControls className={controlsClassName} />}

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Slide {index + 1} of {count}
        </p>
      </section>
    </SliderContext.Provider>
  );
}

export function SliderControls({ className }: { className?: string }) {
  const api = useContext(SliderContext);
  if (!api || api.count < 2) return null;
  const btn =
    "flex h-12 w-12 cursor-pointer items-center justify-center bg-accent text-on-accent transition-colors hover:bg-accent-strong";
  return (
    <div className={cx("flex gap-px", className)}>
      <button type="button" onClick={api.prev} className={btn} aria-label="Previous slide">
        <ArrowLeftIcon size={20} aria-hidden="true" />
      </button>
      <button type="button" onClick={api.next} className={btn} aria-label="Next slide">
        <ArrowRightIcon size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
