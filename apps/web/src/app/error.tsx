"use client";

import { getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { ROUTES } from "@/lib/routes";

type ErrorPageProps = {
  error: Error & { digest?: string };
  /** Loads the page again (fetches it anew). */
  retry: () => void;
};

/**
 * Shown when a page can't be made, e.g. the database can't be read and there is no earlier copy to show. No
 * site header (it reads the database too); the footer comes from the root layout. Visitors see no details:
 * the digest matches the server log.
 */
const ErrorPage = ({ error, retry }: ErrorPageProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex-1 bg-surface">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-4 pt-7 pb-16 md:px-6 md:pt-10 md:pb-24">
        <Link href={ROUTES.home} className="mb-6 self-start rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
          <Image src="/brand/logo.svg" alt="Travel To Nepal" width={89} height={52} className="h-11 w-auto md:h-13" />
        </Link>
        <p className="inline-flex items-center gap-2 text-eyebrow text-brand uppercase">
          <Icon name="warning" size={18} />
          Something went wrong
        </p>
        <h1 className="max-w-155 text-h1-sm md:text-h1">This page didn’t load</h1>
        <p className="max-w-155 text-body-lg">
          Our website had a problem showing this page. Please try again in a moment. If you are planning a trek, we are still here on WhatsApp.
        </p>
        <div className="flex flex-wrap gap-2.5 pt-1.5">
          <button
            type="button"
            onClick={retry}
            className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand px-5 font-bold text-on-brand transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring max-md:w-full"
          >
            <Icon name="redo" size={18} />
            Try again
          </button>
          <ButtonLink href={getWhatsAppUrl()} variant="whatsapp" icon="whatsapp" isExternal className="max-md:w-full">
            Ask us on WhatsApp
          </ButtonLink>
        </div>
        {error.digest && <p className="pt-4 text-caption text-muted-foreground">Error reference: {error.digest}</p>}
      </div>
    </main>
  );
};

export default ErrorPage;
