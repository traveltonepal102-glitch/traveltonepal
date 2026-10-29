import { Icon } from "@ttn/ui/icon";

import type { ContactClicksSummary } from "../lib/contactClicks";

type ContactClicksCardProps = { summary: ContactClicksSummary; days: number; websiteUrl: string | null };

const TOTAL = "flex flex-col gap-0.5 rounded-lg border border-solid border-border bg-page px-4 py-3";

/**
 * "WhatsApp and email clicks": how often visitors pressed the website's WhatsApp and email buttons, and on which pages
 * (counted without cookies or IP addresses), so you can see which pages bring enquiries.
 */
export const ContactClicksCard = ({ summary, days, websiteUrl }: ContactClicksCardProps) => (
  <section aria-labelledby="contact-clicks-title" className="flex flex-col gap-4 rounded-lg border border-solid border-border bg-surface p-5">
    <div>
      <h2 id="contact-clicks-title" className="m-0 font-display text-h4 text-ink">
        WhatsApp and email clicks
      </h2>
      <p className="m-0 mt-0.5 text-caption text-muted-foreground">The last {days} days, Nepal time. Counted without cookies or IP addresses.</p>
    </div>
    <div className="grid gap-3 tablet:grid-cols-2">
      <p className={TOTAL}>
        <span className="font-display text-2xl font-extrabold text-ink">{summary.whatsapp}</span>
        <span className="inline-flex items-center gap-1.5 text-caption text-text">
          <Icon name="chat" size={16} className="text-whatsapp" />
          WhatsApp
        </span>
      </p>
      <p className={TOTAL}>
        <span className="font-display text-2xl font-extrabold text-ink">{summary.email}</span>
        <span className="inline-flex items-center gap-1.5 text-caption text-text">
          <Icon name="mail" size={16} className="text-brand" />
          Email
        </span>
      </p>
    </div>
    {summary.pages.length > 0 ? (
      <table className="w-full border-collapse text-left text-caption">
        <thead>
          <tr className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
            <th scope="col" className="py-2 pr-3">Page</th>
            <th scope="col" className="py-2 pr-3 text-right">WhatsApp</th>
            <th scope="col" className="py-2 text-right">Email</th>
          </tr>
        </thead>
        <tbody>
          {summary.pages.map((page) => (
            <tr key={page.path} className="border-t border-solid border-border">
              <th scope="row" className="max-w-0 truncate py-2 pr-3 font-semibold text-ink">
                {page.path ? (
                  websiteUrl ? (
                    <a href={`${websiteUrl}${page.path}`} target="_blank" rel="noopener noreferrer" className="text-brand">
                      {page.path}
                    </a>
                  ) : (
                    page.path
                  )
                ) : (
                  <span className="font-normal text-muted-foreground">Page not known</span>
                )}
              </th>
              <td className="py-2 pr-3 text-right">{page.whatsapp}</td>
              <td className="py-2 text-right">{page.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="m-0 text-caption text-muted-foreground">No clicks yet. They appear here as soon as visitors press a WhatsApp or email button.</p>
    )}
  </section>
);
