import type { RichTextImage } from "@ttn/ui/lib/richText";

import { SiteImage } from "@/components/ui/SiteImage";
import { photosPublicBaseUrl } from "@/env";

/**
 * A photo from the photo library inside a text: its own shape (no cropping), at the size the screen needs. A text
 * column is at most about 760px wide, so larger sizes are never downloaded for it.
 */
export const RichTextPhoto = ({ image }: { image: RichTextImage }) => {
  const { photoId, alt, width, height, variantWidths } = image.attrs;
  return (
    <figure className="m-0">
      <div className="relative w-full overflow-hidden rounded-xl bg-muted" style={{ aspectRatio: `${width} / ${height}` }}>
        <SiteImage image={{ src: `${photosPublicBaseUrl}/${photoId}`, alt, variantWidths }} sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" />
      </div>
    </figure>
  );
};
