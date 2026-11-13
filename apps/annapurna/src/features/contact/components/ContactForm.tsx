"use client";

import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { GROUP_OPTIONS } from "@ttn/site-data/tripMessage";
import { useRef, useState } from "react";
import type { FormEvent } from "react";

import { outlineButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { todayInNepal } from "@/features/home/startDate";

import { MAX_MESSAGE_LENGTH, buildContactMessage, checkContactForm, contactEmailSubject } from "../contactMessage";
import type { ContactFieldErrors } from "../contactMessage";
import { SelectField, TextAreaField, TextField } from "./ContactFields";

const NO_TREK = "I'm not sure yet";
const NO_GROUP = "Not sure yet";

/** Opens WhatsApp in a new tab, or in this one when the browser blocks new tabs. */
const openWhatsApp = (url: string) => {
  const tab = window.open(url, "_blank");
  if (!tab) window.location.href = url;
  else tab.opener = null;
};

/**
 * The contact form: checked here, then it opens WhatsApp or the visitor's email app with the message written. Nothing is
 * sent to or stored by this website, so the page says plainly that they still have to press send there.
 */
export const ContactForm = ({ trekNames }: { trekNames: readonly string[] }) => {
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [opened, setOpened] = useState<"WhatsApp" | "your email app" | null>(null);
  const form = useRef<HTMLFormElement>(null);

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const checked = checkContactForm({ ...fields, trek: fields.trek === NO_TREK ? "" : fields.trek, group: fields.group === NO_GROUP ? "" : fields.group });
    if (checked.errors) {
      setErrors(checked.errors);
      setOpened(null);
      // Take them to the first field that needs fixing.
      form.current?.querySelector<HTMLElement>(`[name="${Object.keys(checked.errors)[0]}"]`)?.focus();
      return;
    }
    setErrors({});
    const message = buildContactMessage(checked.values);
    if ((event.nativeEvent as SubmitEvent).submitter?.getAttribute("value") === "email") {
      window.location.href = getEmailUrl({ subject: contactEmailSubject(checked.values), body: message });
      setOpened("your email app");
      return;
    }
    openWhatsApp(getWhatsAppUrl(message));
    setOpened("WhatsApp");
  };

  return (
    <form ref={form} noValidate onSubmit={send} aria-labelledby="contact-form-h" className="flex flex-col gap-5 rounded-2xl border border-solid border-line bg-snow p-6 shadow-card md:p-8">
      <div className="flex flex-col gap-1.5">
        <h2 id="contact-form-h" className="text-[28px]! leading-9!">
          Send us a message
        </h2>
        <p className="text-base leading-6.5">Tell us about your trip and we will reply with advice and a price for your group.</p>
      </div>
      <div className="grid gap-4.5 sm:grid-cols-2">
        <TextField name="name" label="Full name" autoComplete="name" maxLength={80} error={errors.name} />
        <TextField name="email" label="Email" type="email" autoComplete="email" inputMode="email" maxLength={120} error={errors.email} />
        <TextField name="phone" label="Phone or WhatsApp" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} isOptional error={errors.phone} />
        <TextField name="country" label="Country" autoComplete="country-name" maxLength={60} isOptional error={errors.country} />
        <div className="sm:col-span-2">
          <SelectField name="trek" label="Trek you are interested in" options={[NO_TREK, ...trekNames]} isOptional error={errors.trek} />
        </div>
        <SelectField name="group" label="Group size" options={[NO_GROUP, ...GROUP_OPTIONS]} isOptional error={errors.group} />
        <TextField name="startDate" label="Preferred start date" type="date" onFocus={(event) => (event.currentTarget.min = todayInNepal())} isOptional error={errors.startDate} />
      </div>
      <TextAreaField name="message" label="Your message" rows={5} maxLength={MAX_MESSAGE_LENGTH} placeholder="What would you like to know?" error={errors.message} />
      <div className="actions">
        <button type="submit" value="whatsapp" className={`${whatsAppButton} cursor-pointer border-0`}>
          <WhatsAppLogo />
          Send on WhatsApp
        </button>
        <button type="submit" value="email" className={`${outlineButton} cursor-pointer`}>
          <TrailIcon name="mail" />
          Send by email
        </button>
      </div>
      <p role="status" className={opened ? "rounded-[10px] bg-sky px-4 py-3 text-[15px] leading-5.75 font-medium text-navy-deep" : "sr-only"}>
        {opened && `Your message is ready in ${opened}. Press send there to reach us.`}
      </p>
      <p className="flex items-start gap-1.5 text-sm leading-5 text-muted">
        <TrailIcon name="lock" size={14} className="mt-0.75" />
        Your message opens in WhatsApp or your email app. Nothing is stored on this website.
      </p>
    </form>
  );
};
