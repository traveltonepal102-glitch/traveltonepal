"use client";

import { currencySymbol, formatMoney } from "@ttn/config/siteLanguage";
import type { SiteCurrency } from "@ttn/config/siteLanguage";
import { createContext, useContext } from "react";
import type { ReactNode } from "react";

const SiteCurrencyContext = createContext<SiteCurrency>("USD");

/** The currency of the website "Working on" shows: its prices are typed and shown in it (sites.currency). */
export const SiteCurrencyProvider = ({ value, children }: { value: SiteCurrency; children: ReactNode }) => (
  <SiteCurrencyContext.Provider value={value}>{children}</SiteCurrencyContext.Provider>
);

/** The current website's currency, with its sign ("$", "€") and a price as the admin shows it ("$1,280", "€1,280"). */
export const useSiteCurrency = () => {
  const currency = useContext(SiteCurrencyContext);
  return {
    currency,
    symbol: currencySymbol(currency),
    /** The admin is in English, so amounts are written the English way in either currency. */
    format: (amount: number) => formatMoney(amount, currency, "en"),
  };
};
