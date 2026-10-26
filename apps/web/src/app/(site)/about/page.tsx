import { AboutPage } from "@/features/about/components/AboutPage";
import { aboutMetadata } from "@/features/about/seo";
import { getAboutPage } from "@/features/about/services/aboutRepository";

export const generateMetadata = async () => aboutMetadata(await getAboutPage());

const About = () => (
  <main className="flex-1 bg-page">
    <AboutPage />
  </main>
);

export default About;
