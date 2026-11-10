import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { PHOTO_SIZES } from "../lib/photoSizes";
import type { PhotoSize } from "../lib/photoSizes";

/** "Best size: …" for a photo field, so uploads fit the website's box instead of being trimmed. */
export const PhotoSizeNote = ({ size, className }: { size: PhotoSize; className?: string }) => {
  const { best, note } = PHOTO_SIZES[size];
  return (
    <p className={cn("m-0 flex items-start gap-1.5 text-xs text-muted-foreground", className)}>
      <Icon name="info" size={14} className="mt-px flex-none text-brand" />
      <span>
        <strong className="font-semibold text-text">Best size: {best}.</strong> {note}
      </span>
    </p>
  );
};
