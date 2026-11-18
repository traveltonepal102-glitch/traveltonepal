import { getWhatsAppUrl } from "@ttn/config/contact";
import Link from "next/link";

import { primaryButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { CONTACT_SECTIONS } from "@/features/contact/sections";
import { ROUTES } from "@/lib/routes";

type PlanTrekButtonProps = {
  hasWhatsApp: boolean;
  className?: string;
};

/** "Trek planen": opens WhatsApp, in WhatsApp's green with its logo; with no number in Site settings, the contact form. */
export const PlanTrekButton = ({ hasWhatsApp, className = "" }: PlanTrekButtonProps) =>
  hasWhatsApp ? (
    <a href={getWhatsAppUrl("Hallo! Ich möchte einen Trek in der Everest-Region planen.")} target="_blank" rel="nofollow noopener" className={`${whatsAppButton} whitespace-nowrap ${className}`}>
      <WhatsAppLogo />
      Trek planen
    </a>
  ) : (
    <Link href={`${ROUTES.contact}#${CONTACT_SECTIONS.plan}`} className={`${primaryButton} whitespace-nowrap ${className}`}>
      Trek planen
    </Link>
  );
