import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { loadSiteSettings } from "@/sanity/fetch";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await loadSiteSettings();

  return (
    <>
      {/* Header stays outside the smoother so it can remain fixed */}
      <SiteHeader registrationUrl={settings.registrationUrl ?? undefined} />
      <SmoothScroll>
        <main>{children}</main>
        <SiteFooter
          instagramUrl={settings.instagramUrl ?? undefined}
          facebookUrl={settings.facebookUrl ?? undefined}
          contactEmail={settings.contactEmail ?? undefined}
          registrationUrl={settings.registrationUrl ?? undefined}
        />
      </SmoothScroll>
    </>
  );
}
