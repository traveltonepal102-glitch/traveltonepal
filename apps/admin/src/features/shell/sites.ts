export type AdminSite = {
  id: string;
  /** Two or three letters for the tile. */
  mono: string;
  name: string;
  /** null until the site has its domain. */
  domain: string | null;
};

export const ALL_SITES_ID = "all";

/**
 * The sites in the network (design: the "Working on" switcher). Static until sites come from the
 * database; picking one doesn't filter anything yet.
 */
export const ADMIN_SITES: AdminSite[] = [
  { id: ALL_SITES_ID, mono: "ALL", name: "All sites", domain: "10 websites · EN + DE" },
  { id: "ttn", mono: "TTN", name: "Travel To Nepal", domain: "traveltonepal.com" },
  { id: "langtang", mono: "LT", name: "Langtang", domain: null },
  { id: "everest", mono: "EV", name: "Everest", domain: null },
  { id: "annapurna", mono: "AN", name: "Annapurna", domain: null },
  { id: "manaslu", mono: "MA", name: "Manaslu", domain: null },
  { id: "mardi-himal", mono: "MH", name: "Mardi Himal", domain: null },
  { id: "kanchenjunga", mono: "KA", name: "Kanchenjunga", domain: null },
  { id: "nar-phu", mono: "NP", name: "Nar Phu", domain: null },
  { id: "pikey-peak", mono: "PP", name: "Pikey Peak", domain: null },
  { id: "tamang-heritage", mono: "TH", name: "Tamang Heritage", domain: null },
];

export const NO_DOMAIN_LABEL = "Domain not set yet";
