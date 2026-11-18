import type { Metadata } from "next";

import { NotFoundPage } from "@/features/not-found/components/NotFoundPage";

export const metadata: Metadata = { title: "Seite nicht gefunden", robots: { index: false, follow: true } };

export default NotFoundPage;
