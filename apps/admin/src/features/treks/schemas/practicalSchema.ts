import { z } from "zod";

import { readList, text } from "@/lib/forms/formFields";

import { MAX_PACKING_GROUPS, MAX_PACKING_ITEMS, PACKING_ICON_VALUES, TREK_LIMITS as LIMIT } from "../constants";
import { parseMyMapsId } from "../lib/googleMaps";
import { pointsSchema, readPoints } from "./pointsSchema";

/** A pasted My Maps link (or id) → the id; "" → null. */
export const myMapsIdSchema = z.string().transform((value, context) => {
  const result = parseMyMapsId(value);
  if (result.ok) return result.id;
  context.addIssue({
    code: "custom",
    message: "Paste the map's share link from Google My Maps (it has “mid=” in it). Short maps.app.goo.gl links don't work here.",
  });
  return z.NEVER;
});

const packingGroupSchema = z
  .object({
    title: text(LIMIT.packingGroupTitle),
    icon: z.enum(PACKING_ICON_VALUES, "Pick an icon."),
    items: pointsSchema(MAX_PACKING_ITEMS),
  })
  .superRefine((group, context) => {
    if (Boolean(group.title) === Boolean(group.items.length)) return;
    if (group.title) context.addIssue({ code: "custom", path: ["items"], message: "Add at least one item, or remove this card." });
    else context.addIssue({ code: "custom", path: ["title"], message: "Write the card's title, or remove this card." });
  });

/** The packing cards. A card with no title and no items is ignored (errors keep the card's number). */
export const packingGroupsSchema = z
  .array(packingGroupSchema)
  .transform((groups) => groups.filter((group) => group.title))
  .refine((groups) => groups.length <= MAX_PACKING_GROUPS, `Keep it to ${MAX_PACKING_GROUPS} cards.`);

/** Packing cards in FormData: packingGroupTitle / packingGroupIcon per card, and its items as packingItem<card>Title/Text. */
export const readPackingGroups = (formData: FormData) => {
  const icons = readList(formData, "packingGroupIcon");
  return readList(formData, "packingGroupTitle").map((title, index) => ({
    title,
    icon: icons[index] ?? "",
    items: readPoints(formData, `packingItem${index}`),
  }));
};
