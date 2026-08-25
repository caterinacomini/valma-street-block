export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow ? (
        <p className="text-sm font-bold text-blue">{eyebrow}</p>
      ) : null}
      <h2 className="mt-1 font-display text-3xl tracking-wide text-ink sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base text-ink/70">{description}</p>
      ) : null}
    </div>
  );
}
