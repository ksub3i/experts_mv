import type { Media } from "@/lib/types";

/**
 * TEMPORARY placeholder photography from Unsplash (free to use under the
 * Unsplash License — https://unsplash.com/license).
 *
 * The brand guidelines ask for real project photos, not stock, so replace
 * these with The Experts' own photography: put files in /public and set
 * `src: "/photos/…"`, then remove the Unsplash entry from next.config.ts.
 */
const unsplash = (id: string, alt: string): Media => ({
  src: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2400&q=80`,
  alt,
});

export const images = {
  homeHero: unsplash("photo-1517581177682-a085bb7ffb15", ""), // decorative background
  homeTeam: unsplash("photo-1541888946425-d81bb19240f5", ""),
  familyPanel: unsplash("photo-1742112125567-3e8967bad60f", "Team members reviewing plans together on a job site"),
  testimonials: unsplash("photo-1613490493576-7fde63acd811", ""),
  aboutHero: unsplash("photo-1541888894402-f3b1af908be4", ""),
  // Supplied by the client (public/photos). 500×500 — replace with a larger original (≥1000px) if available.
  storyMain: { src: "/photos/our-story-team.png", alt: "Two members of The Experts team standing by the water" } as Media,
  contact: unsplash("photo-1742112125635-6f8201c6ee3f", ""),

  services: {
    "interior-renovation": unsplash("photo-1593696140826-c58b021acf8b", "A renovated open-plan living and dining room"),
    "exterior-renovation": unsplash("photo-1778342259272-142fa3f81859", "A painter working on a house exterior"),
    "kitchens-bathrooms": unsplash("photo-1507089947368-19c1da9775ae", "A bright, newly fitted white kitchen"),
    "repairs-maintenance": unsplash("photo-1562259929-b4e1fd3aef09", "A power drill ready for a repair job"),
    "project-management": unsplash("photo-1608303588026-884930af2559", "People reviewing architectural plans on a desk"),
  },

  projects: {
    "sample-villa": [
      "photo-1719887805632-de5be825f72b",
      "photo-1721989519334-40923a0ee1c0",
      "photo-1692736933732-ad902fc34626",
      "photo-1560448204-e02f11c3d0e2",
      "photo-1649083048337-4aeb6dda80bb",
      "photo-1584622650111-993a426fbf0a",
      "photo-1651108066220-f61c22fc281f",
    ],
    "sample-apartment": [
      "photo-1738168279272-c08d6dd22002",
      "photo-1600489000022-c2086d79f9d4",
      "photo-1588854337221-4cf9fa96059c",
      "photo-1661107259637-4e1c55462428",
      "photo-1629079447777-1e605162dc8d",
      "photo-1666282167632-c613fbeb163c",
      "photo-1682184805271-11671b7ecf4c",
    ],
    "sample-guesthouse": [
      "photo-1760067538022-8ef8739b1b18",
      "photo-1771529173150-c3d266df0c0d",
      "photo-1668384264469-2846b84f3bf3",
      "photo-1602002418816-5c0aeef426aa",
      "photo-1786295866782-74a4ccb6f433",
      "photo-1786295866816-89841e942221",
      "photo-1777750050186-3a06f1edc000",
    ],
    "sample-cafe": [
      "photo-1648462908676-8305f0eff8e0",
      "photo-1728761390316-935ffeb3fbcc",
      "photo-1601065700897-d9fa1c093f3e",
      "photo-1729394405518-eaf2a0203aa7",
      "photo-1709548145082-04d0cde481d4",
      "photo-1621135177072-57c9b6242e7a",
      "photo-1618832515490-e181c4794a45",
    ],
    "sample-townhouse": [
      "photo-1625283518755-6047df2fb180",
      "photo-1605297507265-a46432d9c44d",
      "photo-1634586648651-f1fb9ec10d90",
      "photo-1674649207083-281c2517ab49",
      "photo-1736182615481-3795ea557614",
      "photo-1613545325278-f24b0cae1224",
      "photo-1633330977020-2bdfb8530cc2",
    ],
    "sample-residence": [
      "photo-1597047084897-51e81819a499",
      "photo-1628012209120-d9db7abf7eab",
      "photo-1598911096723-af003b4ea77a",
      "photo-1657346088167-b982455bf29a",
      "photo-1599619585752-c3edb42a414c",
      "photo-1786295866839-d17f879c65cd",
      "photo-1523217582562-09d0def993a6",
    ],
    "sample-office": [
      "photo-1660496247667-3fb697c396af",
      "photo-1560264280-88b68371db39",
      "photo-1606836576983-8b458e75221d",
      "photo-1541746972996-4e0b0f43e02a",
      "photo-1676311396794-f14881e9daaa",
      "photo-1645651964715-d200ce0939cc",
      "photo-1694522362256-6c907336af43",
    ],
  } as Record<string, string[]>,
};

/** Cover (first id) and gallery (rest) for a sample project. */
export function projectPhotos(slug: string, name: string) {
  const [cover, ...rest] = images.projects[slug] ?? [];
  return {
    cover: unsplash(cover, `${name} — project cover`),
    gallery: rest.map((id, i) => unsplash(id, `${name} — project photo ${i + 1}`)),
  };
}
