import Image from "next/image";

/**
 * Hero photo (design: Main.dc.html, Gokyo Lake) with navy shading from the top and bottom so white text stays
 * readable, and the white wave at the bottom.
 */
export const HeroBackdrop = () => (
  <>
    <Image
      src="/images/gokyo-lake-everest.jpg"
      alt="Gokyo village and turquoise Gokyo Lake beside the Ngozumpa Glacier, with snow peaks of the Everest region behind"
      fill
      preload
      fetchPriority="high"
      sizes="100vw"
      className="object-cover object-[50%_55%]"
    />
    <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-navy/82 via-navy/45 via-38% to-navy/96" />
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
