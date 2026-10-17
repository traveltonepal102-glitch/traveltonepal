export type JsonLdData = Record<string, unknown>;

/** JSON for a <script> tag: "<" is escaped so text from the CMS can never close the tag early. */
export const serializeJsonLd = (data: JsonLdData) => JSON.stringify(data).replace(/</g, "\\u003c");
