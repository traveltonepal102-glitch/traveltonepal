import { AboutPage } from "@/features/about/components/AboutPage";
import { getAboutContent } from "@/features/about/services/aboutRepository";
import { PageSchemasJsonLd } from "@/features/site-pages/components/PageSchemasJsonLd";
import { sitePageMetadata } from "@/features/site-pages/seo";
import { ROUTES } from "@/lib/routes";

export const generateMetadata = async () => sitePageMetadata((await getAboutContent()).top, ROUTES.about);

const About = () => (
  <>
    <AboutPage />
    <PageSchemasJsonLd pages={[{ kind: "page", slug: "about" }]} />
  </>
);

export default About;
