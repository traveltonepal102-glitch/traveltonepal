import type { Metadata } from "next";

import { NewsletterConfirmed } from "@/features/newsletter/components/NewsletterConfirmed";

/** Where Brevo sends a new subscriber after they confirm: not a page for Google. */
export const metadata: Metadata = { title: "Anmeldung bestätigt", robots: { index: false, follow: true } };

const NewsletterConfirmedPage = () => <NewsletterConfirmed />;

export default NewsletterConfirmedPage;
