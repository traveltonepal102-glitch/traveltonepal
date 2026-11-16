import { SITE_CURRENCIES, SITE_CURRENCY_LABELS, SITE_LANGUAGE_LABELS, SITE_LANGUAGES } from "@ttn/config/siteLanguage";
import type { SiteCurrency, SiteLanguage } from "@ttn/config/siteLanguage";

import { FormSection } from "@/components/ui/FormSection";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";

type SiteLanguageFieldsProps = {
  language: SiteLanguage;
  currency: SiteCurrency;
  /** A live site shows them without letting them change (its pages and prices are in them). */
  isLocked: boolean;
  errors: Record<string, string | undefined>;
};

const LANGUAGE_OPTIONS = SITE_LANGUAGES.map((value) => ({ value, label: SITE_LANGUAGE_LABELS[value] }));
const CURRENCY_OPTIONS = SITE_CURRENCIES.map((value) => ({ value, label: SITE_CURRENCY_LABELS[value] }));

/**
 * The website's language and currency (decided 2026-11-15): its content is typed in the language and its prices in the
 * currency, and its own words and page addresses follow the language. Fixed once the site is live.
 */
export const SiteLanguageFields = ({ language, currency, isLocked, errors }: SiteLanguageFieldsProps) => (
  <FormSection
    title="Language and currency"
    hint={
      isLocked
        ? "A live website keeps its language and currency: its pages, addresses and prices are in them."
        : "Type the website's treks, pages and blogs in this language, and its prices in this currency. Fixed once the site is live."
    }
  >
    <div className="grid gap-3 tablet:grid-cols-2">
      {isLocked ? (
        <>
          <TextField name="languageShown" label="Language" defaultValue={SITE_LANGUAGE_LABELS[language]} isReadOnly />
          <TextField name="currencyShown" label="Currency" defaultValue={SITE_CURRENCY_LABELS[currency]} isReadOnly />
        </>
      ) : (
        <>
          <SelectField name="language" label="Language" options={LANGUAGE_OPTIONS} defaultValue={language} error={errors.language} />
          <SelectField name="currency" label="Currency" options={CURRENCY_OPTIONS} defaultValue={currency} error={errors.currency} />
        </>
      )}
    </div>
  </FormSection>
);
