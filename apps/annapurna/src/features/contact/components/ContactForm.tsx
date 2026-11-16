"use client";

import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { groupOptions } from "@ttn/site-data/tripMessage";
import { useRef, useState } from "react";
import type { FormEvent } from "react";

import { outlineButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { todayInNepal } from "@/features/home/startDate";

import { MAX_MESSAGE_LENGTH, buildContactMessage, checkContactForm, contactEmailSubject } from "../contactMessage";
import type { ContactFieldErrors } from "../contactMessage";
import { SelectField, TextAreaField, TextField } from "./ContactFields";
import { SITE_LANGUAGE } from "@/lib/site";

const NO_TREK = "Weiß ich noch nicht";
const NO_GROUP = "Steht noch nicht fest";

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
  const [opened, setOpened] = useState<"WhatsApp" | "Ihrem E-Mail-Programm" | null>(null);
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
      setOpened("Ihrem E-Mail-Programm");
      return;
    }
    openWhatsApp(getWhatsAppUrl(message));
    setOpened("WhatsApp");
  };

  return (
    <form ref={form} noValidate onSubmit={send} aria-labelledby="contact-form-h" className="flex flex-col gap-5 rounded-2xl border border-solid border-line bg-snow p-6 shadow-card md:p-8">
      <div className="flex flex-col gap-1.5">
        <h2 id="contact-form-h" className="text-[28px]! leading-9!">
          Schreiben Sie uns
        </h2>
        <p className="text-base leading-6.5">Erzählen Sie uns von Ihrer Reise. Wir antworten mit Tipps und einem Preis für Ihre Gruppe.</p>
      </div>
      <div className="grid gap-4.5 sm:grid-cols-2">
        <TextField name="name" label="Vor- und Nachname" autoComplete="name" maxLength={80} error={errors.name} />
        <TextField name="email" label="E-Mail" type="email" autoComplete="email" inputMode="email" maxLength={120} error={errors.email} />
        <TextField name="phone" label="Telefon oder WhatsApp" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} isOptional error={errors.phone} />
        <TextField name="country" label="Land" autoComplete="country-name" maxLength={60} isOptional error={errors.country} />
        <div className="sm:col-span-2">
          <SelectField name="trek" label="Welcher Trek interessiert Sie?" options={[NO_TREK, ...trekNames]} isOptional error={errors.trek} />
        </div>
        <SelectField name="group" label="Gruppengröße" options={[NO_GROUP, ...groupOptions(SITE_LANGUAGE)]} isOptional error={errors.group} />
        <TextField name="startDate" label="Gewünschtes Startdatum" type="date" onFocus={(event) => (event.currentTarget.min = todayInNepal())} isOptional error={errors.startDate} />
      </div>
      <TextAreaField name="message" label="Ihre Nachricht" rows={5} maxLength={MAX_MESSAGE_LENGTH} placeholder="Was möchten Sie wissen?" error={errors.message} />
      <div className="actions">
        <button type="submit" value="whatsapp" className={`${whatsAppButton} cursor-pointer border-0`}>
          <WhatsAppLogo />
          Per WhatsApp senden
        </button>
        <button type="submit" value="email" className={`${outlineButton} cursor-pointer`}>
          <TrailIcon name="mail" />
          Per E-Mail senden
        </button>
      </div>
      <p role="status" className={opened ? "rounded-[10px] bg-sky px-4 py-3 text-[15px] leading-5.75 font-medium text-navy-deep" : "sr-only"}>
        {opened && `Ihre Nachricht ist in ${opened} vorbereitet. Tippen Sie dort auf „Senden“, damit sie bei uns ankommt.`}
      </p>
      <p className="flex items-start gap-1.5 text-sm leading-5 text-muted">
        <TrailIcon name="lock" size={14} className="mt-0.75" />
        Ihre Nachricht öffnet sich in WhatsApp oder Ihrem E-Mail-Programm. Auf dieser Website wird nichts gespeichert.
      </p>
    </form>
  );
};
