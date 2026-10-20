import { ContactPage } from "@/features/contact/components/ContactPage";
import { contactMetadata } from "@/features/contact/seo";

export const metadata = contactMetadata;

const Contact = () => (
  <main className="flex-1 bg-page">
    <ContactPage />
  </main>
);

export default Contact;
