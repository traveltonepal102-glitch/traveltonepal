import { INTL_LOCALES, formatMoney } from "@ttn/config/siteLanguage";
import type { SiteCurrency } from "@ttn/config/siteLanguage";

import { SITE_LANGUAGE } from "./site";

const NUMBER = new Intl.NumberFormat(INTL_LOCALES[SITE_LANGUAGE]);

/** 5106 → "5.106 m" */
export const formatAltitude = (meters: number) => `${NUMBER.format(meters)} m`;

/** 1 → "1 Tag", 13 → "13 Tage" */
export const formatDays = (days: number) => `${days} ${days === 1 ? "Tag" : "Tage"}`;

/** 1280 in the website's currency → "1.280 €" (the currency comes with the price from the database). */
export const formatPrice = (amount: number, currency: SiteCurrency) => formatMoney(amount, currency, SITE_LANGUAGE);

/** 4.9 → "4,9" (a rating). */
export const formatDecimal = (value: number) => value.toFixed(1).replace(".", ",");
