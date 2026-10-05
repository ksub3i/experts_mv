/**
 * Questionnaire options. `value`s are stored in the database (keep them stable);
 * `label`s are what customers see and can be edited freely.
 */

export const RENOVATION_TYPES = [
  { value: "kitchen", label: "Kitchen" },
  { value: "bathroom", label: "Bathroom" },
  { value: "full_home", label: "Full home / apartment" },
  { value: "exterior", label: "Exterior & painting" },
  { value: "repairs", label: "Repairs & maintenance" },
  { value: "commercial", label: "Commercial" },
  { value: "new_construction", label: "New construction" },
  { value: "other", label: "Other" },
] as const;

export type RenovationType = (typeof RENOVATION_TYPES)[number]["value"];

/** Step 2 choices, depending on the Step 1 answer. "other" asks for free text instead. */
export const WORK_TYPES: Record<Exclude<RenovationType, "other">, { value: string; label: string }[]> = {
  kitchen: [
    { value: "cabinets", label: "Cabinets" },
    { value: "countertops", label: "Countertops" },
    { value: "flooring", label: "Flooring" },
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical" },
    { value: "full_renovation", label: "Full renovation" },
  ],
  bathroom: [
    { value: "tiling", label: "Tiling" },
    { value: "shower_bath", label: "Shower or bath" },
    { value: "vanity_fixtures", label: "Vanity & fixtures" },
    { value: "plumbing", label: "Plumbing" },
    { value: "waterproofing", label: "Waterproofing" },
    { value: "full_renovation", label: "Full renovation" },
  ],
  full_home: [
    { value: "layout_changes", label: "Layout changes" },
    { value: "flooring", label: "Flooring" },
    { value: "ceilings", label: "Ceilings" },
    { value: "electrical_lighting", label: "Electrical & lighting" },
    { value: "painting", label: "Painting" },
    { value: "kitchen_bathrooms", label: "Kitchen & bathrooms" },
    { value: "full_renovation", label: "Full renovation" },
  ],
  exterior: [
    { value: "exterior_painting", label: "Exterior painting" },
    { value: "waterproofing", label: "Waterproofing" },
    { value: "facade_repair", label: "Facade repair" },
    { value: "roofing", label: "Roofing" },
    { value: "balconies_railings", label: "Balconies & railings" },
    { value: "windows_doors", label: "Windows & doors" },
  ],
  repairs: [
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical" },
    { value: "leaks_damp", label: "Leaks & damp" },
    { value: "doors_windows", label: "Doors & windows" },
    { value: "fixtures_fittings", label: "Fixtures & fittings" },
    { value: "general_maintenance", label: "General maintenance" },
  ],
  commercial: [
    { value: "office_fitout", label: "Office fit-out" },
    { value: "shop_cafe_fitout", label: "Shop or café fit-out" },
    { value: "guesthouse_hotel", label: "Guesthouse or hotel" },
    { value: "maintenance_contract", label: "Maintenance contract" },
    { value: "other_commercial", label: "Other commercial work" },
  ],
  new_construction: [
    { value: "design_planning", label: "Design & planning" },
    { value: "foundations_structure", label: "Foundations & structure" },
    { value: "full_build", label: "Full build" },
    { value: "project_management", label: "Project management" },
  ],
};

export const BUDGETS = [
  { value: "under_5k", label: "Under 5k MVR" },
  { value: "5k_10k", label: "5k – 10k MVR" },
  { value: "10k_25k", label: "10k – 25k MVR" },
  { value: "25k_50k", label: "25k – 50k MVR" },
  { value: "50k_100k", label: "50k – 100k MVR" },
  { value: "100k_plus", label: "100k+ MVR" },
  { value: "not_sure", label: "Not sure yet" },
] as const;

export const AREAS = [
  { value: "male", label: "Malé" },
  { value: "hulhumale", label: "Hulhumalé" },
  { value: "other", label: "Other island" },
] as const;

export const TIMELINES = [
  { value: "asap", label: "As soon as possible" },
  { value: "1_3_months", label: "In 1 – 3 months" },
  { value: "3_6_months", label: "In 3 – 6 months" },
  { value: "6_plus_months", label: "In 6+ months" },
  { value: "researching", label: "Just researching" },
] as const;

export const FILE_CATEGORIES = [
  { value: "existing_photos", label: "Existing room photos", hint: "Photos of the space as it is today" },
  { value: "floor_plans", label: "Floor plans", hint: "Drawings or sketches of the layout" },
  { value: "inspiration", label: "Inspiration", hint: "Styles or finishes you like" },
  { value: "measurements", label: "Measurements", hint: "Dimensions, notes or sketches" },
] as const;

export type FileCategory = (typeof FILE_CATEGORIES)[number]["value"];

export const UPLOAD_LIMITS = {
  maxFiles: 15,
  maxBytes: 15 * 1024 * 1024, // 15 MB, matches the storage bucket limit
  mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "application/pdf"],
  accept: "image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf,.heic,.heif",
};

export const values = <T extends readonly { value: string }[]>(list: T) =>
  list.map((o) => o.value) as unknown as [T[number]["value"], ...T[number]["value"][]];

export const labelFor = (list: readonly { value: string; label: string }[], value?: string) =>
  list.find((o) => o.value === value)?.label ?? value ?? "";
