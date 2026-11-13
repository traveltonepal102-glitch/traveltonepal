import type { WebTrekGuideRow, WebTrekPageRow, WebTrekRow } from "@ttn/site-data/database.types";
import { describe, expect, it } from "vitest";

import { toHomeGuideTeam } from "./homeTrekExtras";
import { toHomeTrek } from "./homeTrekRows";

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

const doc = (text: string) => ({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text }] }] });

const summary = {
  slug: "manaslu-circuit-trek",
  name: "Manaslu Circuit Trek",
  summary: "",
  region_name: "Manaslu",
  days: 13,
  difficulty: "challenging",
  max_altitude_m: 5106,
  season_label: "",
  price_from_usd: 1500,
  has_page: true,
  cover_id: null,
  cover_variant_widths: null,
} as unknown as WebTrekRow;

const page = {
  short_name: "Manaslu Circuit",
  protected_area: "Manaslu Conservation Area",
  start_finish: "Kathmandu",
  daily_walking: "",
  accommodation: " Teahouses ",
  hidden_shared_sections: [],
  section_order: ["faq", "itinerary", "intro", "pricing", "founder"],
  introduction: doc("From rice terraces to the pass."),
  highlights: [],
  highlights_heading: "",
  suitability_points: [],
  suitability_intro: "",
  suitability_heading: "",
  itinerary_intro: doc(""),
  itinerary_heading: "",
  days: [{ title: "Arrive", altitude_m: 1400, description: doc("Welcome."), is_high_point: false }, { title: "The pass", altitude_m: 5106, description: doc("Up."), is_high_point: true }],
  group_prices: [{ label: "1 person", short_label: "1", price_usd: 1590 }, { label: "3–5 people", short_label: "3–5", price_usd: 1280, is_default: true }],
  pricing_intro: "",
  pricing_heading: "",
  included: [{ title: "Permits", text: "All of them" }],
  excluded: [],
  inclusions_heading: "",
  packing_groups: [],
  packing_heading: "",
  packing_intro: "",
  packing_line: EMPTY_DOC,
  route_map_line: EMPTY_DOC,
  months_line: EMPTY_DOC,
  faqs: [{ title: "Trek", icon: "info", items: [{ question: "Is it hard?", answer: doc("Yes.") }, { question: "No answer", answer: doc("") }] }],
  faq_heading: "",
  region_month_ratings: ["avoid", "avoid", "best", "best", "best", "possible", "avoid", "avoid", "best", "best", "best", "possible"],
  pdf_map_path: null,
  guides_heading: "",
  guides_intro: "",
  meal_budget_min_usd: null,
  meal_budget_max_usd: null,
  meal_trail_tips: [],
  meal_teahouse_notes: [],
  my_maps_id: null,
  map_place: "",
  route_map_heading: "",
  know_heading: "",
  know_intro: "",
  know_topics: [],
  distance_km: null,
  transport: "",
  guide_ratio: "",
} as unknown as WebTrekPageRow;

const trek = (overrides: Partial<WebTrekPageRow> = {}, guides: readonly WebTrekGuideRow[] = []) => toHomeTrek({ summary, page: { ...page, ...overrides }, photos: [], guides }, "https://photos", "https://files");

