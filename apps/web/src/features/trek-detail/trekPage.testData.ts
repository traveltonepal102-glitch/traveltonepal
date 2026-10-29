import type { TrekSummary } from "@/features/treks/types";
import type { WebTrekGuideRow, WebTrekPageRow, WebTrekPhotoRow } from "@/lib/supabase/database.types";

import type { TrekPageSource } from "./trekPageRows";

/**
 * Test data: the Langtang Valley Trek as the website's database views return it (web_trek_pages and friends),
 * so the page's mapping, elevation chart and SEO are tested on a real trek. Not used by the website itself.
 */
export const PHOTOS_BASE = "https://photos.example/photos";

export const LANGTANG_SUMMARY: TrekSummary = {
  slug: "langtang-valley",
  name: "Langtang Valley Trek",
  region: "Langtang",
  regionSlug: "langtang",
  route: [{ slug: "langtang", name: "Langtang" }],
  summary: "Glaciers, yak pastures and Tamang villages, close to Kathmandu with no flights.",
  days: 10,
  maxAltitudeM: 4773,
  difficulty: "Moderate",
  priceFromUsd: 890,
  seasonLabel: "Mar–May, Oct–Nov",
  seasons: ["spring", "autumn"],
  tags: ["classic"],
  badge: "Best value",
  isPopular: true,
  hasPage: true,
  image: { src: `${PHOTOS_BASE}/cover`, alt: "Langtang Valley Trek", variantWidths: [400, 800] },
};

