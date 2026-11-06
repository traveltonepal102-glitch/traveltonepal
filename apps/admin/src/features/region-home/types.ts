import type { TrekStatusValue } from "@/lib/supabase/database.types";

/** What a region Home keeps in its page row's `content`, beside the top in its columns. */
export type HomeTopContent = {
  /** The hero photo's description (alt text), for Google and screen readers. */
  photoAlt: string;
  /** The hero's WhatsApp button. */
  buttonLabel: string;
  /** The hero's second button (jumps down the page); "" for none. */
  secondLabel: string;
};

/** One of the website's treks, to pick as its main trek. */
export type HomeTrekOption = { id: string; name: string; status: TrekStatusValue };
