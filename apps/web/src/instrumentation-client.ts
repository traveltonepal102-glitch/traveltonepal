import { startErrorMonitoring } from "@/lib/errorReporting";

// Error monitoring in the browser: set up before the app starts, downloaded once the page has loaded.
startErrorMonitoring();