export const LANGTANG_PAGE: WebTrekPageRow = {
  "id": "3ca0359a-1ee6-4007-a999-6ed90f307528",
  "slug": "langtang-valley",
  "locale": "en",
  "headline": "Langtang Valley Trek 10 Days (Itinerary, Cost, Complete Guide)",
  "short_name": "Langtang Trek",
  "seo_title": "Langtang Valley Trek 10 Days: Itinerary, Cost $890",
  "seo_description": "Private 10-day Langtang Valley Trek from Kathmandu with a local guide: no flights, a gradual ascent to Kyanjin Gompa and a sunrise on Kyanjin Ri (4,773 m).",
  "category": "Classic valley trek",
  "protected_area": "Langtang National Park",
  "current_season": "2026/2027",
  "days_note": "Kathmandu return",
  "grade": 3,
  "high_point": "Kyanjin Ri",
  "optional_high_point": "Tserko Ri",
  "optional_high_point_m": 4984,
  "introduction": {
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "The Langtang Valley Trek is the closest big-mountain trek to Kathmandu, and one of the most rewarding. A scenic drive takes you to Syabrubesi (1,503 m), where the trail follows the Langtang Khola through bamboo, oak and rhododendron forest, past yak pastures and Tamang villages, to Kyanjin Gompa (3,870 m): a monastery village ringed by glaciers. From there a sunrise climb of Kyanjin Ri (4,773 m) puts you face to face with Langtang Lirung (7,227 m)."
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Daily stages are short and the ascent is gradual, so it suits first-time trekkers as well as experienced walkers. You spend two nights at Kyanjin Gompa, with a free day for Kyanjin Ri or the longer climb to Tserko Ri (4,984 m), and sleep in family-run teahouses along the way."
          }
        ]
      }
    ]
  },
  "photo_badges": [
    {
      "label": "No flights needed",
      "icon": "route",
      "tone": "brand"
    },
    {
      "label": "Local guide-led",
      "icon": "nordic_walking",
      "tone": "green"
    },
    {
      "label": "Gradual ascent",
      "icon": "health_and_safety",
      "tone": "brand"
    }
  ],
  "highlights_heading": "Langtang Trek highlights and why you will love this trek",
  "highlights": [
    {
      "title": "Kyanjin Ri sunrise (4,773 m / 15,659 ft)",
      "text": "An early hike to the best viewpoint in the valley, with Langtang Lirung (7,227 m) and its glaciers right in front of you."
    },
    {
      "title": "Kyanjin Gompa monastery village (3,870 m)",
      "text": "A Buddhist monastery, prayer wheels and mani walls at the head of the valley, with two nights to explore."
    },
    {
      "title": "Tamang culture and hospitality",
      "text": "Stone villages, teahouses run by Tamang families and a culture closely linked to Tibet."
    },
    {
      "title": "Forest to glacier in four days",
      "text": "From bamboo and rhododendron forest to high yak pastures and glacial moraines."
    },
    {
      "title": "Yak cheese and local food",
      "text": "Visit the cheese factory at Kyanjin and taste fresh yak cheese and butter tea."
    },
    {
      "title": "Close to Kathmandu, no flights",
      "text": "A scenic drive to the trailhead means no weather delays on mountain flights."
    }
  ],
  "suitability_intro": "An honest checklist from our guides to help you prepare and decide if the Langtang Valley suits your goals.",
  "suitability_points": [
    {
      "title": "Physical demands and fitness",
      "text": "5 to 7 hours of walking a day on mountain trails with a light daypack (4–6 kg). Moderate stamina is enough."
    },
    {
      "title": "Altitude and acclimatization",
      "text": "You sleep no higher than 3,870 m and day hike to 4,773 m. Suitable for anyone in good health."
    },
    {
      "title": "Technical skill required",
      "text": "None. Trails, stone steps and some moraine. No ropes, crampons or climbing gear."
    },
    {
      "title": "Trail comfort and accommodation",
      "text": "Simple family-run teahouses with shared dining rooms and twin rooms. Not luxury hotels."
    },
    {
      "title": "Mental resilience",
      "text": "Be ready for changing mountain weather and cold nights below freezing at Kyanjin."
    },
    {
      "title": "Medical conditions",
      "text": "With heart or lung conditions or severe asthma, speak to your doctor before booking."
    }
  ],
  "itinerary_intro": {
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Ten unhurried days from Kathmandu to the glaciers of the upper Langtang valley and back. You drive to Syabrubesi, follow the river up through forest and Tamang villages, spend two nights at Kyanjin Gompa, and climb Kyanjin Ri at sunrise before walking back down the valley. Every night is in a family-run teahouse."
          }
        ]
      }
    ]
  },
  "days": [
    {
      "place": "Kathmandu",
      "title": "Arrive in Kathmandu (1,400 m), welcome and trip briefing",
      "subtitle": "Airport pickup · Gear check in Thamel",
      "duration": "Arrival",
      "altitude_m": 1400,
      "sleep_altitude_m": null,
      "is_high_point": false,
      "description": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Our team meets you at Tribhuvan International Airport and takes you to your hotel. In the evening we check your gear, sort the permits and talk you through the route."
              }
            ]
          }
        ]
      },
      "photo": null
    },
    {
      "place": "Syabrubesi",
      "title": "Drive Kathmandu to Syabrubesi (1,503 m)",
      "subtitle": "Scenic mountain road via Dhunche · Trishuli valley",
      "duration": "7–8 hrs drive",
      "altitude_m": 1503,
      "sleep_altitude_m": null,
      "is_high_point": false,
      "description": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "A long but beautiful drive north through terraced hills and the Trishuli valley to Syabrubesi, the trailhead village on the Bhote Koshi river."
              }
            ]
          }
        ]
      },
      "photo": null
    },
    {
      "place": "Lama Hotel",
      "title": "Syabrubesi to Lama Hotel (2,470 m) along the Langtang Khola",
      "subtitle": "River gorge · Bamboo and rhododendron forest",
      "duration": "6–7 hrs",
      "altitude_m": 2470,
      "sleep_altitude_m": null,
      "is_high_point": false,
      "description": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Cross the suspension bridge out of Syabrubesi and follow the river upstream through oak, bamboo and rhododendron forest. Look out for langur monkeys near the trail."
              }
            ]
          }
        ]
      },
      "photo": null
    },
    {
      "place": "Langtang",
      "title": "Lama Hotel to Langtang Village (3,430 m)",
      "subtitle": "Yak pastures · First views of Langtang Lirung",
      "duration": "6–7 hrs",
      "altitude_m": 3430,
      "sleep_altitude_m": null,
      "is_high_point": false,
      "description": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "The forest thins as the valley opens out at Ghoda Tabela. Yak pastures, water-driven prayer wheels and stone houses lead into the rebuilt Langtang village."
              }
            ]
          }
        ]
      },
      "photo": null
    },
    {
      "place": "Kyanjin Gompa",
      "title": "Langtang Village to Kyanjin Gompa (3,870 m)",
      "subtitle": "Short day · Monastery and yak cheese factory",
      "duration": "3–4 hrs",
      "altitude_m": 3870,
      "sleep_altitude_m": null,
      "is_high_point": false,
      "description": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "A short climb past long mani walls and chortens to Kyanjin Gompa. The afternoon is free to rest, visit the monastery and taste the local yak cheese."
              }
            ]
          }
        ]
      },
      "photo": null
    },
    {
      "place": "Kyanjin Ri",
      "title": "Sunrise hike up Kyanjin Ri (4,773 m), or Tserko Ri (4,984 m)",
      "subtitle": "The high point of the trek · Langtang Lirung up close",
      "duration": "5–7 hrs",
      "altitude_m": 4773,
      "sleep_altitude_m": 3870,
      "is_high_point": true,
      "description": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "An early start to Kyanjin Ri for sunrise on Langtang Lirung (7,227 m) and the glaciers that ring the valley. Strong walkers can choose Tserko Ri instead. Second night in Kyanjin."
              }
            ]
          }
        ]
      },
      "photo": null
    },
    {
      "place": "Lama Hotel",
      "title": "Kyanjin Gompa to Lama Hotel (2,470 m)",
      "subtitle": "Long descent down the valley",
      "duration": "6–7 hrs",
      "altitude_m": 2470,
      "sleep_altitude_m": null,
      "is_high_point": false,
      "description": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Retrace the valley downhill with the peaks behind you, dropping back into the forest for the night at Lama Hotel."
              }
            ]
          }
        ]
      },
      "photo": null
    },
    {
      "place": "Syabrubesi",
      "title": "Lama Hotel to Syabrubesi (1,503 m)",
      "subtitle": "Last trekking day · Celebrate with your team",
      "duration": "5–6 hrs",
      "altitude_m": 1503,
      "sleep_altitude_m": null,
      "is_high_point": false,
      "description": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "The final descent through the gorge to Syabrubesi, where we celebrate the end of the trek with your guide and porters."
              }
            ]
          }
        ]
      },
      "photo": null
    },
    {
      "place": "Kathmandu",
      "title": "Drive Syabrubesi to Kathmandu (1,400 m)",
      "subtitle": "Free evening in Thamel",
      "duration": "7–8 hrs drive",
      "altitude_m": 1400,
      "sleep_altitude_m": null,
      "is_high_point": false,
      "description": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Drive back to Kathmandu on the same scenic road. The evening is free for shopping and a farewell dinner."
              }
            ]
          }
        ]
      },
      "photo": null
    },
    {
      "place": "Kathmandu",
      "title": "Departure, or extend your stay in Nepal",
      "subtitle": "Airport transfer",
      "duration": "",
      "altitude_m": 1400,
      "sleep_altitude_m": null,
      "is_high_point": false,
      "description": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Transfer to the airport for your flight home, or stay on for another adventure in Nepal. We are happy to help plan it."
              }
            ]
          }
        ]
      },
      "photo": null
    }
  ],
  "guides_intro": "Hand-picked, licensed guides born in the Langtang valley, trained in wilderness first aid and focused on your safety.",
  "included": [
    {
      "title": "Ground transport",
      "text": "Kathmandu – Syabrubesi – Kathmandu by jeep or bus."
    },
    {
      "title": "Licensed guide and porters",
      "text": "first-aid trained, insured and fairly paid."
    },
    {
      "title": "Teahouse lodging",
      "text": "7 nights on the trek and 2 hotel nights in Kathmandu."
    },
    {
      "title": "Permits",
      "text": "Langtang National Park permit and TIMS card."
    },
    {
      "title": "Safety gear",
      "text": "pulse oximeter and first-aid kit."
    },
    {
      "title": "Airport transfers",
      "text": "arrival and departure in Kathmandu."
    }
  ],
  "excluded": [
    {
      "title": "Meals on the trek",
      "text": "order freely from the menu (about $20–30 a day)."
    },
    {
      "title": "International airfare",
      "text": "flights to and from Kathmandu."
    },
    {
      "title": "Travel insurance",
      "text": "required, with helicopter rescue cover."
    },
    {
      "title": "Nepal tourist visa",
      "text": "on arrival at the airport."
    },
    {
      "title": "Lodge extras",
      "text": "hot showers, battery charging and Wi-Fi."
    }
  ],
  "meal_budget_min_usd": 20,
  "meal_budget_max_usd": 30,
  "meal_trail_tips": [
    {
      "title": "“Dal bhat power”",
      "text": "unlimited refills of rice, lentils and vegetable curry. The best fuel at altitude."
    },
    {
      "title": "Go vegetarian higher up",
      "text": "meat is carried up without refrigeration, so we suggest vegetarian meals above Lama Hotel."
    },
    {
      "title": "Stay hydrated",
      "text": "drink 3–4 litres a day (ginger-lemon-honey tea, garlic soup, boiled water)."
    },
    {
      "title": "Cash is king",
      "text": "there are no ATMs on the trail. Bring enough Nepali rupees from Kathmandu."
    }
  ],
  "meal_teahouse_notes": [
    {
      "title": "Teahouse rule",
      "text": "eat breakfast and dinner where you sleep. Lodges keep room prices low because of it."
    },
    {
      "title": "Order early",
      "text": "order dinner around 5 pm and choose your breakfast time the night before."
    },
    {
      "title": "Small extras",
      "text": "showers, charging and Wi-Fi cost a few dollars each higher up."
    }
  ],
  "start_finish": "Kathmandu / Syabrubesi",
  "distance_km": 75,
  "daily_walking": "5 to 7 hours a day",
  "guide_ratio": "1 : 4 + porters",
  "accommodation": "Teahouse and hotel",
  "transport": "Jeep to Syabrubesi",
  "trek_start": "Syabrubesi, Rasuwa",
  "map_place": "Kyanjin Gompa, Langtang, Nepal",
  "my_maps_id": null,
  "packing_intro": "Tested gear for the valley: −10 °C nights at Kyanjin to 25 °C days in the forest.",
  "packing_groups": [
    {
      "title": "Clothing and layering",
      "icon": "apparel",
      "items": [
        {
          "title": "Base layers",
          "text": "2–3 merino or synthetic tops and bottoms."
        },
        {
          "title": "Fleece mid-layer",
          "text": "a warm fleece or softshell."
        },
        {
          "title": "Down jacket",
          "text": "rated to about −10 °C for evenings at Kyanjin."
        },
        {
          "title": "Waterproof shell",
          "text": "jacket and trousers for rain and wind."
        }
      ]
    },
    {
      "title": "Footwear and trail care",
      "icon": "footprint",
      "items": [
        {
          "title": "Trekking boots",
          "text": "waterproof, broken in, with ankle support."
        },
        {
          "title": "Camp shoes",
          "text": "light trainers or sandals for the teahouse."
        },
        {
          "title": "Socks",
          "text": "4–5 pairs of cushioned trekking socks."
        },
        {
          "title": "Gaiters",
          "text": "useful for spring mud on the lower trail."
        }
      ]
    },
    {
      "title": "Gear and packs",
      "icon": "backpack",
      "items": [
        {
          "title": "Daypack (25–35 L)",
          "text": "with a rain cover for layers, water and snacks."
        },
        {
          "title": "Duffel bag",
          "text": "carried by your porter (max 15 kg)."
        },
        {
          "title": "Sleeping bag",
          "text": "comfort to −10 °C (you can rent one in Kathmandu)."
        },
        {
          "title": "Trekking poles and headlamp",
          "text": "for the descent and the sunrise hike."
        }
      ]
    },
    {
      "title": "Health, hygiene and water",
      "icon": "medical_services",
      "items": [
        {
          "title": "Water purification",
          "text": "tablets or a UV pen, plus two 1 L bottles."
        },
        {
          "title": "Medical kit",
          "text": "blister plasters, painkillers, rehydration salts."
        },
        {
          "title": "Sun protection",
          "text": "SPF 50 sunscreen and lip balm."
        },
        {
          "title": "Hygiene",
          "text": "wet wipes, hand sanitizer and a quick-dry towel."
        }
      ]
    }
  ],
  "know_heading": "Langtang Valley Trek guide: best season, facilities and high-altitude",
  "know_topics": [
    {
      "icon": "wb_twilight",
      "title": "Best season and weather windows",
      "body": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Spring (March to May):",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "type": "text",
                "text": " warm days and rhododendron forest in bloom."
              }
            ]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Autumn (October to November):",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "type": "text",
                "text": " the clearest skies of the year and stable temperatures."
              }
            ]
          }
        ]
      },
      "note": "Winter (Dec–Feb) is clear but very cold at Kyanjin. The monsoon (Jun–Sep) brings rain, leeches and landslide risk on the road."
    },
    {
      "icon": "cottage",
      "title": "Teahouse accommodation and facilities",
      "body": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Rooms:",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "type": "text",
                "text": " simple twin rooms with foam mattresses and blankets; use your sleeping bag on top."
              }
            ]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Heating and showers:",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "type": "text",
                "text": " dining rooms are warmed in the evening; hot showers cost a few dollars."
              }
            ]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Wi-Fi and power:",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "type": "text",
                "text": " charging and Wi-Fi are available in most lodges for a small fee."
              }
            ]
          }
        ]
      },
      "note": ""
    },
    {
      "icon": "soup_kitchen",
      "title": "Food, nutrition and safe water",
      "body": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Dal bhat:",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "type": "text",
                "text": " rice, lentil soup, vegetables and pickle, with free refills."
              }
            ]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Trail menus:",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "type": "text",
                "text": " garlic soup, Tibetan bread, porridge, noodles, pasta and ginger tea."
              }
            ]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Hydration:",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "type": "text",
                "text": " drink 3–4 litres a day and treat your water; skip single-use plastic."
              }
            ]
          }
        ]
      },
      "note": ""
    },
    {
      "icon": "emergency",
      "title": "Emergency plan and helicopter evacuation",
      "body": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Rescue:",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "type": "text",
                "text": " our Kathmandu office coordinates helicopter evacuation with your insurer if it is ever needed."
              }
            ]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "On the trail:",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "type": "text",
                "text": " your guide carries a first-aid kit and pulse oximeter and knows the nearest helipads."
              }
            ]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Insurance:",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "type": "text",
                "text": " travel insurance covering emergency evacuation is required for every trekker."
              }
            ]
          }
        ]
      },
      "note": ""
    }
  ],
  "faqs": [
    {
      "title": "General information",
      "icon": "calendar_month",
      "items": [
        {
          "question": "What are the highlights of the Langtang Valley Trek?",
          "answer": {
            "type": "doc",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "type": "text",
                    "text": "Sunrise on Kyanjin Ri with Langtang Lirung (7,227 m) in front of you, the monastery village of Kyanjin Gompa, Tamang villages and hospitality, the yak cheese factory, and the change from forest to glaciers in just a few days."
                  }
                ]
              }
            ]
          }
        },
        {
          "question": "What is the highest altitude on the trek?",
          "answer": {
            "type": "doc",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "type": "text",
                    "text": "Kyanjin Ri at 4,773 m (15,659 ft) on day 6. Strong walkers can climb Tserko Ri (4,984 m) instead. You sleep no higher than Kyanjin Gompa at 3,870 m."
                  }
                ]
              }
            ]
          }
        },
        {
          "question": "Why choose Langtang over Everest or Annapurna?",
          "answer": {
            "type": "doc",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "type": "text",
                    "text": "It is the closest big-mountain valley to Kathmandu, needs no domestic flight, and fits great Himalayan views into 10 days with fewer crowds."
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      "title": "Itinerary and duration",
      "icon": "nordic_walking",
      "items": [
        {
          "question": "How long does the Langtang Valley Trek take?",
          "answer": {
            "type": "doc",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "type": "text",
                    "text": "Our standard itinerary is 10 days from Kathmandu and back, with 7 days on the trail. It can be shortened or extended to suit you."
                  }
                ]
              }
            ]
          }
        },
        {
          "question": "How do I get to the starting point?",
          "answer": {
            "type": "doc",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "type": "text",
                    "text": "A 7–8 hour drive by private jeep or local bus from Kathmandu to Syabrubesi (1,503 m), included in the price."
                  }
                ]
              }
            ]
          }
        },
        {
          "question": "How many hours do we walk each day?",
          "answer": {
            "type": "doc",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "type": "text",
                    "text": "Usually 5 to 7 hours at a steady pace, with breaks for photos, tea and lunch at a teahouse."
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      "title": "Trek difficulty and fitness",
      "icon": "fitness_center",
      "items": [
        {
          "question": "How difficult is the Langtang Valley Trek?",
          "answer": {
            "type": "doc",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "type": "text",
                    "text": "Moderate, grade 3 of 5. There is no climbing, but long uphill days and the altitude need reasonable fitness."
                  }
                ]
              }
            ]
          }
        },
        {
          "question": "How should I train?",
          "answer": {
            "type": "doc",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "type": "text",
                    "text": "Stair climbing, weekend hikes in your boots with a light pack, and steady cardio for 6–8 weeks before you go."
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      "title": "Altitude and health",
      "icon": "medical_services",
      "items": [
        {
          "question": "How do you prevent altitude sickness?",
          "answer": {
            "type": "doc",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "type": "text",
                    "text": "A gradual ascent, a slow and steady pace, oxygen and pulse checks twice a day, plenty of fluids, and descending at once if serious symptoms appear."
                  }
                ]
              }
            ]
          }
        },
        {
          "question": "What happens in an emergency?",
          "answer": {
            "type": "doc",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "type": "text",
                    "text": "Your guide carries a first-aid kit and pulse oximeter. If needed, our Kathmandu office arranges helicopter evacuation with your insurer."
                  }
                ]
              }
            ]
          }
        }
      ]
    }
  ],
  "group_prices": [
    {
      "label": "1 person (solo)",
      "short_label": "1 Pax",
      "price_usd": 1110,
      "team": "Private guide + private porter",
      "is_default": false
    },
    {
      "label": "2 people",
      "short_label": "2 Pax",
      "price_usd": 965,
      "team": "Guide + 1 porter",
      "is_default": false
    },
    {
      "label": "3–5 people",
      "short_label": "3–5 Pax",
      "price_usd": 890,
      "team": "Lead guide + assistant + porters",
      "is_default": true
    },
    {
      "label": "6–10 people",
      "short_label": "6–10",
      "price_usd": 815,
      "team": "Lead guide + 2 assistants + porters",
      "is_default": false
    },
    {
      "label": "11+ people",
      "short_label": "11+ Pax",
      "price_usd": 740,
      "team": "Full trekking team",
      "is_default": false
    }
  ],
  "region_month_ratings": ["possible", "possible", "best", "best", "best", "avoid", "avoid", "avoid", "possible", "best", "best", "possible"],
  "has_fixed_dates": true,
  "departures": [
    {
      "start_date": "2026-11-02",
      "status": "guaranteed",
      "note": "4 slots left"
    },
    {
      "start_date": "2026-11-16",
      "status": "guaranteed",
      "note": "6 slots left"
    },
    {
      "start_date": "2027-03-18",
      "status": "open",
      "note": "Spring bloom · 8 slots"
    },
    {
      "start_date": "2027-04-12",
      "status": "open",
      "note": "Peak season · Open"
    }
  ],
  "similar_slugs": [],
  "hidden_shared_sections": [],
  "section_order": []
};

