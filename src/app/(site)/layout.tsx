import { PostponedBanner } from "@/components/postponed-banner";
import { draftMode } from "next/headers";

import { navLinksFor } from "@/lib/sections";
import { VisualEditing } from "next-sanity/visual-editing";

import { ScrollReveals } from "@/components/scroll-reveals";
import { SiteLoader } from "@/components/site-loader";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { formatDateIt } from "@/lib/format";
import { loadSiteSettings } from "@/sanity/fetch";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await loadSiteSettings();
  const { isEnabled: preview } = await draftMode();
  /* Menu and footer read the same list the page renders from, so a section
     switched off cannot leave a link pointing at an anchor that is not there. */
  const links = navLinksFor(settings.sections);
  const footerNav =
    settings.showSponsors === false
      ? links
      : [...links, { href: "#sponsor", label: "Sponsor" }];

  return (
    <>
      <SiteLoader />
      {settings.postponed ? (
        <PostponedBanner
          note={settings.postponedNote || "Evento rinviato"}
          newDate={formatDateIt(settings.rainDate) ?? undefined}
        />
      ) : null}
      {/* Header stays outside the smoother so it can remain fixed */}
      <SiteHeader
        navLinks={links}
        registrationUrl={settings.registrationUrl ?? undefined}
        registrationOpen={settings.registrationOpen}
        registrationLabel={settings.registrationLabel}
        registrationClosedLabel={settings.registrationClosedLabel}
        instagramUrl={settings.instagramUrl ?? undefined}
        facebookUrl={settings.facebookUrl ?? undefined}
      />
      <SmoothScroll>
        <main className="site-in">{children}</main>
        <SiteFooter
          eventLinks={footerNav}
          instagramUrl={settings.instagramUrl ?? undefined}
          facebookUrl={settings.facebookUrl ?? undefined}
          contactEmail={settings.contactEmail ?? undefined}
          photoCredit={settings.photoCredit ?? undefined}
          registrationUrl={settings.registrationUrl ?? undefined}
          registrationOpen={settings.registrationOpen}
          registrationLabel={settings.registrationLabel}
          registrationClosedLabel={settings.registrationClosedLabel}
        />
        {/* Last child, so its effect runs once every section is mounted */}
        <ScrollReveals />
        {/* Only inside the Studio's preview pane: it paints the click-to-edit
            overlays and keeps the page in step with what is being typed. */}
        {preview ? <VisualEditing /> : null}
      </SmoothScroll>
    </>
  );
}
