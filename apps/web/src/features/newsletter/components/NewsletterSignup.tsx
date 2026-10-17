"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@ttn/ui/icon";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

import { subscribeToNewsletter } from "../actions";
import { newsletterSchema } from "../schema";
import type { NewsletterResult } from "../schema";

const UNREACHABLE: NewsletterResult = { status: "error", message: "We could not reach the server. Please try again." };

/** Email field and button; after sign-up it asks the visitor to confirm from their inbox (double opt-in). */
export const NewsletterSignup = () => {
  const errorId = useId();
  const [result, setResult] = useState<NewsletterResult | null>(null);
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "", website: "" },
  });

  const onSubmit = handleSubmit(async (fields) => {
    setResult(null);
    setResult(await subscribeToNewsletter(fields).catch(() => UNREACHABLE));
  });

  if (result?.status === "confirmation-sent") {
    return (
      <p role="status" className="flex max-w-sm items-start gap-2.5 rounded-md bg-white/10 p-3.5 text-body-sm text-white">
        <Icon name="mark_email_read" className="flex-none text-saffron" />
        Almost done: check your inbox and confirm your subscription.
      </p>
    );
  }

  const error = formState.errors.email?.message ?? (result?.status === "error" ? result.message : undefined);

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-none flex-col gap-1.5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="flex">
          <span className="sr-only">Email address</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            {...register("email")}
            className="w-full rounded-md border border-line-strong bg-white px-4 py-3 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron sm:w-70"
          />
        </label>
        {/* Honeypot: hidden from people and screen readers; bots that fill it in are ignored. */}
        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...register("website")} />
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="cursor-pointer rounded-md bg-saffron px-5 py-3 text-xs font-extrabold tracking-[0.06em] text-ink uppercase hover:bg-saffron/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-wait disabled:opacity-70"
        >
          {formState.isSubmitting ? "Sending…" : "Subscribe"}
        </button>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-semibold text-[#ffb4ab]">
          {error}
        </p>
      ) : (
        <p className="text-[11px] text-navy-text">We send a confirmation email first. Unsubscribe any time.</p>
      )}
    </form>
  );
};
