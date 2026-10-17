import type { TrekDetailContent } from "../types";

type GuideContent = Pick<TrekDetailContent, "packing" | "fieldGuide" | "faqs">;

/** Langtang Valley packing list, field guide and FAQ, from the website design (Trek.dc.html). */
export const LANGTANG_VALLEY_GUIDE: GuideContent = {
  packing: {
    intro: "Tested gear for the valley: −10 °C nights at Kyanjin to 25 °C days in the forest.",
    groups: [
      {
        title: "Clothing and layering",
        icon: "apparel",
        items: [
          { title: "Base layers", text: "2–3 merino or synthetic tops and bottoms." },
          { title: "Fleece mid-layer", text: "a warm fleece or softshell." },
          { title: "Down jacket", text: "rated to about −10 °C for evenings at Kyanjin." },
          { title: "Waterproof shell", text: "jacket and trousers for rain and wind." },
        ],
      },
      {
        title: "Footwear and trail care",
        icon: "footprint",
        items: [
          { title: "Trekking boots", text: "waterproof, broken in, with ankle support." },
          { title: "Camp shoes", text: "light trainers or sandals for the teahouse." },
          { title: "Socks", text: "4–5 pairs of cushioned trekking socks." },
          { title: "Gaiters", text: "useful for spring mud on the lower trail." },
        ],
      },
      {
        title: "Gear and packs",
        icon: "backpack",
        items: [
          { title: "Daypack (25–35 L)", text: "with a rain cover for layers, water and snacks." },
          { title: "Duffel bag", text: "carried by your porter (max 15 kg)." },
          { title: "Sleeping bag", text: "comfort to −10 °C (you can rent one in Kathmandu)." },
          { title: "Trekking poles and headlamp", text: "for the descent and the sunrise hike." },
        ],
      },
      {
        title: "Health, hygiene and water",
        icon: "medical_services",
        items: [
          { title: "Water purification", text: "tablets or a UV pen, plus two 1 L bottles." },
          { title: "Medical kit", text: "blister plasters, painkillers, rehydration salts." },
          { title: "Sun protection", text: "SPF 50 sunscreen and lip balm." },
          { title: "Hygiene", text: "wet wipes, hand sanitizer and a quick-dry towel." },
        ],
      },
    ],
  },
  fieldGuide: {
    heading: "Langtang Valley Trek guide: best season, facilities and high-altitude safety",
    topics: [
      {
        title: "Best season and weather windows",
        icon: "wb_twilight",
        points: [
          { title: "Spring (March to May)", text: "warm days and rhododendron forest in bloom." },
          { title: "Autumn (October to November)", text: "the clearest skies of the year and stable temperatures." },
        ],
        note: "Winter (Dec–Feb) is clear but very cold at Kyanjin. The monsoon (Jun–Sep) brings rain, leeches and landslide risk on the road.",
      },
      {
        title: "Teahouse accommodation and facilities",
        icon: "cottage",
        points: [
          { title: "Rooms", text: "simple twin rooms with foam mattresses and blankets; use your sleeping bag on top." },
          { title: "Heating and showers", text: "dining rooms are warmed in the evening; hot showers cost a few dollars." },
          { title: "Wi-Fi and power", text: "charging and Wi-Fi are available in most lodges for a small fee." },
        ],
      },
      {
        title: "Food, nutrition and safe water",
        icon: "soup_kitchen",
        points: [
          { title: "Dal bhat", text: "rice, lentil soup, vegetables and pickle, with free refills." },
          { title: "Trail menus", text: "garlic soup, Tibetan bread, porridge, noodles, pasta and ginger tea." },
          { title: "Hydration", text: "drink 3–4 litres a day and treat your water; skip single-use plastic." },
        ],
      },
      {
        title: "Emergency plan and helicopter evacuation",
        icon: "emergency",
        points: [
          {
            title: "Rescue",
            text: "our Kathmandu office coordinates helicopter evacuation with your insurer if it is ever needed.",
          },
          {
            title: "On the trail",
            text: "your guide carries a first-aid kit and pulse oximeter and knows the nearest helipads.",
          },
          { title: "Insurance", text: "travel insurance covering emergency evacuation is required for every trekker." },
        ],
      },
    ],
  },
  faqs: [
    {
      title: "General information",
      icon: "calendar_month",
      items: [
        {
          question: "What are the highlights of the Langtang Valley Trek?",
          answer:
            "Sunrise on Kyanjin Ri with Langtang Lirung (7,227 m) in front of you, the monastery village of Kyanjin Gompa, Tamang villages and hospitality, the yak cheese factory, and the change from forest to glaciers in just a few days.",
        },
        {
          question: "What is the highest altitude on the trek?",
          answer:
            "Kyanjin Ri at 4,773 m (15,659 ft) on day 6. Strong walkers can climb Tserko Ri (4,984 m) instead. You sleep no higher than Kyanjin Gompa at 3,870 m.",
        },
        {
          question: "Why choose Langtang over Everest or Annapurna?",
          answer:
            "It is the closest big-mountain valley to Kathmandu, needs no domestic flight, and fits great Himalayan views into 10 days with fewer crowds.",
        },
      ],
    },
    {
      title: "Itinerary and duration",
      icon: "nordic_walking",
      items: [
        {
          question: "How long does the Langtang Valley Trek take?",
          answer:
            "Our standard itinerary is 10 days from Kathmandu and back, with 7 days on the trail. It can be shortened or extended to suit you.",
        },
        {
          question: "How do I get to the starting point?",
          answer: "A 7–8 hour drive by private jeep or local bus from Kathmandu to Syabrubesi (1,503 m), included in the price.",
        },
        {
          question: "How many hours do we walk each day?",
          answer: "Usually 5 to 7 hours at a steady pace, with breaks for photos, tea and lunch at a teahouse.",
        },
      ],
    },
    {
      title: "Trek difficulty and fitness",
      icon: "fitness_center",
      items: [
        {
          question: "How difficult is the Langtang Valley Trek?",
          answer: "Moderate, grade 3 of 5. There is no climbing, but long uphill days and the altitude need reasonable fitness.",
        },
        {
          question: "How should I train?",
          answer: "Stair climbing, weekend hikes in your boots with a light pack, and steady cardio for 6–8 weeks before you go.",
        },
      ],
    },
    {
      title: "Altitude and health",
      icon: "medical_services",
      items: [
        {
          question: "How do you prevent altitude sickness?",
          answer:
            "A gradual ascent, a slow and steady pace, oxygen and pulse checks twice a day, plenty of fluids, and descending at once if serious symptoms appear.",
        },
        {
          question: "What happens in an emergency?",
          answer:
            "Your guide carries a first-aid kit and pulse oximeter. If needed, our Kathmandu office arranges helicopter evacuation with your insurer.",
        },
      ],
    },
  ],
};
