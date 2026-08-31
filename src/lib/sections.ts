/**
 * The sections an editor can reorder and switch off, in the order the page
 * shows them when nobody has said otherwise. One list, so the page, the menu
 * and the footer can never disagree about what exists or what it is called.
 *
 * Sponsors are not here: they sit after the closing card, which is the page's
 * ending, and moving them would move that. They can still be switched off.
 */
export const MOVABLE_SECTIONS = [
  { id: "programma", label: "Programma", anchor: "#programma" },
  { id: "comeArrivare", label: "Come arrivare", anchor: "#come-arrivare" },
  { id: "edizioniPassate", label: "Edizioni passate", anchor: "#edizioni-passate" },
  { id: "regolamento", label: "Regolamento", anchor: "#regolamento" },
] as const;

export type SectionId = (typeof MOVABLE_SECTIONS)[number]["id"];

export type SectionChoice = { section: SectionId; visible?: boolean };

export type NavLink = { href: string; label: string };

/**
 * What the editor asked for, reconciled with what actually exists: unknown ids
 * are dropped, duplicates ignored, and anything they never mentioned is kept at
 * the end and visible. A half-filled list can hide a section but never lose one.
 */
export function resolveSections(choices?: SectionChoice[] | null) {
  const known = new Map(MOVABLE_SECTIONS.map((s) => [s.id, s]));
  const seen = new Set<SectionId>();
  const ordered: { id: SectionId; label: string; anchor: string; visible: boolean }[] = [];

  for (const choice of choices ?? []) {
    const section = known.get(choice.section);
    if (!section || seen.has(section.id)) continue;
    seen.add(section.id);
    ordered.push({ ...section, visible: choice.visible !== false });
  }
  for (const section of MOVABLE_SECTIONS) {
    if (!seen.has(section.id)) ordered.push({ ...section, visible: true });
  }
  return ordered;
}

/** Menu entries for the sections that are actually on the page, in page order. */
export function navLinksFor(
  choices?: SectionChoice[] | null,
  extra: NavLink[] = [],
): NavLink[] {
  return [
    ...resolveSections(choices)
      .filter((s) => s.visible)
      .map((s) => ({ href: s.anchor, label: s.label })),
    ...extra,
  ];
}
