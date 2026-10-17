"use client";

import { Icon } from "@ttn/ui/icon";

import { MAX_REQUESTS_LENGTH } from "../../requestMessage";
import { EmailFallback, SelectField, TextField, WhatsAppSubmit } from "./RequestFields";
import { useTrekRequest } from "./useTrekRequest";
import type { TrekRequestOptions } from "./useTrekRequest";

/** End-of-page request form ("Book the … with us"): name, country, group size, timing and requests. */
export const CalloutRequestForm = (options: TrekRequestOptions) => {
  const { form, group, timing, onSubmit, emailHref } = useTrekRequest(options);
  const { register, formState } = form;

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Your full name"
          autoComplete="name"
          placeholder="Alex Taylor"
          error={formState.errors.name?.message}
          {...register("name")}
        />
        <TextField
          label="Country"
          autoComplete="country-name"
          placeholder="Germany"
          error={formState.errors.country?.message}
          {...register("country")}
        />
        <SelectField label="Group size" {...group} />
        <SelectField label="Preferred month and year" {...timing} />
      </div>
      <TextField
        label="Special requests"
        maxLength={MAX_REQUESTS_LENGTH}
        placeholder="e.g. 2 adults, private trip, add Tserko Ri"
        error={formState.errors.requests?.message}
        {...register("requests")}
      />
      <WhatsAppSubmit isTall>
        Send my request on WhatsApp
        <Icon name="send" size={18} />
      </WhatsAppSubmit>
      <EmailFallback href={emailHref} />
    </form>
  );
};
