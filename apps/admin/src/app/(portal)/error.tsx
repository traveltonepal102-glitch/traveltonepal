"use client";

import * as Sentry from "@sentry/nextjs";
import { isReportedByServer } from "@ttn/config/errorMonitoring";
import { Icon } from "@ttn/ui/icon";
import { useEffect } from "react";

import { primaryButton } from "@/components/ui/buttonStyles";

type PortalErrorProps = {
  error: unknown;
  retry: () => void;
};

/**
 * A signed-in screen that failed to load (e.g. the database didn't answer). The menu stays usable. A server error
 * was already reported by the server; one from the browser is reported here.
 */
const PortalError = ({ error, retry }: PortalErrorProps) => {
  useEffect(() => {
    if (!isReportedByServer(error)) Sentry.captureException(error);
  }, [error]);

  return (
    <section
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-solid border-border bg-surface px-6 py-14 text-center"
    >
      <span className="inline-flex size-14 items-center justify-center rounded-xl bg-danger-tint text-danger">
        <Icon name="error" size={28} />
      </span>
      <h1 className="m-0 font-display text-h3 text-ink">This screen couldn&apos;t load</h1>
      <p className="m-0 max-w-105 text-muted-foreground">
        Something went wrong on our side. Try again; if it keeps happening, tell your developer what you were opening.
      </p>
      <button type="button" onClick={retry} className={primaryButton}>
        Try again
      </button>
    </section>
  );
};

export default PortalError;
