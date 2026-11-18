/** Topographic lines behind the footer (the brand's contour motif, as on the legal pages): decoration only. */
export const FooterContours = () => (
  <svg aria-hidden="true" viewBox="0 0 900 600" className="pointer-events-none absolute -top-40 -right-60 h-[760px] w-[1140px] opacity-60 max-md:-right-120">
    {Array.from({ length: 10 }, (_, ring) => {
      const rx = 90 + ring * 52;
      const ry = 60 + ring * 36;
      return (
        <path
          key={ring}
          d={`M${560 - rx} 300 C${560 - rx} ${300 - ry * 1.1} ${560 + rx * 0.8} ${300 - ry * 1.25} ${560 + rx} ${300 - ry * 0.2} C${560 + rx * 1.05} ${300 + ry * 0.9} ${560 - rx * 0.4} ${300 + ry * 1.2} ${560 - rx} 300Z`}
          fill="none"
          stroke="var(--color-glacier)"
          strokeWidth="1"
          opacity={0.32 - ring * 0.025}
        />
      );
    })}
  </svg>
);
