import type { GuideArticleContent } from "../types";

/**
 * "Best time to trek Langtang". Text from the website design (Guide-article); the [BRACKETED] author
 * details wait for the writer's. Moves to Payload in the CMS phase.
 */
export const BEST_TIME_TO_TREK_LANGTANG: GuideArticleContent = {
  slug: "best-time-to-trek-langtang",
  standfirst:
    "Spring flowers or clear autumn skies? What each month is really like on the Langtang trail, from the forest at Syabrubesi to sunrise on Kyanjin Ri, and the months we recommend.",
  trekSlug: "langtang-valley",
  regionSlug: "langtang",
  bestMonths: "Oct–Nov & Mar–May",
  authorRole: "[Author role, e.g. Senior trek leader, Langtang]",
  authorBio: "[Short bio: years of guiding, regions known best, languages spoken.]",
  updatedForSeason: 2026,
  facts: [
    { icon: "wb_sunny", tone: "green", label: "Best months", value: "Oct–Nov, Mar–May" },
    { icon: "water_drop", tone: "brand", label: "Wettest months", value: "Jun–Aug (monsoon)" },
    { icon: "altitude", tone: "saffron", label: "Highest point", value: "4,773 m (15,659 ft)" },
    { icon: "wb_twilight", tone: "navy", label: "Coldest nights", value: "Dec–Feb, below 0 °C" },
  ],
  quickAnswer: [
    { strong: "October and November" },
    " give the clearest mountain views. ",
    { strong: "March to May" },
    " brings warm days and rhododendrons in bloom. December to February works if you can handle cold nights, and June to September is the wettest time of year.",
  ],
  intro: [
    "Langtang is the closest big-mountain valley to Kathmandu, so many trekkers fit it into a short trip. The good news: it has a long trekking season. The trick is matching the month to what you care about most, whether that is clear views, flowers, quiet trails or warmth.",
  ],
  sections: [
    {
      id: "seasons",
      tocLabel: "Seasons at a glance",
      title: "Langtang seasons at a glance",
      blocks: [{ type: "season-strip" }],
    },
    {
      id: "autumn",
      tocLabel: "Autumn",
      title: "Autumn (October to November): the clearest views",
      blocks: [
        {
          type: "paragraph",
          text: "After the monsoon rains wash the air clean, autumn brings the most reliable mountain views of the year. Days are dry and stable, and Langtang Lirung stands out sharply from Kyanjin Ri at sunrise. Nights at Kyanjin Gompa drop below freezing, especially in November.",
        },
        {
          type: "paragraph",
          text: "This is also the busiest season. Teahouses fill up in October, so we confirm your lodges early.",
        },
      ],
    },
    {
      id: "spring",
      tocLabel: "Spring",
      title: "Spring (March to May): warm days and flowers",
      blocks: [
        {
          type: "paragraph",
          text: "Spring is the warmest time to trek. The rhododendron forest between Syabrubesi and Lama Hotel is in bloom from March, and the valley turns green. Afternoons can bring haze or clouds, so start early for the best views.",
        },
        {
          type: "figure",
          image: { src: "/images/langtang-khola-river.jpg", alt: "The Langtang Khola river running through green forest in spring" },
          caption: "The forest along the Langtang Khola turns green in spring.",
        },
        { type: "trek-card" },
      ],
    },
    {
      id: "winter",
      tocLabel: "Winter",
      title: "Winter (December to February): quiet and cold",
      blocks: [
        {
          type: "paragraph",
          text: "Winter skies are often clear and the trail is quiet. The trade-off is cold: nights at Kyanjin are well below freezing and snow can close the higher viewpoints. With a warm sleeping bag and flexible plans, it can be a peaceful time to go.",
        },
      ],
    },
    {
      id: "monsoon",
      tocLabel: "Monsoon",
      title: "Monsoon (June to September): green but wet",
      blocks: [
        {
          type: "paragraph",
          text: "The monsoon brings daily rain, leeches on the lower trail and clouds over the peaks. Landslides can delay the drive to Syabrubesi. Late September is often a good compromise as the rain eases.",
        },
      ],
    },
    {
      id: "month-by-month",
      tocLabel: "Month by month",
      title: "Month by month",
      blocks: [
        {
          type: "month-table",
          months: [
            { onTheTrail: "Clear and very cold at night; snow possible higher up", crowds: "Low" },
            { onTheTrail: "Cold and clear, slowly warming", crowds: "Low" },
            { onTheTrail: "Warming up; rhododendrons begin to bloom lower down", crowds: "Medium" },
            { onTheTrail: "Warm days and flowers; some afternoon haze", crowds: "Busy" },
            { onTheTrail: "Warm; clouds build in the afternoon before the monsoon", crowds: "Medium" },
            { onTheTrail: "Monsoon begins; rain and leeches on the lower trail", crowds: "Low" },
            { onTheTrail: "Wettest month; landslide risk on the road", crowds: "Very low" },
            { onTheTrail: "Heavy rain, lush and green", crowds: "Very low" },
            { onTheTrail: "Rain easing late in the month; views improving", crowds: "Low" },
            { onTheTrail: "Clear skies and stable weather; cold nights", crowds: "Busiest" },
            { onTheTrail: "Crisp and clear; colder nights at Kyanjin", crowds: "Medium" },
            { onTheTrail: "Clear, cold and quiet", crowds: "Low" },
          ],
        },
        {
          type: "tip",
          title: "Our local tip",
          text: "For good weather with fewer people, start in late March or early November. You get most of the views with quieter teahouses.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What is the best month for the Langtang Valley Trek?",
      answer:
        "October, closely followed by November and April. October has the clearest skies; April has warmer days and flowers.",
    },
    {
      question: "Can I trek Langtang in winter?",
      answer:
        "Yes. December to February is quiet and often clear, but nights at Kyanjin are well below freezing. Bring a warm sleeping bag and allow a spare day for snow.",
    },
    {
      question: "Is Langtang possible in the monsoon?",
      answer:
        "It is possible but not ideal: expect rain most days, leeches lower down and clouds over the peaks. The road to Syabrubesi can be blocked by landslides.",
    },
  ],
  relatedSlugs: ["langtang-valley-trek-cost", "nepal-trekking-permits-by-region", "best-time-to-trek-in-nepal"],
  seo: {
    title: "Best time to trek Langtang: a month-by-month guide",
    description:
      "When to trek Langtang: clear views in October and November, flowers from March to May, quiet cold winters and the wet monsoon. Month by month, from local guides.",
  },
};
