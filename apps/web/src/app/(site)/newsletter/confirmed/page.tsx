import type { Metadata } from "next";

import { NewsletterConfirmed } from "@/features/newsletter/components/NewsletterConfirmed";

/** Only Brevo's confirm link leads here, so search engines leave it out. */
export const metadata: Metadata = {
  title: "You're subscribed",
  robots: { index: false, follow: true },
};

const NewsletterConfirmedPage = () => <NewsletterConfirmed />;

export default NewsletterConfirmedPage;
