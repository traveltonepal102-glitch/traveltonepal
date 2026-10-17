import type { TrekDetailContent } from "../types";

type ItineraryContent = Pick<TrekDetailContent, "itinerary" | "routeSketch" | "trailhead" | "routeMap" | "customization">;

/** Langtang Valley itinerary, route (sketch, trailhead, Google map) and custom-trip options, from Trek.dc.html. */
export const LANGTANG_VALLEY_ITINERARY: ItineraryContent = {
  itinerary: {
    intro:
      "Ten unhurried days from Kathmandu to the glaciers of the upper Langtang valley and back. You drive to Syabrubesi, follow the river up through forest and Tamang villages, spend two nights at Kyanjin Gompa, and climb Kyanjin Ri at sunrise before walking back down the valley. Every night is in a family-run teahouse.",
    days: [
      {
        place: "Kathmandu",
        title: "Arrive in Kathmandu (1,400 m), welcome and trip briefing",
        subtitle: "Airport pickup · Gear check in Thamel",
        duration: "Arrival",
        altitudeM: 1400,
        text: "Our team meets you at Tribhuvan International Airport and takes you to your hotel. In the evening we check your gear, sort the permits and talk you through the route.",
      },
      {
        place: "Syabrubesi",
        title: "Drive Kathmandu to Syabrubesi (1,503 m)",
        subtitle: "Scenic mountain road via Dhunche · Trishuli valley",
        duration: "7–8 hrs drive",
        altitudeM: 1503,
        text: "A long but beautiful drive north through terraced hills and the Trishuli valley to Syabrubesi, the trailhead village on the Bhote Koshi river.",
      },
      {
        place: "Lama Hotel",
        title: "Syabrubesi to Lama Hotel (2,470 m) along the Langtang Khola",
        subtitle: "River gorge · Bamboo and rhododendron forest",
        duration: "6–7 hrs",
        altitudeM: 2470,
        photo: { src: "/images/langtang-khola-river.jpg", alt: "The Langtang Khola river running through the forested valley" },
        text: "Cross the suspension bridge out of Syabrubesi and follow the river upstream through oak, bamboo and rhododendron forest. Look out for langur monkeys near the trail.",
      },
      {
        place: "Langtang",
        title: "Lama Hotel to Langtang Village (3,430 m)",
        subtitle: "Yak pastures · First views of Langtang Lirung",
        duration: "6–7 hrs",
        altitudeM: 3430,
        photo: { src: "/images/tamang-heritage-village.jpg", alt: "Stone houses of a Tamang village on the hillside" },
        text: "The forest thins as the valley opens out at Ghoda Tabela. Yak pastures, water-driven prayer wheels and stone houses lead into the rebuilt Langtang village.",
      },
      {
        place: "Kyanjin Gompa",
        title: "Langtang Village to Kyanjin Gompa (3,870 m)",
        subtitle: "Short day · Monastery and yak cheese factory",
        duration: "3–4 hrs",
        altitudeM: 3870,
        photo: { src: "/images/kyanjin-gompa-chorten.jpg", alt: "Stone chorten above Kyanjin Gompa" },
        text: "A short climb past long mani walls and chortens to Kyanjin Gompa. The afternoon is free to rest, visit the monastery and taste the local yak cheese.",
      },
      {
        place: "Kyanjin Ri",
        title: "Sunrise hike up Kyanjin Ri (4,773 m), or Tserko Ri (4,984 m)",
        subtitle: "The high point of the trek · Langtang Lirung up close",
        duration: "5–7 hrs",
        altitudeM: 4773,
        sleepAltitudeM: 3870,
        isHighPoint: true,
        photo: { src: "/images/langtang-peaks.jpg", alt: "Snow-covered boulders below Langtang Lirung, seen from Tserko Ri" },
        text: "An early start to Kyanjin Ri for sunrise on Langtang Lirung (7,227 m) and the glaciers that ring the valley. Strong walkers can choose Tserko Ri instead. Second night in Kyanjin.",
      },
      {
        place: "Lama Hotel",
        title: "Kyanjin Gompa to Lama Hotel (2,470 m)",
        subtitle: "Long descent down the valley",
        duration: "6–7 hrs",
        altitudeM: 2470,
        photo: { src: "/images/trekkers-on-trail.jpg", alt: "Trekkers on a mountain trail" },
        text: "Retrace the valley downhill with the peaks behind you, dropping back into the forest for the night at Lama Hotel.",
      },
      {
        place: "Syabrubesi",
        title: "Lama Hotel to Syabrubesi (1,503 m)",
        subtitle: "Last trekking day · Celebrate with your team",
        duration: "5–6 hrs",
        altitudeM: 1503,
        text: "The final descent through the gorge to Syabrubesi, where we celebrate the end of the trek with your guide and porters.",
      },
      {
        place: "Kathmandu",
        title: "Drive Syabrubesi to Kathmandu (1,400 m)",
        subtitle: "Free evening in Thamel",
        duration: "7–8 hrs drive",
        altitudeM: 1400,
        text: "Drive back to Kathmandu on the same scenic road. The evening is free for shopping and a farewell dinner.",
      },
      {
        place: "Kathmandu",
        title: "Departure, or extend your stay in Nepal",
        subtitle: "Airport transfer",
        altitudeM: 1400,
        text: "Transfer to the airport for your flight home, or stay on for another adventure in Nepal. We are happy to help plan it.",
      },
    ],
  },
  routeSketch: {
    description: "Sketch map of the route from Syabrubesi to Kyanjin Ri",
    caption: "Langtang Valley Trek route overview (Kathmandu – Syabrubesi – Kyanjin Gompa)",
    groundPath: "M0 330 C 120 300, 260 330, 380 300 S 560 230, 700 240 S 900 260, 1000 250 L1000 560 L0 560 Z",
    peaksPath: "M470 30 L520 70 L560 40 L610 85 L560 110 L500 100 Z M660 40 L720 75 L770 50 L840 95 L790 120 L700 105 Z",
    riverPath: "M20 470 C 80 450, 100 448, 140 442 S 300 398, 380 382 S 540 300, 620 272 S 760 228, 820 220 S 930 205, 1000 196",
    routePath: "M120 430 C 200 405, 280 385, 360 360 S 520 285, 610 250 S 730 212, 780 205",
    sideHikePath: "M780 205 C 790 175, 795 150, 805 120",
    pins: [
      { name: "Syabrubesi", altitudeM: 1503, x: 120, y: 430, kind: "start" },
      { name: "Lama Hotel", altitudeM: 2470, x: 360, y: 360, kind: "stop" },
      { name: "Langtang", altitudeM: 3430, x: 610, y: 250, kind: "stop" },
      { name: "Kyanjin Gompa", altitudeM: 3870, x: 780, y: 205, kind: "stop" },
      { name: "Kyanjin Ri", altitudeM: 4773, x: 805, y: 120, kind: "summit", labelSide: "left" },
      { name: "Tserko Ri", altitudeM: 4984, x: 905, y: 232, kind: "option" },
    ],
    labels: [
      { text: "Syabrubesi", x: 120, y: 480 },
      { text: "Langtang", x: 610, y: 300 },
      { text: "Kyanjin", x: 780, y: 255 },
      { text: "Kyanjin Ri", x: 805, y: 95 },
    ],
    approachPath: "M0 548 C 50 520, 90 470, 120 430",
    optionPath: "M780 205 C 830 214, 870 222, 905 232",
    mapLabels: [
      { text: "Langtang National Park", x: 300, y: 250, kind: "park" },
      { text: "▲ Langtang Lirung 7,227 m", x: 500, y: 140, kind: "peak" },
      { text: "To Kathmandu", x: 60, y: 520, kind: "road" },
      { text: "Langtang Khola", x: 700, y: 290, kind: "water" },
    ],
  },
  trailhead: { name: "Syabrubesi", altitudeM: 1503 },
  // TODO(owner): add `myMapsId` once the GPS route is on Google My Maps, to show the trail line.
  routeMap: { place: "Kyanjin Gompa, Langtang, Nepal" },
  customization: {
    pitch:
      "Want to match your own pace, fitness, group or holiday dates? Tell us what you have in mind and our Kathmandu team will change the route as many times as you need, until it is the Langtang trek you want.",
    options: [
      { label: "Extra rest day", icon: "calendar_month" },
      { label: "Add Tserko Ri or Gosaikunda", icon: "landscape" },
      { label: "Private guide and porter", icon: "groups" },
      { label: "Slower or faster pace", icon: "tune" },
    ],
  },
};
