import type { Metadata } from "next";

import { HomePage } from "@/features/home/components/HomePage";
import { homeMetadata } from "@/features/home/seo";
import { getHomeData } from "@/features/home/services/homeRepository";
import { PageSchemasJsonLd } from "@/features/site-pages/components/PageSchemasJsonLd";

export const generateMetadata = async (): Promise<Metadata> => homeMetadata((await getHomeData()).seo);

/** Home is the main trek: its own structured data blocks and the main trek's (whose own address moves here). */
const Home = async () => {
  const data = await getHomeData();
  return (
    <>
      <HomePage data={data} />
      <PageSchemasJsonLd pages={[{ kind: "page", slug: "home" }, ...(data.trekCard ? [{ kind: "trek" as const, slug: data.trekCard.slug }] : [])]} />
    </>
  );
};

export default Home;
