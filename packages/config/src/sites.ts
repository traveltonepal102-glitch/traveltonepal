/** The main site's id (traveltonepal.com). Region sites are rows in the database's sites table. */
export const MAIN_SITE_ID = "ttn";

/** A site's id, as in the sites table: lowercase letters and digits, with single hyphens between them. */
export const SITE_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
