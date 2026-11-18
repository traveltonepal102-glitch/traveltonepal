import Link from "next/link";

import { outlineButton, primaryButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { ROUTES } from "@/lib/routes";

/** Shown after a new subscriber clicks the confirm button in Brevo's email. */
export const NewsletterConfirmed = () => (
  <main id="main" className="wrap flex flex-col gap-4 py-16 md:py-24">
    <span aria-hidden="true" className="inline-flex size-14 items-center justify-center rounded-2xl bg-glacier-tint text-ocean">
      <TrailIcon name="check" size={28} />
    </span>
    <h1>Du bist angemeldet</h1>
    <p className="text-lg leading-7.5">
      Danke für deine Bestätigung. Ein paar Mal im Jahr schicken wir dir Neues aus dem Khumbu: die Saison, die Wege zum Everest und neue Treks. Jede E-Mail hat
      einen Abmeldelink, du kannst dich also jederzeit wieder abmelden.
    </p>
    <div className="actions pt-1.5">
      <Link href={ROUTES.home} className={primaryButton}>
        Zum Everest Base Camp Trek
      </Link>
      <Link href={ROUTES.blogs} className={outlineButton}>
        Zum Blog
      </Link>
    </div>
  </main>
);
