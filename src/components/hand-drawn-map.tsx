function PinIcon({ type }: { type: string }) {
  switch (type) {
    case "parcheggio":
      return <span>P</span>;
    case "info":
      return <span>i</span>;
    case "ritrovo":
      return (
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 3v18" />
          <path d="M5 4h11l-2 4 2 4H5" />
        </svg>
      );
    case "blocco":
      return (
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 19l6-10 4 6 2-3 6 7z" />
        </svg>
      );
    case "trasporti":
      return (
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="6" width="18" height="10" rx="2" />
          <circle cx="7.5" cy="18" r="1.3" />
          <circle cx="16.5" cy="18" r="1.3" />
          <path d="M3 11h18" />
        </svg>
      );
    case "ristoro":
      return (
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2v7a2 2 0 004 0V2M8 9v13M17 2c-1.7 0-3 2-3 5s1.3 5 3 5v9" />
        </svg>
      );
    default:
      return null;
  }
}

const TYPE_COLOR: Record<string, string> = {
  parcheggio: "var(--color-ink)",
  ritrovo: "var(--color-blue)",
  blocco: "var(--color-accent)",
  info: "var(--color-yellow)",
  ristoro: "var(--color-card)",
  trasporti: "var(--color-blue)",
};

const TYPE_TEXT_COLOR: Record<string, string> = {
  info: "var(--color-ink)",
};

export function HandDrawnMap({
  points,
}: {
  points: {
    _id: string;
    label: string;
    type: string;
    description?: string | null;
    x?: number | null;
    y?: number | null;
  }[];
}) {
  const placed = points.filter(
    (p) => typeof p.x === "number" && typeof p.y === "number",
  );

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border-2 border-ink/15 bg-white shadow-inner sm:aspect-[4/3]">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <filter id="wobble">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.02"
                numOctaves="2"
                result="noise"
                seed="7"
              />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" />
            </filter>
          </defs>

          <rect width="100" height="100" fill="var(--color-white)" />

          {/* dotted paper grid */}
          {Array.from({ length: 10 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={5 + col * 10}
                cy={5 + row * 10}
                r="0.4"
                fill="var(--color-ink)"
                opacity="0.08"
              />
            )),
          )}

          {/* park blob */}
          <path
            d="M38 34 C48 26 62 28 66 38 C70 48 64 58 52 58 C40 58 30 44 38 34 Z"
            fill="var(--color-blue)"
            opacity="0.22"
            filter="url(#wobble)"
          />

          {/* streets */}
          <path
            d="M0 62 C20 58 35 66 50 60 C68 53 82 66 100 60"
            stroke="var(--color-ink)"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.3"
            filter="url(#wobble)"
          />
          <path
            d="M18 100 C24 80 30 60 46 40 C56 28 60 18 58 0"
            stroke="var(--color-ink)"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.3"
            filter="url(#wobble)"
          />

          {/* dashed suggested route between first two points */}
          {placed.length > 1 &&
          typeof placed[0].x === "number" &&
          typeof placed[1].x === "number" ? (
            <path
              d={`M${placed[0].x} ${placed[0].y} Q${(placed[0].x! + placed[1].x!) / 2} ${Math.min(placed[0].y!, placed[1].y!) - 12} ${placed[1].x} ${placed[1].y}`}
              stroke="var(--color-yellow)"
              strokeWidth="1"
              strokeDasharray="2.5 2.5"
              strokeLinecap="round"
              fill="none"
              filter="url(#wobble)"
            />
          ) : null}

          {/* little mountains, echoing the valley setting */}
          <path
            d="M2 20 L10 6 L16 16 L22 4 L30 20 Z"
            fill="var(--color-ink)"
            opacity="0.16"
            filter="url(#wobble)"
          />

          {/* compass */}
          <g transform="translate(88 10)" opacity="0.55">
            <circle
              r="6"
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="0.6"
            />
            <path d="M0 -6 L1.4 0 L0 6 L-1.4 0 Z" fill="var(--color-blue)" />
            <text
              y="-8"
              textAnchor="middle"
              fontFamily="var(--font-sans)"
              fontWeight="700"
              fontSize="4"
              fill="var(--color-ink)"
            >
              N
            </text>
          </g>
        </svg>

        {placed.map((point) => (
          <div
            key={point._id}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-sm font-bold shadow-md"
              style={{
                background: TYPE_COLOR[point.type] ?? "var(--color-ink)",
                color: TYPE_TEXT_COLOR[point.type] ?? "var(--color-white)",
              }}
              title={point.label}
            >
              <PinIcon type={point.type} />
            </div>
          </div>
        ))}
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {placed.map((point) => (
          <li
            key={point._id}
            className="flex items-start gap-3 rounded-xl border-2 border-ink/10 bg-white p-3"
          >
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              style={{
                background: TYPE_COLOR[point.type] ?? "var(--color-ink)",
                color: TYPE_TEXT_COLOR[point.type] ?? "var(--color-white)",
              }}
            >
              <PinIcon type={point.type} />
            </span>
            <div>
              <p className="font-display text-sm tracking-wide text-ink">
                {point.label}
              </p>
              {point.description ? (
                <p className="text-sm text-ink/70">{point.description}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
