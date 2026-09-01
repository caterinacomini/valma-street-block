"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export type FaqCategory = {
  title: string;
  items: { question: string; answer: string }[];
};

export function RegulationFaq({ categories }: { categories: FaqCategory[] }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openItem, setOpenItem] = useState<number | null>(0);

  const current = categories[activeCategory];

  if (!current) return null;

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-20">
      {/* Categories */}
      <nav className="h-fit rounded-3xl border border-ink/25 px-4 py-5 lg:sticky lg:top-28">
        <ul className="flex flex-col gap-1">
          {categories.map((category, index) => {
            const isActive = index === activeCategory;
            return (
              <li key={category.title}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory(index);
                    setOpenItem(0);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-semibold tracking-wide uppercase transition ${
                    isActive
                      ? "bg-ink text-white"
                      : "text-ink/75 hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  {category.title}
                  <ChevronRight size={16} className="shrink-0" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Questions */}
      <div>
        {current.items.map((item, index) => {
          const isOpen = openItem === index;
          return (
            <div key={item.question} className="border-b border-ink/15">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenItem(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="font-display text-xl tracking-wide text-ink sm:text-2xl">
                    {item.question}
                  </span>
                  <ChevronDown size={22} aria-hidden="true" />
                </button>
              </h3>
              {isOpen ? (
                <p className="pb-6 text-base leading-relaxed text-ink/75 sm:text-lg">
                  {item.answer}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
