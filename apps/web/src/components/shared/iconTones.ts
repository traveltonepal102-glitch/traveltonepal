/** Icon tile colors, from the design system's tints (trek and region pages). */
export type IconTone = "green" | "saffron" | "brand" | "danger" | "navy";

export const ICON_TONES: Record<IconTone, string> = {
  green: "bg-green-tint text-whatsapp",
  saffron: "bg-saffron-tint text-saffron-deep",
  brand: "bg-brand-tint text-brand",
  danger: "bg-danger-tint text-danger",
  navy: "bg-navy/10 text-navy",
};
