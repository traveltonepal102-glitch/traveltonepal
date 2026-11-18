"use client";

import type { FormEvent } from "react";
import { useId, useState } from "react";

import { TrailIcon } from "@/components/ui/TrailIcon";

import { subscribeToNewsletter } from "../actions";
import { newsletterSchema } from "../schema";
import type { NewsletterResult } from "../schema";

const UNREACHABLE: NewsletterResult = { status: "error", message: "Wir konnten den Server nicht erreichen. Bitte versuch es noch einmal." };
const FIELD = "flex flex-col gap-0.5 text-xs font-semibold tracking-[0.16em] text-on-ink-label uppercase";
const INPUT =
  "min-h-12 w-full border-0 border-b border-solid border-white/30 bg-transparent p-0 font-[inherit] text-[17px] font-normal tracking-normal text-mist normal-case placeholder:text-on-ink-muted focus-visible:border-glacier focus-visible:outline-none";

/** The footer's "Post aus dem Khumbu" sign-up: name and email, then Brevo's double opt-in (confirm from the inbox). */
export const NewsletterSignup = () => {
  const titleId = useId();
  const errorId = useId();
  const [result, setResult] = useState<NewsletterResult | null>(null);
  const [isSending, setIsSending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    // The same check as the server's, so a typo is caught before the round trip.
    const checked = newsletterSchema.safeParse(fields);
    if (!checked.success) return setResult({ status: "error", message: checked.error.issues[0]?.message ?? "Bitte prüf deine E-Mail-Adresse." });
    setIsSending(true);
    setResult(await subscribeToNewsletter(fields).catch(() => UNREACHABLE));
    setIsSending(false);
  };

  const error = result?.status === "error" ? result.message : undefined;

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby={titleId} className="overflow-hidden rounded-[14px] border border-solid border-white/16">
      <p id={titleId} className="flex items-center gap-3 border-0 border-b border-solid border-white/12 px-5.5 py-4 text-[13px] leading-none font-semibold tracking-[0.2em] text-mist uppercase">
        <span className="inline-flex size-7.5 items-center justify-center rounded-full bg-white/7 text-glacier">
          <TrailIcon name="mail" size={15} />
        </span>
        Post aus dem Khumbu
      </p>
      {result?.status === "confirmation-sent" ? (
        <p role="status" className="flex items-start gap-2.5 px-5.5 py-5 text-[15px] text-mist">
          <TrailIcon name="check" className="mt-1 text-glacier" />
          Fast geschafft: Schau in dein Postfach und bestätige deine Anmeldung.
        </p>
      ) : (
        <div className="flex flex-col gap-4.5 px-5.5 pt-4.5 pb-5.5">
          <div className="grid gap-4.5 sm:grid-cols-2">
            <label className={FIELD}>
              Name
              <input name="name" type="text" autoComplete="name" placeholder="Vor- und Nachname" className={INPUT} />
            </label>
            <label className={FIELD}>
              E-Mail
              <input name="email" type="email" required autoComplete="email" placeholder="du@beispiel.de" aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} className={INPUT} />
            </label>
          </div>
          {/* Honeypot: hidden from people and screen readers; bots that fill it in are ignored. */}
          <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <div className="flex flex-wrap items-center gap-3.5">
            <button
              type="submit"
              disabled={isSending}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-[10px] border-0 bg-mist py-0 pr-2 pl-4.5 font-[inherit] text-sm font-bold tracking-[0.14em] text-ink uppercase hover:bg-ice disabled:cursor-wait disabled:opacity-70"
            >
              {isSending ? "Wird gesendet…" : "Anmelden"}
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-ocean text-mist">
                <TrailIcon name="arrow" size={14} />
              </span>
            </button>
            {error ? (
              <p id={errorId} role="alert" className="text-[13px] leading-4.5 font-semibold text-on-ink-error">
                {error}
              </p>
            ) : (
              <p className="text-[13px] leading-4.5 text-on-ink-muted">Ein paar Mal im Jahr Neues zur Saison. Du bestätigst zuerst per E-Mail.</p>
            )}
          </div>
        </div>
      )}
    </form>
  );
};
