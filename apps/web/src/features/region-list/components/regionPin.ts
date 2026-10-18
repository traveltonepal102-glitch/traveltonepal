/** What a pin on the Google map shows. */
export type PinRegion = { number: number; name: string };

const CIRCLE =
  "inline-flex items-center justify-center rounded-full border-[3px] border-white font-display font-extrabold text-white shadow-md";
const CIRCLE_NORMAL = "size-7 bg-brand text-sm";
const CIRCLE_SELECTED = "size-9.5 bg-saffron text-base text-ink ring-8 ring-saffron/30";
const LABEL = "rounded-sm bg-white px-2 py-0.5 font-display text-sm font-extrabold whitespace-nowrap text-navy shadow-card";

/**
 * Pin content for a Google Maps Advanced Marker: the region number in a circle, with the name above
 * it when selected. Google places DOM it is given, so this builds DOM (classes are full strings so
 * Tailwind generates them).
 */
export const createPinElement = (region: PinRegion, isSelected: boolean): HTMLElement => {
  const pin = document.createElement("div");
  pin.className = "flex flex-col items-center gap-1";

  if (isSelected) {
    const label = document.createElement("span");
    label.className = LABEL;
    label.textContent = region.name;
    pin.append(label);
  }

  const circle = document.createElement("span");
  circle.className = `${CIRCLE} ${isSelected ? CIRCLE_SELECTED : CIRCLE_NORMAL}`;
  circle.textContent = String(region.number);
  pin.append(circle);
  return pin;
};
