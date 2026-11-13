import { getWhatsAppUrl } from "@ttn/config/contact";
import Link from "next/link";

import { outlineOnDarkButton, primaryButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { CONTACT_SECTIONS } from "@/features/contact/sections";
import { ROUTES } from "@/lib/routes";

type PlanTrekButtonProps = {
  hasWhatsApp: boolean;
  /** On the dark green header: WhatsApp's green, or an outline for the contact form. */
  isOnDark?: boolean;
  className?: string;
};

/** "Plan my trek": opens WhatsApp with the logo on it; with no number in Site settings, the contact form. */
export const PlanTrekButton = ({ hasWhatsApp, isOnDark = false, className = "" }: PlanTrekButtonProps) =>
  hasWhatsApp ? (
    <a href={getWhatsAppUrl("Hello! I would like to plan a trek in the Manaslu region.")} rel="nofollow" className={`${isOnDark ? whatsAppButton : primaryButton} whitespace-nowrap ${className}`}>
      <WhatsAppLogo />
      Plan my trek
    </a>
  ) : (
    <Link href={`${ROUTES.contact}#${CONTACT_SECTIONS.plan}`} className={`${isOnDark ? outlineOnDarkButton : primaryButton} whitespace-nowrap ${className}`}>
      Plan my trek
    </Link>
  );
