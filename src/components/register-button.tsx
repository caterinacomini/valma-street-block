const PADDING = {
  xs: "px-3.5 py-1.5 text-xs",
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-xl sm:text-2xl",
} as const;

const VARIANT = {
  solid: "bg-yellow text-ink hover:brightness-95",
  inverse: "bg-white text-blue hover:bg-white/90",
  dark: "bg-ink text-white hover:bg-ink/85",
} as const;

export function RegisterButton({
  registrationUrl,
  size = "md",
  variant = "solid",
  className = "",
}: {
  registrationUrl?: string;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "solid" | "inverse" | "dark";
  className?: string;
}) {
  return (
    <a
      href={registrationUrl || "#"}
      target={registrationUrl ? "_blank" : undefined}
      rel={registrationUrl ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center justify-center rounded-full ${PADDING[size]} ${VARIANT[variant]} font-sans font-bold tracking-wide whitespace-nowrap uppercase transition ${className}`}
    >
      Iscriviti ora
    </a>
  );
}
