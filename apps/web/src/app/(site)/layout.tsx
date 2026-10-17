import { SiteHeader } from "@/features/site-header/components/SiteHeader";

/**
 * Every page except home (which lays the overlay header over its hero photo) gets the solid header.
 * A route group: "(site)" is not part of the URL, so app/(site)/treks/page.tsx is /treks.
 */
const SiteLayout = ({ children }: LayoutProps<"/">) => (
  <>
    <SiteHeader />
    {children}
  </>
);

export default SiteLayout;
