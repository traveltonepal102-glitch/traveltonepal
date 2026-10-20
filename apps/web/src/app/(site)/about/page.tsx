import { AboutPage } from "@/features/about/components/AboutPage";
import { aboutMetadata } from "@/features/about/seo";

export const metadata = aboutMetadata;

const About = () => (
  <main className="flex-1 bg-page">
    <AboutPage />
  </main>
);

export default About;
