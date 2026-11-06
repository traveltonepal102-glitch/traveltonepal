import type { Metadata } from "next";

import { pageMetadata } from "@/lib/pageMetadata";

import type { HomeSeo } from "./types";

/** The home page's tags: its Google result from Pages › Home. Home is the website's own entry, so "website", not "article". */
export const homeMetadata = ({ title, description, shareImageBase, isLive }: HomeSeo): Metadata => ({
  ...pageMetadata({ path: "/", title, description, shareImageBase, isLive }),
  title: { absolute: title },
});
