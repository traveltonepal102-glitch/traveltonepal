import { Icon } from "@ttn/ui/icon";

type OfficeMapPreviewProps = {
  /** Google Maps link for the office (opens in a new tab). */
  mapsUrl: string;
  label?: string;
  className?: string;
};

/**
 * Drawn street map with a pin (decorative: no map loads, so no cookie consent is needed) and a button
 * that opens the office in Google Maps. Used on the About and Contact pages.
 */
export const OfficeMapPreview = ({ mapsUrl, label = "Travel To Nepal office", className = "min-h-85" }: OfficeMapPreviewProps) => (
  <div className={`relative overflow-hidden rounded-2xl border border-[#dde3d6] bg-[#eef0ea] ${className}`}>
    <svg aria-hidden="true" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
      <path d="M0 120 L600 90 M0 260 L600 300 M150 0 L190 400 M420 0 L380 400 M0 360 L600 330" stroke="#ffffff" strokeWidth="14" />
      <path d="M0 120 L600 90 M0 260 L600 300 M150 0 L190 400 M420 0 L380 400" stroke="#f6c26b" strokeWidth="5" />
      <rect x="230" y="150" width="120" height="80" rx="8" fill="#d5e7c9" />
    </svg>
    <svg aria-hidden="true" viewBox="0 0 24 32" className="absolute top-[42%] left-1/2 -mt-11 -ml-4.25 h-11.5 w-8.5">
      <path d="M12 1C6 1 1.5 5.4 1.5 11.2 1.5 19 12 31 12 31s10.5-12 10.5-19.8C22.5 5.4 18 1 12 1z" fill="#d93025" stroke="#a50e0e" />
      <circle cx="12" cy="11" r="4" fill="#ffffff" />
    </svg>
    <p className="absolute top-3 left-3 rounded-md bg-surface px-3 py-2 text-caption font-bold text-ink shadow-card">{label}</p>
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute bottom-4.5 left-1/2 inline-flex min-h-10.5 -translate-x-1/2 items-center gap-1.5 rounded-full bg-brand px-4 font-bold whitespace-nowrap text-on-brand shadow-raised hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <Icon name="map" size={18} />
      Open in Google Maps
    </a>
  </div>
);
