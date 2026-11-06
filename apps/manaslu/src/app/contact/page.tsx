import { ContactPage } from "@/features/contact/components/ContactPage";
import { getContactPage } from "@/features/contact/services/contactRepository";
import { sitePageMetadata } from "@/features/site-pages/seo";
import { ROUTES } from "@/lib/routes";

export const generateMetadata = async () => sitePageMetadata((await getContactPage()).top, ROUTES.contact);

const Contact = () => <ContactPage />;

export default Contact;
