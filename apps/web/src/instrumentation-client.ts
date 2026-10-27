import * as Sentry from "@sentry/nextjs";
import { errorMonitoringOptions } from "@ttn/config/errorMonitoring";

// Error monitoring in the browser, before the app starts.
Sentry.init(errorMonitoringOptions());
