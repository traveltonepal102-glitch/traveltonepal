/**
 * Trek cards have one main link (the name), stretched over the card with `after:absolute after:inset-0`
 * and marked `data-trek-link`; the card shows the focus ring when that link has keyboard focus.
 */
export const STRETCHED_LINK = "outline-none after:absolute after:inset-0";

export const CARD_FOCUS_RING =
  "has-[[data-trek-link]:focus-visible]:outline-2 has-[[data-trek-link]:focus-visible]:outline-offset-2 has-[[data-trek-link]:focus-visible]:outline-ring";
