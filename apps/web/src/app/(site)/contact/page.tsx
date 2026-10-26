import { ContactPage } from "@/features/contact/components/ContactPage";
import { contactMetadata } from "@/features/contact/seo";
import { getContactPage } from "@/features/contact/services/contactRepository";

export const generateMetadata = async () => contactMetadata(await getContactPage());

const Contact = () => (
  <main className="flex-1 bg-page">
    <ContactPage />
  </main>
);

export default Contact;
