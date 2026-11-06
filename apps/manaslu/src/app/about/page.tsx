import { AboutPage } from "@/features/about/components/AboutPage";
import { getAboutContent } from "@/features/about/services/aboutRepository";
import { sitePageMetadata } from "@/features/site-pages/seo";
import { ROUTES } from "@/lib/routes";

export const generateMetadata = async () => sitePageMetadata((await getAboutContent()).top, ROUTES.about);

const About = () => <AboutPage />;

export default About;
