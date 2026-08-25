import { RegisterButton } from "./register-button";

const eventLinks = [
  { href: "#programma", label: "Programma" },
  { href: "#come-arrivare", label: "Come arrivare" },
  { href: "#regolamento", label: "Regolamento" },
  { href: "#edizioni-passate", label: "Edizioni passate" },
  { href: "#sponsor", label: "Sponsor" },
];

export function SiteFooter({
  instagramUrl,
  facebookUrl,
  contactEmail,
  registrationUrl,
}: {
  instagramUrl?: string;
  facebookUrl?: string;
  contactEmail?: string;
  registrationUrl?: string;
}) {
  const social = [
    instagramUrl ? { href: instagramUrl, label: "Instagram" } : null,
    facebookUrl ? { href: facebookUrl, label: "Facebook" } : null,
  ].filter((link) => link !== null);

  return (
    <footer className="bg-blue text-white">
      <div className="page-x pt-14 pb-10 sm:pt-20">
        {/* Oversized wordmark — sized off the available width (page-x margins
            subtracted) so it spans the column edge to edge at any viewport.
            7.3 is the measured width/font-size ratio of this string in Koulen;
            overflow-hidden guards the fallback font, which is wider. */}
        <div className="overflow-hidden">
          <p className="font-display leading-[0.8] tracking-[-0.01em] whitespace-nowrap text-yellow text-[calc((100vw-48px)/7.3)] sm:text-[calc((100vw-96px)/7.3)] lg:text-[calc((100vw-192px)/7.3)]">
            VALMA STREET BLOCK
          </p>
        </div>

        <div className="mt-4 flex items-end justify-between gap-6 border-t border-white/25 pt-3">
          <p className="text-xs tracking-wide text-white/70 uppercase sm:text-sm">
            Arrampicata urbana dal 2015
          </p>
          <p className="hidden text-xs tracking-wide text-white/70 uppercase sm:block sm:text-sm">
            Valmadrera · Lecco
          </p>
        </div>

        {/* Link columns */}
        <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <p className="font-display text-2xl leading-tight sm:text-3xl">
              Ci vediamo tra le vie
              <br />
              di Valmadrera
            </p>
            <div className="mt-5">
              <RegisterButton
                registrationUrl={registrationUrl}
                variant="dark"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
              Evento
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 text-base">
              {eventLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/85 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
              Social
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 text-base">
              {social.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/85 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/25 pt-6 sm:flex-row sm:items-center sm:justify-between">
          {contactEmail ? (
            <a
              href={`mailto:${contactEmail}`}
              className="text-sm font-medium transition hover:text-white/70 sm:text-base"
            >
              {contactEmail}
            </a>
          ) : null}
          <p className="text-xs text-white/70">
            Organizzato da CAI Valmadrera e OSA Valmadrera
          </p>
        </div>
      </div>
    </footer>
  );
}
