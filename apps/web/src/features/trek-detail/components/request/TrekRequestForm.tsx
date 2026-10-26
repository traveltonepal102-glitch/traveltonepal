"use client";

import { MAX_REQUESTS_LENGTH } from "../../requestMessage";
import { EmailFallback, SelectField, StaticField, TextAreaField, TextField, WhatsAppSubmit } from "./RequestFields";
import { useTrekRequest } from "./useTrekRequest";
import type { TrekRequestOptions } from "./useTrekRequest";

import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

/** In-page request form ("Book your … Trek"): trek, group size, name, timing and special requests. */
export const TrekRequestForm = (options: TrekRequestOptions) => {
  const { form, group, timing, onSubmit, emailHref } = useTrekRequest(options);
  const { register, formState } = form;

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-3.5 md:grid-cols-2">
        <StaticField label="Trek">
          {options.trekName} — {options.days} days
        </StaticField>
        <SelectField label="Group size" {...group} />
        <TextField
          label="Full name"
          autoComplete="name"
          placeholder="e.g. Anna Weber"
          error={formState.errors.name?.message}
          {...register("name")}
        />
        <SelectField label="Preferred time" {...timing} />
      </div>
      <TextAreaField
        label="Special requests or exact dates"
        rows={2}
        maxLength={MAX_REQUESTS_LENGTH}
        placeholder="e.g. Extra rest day, add Tserko Ri, vegetarian meals, start on 12 October"
        error={formState.errors.requests?.message}
        {...register("requests")}
      />
      <WhatsAppSubmit>
        <WhatsAppLogo size={18} />
        Send my request on WhatsApp
      </WhatsAppSubmit>
      <EmailFallback href={emailHref} />
    </form>
  );
};
