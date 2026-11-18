type DayPlaces = { title: string; place: string; highPlace?: string; sleepAltitudeM?: number | null; altitudeM?: number };

/**
 * A capitalised name (one or more words) followed by its height in brackets: "Kala Patthar (5.545 m)",
 * "Nangkartshang (etwa 5.080 m)", "Everest Base Camp (5,364 m)".
 */
const NAME_BEFORE_HEIGHT = /((?:\p{Lu}[\p{L}'’-]*)(?:\s+\p{Lu}[\p{L}'’-]*)*)\s*\(\s*(?:etwa|ca\.|about|approx\.)?\s*(\d[\d.,]*)\s*m\s*\)/gu;

/** "5.364" and "5,364" are both 5364 metres. */
const metres = (digits: string) => Number(digits.replace(/[.,]/g, ""));

/** The names written with a height in the title: the one at the day's own altitude, else the first. */
const nameInTitle = (title: string, altitudeM?: number) => {
  const named = [...title.matchAll(NAME_BEFORE_HEIGHT)].map((match) => ({ name: match[1] ?? "", height: metres(match[2] ?? "") }));
  return (named.find((entry) => entry.height === altitudeM) ?? named[0])?.name;
};

/**
 * The name of a day's highest point, which its altitude measures: the pass or viewpoint when the day sleeps lower
 * (Larkya La), else where it sleeps (Samdo). A day saved without that name takes it from its title: the name written
 * before the day's own height ("…Gorak Shep (5.164 m) und zum Everest Base Camp (5.364 m)" at 5364 → "Everest Base
 * Camp"), else the first named height, else the whole title.
 */
export const topPlaceOf = ({ title, place, highPlace, sleepAltitudeM, altitudeM }: DayPlaces) => {
  const name = (sleepAltitudeM == null ? place : highPlace)?.trim();
  return name || nameInTitle(title, altitudeM) || title;
};
