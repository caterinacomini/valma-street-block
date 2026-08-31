"use client";

import { useEffect, useState } from "react";

/**
 * Shown only while an edition is actually postponed, and only until the reader
 * has taken it in: the hero already carries the news, so this exists to catch
 * whoever lands deeper in the page or arrives certain of the old date.
 *
 * It waits for the loader to clear rather than racing it, rises from the bottom
 * so it never fights the fixed header, and remembers being dismissed — keyed by
 * the message, so a later change of plan speaks up again to someone who had
 * already waved the last one away.
 */
export function PostponedBanner({
  note,
  newDate,
}: {
  note: string;
  newDate?: string;
}) {
  const [state, setState] = useState<"hidden" | "in" | "out">("hidden");
  const key = `vsb-postponed:${note}|${newDate ?? ""}`;

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(key) === "1";
    } catch {
      /* private windows and blocked storage: just show it */
    }
    if (dismissed) return;

    const timer = setTimeout(() => setState("in"), 2600);
    return () => clearTimeout(timer);
  }, [key]);

  if (state === "hidden") return null;

  const close = () => {
    setState("out");
    try {
      window.localStorage.setItem(key, "1");
    } catch {
      /* nothing to remember it with; it will show again next time */
    }
  };

  return (
    <div
      role="status"
      className={`fixed inset-x-3 bottom-3 z-[60] transition-all duration-500 ease-out motion-reduce:transition-none sm:inset-x-5 sm:bottom-5 ${
        state === "in"
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-4 rounded-2xl bg-blue px-4 py-3.5 text-ink shadow-2xl sm:px-6 sm:py-4">
        <p className="min-w-0 flex-1 text-sm leading-snug font-bold sm:text-base">
          {note}
          {newDate ? (
            <span className="block font-display text-lg tracking-wide sm:text-xl">
              Nuova data: {newDate}
            </span>
          ) : null}
        </p>
        <button
          type="button"
          onClick={close}
          aria-label="Chiudi l'avviso"
          className="shrink-0 rounded-full p-2 transition hover:bg-ink/10 focus-visible:ring-2 focus-visible:ring-ink focus-visible:outline-none"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 4l10 10M14 4L4 14"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
