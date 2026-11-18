/**
 * Regions are Travel To Nepal's and named in English ("Everest Region"); this German website writes them the German
 * way ("Everest-Region"). A name without the word "Region" is shown as typed.
 */
export const regionName = (name: string) => name.trim().replace(/\s+region$/i, "-Region");
