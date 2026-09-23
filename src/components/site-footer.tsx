import { ArrowUpRight } from "lucide-react";

import type { NavLink } from "@/lib/sections";

import { RegisterButton } from "./register-button";



export function SiteFooter({
  contactEmail,
  contactEmailVisible,
  eventLinks,
  instagramUrl,
  facebookUrl,
  organizers,
  patronage,
  photoCredit,
  registrationUrl,
  registrationOpen,
  registrationLabel,
  registrationClosedLabel,
}: {
  contactEmail?: string;
  contactEmailVisible?: boolean;
  eventLinks: NavLink[];
  instagramUrl?: string;
  facebookUrl?: string;
  organizers?: string;
  patronage?: string;
  photoCredit?: string;
  registrationUrl?: string;
  registrationOpen?: boolean;
  registrationLabel?: string;
  registrationClosedLabel?: string;
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

        <div className="mt-1 flex items-end justify-between gap-6">
          <p className="text-xs tracking-wide text-white/70 uppercase sm:text-sm">
            Arrampicata urbana dal 2015
          </p>
          <p className="hidden text-xs tracking-wide text-white/70 uppercase sm:block sm:text-sm">
            Valmadrera · Lecco
          </p>
        </div>

        {/* Link columns */}
        <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-[3.75rem] sm:mt-8 sm:grid-cols-3 sm:gap-y-10 lg:grid-cols-4">
          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <p className="font-display text-2xl leading-tight sm:text-3xl">
              Ci vediamo tra le vie
              <br />
              di Valmadrera
            </p>
            <div className="mt-5">
              <RegisterButton
                registrationUrl={registrationUrl}
                open={registrationOpen}
                label={registrationLabel}
                closedLabel={registrationClosedLabel}
                variant="dark"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
              Evento
            </p>
            <ul className="mt-3 flex flex-col gap-1 text-base sm:mt-4 sm:gap-2.5">
              {eventLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex font-medium text-white/85 decoration-2 underline-offset-[6px] transition hover:underline sm:font-normal"
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
            <ul className="mt-3 flex flex-col gap-1 text-base sm:mt-4 sm:gap-2.5">
              {social.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 font-medium text-white/85 decoration-2 underline-offset-[6px] transition hover:underline sm:font-normal"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={14}
                      aria-hidden="true"
                      className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        {/* Who runs it and who backs it on the left, the photographers on the
            right. One rhythm for both columns, set by a gap rather than a
            margin per line: written on each paragraph, the two sides drifted
            to eight pixels and six. */}
        <div className="mt-9 flex flex-col gap-1.5 pt-6 text-xs text-white/70 sm:mt-14 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="flex flex-col gap-1.5">
            {contactEmail && contactEmailVisible ? (
              <a
                href={`mailto:${contactEmail}`}
                className="text-sm font-medium text-white decoration-2 underline-offset-[6px] transition hover:underline sm:text-base"
              >
                {contactEmail}
              </a>
            ) : null}
            {organizers ? <p>{organizers}</p> : null}
            {patronage ? <p>{patronage}</p> : null}
          </div>

          {photoCredit ? (
            <p className="sm:text-right">{photoCredit}</p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