export const LANGTANG_PHOTOS: WebTrekPhotoRow[] = [
  { trek_slug: "langtang-valley", position: 1, cover_id: "p2", cover_width: 800, cover_height: 600, cover_variant_widths: [400, 800], cover_placeholder: "", cover_place: "" },
  { trek_slug: "langtang-valley", position: 0, cover_id: "p1", cover_width: 800, cover_height: 600, cover_variant_widths: [400, 800], cover_placeholder: "", cover_place: "Kyanjin Gompa" },
];

export const LANGTANG_GUIDES: WebTrekGuideRow[] = [
  {
    trek_slug: "langtang-valley",
    position: 0,
    locale: "en",
    id: "g1",
    name: "Pasang Tamang",
    role: "Senior trek leader",
    quote: "In Langtang I know every teahouse family.",
    home_village: "Briddim",
    home_district: "Rasuwa",
    years_guiding: 16,
    languages: ["English", "Nepali", "Tamang"],
    badge: "local",
    is_licensed: false,
    has_wfr: true,
    has_first_aid: false,
    other_certificates: ["nathm"],
    cover_id: null,
    cover_width: null,
    cover_height: null,
    cover_variant_widths: null,
    cover_placeholder: null,
    cover_place: null,
  },
];

/** Other published treks, for "Explore more of the Himalaya". */
const otherTrek = (slug: string, regionSlug: string, days: number): TrekSummary => ({
  ...LANGTANG_SUMMARY,
  slug,
  name: slug,
  regionSlug,
  route: [{ slug: regionSlug, name: regionSlug }],
  days,
  isPopular: false,
  image: undefined,
});

export const OTHER_TREKS: TrekSummary[] = [
  otherTrek("tamang-heritage-trail", "tamang-heritage-trail", 7),
  otherTrek("everest-base-camp", "everest", 14),
  otherTrek("poon-hill", "annapurna", 5),
  otherTrek("mardi-himal", "mardi-himal", 7),
  otherTrek("kanchenjunga-base-camp", "kanchenjunga", 22),
];

export const langtangSource = (page: Partial<WebTrekPageRow> = {}, source: Partial<TrekPageSource> = {}): TrekPageSource => ({
  summary: LANGTANG_SUMMARY,
  page: { ...LANGTANG_PAGE, ...page },
  photos: LANGTANG_PHOTOS,
  guides: LANGTANG_GUIDES,
  treks: [LANGTANG_SUMMARY, ...OTHER_TREKS],
  regions: [],
  ...source,
});
