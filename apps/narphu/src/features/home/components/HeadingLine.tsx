import { isRichTextEmpty } from "@ttn/ui/lib/richText";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

import { RichText } from "@/components/shared/RichText";

/** The line under a section's heading, written in the trek editor as rich text (it may link to other pages); nothing when empty. */
export const HeadingLine = ({ doc }: { doc: RichTextDoc }) => (isRichTextEmpty(doc) ? null : <RichText doc={doc} className="flex flex-col gap-2" />);
