import { getWhatsAppUrl } from "@ttn/config/contact";
import Link from "next/link";

import { primaryButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { CONTACT_SECTIONS } from "@/features/contact/sections";
import { ROUTES } from "@/lib/routes";

type PlanTrekButtonProps = { hasWhatsApp: boolean; className?: string };

/** "Plan my trek": opens WhatsApp with the logo on it; with no number in Site settings, the contact form. */
export const PlanTrekButton = ({ hasWhatsApp, className = "" }: PlanTrekButtonProps) =>
  hasWhatsApp ? (
    <a href={getWhatsAppUrl("Hello! I would like to plan a trek in the Annapurna region.")} className={`${whatsAppButton} whitespace-nowrap ${className}`}>
      <WhatsAppLogo />
      Plan my trek
    </a>
  ) : (
    <Link href={`${ROUTES.contact}#${CONTACT_SECTIONS.plan}`} className={`${primaryButton} whitespace-nowrap ${className}`}>
      Plan my trek
    </Link>
  );
