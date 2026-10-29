import { ContactPage } from "@/features/contact/components/ContactPage";
import { contactMetadata } from "@/features/contact/seo";
import { getContactPage } from "@/features/contact/services/contactRepository";
import { PageSchemasJsonLd } from "@/features/seo/PageSchemasJsonLd";
import { withSiteDefaults } from "@/features/seo/withSiteDefaults";

export const generateMetadata = async () => withSiteDefaults(contactMetadata(await getContactPage()));

const Contact = () => (
  <main className="flex-1 bg-page">
    <PageSchemasJsonLd kind="page" slug="contact" />
    <ContactPage />
  </main>
);

export default Contact;
