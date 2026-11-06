import type { ContactContent } from "@ttn/site-data/contactContent";

import type { SitePageTop } from "@/features/site-pages/types";

/** The Contact page as saved in the admin's Pages › Contact (contact details themselves are in Site settings). */
export type ContactPageContent = ContactContent & { top: SitePageTop };
