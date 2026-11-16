/**
 * Each website has one language and one currency (decided 2026-11-15; `sites.language` and `sites.currency`, set in
 * the admin's Sites). Its content is typed in that language and its prices in that currency; the website writes its
 * fixed words in that language too. Travel To Nepal and Manaslu Trek: English, US dollars; Annapurna Trekking: German,
 * euros.
 */
export const SITE_LANGUAGES = ["en", "de"] as const;
export type SiteLanguage = (typeof SITE_LANGUAGES)[number];

export const SITE_CURRENCIES = ["USD", "EUR"] as const;
export type SiteCurrency = (typeof SITE_CURRENCIES)[number];

/** As the admin names them. */
export const SITE_LANGUAGE_LABELS: Record<SiteLanguage, string> = { en: "English", de: "German" };
export const SITE_CURRENCY_LABELS: Record<SiteCurrency, string> = { USD: "US dollars ($)", EUR: "Euros (€)" };

/** The Intl locale for numbers and dates: "5,106 m" / "5.106 m". */
export const INTL_LOCALES: Record<SiteLanguage, string> = { en: "en-US", de: "de-DE" };

/** The Open Graph locale (og:locale). */
export const OG_LOCALES: Record<SiteLanguage, string> = { en: "en_US", de: "de_DE" };

export const isSiteLanguage = (value: unknown): value is SiteLanguage => SITE_LANGUAGES.includes(value as SiteLanguage);
export const isSiteCurrency = (value: unknown): value is SiteCurrency => SITE_CURRENCIES.includes(value as SiteCurrency);

/** A row's currency, read leniently: anything unknown is US dollars, as every price was before 2026-11-15. */
export const toSiteCurrency = (value: unknown): SiteCurrency => (isSiteCurrency(value) ? value : "USD");

const moneyFormats = new Map<string, Intl.NumberFormat>();

/** A whole amount the way the website's readers write it: "$1,280" in English, "1.280 €" in German. */
export const formatMoney = (amount: number, currency: SiteCurrency, language: SiteLanguage = "en") => {
  const key = `${language}-${currency}`;
  let format = moneyFormats.get(key);
  if (!format) {
    format = new Intl.NumberFormat(INTL_LOCALES[language], { style: "currency", currency, maximumFractionDigits: 0, minimumFractionDigits: 0 });
    moneyFormats.set(key, format);
  }
  return format.format(amount);
};

/** The currency's sign alone, for form fields: "$" or "€". */
export const currencySymbol = (currency: SiteCurrency) => (currency === "EUR" ? "€" : "$");
