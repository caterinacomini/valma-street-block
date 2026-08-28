"use client";

import { useEffect, useState } from "react";

// Hand-set tilts, so the three letters sit like the painted mark rather than
// on a ruled baseline.
const MARK = [
  { char: "V", tilt: -4 },
  { char: "S", tilt: 3 },
  { char: "B", tilt: -2 },
];

/**
 * Covers the page until it has finished loading, then clears itself.
 *
 * The shell carries a delayed fade in CSS as a fallback, so the overlay lifts
 * even if this component never gets to run — a loader that can trap the page
 * behind it is worse than no loader. Marking it done just restarts the same
 * fade with no delay.
 */
export function SiteLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const finish = () => {
      if (!cancelled) setDone(true);
    };

    if (document.readyState === "complete") {
      const settle = setTimeout(finish, 1100);
      return () => {
        cancelled = true;
        clearTimeout(settle);
      };
    }

    window.addEventListener("load", finish);
    // never hold the page hostage to an asset that will not arrive
    const cap = setTimeout(finish, 3200);
    return () => {
      cancelled = true;
      window.removeEventListener("load", finish);
      clearTimeout(cap);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-ink ${
        done ? "loader-shell-done" : "loader-shell"
      }`}
    >
      <div className="grain pointer-events-none absolute inset-0 opacity-25 mix-blend-screen" />

      {/* Set in the display face rather than placed as an image: the mark has
          to hold up at 30vw, and the bitmap went soft well before that. */}
      <p className="relative -rotate-[7deg] font-display text-[30vw] leading-none text-yellow sm:text-[22vw] lg:text-[16vw]">
        {MARK.map((letter, i) => (
          <span
            key={letter.char}
            className="inline-block"
            style={{ transform: `rotate(${letter.tilt}deg)` }}
          >
            <span
              className={`inline-block ${
                done ? "loader-letter-out" : "loader-letter"
              }`}
              style={{ animationDelay: `${i * (done ? 0.14 : 0.18)}s` }}
            >
              {letter.char}
            </span>
          </span>
        ))}
      </p>
    </div>
  );
}
