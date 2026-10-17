import { getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { ROUTES } from "@/lib/routes";

import { TrailEndIllustration } from "./TrailEndIllustration";

export const NotFoundHero = () => (
  <section className="border-b border-line bg-surface">
    <div className="mx-auto grid max-w-content items-center gap-12 px-4 pt-7 pb-9 md:px-6 md:pt-14 md:pb-16 lg:grid-cols-[minmax(0,1fr)_480px]">
      <div className="flex max-w-155 flex-col gap-4">
        <p className="inline-flex items-center gap-2 text-eyebrow text-brand uppercase">
          <Icon name="travel_explore" size={18} />
          Error 404 · Page not found
        </p>
        <h1 className="text-h1-sm md:text-h1">This trail ends here</h1>
        <p className="text-body-lg">
          The page you were looking for has moved or no longer exists. The link may also have a small typo. Here are
          the quickest ways back on track.
        </p>
        <div className="flex flex-wrap gap-2.5 pt-1.5">
          <ButtonLink href={ROUTES.home} icon="home" className="max-md:w-full">
            Back to home
          </ButtonLink>
          <ButtonLink href={ROUTES.treks} variant="secondary" icon="hiking" className="max-md:w-full">
            See all treks
          </ButtonLink>
          <ButtonLink href={getWhatsAppUrl()} variant="whatsapp" icon="chat" isExternal className="max-md:w-full">
            Ask us on WhatsApp
          </ButtonLink>
        </div>
      </div>
      <div className="w-full max-w-105 lg:max-w-none">
        <TrailEndIllustration />
      </div>
    </div>
  </section>
);
