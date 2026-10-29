import { AboutPage } from "@/features/about/components/AboutPage";
import { aboutMetadata } from "@/features/about/seo";
import { getAboutPage } from "@/features/about/services/aboutRepository";
import { PageSchemasJsonLd } from "@/features/seo/PageSchemasJsonLd";
import { withSiteShareImage } from "@/features/seo/withSiteShareImage";

export const generateMetadata = async () => withSiteShareImage(aboutMetadata(await getAboutPage()));

const About = () => (
  <main className="flex-1 bg-page">
    <PageSchemasJsonLd kind="page" slug="about" />
    <AboutPage />
  </main>
);

export default About;
