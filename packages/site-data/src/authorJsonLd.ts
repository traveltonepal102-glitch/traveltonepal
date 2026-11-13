type JsonLdAuthor = {
  name: string;
  /** Job title; "" for none. */
  role: string;
  /** The author's profile links from the admin's "Profile links for Google", the main one first. */
  profileLinks: readonly string[];
};

/**
 * A blog's or travel guide's author as a schema.org Person. The websites have no author pages, so the main profile link
 * is the author's `url` and every link is in `sameAs`: that is how Google knows who the author is.
 */
export const authorJsonLd = ({ name, role, profileLinks }: JsonLdAuthor) => ({
  "@type": "Person",
  name,
  ...(role ? { jobTitle: role } : {}),
  ...(profileLinks.length > 0 ? { url: profileLinks[0], sameAs: [...profileLinks] } : {}),
});
