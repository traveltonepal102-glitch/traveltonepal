import Image from "next/image";

/**
 * Hero photo with navy shading so white text stays readable, and the white wave at the bottom.
 * Phones get stronger shading: there the text runs across the bright right side of the photo too.
 */
export const HeroBackdrop = () => (
  <>
    <Image
      src="/images/kyanjin-gompa-prayer-wheels.jpg"
      alt="Prayer wheels at Kyanjin Gompa with the snow peaks of the Langtang valley behind"
      fill
      preload
      sizes="100vw"
      className="object-cover object-[62%_40%]"
    />
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-linear-to-r from-navy/90 via-navy/75 to-navy/55 md:via-navy/65 md:via-48% md:to-navy/20"
    />
    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-42.5 bg-linear-to-b from-navy/75 to-transparent" />
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className="absolute inset-x-0 bottom-0 block h-18 w-full"
    >
      <path d="M0 80 L0 40 C 240 10, 420 60, 720 36 C 1000 14, 1200 58, 1440 28 L1440 80 Z" className="fill-surface" />
    </svg>
  </>
);
