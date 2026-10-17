import type { TrekDetailContent } from "../types";
import { LANGTANG_VALLEY_GUIDE } from "./langtangValleyGuide";
import { LANGTANG_VALLEY_ITINERARY } from "./langtangValleyItinerary";

/** Demo content from the website design (Trek.dc.html) until trek pages come from Payload (CMS phase). */
export const LANGTANG_VALLEY: TrekDetailContent = {
  slug: "langtang-valley",
  headline: "Langtang Valley Trek 10 Days (Itinerary, Cost, Complete Guide)",
  shortName: "Langtang Trek",
  seo: {
    title: "Langtang Valley Trek 10 Days: Itinerary, Cost and Guide",
    description:
      "Private 10-day Langtang Valley Trek from Kathmandu with a local guide: no flights, a gradual ascent to Kyanjin Gompa and a sunrise on Kyanjin Ri (4,773 m), with clear group prices.",
  },
  category: "Classic valley trek",
  protectedArea: "Langtang National Park",
  currentSeason: "2026/2027",
  daysNote: "Kathmandu return",
  grade: 3,
  highPoint: "Kyanjin Ri",
  optionalHighPoint: { name: "Tserko Ri", altitudeM: 4984 },
  intro: [
    "The Langtang Valley Trek is the closest big-mountain trek to Kathmandu, and one of the most rewarding. A scenic drive takes you to Syabrubesi (1,503 m), where the trail follows the Langtang Khola through bamboo, oak and rhododendron forest, past yak pastures and Tamang villages, to Kyanjin Gompa (3,870 m): a monastery village ringed by glaciers. From there a sunrise climb of Kyanjin Ri (4,773 m) puts you face to face with Langtang Lirung (7,227 m).",
    "Daily stages are short and the ascent is gradual, so it suits first-time trekkers as well as experienced walkers. You spend two nights at Kyanjin Gompa, with a free day for Kyanjin Ri or the longer climb to Tserko Ri (4,984 m), and sleep in family-run teahouses along the way.",
  ],
  photos: [
    {
      src: "/images/kyanjin-gompa-prayer-wheels.jpg",
      alt: "Prayer wheels at Kyanjin Gompa with the snow peaks of the Langtang valley behind",
      place: "Kyanjin Gompa",
      altitudeM: 3870,
    },
    { src: "/images/langtang-glacier-peaks.jpg", alt: "Snow peaks above the Langtang glacier", place: "Langtang Himal" },
    { src: "/images/langtang-khola-river.jpg", alt: "The Langtang Khola in the forest", place: "Forest trail above the Langtang Khola" },
    { src: "/images/tamang-heritage-village.jpg", alt: "Village houses on a terraced hillside", place: "Tamang Heritage Trail, next to Langtang" },
    { src: "/images/kyanjin-gompa-chorten.jpg", alt: "Stone chorten above Kyanjin Gompa", place: "Kyanjin Gompa" },
    { src: "/images/langtang-peaks.jpg", alt: "Snow-covered boulders below Langtang Lirung", place: "Upper Langtang valley" },
    { src: "/images/trekkers-on-trail.jpg", alt: "The trail climbing above the river", place: "Langtang valley trail" },
  ],
  photoBadges: [
    { label: "No flights needed", icon: "route", tone: "brand" },
    { label: "Local guide-led", icon: "nordic_walking", tone: "green" },
    { label: "Gradual ascent", icon: "health_and_safety", tone: "brand" },
  ],
  highlightsHeading: "Langtang Trek highlights and why you will love this trek",
  highlights: [
    {
      title: "Kyanjin Ri sunrise (4,773 m / 15,659 ft)",
      text: "An early hike to the best viewpoint in the valley, with Langtang Lirung (7,227 m) and its glaciers right in front of you.",
    },
    {
      title: "Kyanjin Gompa monastery village (3,870 m)",
      text: "A Buddhist monastery, prayer wheels and mani walls at the head of the valley, with two nights to explore.",
    },
    {
      title: "Tamang culture and hospitality",
      text: "Stone villages, teahouses run by Tamang families and a culture closely linked to Tibet.",
    },
    {
      title: "Forest to glacier in four days",
      text: "From bamboo and rhododendron forest to high yak pastures and glacial moraines.",
    },
    {
      title: "Yak cheese and local food",
      text: "Visit the cheese factory at Kyanjin and taste fresh yak cheese and butter tea.",
    },
    {
      title: "Close to Kathmandu, no flights",
      text: "A scenic drive to the trailhead means no weather delays on mountain flights.",
    },
  ],
  suitability: {
    intro: "An honest checklist from our guides to help you prepare and decide if the Langtang Valley suits your goals.",
    points: [
      {
        title: "Physical demands and fitness",
        text: "5 to 7 hours of walking a day on mountain trails with a light daypack (4–6 kg). Moderate stamina is enough.",
      },
      {
        title: "Altitude and acclimatization",
        text: "You sleep no higher than 3,870 m and day hike to 4,773 m. Suitable for anyone in good health.",
      },
      {
        title: "Technical skill required",
        text: "None. Trails, stone steps and some moraine. No ropes, crampons or climbing gear.",
      },
      {
        title: "Trail comfort and accommodation",
        text: "Simple family-run teahouses with shared dining rooms and twin rooms. Not luxury hotels.",
      },
      { title: "Mental resilience", text: "Be ready for changing mountain weather and cold nights below freezing at Kyanjin." },
      {
        title: "Medical conditions",
        text: "With heart or lung conditions or severe asthma, speak to your doctor before booking.",
      },
    ],
  },
  ...LANGTANG_VALLEY_ITINERARY,
  ...LANGTANG_VALLEY_GUIDE,
  guides: {
    intro:
      "Hand-picked, licensed guides born in the Langtang valley, trained in wilderness first aid and focused on your safety.",
    guideIds: ["senior-trek-leader", "culture-specialist", "solo-trekker-lead", "safety-lead"],
  },
  inclusions: {
    included: [
      { title: "Ground transport", text: "Kathmandu – Syabrubesi – Kathmandu by jeep or bus." },
      { title: "Licensed guide and porters", text: "first-aid trained, insured and fairly paid." },
      { title: "Teahouse lodging", text: "7 nights on the trek and 2 hotel nights in Kathmandu." },
      { title: "Permits", text: "Langtang National Park permit and TIMS card." },
      { title: "Safety gear", text: "pulse oximeter and first-aid kit." },
      { title: "Airport transfers", text: "arrival and departure in Kathmandu." },
    ],
    excluded: [
      { title: "Meals on the trek", text: "order freely from the menu (about $20–30 a day)." },
      { title: "International airfare", text: "flights to and from Kathmandu." },
      { title: "Travel insurance", text: "required, with helicopter rescue cover." },
      { title: "Nepal tourist visa", text: "on arrival at the airport." },
      { title: "Lodge extras", text: "hot showers, battery charging and Wi-Fi." },
    ],
  },
  differentiators: {
    intro: "Why trekkers choose our locally led Langtang treks.",
    items: [
      {
        icon: "landscape",
        tone: "saffron",
        title: "100% local Langtang leadership",
        text: "Our trek leaders come from the Langtang and Rasuwa area and know every teahouse family by name.",
      },
      {
        icon: "health_and_safety",
        tone: "green",
        title: "Daily health checks",
        text: "Pulse oximeter readings morning and evening help catch altitude sickness early.",
      },
      {
        icon: "nordic_walking",
        tone: "brand",
        title: "Fair porter welfare",
        text: "Fair wages, insurance, warm gear and strict weight limits for every porter.",
      },
      {
        icon: "groups",
        tone: "saffron",
        title: "Small private groups",
        text: "Only your group, with personal pacing and quiet teahouse evenings.",
      },
      {
        icon: "volunteer_activism",
        tone: "navy",
        title: "Money stays local",
        text: "Booking direct with a Nepali company means your money supports families along the trail.",
      },
    ],
  },
  meals: {
    dailyBudgetUsd: { min: 20, max: 30 },
    trailTips: [
      { title: "“Dal bhat power”", text: "unlimited refills of rice, lentils and vegetable curry. The best fuel at altitude." },
      {
        title: "Go vegetarian higher up",
        text: "meat is carried up without refrigeration, so we suggest vegetarian meals above Lama Hotel.",
      },
      { title: "Stay hydrated", text: "drink 3–4 litres a day (ginger-lemon-honey tea, garlic soup, boiled water)." },
      { title: "Cash is king", text: "there are no ATMs on the trail. Bring enough Nepali rupees from Kathmandu." },
    ],
    teahouseNotes: [
      { title: "Teahouse rule", text: "eat breakfast and dinner where you sleep. Lodges keep room prices low because of it." },
      { title: "Order early", text: "order dinner around 5 pm and choose your breakfast time the night before." },
      { title: "Small extras", text: "showers, charging and Wi-Fi cost a few dollars each higher up." },
    ],
  },
  startFinish: "Kathmandu / Syabrubesi",
  distanceKm: 75,
  dailyWalking: "5 to 7 hours a day",
  guideRatio: "1 : 4 + porters",
  accommodation: "Teahouse and hotel",
  transport: "Jeep to Syabrubesi",
  groupPrices: [
    { label: "1 person (solo)", shortLabel: "1 Pax", priceUsd: 1110, team: "Private guide + private porter" },
    { label: "2 people", shortLabel: "2 Pax", priceUsd: 965, team: "Guide + 1 porter" },
    { label: "3–5 people", shortLabel: "3–5 Pax", priceUsd: 890, team: "Lead guide + assistant + porters", isDefault: true },
    { label: "6–10 people", shortLabel: "6–10", priceUsd: 815, team: "Lead guide + 2 assistants + porters" },
    { label: "11+ people", shortLabel: "11+ Pax", priceUsd: 740, team: "Full trekking team" },
  ],
  departures: [
    { date: "2026-11-02", isGuaranteed: true, note: "4 slots left" },
    { date: "2026-11-16", isGuaranteed: true, note: "6 slots left" },
    { date: "2027-03-18", isGuaranteed: false, note: "Spring bloom · 8 slots" },
    { date: "2027-04-12", isGuaranteed: false, note: "Peak season · Open" },
  ],
};
