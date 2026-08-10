"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Stagger, in ms, for items revealed as a group. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}

/**
 * Fades content up as it enters the viewport.
 *
 * Starts in the *visible* state and only hides itself once the observer is
 * confirmed working, so a browser that never runs this — or never fires the
 * observer — shows the page rather than a column of blanks.
 */
export function Reveal({ children, delay = 0, className = "", as = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<"idle" | "pending" | "shown">("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Already on screen at mount — no point animating what the visitor sees.
    const box = node.getBoundingClientRect();
    if (box.top < window.innerHeight * 0.92) {
      setState("shown");
      return;
    }

    setState("pending");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            window.setTimeout(() => setState("shown"), delay);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(node);

    /**
     * Failsafe. Now that this element has been hidden, the observer is the only
     * thing that can bring it back — so if it never fires, the content is gone
     * for good. That is not a theoretical worry in the Facebook in-app browser,
     * which requirements §4.7 flags as an unreliable rendering environment.
     * Showing the content a little early costs an animation; not showing it
     * costs the page.
     */
    const failsafe = window.setTimeout(() => {
      setState("shown");
      observer.disconnect();
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [delay]);

  const Tag = as;

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-reveal={state === "idle" ? undefined : state}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}
