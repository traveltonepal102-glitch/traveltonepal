import type { Metadata } from "next";

import { HomePage } from "@/features/home/components/HomePage";
import { homeMetadata } from "@/features/home/seo";
import { getHomeData } from "@/features/home/services/homeRepository";

export const generateMetadata = async (): Promise<Metadata> => homeMetadata((await getHomeData()).seo);

const Home = async () => <HomePage data={await getHomeData()} />;

export default Home;
