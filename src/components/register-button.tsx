import { Lock } from "lucide-react";

/**
 * Three steps, one rule: `lg` for the full-screen moments where the button is
 * the only thing being asked (hero, open menu), `md` for a call to action
 * sitting inside a block of content, `sm` for the bar that is always there.
 * An `xs` step existed and was never used once — removed rather than left
 * around as a fourth choice nobody needed to make.
 */
const PADDING = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-xl sm:text-2xl",
} as const;

const VARIANT = {
  solid: "bg-yellow text-ink hover:brightness-95",
  inverse: "bg-white text-blue hover:bg-white/90",
  dark: "bg-ink text-white hover:bg-ink/85",
} as const;

/**
 * Closed styling is per variant because the grounds differ: `solid` only ever
 * sits on the dark photos and the blurred bar, so it closes in white — ink at
 * low opacity would disappear there.
 */
const CLOSED_VARIANT = {
  solid: "bg-white/15 text-white/85 backdrop-blur-sm",
  inverse: "bg-white/25 text-white/85",
  dark: "bg-white/15 text-white/75",
} as const;

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-bold tracking-wide whitespace-nowrap uppercase transition";

function Padlock() {
  return (
    <Lock size={16} className="shrink-0" aria-hidden="true" />
  );
}

export function RegisterButton({
  registrationUrl,
  open = false,
  label,
  closedLabel,
  size = "md",
  variant = "solid",
  className = "",
}: {
  registrationUrl?: string;
  open?: boolean;
  label?: string;
  closedLabel?: string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "inverse" | "dark";
  className?: string;
}) {
  const live = open && Boolean(registrationUrl);

  /**
   * Closed, this renders as text rather than a greyed-out button. A disabled
   * control tells a sighted reader nothing about why it will not respond, and
   * tells a screen reader nothing at all — so the state is carried by the words
   * and a padlock instead, and there is simply no link to press.
   */
  if (!live) {
    return (
      <span
        className={`${BASE} ${PADDING[size]} ${CLOSED_VARIANT[variant]} ${className}`}
      >
        <Padlock />
        {closedLabel || "Stay tuned"}
      </span>
    );
  }

  return (
    <a
      href={registrationUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${BASE} ${PADDING[size]} ${VARIANT[variant]} ${className}`}
    >
      {label || "Iscriviti ora"}
    </a>
  );
}
