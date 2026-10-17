import type { RegionDetailContent } from "../types";

/** Demo content from the website design (Region.dc.html) until region pages come from Payload (CMS phase). */
export const LANGTANG: RegionDetailContent = {
  slug: "langtang",
  seo: {
    title: "Langtang trekking region: treks, best time and local guides",
    description:
      "Trek Langtang, the closest big-mountain valley to Kathmandu: glaciers, yak pastures and Kyanjin Gompa with no flight needed. Treks, best months, permits and local Tamang guides.",
  },
  district: "Rasuwa, Nepal",
  tagline: "Glaciers, yak pastures and Kyanjin Gompa — the closest big-mountain valley to Kathmandu, with no flight needed.",
  heroImage: { src: "/images/kyanjin-gompa-prayer-wheels.jpg", alt: "Prayer wheels at Kyanjin Gompa below the snow peaks of the Langtang valley" },
  location: { lat: 28.21, lon: 85.56 },
  trekLength: "7–12 days",
  difficulty: "Moderate",
  bestMonthsLabel: "Mar–May, Oct–Nov",
  heroHighlight: "No flights needed",
  facts: [
    { icon: "route", tone: "navy", label: "Getting there", value: "Drive, 7–8 hrs" },
    { icon: "description", tone: "navy", label: "Permits", value: "Langtang NP + local" },
  ],
  overview: {
    heading: "The valley next door to Kathmandu",
    paragraphs: [
      "Langtang is the valley the Tamang people call home, just 120 km north of Kathmandu. You drive to the trailhead, walk up through forest and villages rebuilt after the 2015 earthquake, and end below Langtang Lirung at the monastery of Kyanjin Gompa.",
      "It is the easiest big Himalayan region to reach without a flight, and the quietest of the classic valleys.",
    ],
    bestFor: ["Close to Kathmandu", "No flights"],
    points: [
      {
        icon: "landscape",
        tone: "brand",
        title: "Big mountains, fast",
        text: "Langtang Lirung (7,227 m) from Kyanjin Gompa after 4 days of walking.",
      },
      { icon: "temple_buddhist", tone: "saffron", title: "Tamang culture", text: "Monasteries, mani walls and villages that welcome trekkers." },
      { icon: "directions_walk", tone: "green", title: "Gentle climb", text: "Gradual height gain, good for a first Himalayan trek." },
      { icon: "volunteer_activism", tone: "navy", title: "Your money stays local", text: "Village teahouses and guides from the valley itself." },
    ],
  },
  gettingThere: [
    { icon: "route", label: "From Kathmandu", value: "120 km · 7–8 hours by jeep to Syabrubesi" },
    { icon: "flight_takeoff", label: "Nearest airport", value: "Kathmandu (KTM)" },
    { icon: "description", label: "Permits", value: "Langtang National Park + local area permit" },
    { icon: "hotel", label: "Where you sleep", value: "Family-run teahouses" },
  ],
  featuredTrek: {
    slug: "langtang-valley",
    label: "Our signature Langtang trek",
    pitch:
      "From the river gorge at Syabrubesi to Kyanjin Gompa and a sunrise on Kyanjin Ri (4,773 m). Gradual climb, teahouse stays, local Tamang guides.",
  },
  nearbyTreks: [
    {
      slug: "tamang-heritage-trail",
      label: "Nearby · same trailhead",
      note: "Village homestays and hot springs. Easy to combine with Langtang.",
    },
  ],
  customRoutePitch: "Langtang + Tamang Heritage, a shorter version, or Tserko Ri. We plan it around your days.",
  months: ["possible", "possible", "best", "best", "best", "avoid", "avoid", "avoid", "possible", "best", "best", "possible"],
  seasons: [
    { name: "Spring · Mar–May", rating: "best", text: "Warm days and rhododendron forests in bloom. Clouds often build after lunch." },
    { name: "Monsoon · Jun–Aug", rating: "avoid", text: "Daily rain, leeches and landslide risk on the road." },
    { name: "Autumn · Sep–Nov", rating: "best", text: "Clear skies and the best mountain views. Busiest in October." },
    { name: "Winter · Dec–Feb", rating: "possible", text: "Quiet and clear but cold; nights at Kyanjin Gompa reach −15 °C." },
  ],
  guideIds: ["senior-trek-leader", "solo-trekker-lead", "culture-specialist"],
  photos: [
    { src: "/images/langtang-peaks.jpg", alt: "Snow-covered boulders below Langtang Lirung", place: "Upper Langtang valley" },
    { src: "/images/kyanjin-gompa-chorten.jpg", alt: "Stone chorten above Kyanjin Gompa", place: "Kyanjin Gompa" },
    { src: "/images/tamang-heritage-village.jpg", alt: "Village houses on a terraced hillside", place: "Tamang Heritage Trail, next to Langtang" },
    { src: "/images/langtang-khola-river.jpg", alt: "The Langtang Khola in the forest", place: "Lower Langtang valley" },
    { src: "/images/trekkers-on-trail.jpg", alt: "The trail climbing above the river", place: "Langtang valley trail" },
    { src: "/images/langtang-glacier-peaks.jpg", alt: "Snow peaks of the Langtang Himal", place: "Langtang Himal" },
  ],
  articles: [
    {
      slug: "best-time-to-trek-langtang",
      title: "Best time to trek Langtang",
      category: "Seasons and weather",
      tone: "saffron",
      readMinutes: 8,
      image: { src: "/images/langtang-glacier-peaks.jpg", alt: "Snow peaks above the Langtang valley" },
    },
    {
      slug: "langtang-permits-and-costs",
      title: "Langtang permits and costs",
      category: "Planning and permits",
      tone: "brand",
      readMinutes: 7,
      image: { src: "/images/trekkers-on-trail.jpg", alt: "Trekkers on a mountain trail" },
    },
    {
      slug: "kyanjin-ri-or-tserko-ri",
      title: "Kyanjin Ri or Tserko Ri?",
      category: "Trek advice",
      tone: "green",
      readMinutes: 5,
      image: { src: "/images/langtang-peaks.jpg", alt: "Boulders below Langtang Lirung" },
    },
  ],
  faqs: [
    { question: "Where is Langtang?", answer: "In Rasuwa district, about 120 km north of Kathmandu, along the border with Tibet." },
    {
      question: "Do I need a flight to get to Langtang?",
      answer: "No. You drive to Syabrubesi in 7–8 hours by jeep or bus. That is one of the reasons it is great value.",
    },
    {
      question: "Which permits do I need?",
      answer: "A Langtang National Park permit and a local area permit. We arrange both before you arrive.",
    },
    {
      question: "Is Langtang safe after the 2015 earthquake?",
      answer:
        "Yes. The villages and trail have been rebuilt, and many teahouses are new. Your guide will tell you the story of Langtang village.",
    },
  ],
  compareWith: ["tamang-heritage-trail", "everest", "annapurna", "manaslu"],
};
