import { ContactPage } from "@/features/contact/components/ContactPage";
import { contactMetadata } from "@/features/contact/seo";
import { getContactPage } from "@/features/contact/services/contactRepository";
import { PageSchemasJsonLd } from "@/features/seo/PageSchemasJsonLd";

export const generateMetadata = async () => contactMetadata(await getContactPage());

const Contact = () => (
  <main className="flex-1 bg-page">
    <PageSchemasJsonLd kind="page" slug="contact" />
    <ContactPage />
  </main>
);

export default Contact;
