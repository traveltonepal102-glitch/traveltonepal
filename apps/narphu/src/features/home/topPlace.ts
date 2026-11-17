type DayPlaces = { title: string; place: string; highPlace?: string; sleepAltitudeM?: number | null };

/**
 * The name of a day's highest point, which its altitude measures: the pass or viewpoint when the day sleeps lower
 * (Larkya La), else where it sleeps (Samdo). A day saved without that name falls back to its title.
 */
export const topPlaceOf = ({ title, place, highPlace, sleepAltitudeM }: DayPlaces) => {
  const name = sleepAltitudeM == null ? place : highPlace;
  return name?.trim() || title;
};
