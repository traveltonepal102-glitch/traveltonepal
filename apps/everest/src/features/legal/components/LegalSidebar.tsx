import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";

import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import type { LegalDoc } from "../types";
import { PrintButton } from "./PrintButton";

const SMALL_BUTTON = "inline-flex min-h-11 flex-auto items-center justify-center gap-2 rounded-full px-4 text-sm font-bold no-underline";

/**
 * The legal page's side column (design: on the right, stays in view while reading): "Auf dieser Seite" with each
 * numbered section on a rail (long pages only), the navy "Frage zu dieser Seite?" box with WhatsApp and email, and
 * printing. Under the text on phones and tablets.
 */
export const LegalSidebar = ({ doc, hasToc }: { doc: LegalDoc; hasToc: boolean }) => (
  <aside className="flex flex-col gap-5 lg:sticky lg:top-6 print:hidden">
    {hasToc && doc.sections.length > 0 && (
      <nav aria-labelledby="legal-toc" className="max-lg:hidden">
        <p id="legal-toc" className="mb-3 text-xs leading-4 font-bold tracking-[0.14em] text-muted uppercase">
          Auf dieser Seite
        </p>
        <ol className="m-0 list-none border-0 border-l-2 border-solid border-line p-0">
          {doc.sections.map((section, index) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="-ml-0.5 flex gap-2.5 border-0 border-l-2 border-solid border-transparent py-1.75 pl-3.5 text-sm leading-5 font-medium text-muted no-underline hover:border-ocean hover:text-ink">
                <span className="w-5 flex-none font-bold text-glacier-ink">{index + 1}</span>
                {section.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    )}
    <div className="rounded-[20px] bg-ink p-5.5 text-on-ocean-muted">
      <p className="font-display text-[19px] leading-6 font-bold text-snow">Frage zu dieser Seite?</p>
      <p className="mt-1.5 text-[15px] leading-6">Schreib uns, wir erklären dir gern alles, was unklar ist.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={getWhatsAppUrl(`Hallo! Ich habe eine Frage zu eurer Seite „${doc.title}“.`)} target="_blank" rel="nofollow noopener" className={`${SMALL_BUTTON} bg-whatsapp text-snow hover:bg-whatsapp-deep hover:text-snow`}>
          <WhatsAppLogo size={18} />
          WhatsApp
        </a>
        <a href={getEmailUrl({ subject: `Frage zu: ${doc.title}` })} rel="nofollow" className={`${SMALL_BUTTON} border-[1.5px] border-solid border-white/45 text-snow hover:bg-white/10 hover:text-snow`}>
          <TrailIcon name="mail" size={18} />
          E-Mail
        </a>
      </div>
    </div>
    <PrintButton />
  </aside>
);