describe("the home page's main trek", () => {
  it("keeps the trek editor's order, only for sections this design has and that have content", () => {
    // The editor's order first; a section missing from it comes back where it follows by default, full-width ones last.
    const { sections } = trek();
    expect(sections.indexOf("itinerary")).toBeLessThan(sections.indexOf("intro"));
    expect(sections.slice(-2)).toEqual(["faq", "booking_cta"]);
    expect(sections).not.toContain("highlights");
    expect(sections).not.toContain("packing");
    expect(sections).not.toContain("guides");
    expect(sections).not.toContain("route_map");
    expect(sections).not.toContain("field_guide");
  });

  it("passes on the lines under the packing list's and route map's headings as rich text, links kept", () => {
    const linked = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Permits", marks: [{ type: "link", attrs: { href: "/permits" } }] }] }] };
    const result = trek({ packing_line: linked, route_map_line: linked, map_place: "Samagaun" });
    expect(result.packing.line).toEqual(linked);
    expect(result.routeMap?.line).toEqual(linked);
    expect(trek().packing.line.content).toEqual([{ type: "paragraph" }]);
  });

  it("shows the company's sections unless the trek hides them", () => {
    const shared = ["founder", "consultation", "why_book", "credentials", "booking_form", "booking_cta"] as const;
    for (const section of shared) {
      expect(trek().sections).toContain(section);
      expect(trek({ hidden_shared_sections: [section] }).sections).not.toContain(section);
    }
  });

  it("has the trek's guides in the admin's order, with the region in the local badge", () => {
    const guide = (name: string, position: number) => ({ id: name, name, role: "Lead guide", position, badge: "local", home_village: "", home_district: "", quote: "", languages: ["English"], other_certificates: [], is_licensed: true, has_wfr: false, has_first_aid: false, years_guiding: 12 }) as unknown as WebTrekGuideRow;
    const result = trek({}, [guide("Second", 2), guide("First", 1)]);
    expect(result.sections).toContain("guides");
    expect(result.guides.team.map((person) => person.name)).toEqual(["First", "Second"]);
    expect(result.guides.team[0]).toMatchObject({ badge: "Manaslu local", certBadge: "Licensed", experience: "12+ years guiding", home: "Manaslu" });
  });

  it("leaves the word region out of the local badge", () => {
    expect(toHomeGuideTeam([{ id: "a", name: "A", role: "Guide", position: 1, badge: "local", home_village: "", home_district: "", quote: "", languages: [], other_certificates: [] } as unknown as WebTrekGuideRow], "Manaslu Region", "https://photos")[0]?.badge).toBe("Manaslu local");
  });

  it("builds the route map from a My Maps id, else the place, and leaves it out with neither", () => {
    expect(trek().routeMap).toBeNull();
    expect(trek({ map_place: "Samagaon, Nepal" }).routeMap).toMatchObject({ hasTrailLine: false });
    expect(trek({ my_maps_id: "12OcfrtJkhJ8Z3YFw" }).routeMap).toMatchObject({ hasTrailLine: true, heading: "Manaslu Circuit route map" });
  });

  it("has meals unless the trek hides them or says nothing about them", () => {
    expect(trek().meals).toBeNull();
    expect(trek({ meal_budget_min_usd: 25, meal_budget_max_usd: 35 }).meals?.budget).toEqual({ min: 25, max: 35 });
    expect(trek({ meal_budget_min_usd: 25, meal_budget_max_usd: 35, hidden_shared_sections: ["meals"] }).meals).toBeNull();
  });

  it("shows a field guide topic with words", () => {
    const result = trek({ know_topics: [{ title: "Season", icon: "route", body: doc("Go in spring."), note: "", photo: null }, { title: "Empty", icon: "route", body: doc(""), note: "", photo: null }] });
    expect(result.sections).toContain("field_guide");
    expect(result.fieldGuide.topics.map((topic) => topic.title)).toEqual(["Season"]);
  });

  it("leaves reviews out when the trek hides them", () => {
    expect(trek().sections).toContain("reviews");
    expect(trek({ hidden_shared_sections: ["reviews"] }).sections).not.toContain("reviews");
  });

  it("shows only the facts filled in", () => {
    expect(trek().facts.map((fact) => [fact.label, fact.value])).toEqual([
      ["Duration", "13 days"],
      ["Difficulty", "Challenging"],
      ["Highest point", "5,106 m"],
      ["Start and finish", "Kathmandu"],
      ["Stay", "Teahouses"],
    ]);
    expect(trek({ distance_km: 160, transport: "Jeep", guide_ratio: "1 : 4" }).facts.map((fact) => fact.value)).toEqual(expect.arrayContaining(["160 km", "Jeep", "1 : 4"]));
  });

  it("numbers the days and drops a question without an answer", () => {
    const result = trek();
    expect(result.itinerary.days.map((day) => day.number)).toEqual([1, 2]);
    expect(result.itinerary.days.map((day) => day.topPlace)).toEqual(["Arrive", "The pass"]);
    expect(result.faq.items.map((item) => item.question)).toEqual(["Is it hard?"]);
  });

  it("uses the short name in headings left blank, and the admin's words when typed", () => {
    expect(trek().faq.heading).toBe("Questions about the Manaslu Circuit");
    expect(trek({ faq_heading: "Your questions" }).faq.heading).toBe("Your questions");
  });

  it("puts the number of days before the itinerary's heading, as the trek editor expects", () => {
    expect(trek().itinerary.heading).toBe("2-day day-by-day itinerary");
    expect(trek({ itinerary_heading: "day-by-day route" }).itinerary.heading).toBe("2-day day-by-day route");
  });

  it("has best months only with all twelve ratings", () => {
    expect(trek().months?.ratings).toHaveLength(12);
    expect(trek({ region_month_ratings: ["best"] }).months).toBeNull();
  });
});
