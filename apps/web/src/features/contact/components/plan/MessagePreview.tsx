import Image from "next/image";

import { SITE_NAME } from "@/lib/site";

/** WhatsApp-style preview of the message the visitor is about to send. An illustration: nothing is sent from here. */
export const MessagePreview = ({ message }: { message: string }) => (
  <figure className="overflow-hidden rounded-2xl border border-[#d6ded3] shadow-raised">
    <figcaption className="sr-only">Preview of your message</figcaption>
    <div className="flex items-center gap-2.5 bg-[#0f5e2e] px-4 py-3 text-white">
      <span className="inline-flex size-9 flex-none items-center justify-center rounded-full bg-white">
        <Image src="/brand/logo-mark.svg" alt="" width={13} height={26} className="h-6.5 w-auto" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-bold">{SITE_NAME}</span>
        <span className="text-xs text-[#bbf7d0]">Kathmandu team</span>
      </span>
      <span className="ml-auto text-[11px] text-[#bbf7d0]">Preview</span>
    </div>
    <div className="flex min-h-85 flex-col gap-2.5 bg-[#efe9df] px-3.5 pt-4.5 pb-5.5 text-body-sm text-ink">
      <p className="max-w-[85%] self-start rounded-lg rounded-tl-sm bg-white px-3 py-2.5 shadow-card">
        Namaste! How can we help with your trek?
      </p>
      <p className="max-w-[88%] self-end rounded-lg rounded-tr-sm bg-[#d9fdd3] px-3 py-2.5 break-words whitespace-pre-line shadow-card">
        {message}
      </p>
    </div>
  </figure>
);
