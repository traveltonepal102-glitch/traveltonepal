import { googleMapLinks } from "@ttn/site-data/googleMapLinks";
import type { SiteImageSource } from "@ttn/site-data/images";

import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { RouteMapFrame } from "@/features/home/components/RouteMapFrame";

const COLUMN_SIZES = "(min-width: 1024px) 780px, 100vw";

/** A photo with its caption. */
export const BlogImage = ({ image, caption }: { image: SiteImageSource; caption: string }) => (
  <figure className="flex flex-col gap-2">
    <div className="relative aspect-3/2 overflow-hidden rounded-2xl bg-sky">
      <SiteImage image={image} sizes={COLUMN_SIZES} className="object-cover" />
    </div>
    {caption && <figcaption className="text-sm leading-5 text-muted">{caption}</figcaption>}
  </figure>
);

/** Several photos side by side. */
export const BlogGallery = ({ images }: { images: readonly SiteImageSource[] }) => (
  <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
    {images.map((image) => (
      <li key={image.src} className="relative aspect-4/3 overflow-hidden rounded-xl bg-sky">
        <SiteImage image={image} sizes="(min-width: 1024px) 270px, 50vw" className="object-cover" />
      </li>
    ))}
  </ul>
);

/** A place on a Google map, loaded only on request or with "External media" allowed. */
export const BlogMap = ({ title, place }: { title: string; place: string }) => {
  const { embedUrl } = googleMapLinks({ place });
  return (
    <figure className="flex flex-col gap-2">
      <RouteMapFrame embedUrl={embedUrl} title={title || `Map of ${place}`} hidesTitleBar={false} />
      {title && <figcaption className="text-sm leading-5 text-muted">{title}</figcaption>}
    </figure>
  );
};

/** A PDF to open or save. */
export const BlogFile = ({ url, title, description, size }: { url: string; title: string; description: string; size: string }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 rounded-2xl border border-solid border-line p-4.5 text-text no-underline hover:border-navy">
    <span className="inline-flex size-12 flex-none items-center justify-center rounded-[10px] bg-sky text-navy">
      <TrailIcon name="doc" size={24} />
    </span>
    <span className="flex min-w-0 flex-col">
      <span className="font-semibold text-ink">{title}</span>
      {description && <span className="text-[15px] leading-5.5">{description}</span>}
      <span className="text-sm leading-5 text-muted">PDF{size && `, ${size}`} (opens in a new tab)</span>
    </span>
  </a>
);
