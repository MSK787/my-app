/**
 * Central product catalog for the store.
 *
 * All product information lives here so the rest of the app can stay simple —
 * pages and components only *read* from this file.
 * To change a price, name or add a product, edit the arrays below.
 */

export type CategoryId =
  | "solar-panels"
  | "inverters"
  | "batteries"
  | "cables"
  | "protection"
  | "mounting";

export interface Category {
  id: CategoryId;
  name: string;
  /** Short line shown on the category card on the home page. */
  description: string;
  /** Arabic translation of the description (shown when the UI is Arabic). */
  descriptionAr: string;
  /** Image used on the category card. */
  image: string;
}

export interface Product {
  slug: string;
  name: string;
  category: CategoryId;
  /** Price in USD. */
  price: number;
  /** Optional "was" price, shown crossed out. */
  compareAtPrice?: number;
  /** Average rating, 0–5. */
  rating: number;
  reviewCount: number;
  /** Optional ribbon on the product card, e.g. "Best Seller". */
  badge?: string;
  /** Included in the "New arrivals" quick-browse list. */
  newArrival?: boolean;
  image: string;
  description: string;
  /** Short bullets shown on the product page. */
  highlights: string[];
  /** Key–value rows for the spec table on the product page. */
  specs: { label: string; value: string }[];
  /** Products shown on the home page. */
  featured?: boolean;
  stock: "in" | "low" | "out";
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const categories: Category[] = [
  {
    id: "solar-panels",
    name: "Solar Panels",
    description: "Mono, poly and portable panels for every roof and adventure.",
    descriptionAr: "ألواح مونو وبولي ومحمولة لكل سطح ومغامرة.",
    image: "/images/panel-mono-550.jpg",
  },
  {
    id: "inverters",
    name: "Inverters",
    description: "Hybrid, off-grid and three-phase inverters.",
    descriptionAr: "انفرترات هجينة وخارج الشبكة وثلاثية الطور.",
    image: "/images/inverter-hybrid.jpg",
  },
  {
    id: "batteries",
    name: "Batteries & Storage",
    description: "LiFePO4, AGM and rack-mount storage banks.",
    descriptionAr: "بطاريات ليثيوم LiFePO4 و AGM وخزانات تخزين.",
    image: "/images/battery-lifepo4.jpg",
  },
  {
    id: "cables",
    name: "Cables & Connectors",
    description: "UV-rated solar cable, MC4 connectors and wiring.",
    descriptionAr: "كابلات شمسية مقاومة للأشعة وموصلات MC4.",
    image: "/images/cable-solar.jpg",
  },
  {
    id: "protection",
    name: "Protection & Switchgear",
    description: "Breakers, surge protectors and safety gear.",
    descriptionAr: "قواطع ومانعات صواعق ومعدات أمان.",
    image: "/images/breaker-dc.jpg",
  },
  {
    id: "mounting",
    name: "Mounting & Accessories",
    description: "Rails, clamps and MPPT charge controllers.",
    descriptionAr: "قضبان ومشابك ومنظمات شحن MPPT.",
    image: "/images/rails-mounting.jpg",
  },
];

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export const products: Product[] = [
  // ---- Solar panels ------------------------------------------------------
  {
    slug: "helios-550w-mono",
    name: "Helios 550W Mono PERC Solar Panel",
    category: "solar-panels",
    price: 189,
    compareAtPrice: 229,
    rating: 4.9,
    reviewCount: 86,
    badge: "Best Seller",
    image: "/images/panel-mono-550.jpg",
    description:
      "A high-efficiency half-cut monocrystalline panel built for rooftop and ground-mount systems. PERC cell technology squeezes more power out of every square meter — even on cloudy days.",
    highlights: [
      "550 W output with 21.3% module efficiency",
      "144 half-cut mono PERC cells resist hot spots",
      "25-year linear power warranty",
      "Anodized aluminum frame, salt-mist certified",
    ],
    specs: [
      { label: "Power", value: "550 W" },
      { label: "Cell type", value: "Monocrystalline PERC" },
      { label: "Efficiency", value: "21.3%" },
      { label: "Dimensions", value: "2279 × 1134 × 35 mm" },
      { label: "Weight", value: "27.2 kg" },
      { label: "Connector", value: "MC4" },
      { label: "Warranty", value: "25 years" },
    ],
    featured: true,
    stock: "in",
  },
  {
    slug: "voltgo-150w-portable",
    name: "VoltGo 150W Portable Folding Panel",
    category: "solar-panels",
    price: 239,
    rating: 4.7,
    reviewCount: 41,
    badge: "New",
    newArrival: true,
    image: "/images/panel-portable.jpg",
    description:
      "A fold-and-go panel for camping, boating and emergency backup. Charge power stations, phones and 12 V batteries straight from the sun.",
    highlights: [
      "150 W folding design with carrying handle",
      "Built-in USB-C PD and DC outputs",
      "ETFE-coated surface shrugs off scratches",
      "Weighs just 5.6 kg — packs to 55 × 55 cm",
    ],
    specs: [
      { label: "Power", value: "150 W" },
      { label: "Folded size", value: "55 × 55 × 4 cm" },
      { label: "Weight", value: "5.6 kg" },
      { label: "Outputs", value: "USB-C PD 60 W + DC 18 V" },
      { label: "Waterproofing", value: "IP67" },
    ],
    featured: true,
    stock: "in",
  },

  // ---- Inverters ---------------------------------------------------------
  {
    slug: "sunvolt-5kw-hybrid",
    name: "Aleppo Power 5kW Hybrid Inverter 48V",
    category: "inverters",
    price: 749,
    compareAtPrice: 829,
    rating: 4.8,
    reviewCount: 112,
    badge: "Best Seller",
    image: "/images/inverter-hybrid.jpg",
    description:
      "The heart of a modern home energy system. This hybrid inverter manages solar, battery and grid power in one unit, with a built-in MPPT and seamless switchover during outages.",
    highlights: [
      "5 kW / 10 kVA pure sine output",
      "Dual MPPT inputs, up to 6 kW of solar",
      "Works with 48 V lithium or lead-acid banks",
      "Wi-Fi monitoring and mobile app included",
    ],
    specs: [
      { label: "Rated power", value: "5 kW" },
      { label: "Battery voltage", value: "48 V" },
      { label: "MPPT inputs", value: "2 (max 6 kW PV)" },
      { label: "Output waveform", value: "Pure sine" },
      { label: "Protection", value: "IP65" },
      { label: "Warranty", value: "5 years" },
    ],
    featured: true,
    stock: "in",
  },
  {
    slug: "sunvolt-3kw-offgrid",
    name: "Aleppo Power 3kW Off-Grid Inverter 24V",
    category: "inverters",
    price: 429,
    rating: 4.6,
    reviewCount: 73,
    image: "/images/inverter-offgrid.jpg",
    description:
      "A dependable off-grid workhorse for cabins, workshops and small homes. Pure sine output keeps sensitive electronics safe.",
    highlights: [
      "3 kW pure sine wave output",
      "Built-in 150 VDC MPPT charge controller",
      "Silent operation with temperature-controlled fan",
      "LCD display shows load, battery and solar status",
    ],
    specs: [
      { label: "Rated power", value: "3 kW" },
      { label: "Battery voltage", value: "24 V" },
      { label: "MPPT input", value: "150 VDC / 80 A" },
      { label: "Output waveform", value: "Pure sine" },
      { label: "Warranty", value: "3 years" },
    ],
    stock: "in",
  },
  {
    slug: "sunvolt-10kw-three-phase",
    name: "Aleppo Power 10kW Three-Phase Inverter",
    category: "inverters",
    price: 1490,
    rating: 4.7,
    reviewCount: 28,
    newArrival: true,
    image: "/images/inverter-10kw.jpg",
    description:
      "A three-phase inverter for commercial rooftops and larger residential systems. Dual MPPT channels handle complex roof layouts with ease.",
    highlights: [
      "10 kW three-phase 400 V output",
      "Dual MPPT channels with 15 A per string",
      "IP65 enclosure for outdoor mounting",
      "RS485 + optional Wi-Fi communication",
    ],
    specs: [
      { label: "Rated power", value: "10 kW" },
      { label: "Grid", value: "3-phase 400 V" },
      { label: "MPPT inputs", value: "2" },
      { label: "Efficiency", value: "98.2%" },
      { label: "Protection", value: "IP65" },
      { label: "Warranty", value: "5 years" },
    ],
    stock: "in",
  },

  // ---- Batteries ---------------------------------------------------------
  {
    slug: "powercell-200ah-lifepo4",
    name: "PowerCell 12.8V 200Ah LiFePO4 Battery",
    category: "batteries",
    price: 899,
    compareAtPrice: 999,
    rating: 4.9,
    reviewCount: 203,
    badge: "Best Seller",
    image: "/images/battery-lifepo4.jpg",
    description:
      "Lithium iron phosphate storage that outlasts lead-acid four to one. A built-in BMS protects against overcharge, over-discharge and short circuits.",
    highlights: [
      "2,560 Wh usable capacity (12.8 V, 200 Ah)",
      "4,000+ cycles at 80% depth of discharge",
      "Built-in smart BMS with Bluetooth app",
      "Half the weight of an equivalent lead-acid bank",
    ],
    specs: [
      { label: "Voltage", value: "12.8 V" },
      { label: "Capacity", value: "200 Ah / 2,560 Wh" },
      { label: "Cycle life", value: "4,000+ cycles" },
      { label: "BMS", value: "Built-in, Bluetooth" },
      { label: "Weight", value: "22 kg" },
      { label: "Warranty", value: "5 years" },
    ],
    featured: true,
    stock: "in",
  },
  {
    slug: "powercell-100ah-agm",
    name: "PowerCell 12V 100Ah AGM Deep-Cycle",
    category: "batteries",
    price: 219,
    rating: 4.5,
    reviewCount: 58,
    image: "/images/battery-agm.jpg",
    description:
      "A maintenance-free AGM deep-cycle battery for off-grid and backup use. Spill-proof and vibration-resistant for rough installs.",
    highlights: [
      "100 Ah at 12 V — 1.2 kWh",
      "Spill-proof AGM construction, no topping up",
      "Handles deep discharges down to 50%",
      "Vibration resistant — suited to mobile setups",
    ],
    specs: [
      { label: "Voltage", value: "12 V" },
      { label: "Capacity", value: "100 Ah" },
      { label: "Technology", value: "AGM (lead-acid)" },
      { label: "Cycle life", value: "~600 cycles @ 50% DoD" },
      { label: "Weight", value: "28 kg" },
      { label: "Warranty", value: "2 years" },
    ],
    stock: "in",
  },
  {
    slug: "rackcell-48v-100ah",
    name: "RackCell 48V 100Ah Server-Rack Battery",
    category: "batteries",
    price: 1590,
    rating: 4.8,
    reviewCount: 36,
    badge: "New",
    newArrival: true,
    image: "/images/battery-rack.jpg",
    description:
      "A 5.12 kWh server-rack module for scalable home storage. Stack up to 16 units in parallel for a serious whole-home bank.",
    highlights: [
      "51.2 V, 100 Ah — 5.12 kWh per module",
      "Standard 19-inch rack form factor",
      "CAN/RS485 communication for inverters",
      "LCD front panel with state-of-charge display",
    ],
    specs: [
      { label: "Voltage", value: "51.2 V" },
      { label: "Capacity", value: "100 Ah / 5.12 kWh" },
      { label: "Form factor", value: '19" rack, 3U' },
      { label: "Communication", value: "CAN / RS485" },
      { label: "Weight", value: "45 kg" },
      { label: "Warranty", value: "5 years" },
    ],
    featured: true,
    stock: "low",
  },

  // ---- Cables & connectors ------------------------------------------------
  {
    slug: "solflex-6mm-solar-cable",
    name: "SolFlex 6mm² Solar Cable — 50 m Pair",
    category: "cables",
    price: 89,
    rating: 4.7,
    reviewCount: 94,
    image: "/images/cable-solar.jpg",
    description:
      "Twin 50 m reels of UV-stabilized solar cable for safe, low-loss DC runs between panels, charge controllers and inverters.",
    highlights: [
      "6 mm² tinned copper conductors",
      "Double-insulated, UV and ozone resistant",
      "Rated to 1,000 V DC, -40 °C to 120 °C",
      "One red + one black 50 m reel",
    ],
    specs: [
      { label: "Conductor", value: "6 mm² tinned copper" },
      { label: "Length", value: "2 × 50 m" },
      { label: "Voltage rating", value: "1,000 V DC" },
      { label: "Temp range", value: "-40 °C to 120 °C" },
      { label: "Standard", value: "EN 50618 / TÜV" },
    ],
    stock: "in",
  },
  {
    slug: "mc4-connector-10pairs",
    name: "MC4 Connector Set — 10 Pairs",
    category: "cables",
    price: 24,
    rating: 4.6,
    reviewCount: 131,
    newArrival: true,
    image: "/images/mc4-connectors.jpg",
    description:
      "Ten pairs of quality MC4 connectors for tool-free, weatherproof panel connections. Pre-tinned contacts keep resistance low.",
    highlights: [
      "10 male + 10 female connectors",
      "IP67 waterproof locking",
      "30 A rated contacts",
      "TÜV-certified and UV stable",
    ],
    specs: [
      { label: "Rated current", value: "30 A" },
      { label: "Rated voltage", value: "1,000 V DC" },
      { label: "Ingress protection", value: "IP67" },
      { label: "Pairs", value: "10" },
      { label: "Certification", value: "TÜV" },
    ],
    stock: "low",
  },

  // ---- Protection & switchgear -------------------------------------------
  {
    slug: "breakerbox-dc-63a",
    name: "BreakerBox DC Circuit Breaker 63A",
    category: "protection",
    price: 32,
    rating: 4.8,
    reviewCount: 67,
    image: "/images/breaker-dc.jpg",
    description:
      "A two-pole DC circuit breaker for isolating strings and protecting wiring. DIN-rail mounting drops straight into any combiner box.",
    highlights: [
      "63 A, two-pole DC breaker",
      "Rated for 500 V DC solar strings",
      "DIN-rail mount, 35 mm",
      "6 kA breaking capacity",
    ],
    specs: [
      { label: "Current", value: "63 A" },
      { label: "Poles", value: "2" },
      { label: "Voltage", value: "500 V DC" },
      { label: "Breaking capacity", value: "6 kA" },
      { label: "Mounting", value: "DIN rail 35 mm" },
    ],
    stock: "in",
  },
  {
    slug: "surgeguard-spd",
    name: "SurgeGuard AC/DC Surge Protector",
    category: "protection",
    price: 59,
    rating: 4.7,
    reviewCount: 45,
    newArrival: true,
    image: "/images/spd-surge.jpg",
    description:
      "Type 2 surge protection for both the AC and DC sides of your system. A small module that can save thousands in equipment.",
    highlights: [
      "Type 2 SPD, 40 kA (8/20 µs)",
      "Protects DC strings and AC lines",
      "Visual status indicator window",
      "DIN-rail mount",
    ],
    specs: [
      { label: "Type", value: "Type 2" },
      { label: "Discharge current", value: "40 kA" },
      { label: "Max voltage", value: "1,000 V DC / 275 V AC" },
      { label: "Indicator", value: "Visual window" },
      { label: "Mounting", value: "DIN rail 35 mm" },
    ],
    stock: "in",
  },

  // ---- Mounting & accessories ---------------------------------------------
  {
    slug: "suntrack-60a-mppt",
    name: "SunTrack 60A MPPT Charge Controller",
    category: "mounting",
    price: 149,
    compareAtPrice: 179,
    rating: 4.8,
    reviewCount: 89,
    image: "/images/mppt-controller.jpg",
    description:
      "An MPPT controller that harvests up to 30% more energy than PWM. Handles 12 V, 24 V and 48 V banks out of the box.",
    highlights: [
      "60 A charging, 150 V PV input",
      "Automatic 12/24/48 V bank detection",
      "MPPT tracking efficiency > 99%",
      "Backlit LCD with live system stats",
    ],
    specs: [
      { label: "Rated current", value: "60 A" },
      { label: "Max PV voltage", value: "150 V" },
      { label: "Battery voltage", value: "12/24/48 V auto" },
      { label: "Tracking efficiency", value: "> 99%" },
      { label: "Warranty", value: "2 years" },
    ],
    featured: true,
    stock: "in",
  },
  {
    slug: "railmount-4panel-kit",
    name: "RailMount Aluminum Rail Kit (4 Panels)",
    category: "mounting",
    price: 199,
    rating: 4.5,
    reviewCount: 22,
    image: "/images/rails-mounting.jpg",
    description:
      "Everything needed to mount four panels on a pitched roof: anodized rails, stainless hardware and end clamps.",
    highlights: [
      "4 × 3.2 m anodized aluminum rails",
      "Stainless steel bolts and end clamps",
      "Pre-drilled for fast layout",
      "Fits panels with 30–35 mm frame thickness",
    ],
    specs: [
      { label: "Rails", value: "4 × 3.2 m anodized aluminum" },
      { label: "Hardware", value: "Stainless steel A2" },
      { label: "Panel frame fit", value: "30–35 mm" },
      { label: "Kit weight", value: "14 kg" },
    ],
    stock: "low",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getCategory(id: CategoryId | string): Category | undefined {
  return categories.find((category) => category.id === id);
}

export function getCategoryName(id: CategoryId | string): string {
  return getCategory(id)?.name ?? id;
}

/** Arabic category names — used for Arabic search and the Arabic UI. */
export const ARABIC_CATEGORY_NAMES: Record<CategoryId, string> = {
  "solar-panels": "ألواح شمسية",
  inverters: "انفرترات",
  batteries: "بطاريات",
  cables: "كابلات",
  protection: "حماية",
  mounting: "تثبيت",
};

/** Small icon per category — used in menus and dropdowns. */
export const CATEGORY_EMOJIS: Record<CategoryId, string> = {
  "solar-panels": "☀️",
  inverters: "🔌",
  batteries: "🔋",
  cables: "🔗",
  protection: "🛡️",
  mounting: "🔩",
};

/** Category display name in the active UI language. */
export function getCategoryLabel(
  id: CategoryId | string,
  lang: "en" | "ar" = "en"
): string {
  return lang === "ar" ? ARABIC_CATEGORY_NAMES[id as CategoryId] ?? id : getCategoryName(id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

/** Quick-browse lists, shown in the menu dropdown, sidebar and home tabs. */
export const QUICK_FILTERS = [
  { id: "new", label: "New arrivals" },
  { id: "best-sellers", label: "Best sellers" },
  { id: "featured", label: "Featured products" },
] as const;

export interface ProductFilters {
  category?: string;
  query?: string;
  sort?: string; // "featured" | "price-asc" | "price-desc"
  filter?: string; // "new" | "best-sellers" | "featured"
  inStockOnly?: boolean;
}

/** Filters and sorts the catalog. Used by the /products page and home tabs. */
export function filterProducts({
  category,
  query,
  sort = "featured",
  filter,
  inStockOnly,
}: ProductFilters): Product[] {
  let results = [...products];

  if (category) {
    results = results.filter((product) => product.category === category);
  }

  if (query) {
    results = results.filter((product) => matchesSearch(product, query));
  }

  if (filter === "new") results = results.filter((p) => p.newArrival);
  if (filter === "best-sellers")
    results = results.filter((p) => p.badge === "Best Seller");
  if (filter === "featured") results = results.filter((p) => p.featured);
  if (inStockOnly) results = results.filter((p) => p.stock !== "out");

  if (sort === "price-asc") results.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") results.sort((a, b) => b.price - a.price);

  return results;
}

/** How many products live in each category — for the store sidebar. */
export function countProductsByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const product of products) {
    counts[product.category] = (counts[product.category] ?? 0) + 1;
  }
  return counts;
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

/**
 * Extra search keywords per product (keyed by slug).
 * English matches come from the product's own text; these add Arabic and
 * synonym terms so customers can search in either language, e.g.
 * "انفرتر" finds inverters, "لوح شمسي" finds panels, "200 أمبير" finds
 * the 200 Ah battery.
 */
const PRODUCT_KEYWORDS: Record<string, string[]> = {
  "helios-550w-mono": ["لوح شمسي", "ألواح", "طاقة شمسية", "550 واط", "pv module"],
  "voltgo-150w-portable": ["لوح محمول", "قابل للطي", "تخييم", "portable panel", "folding"],
  "sunvolt-5kw-hybrid": ["انفرتر", "عاكس", "هجين", "5 كيلو", "hybrid"],
  "sunvolt-3kw-offgrid": ["انفرتر", "عاكس", "خارج الشبكة", "3 كيلو", "off-grid"],
  "sunvolt-10kw-three-phase": ["انفرتر", "عاكس", "ثلاثي الطور", "10 كيلو", "three phase"],
  "powercell-200ah-lifepo4": ["بطارية", "ليثيوم", "lifepo4", "200 أمبير", "فوسفات"],
  "powercell-100ah-agm": ["بطارية", "حمضية", "agm", "100 أمبير", "دورة عميقة"],
  "rackcell-48v-100ah": ["بطارية", "رف", "خادم", "48 فولت", "rack"],
  "solflex-6mm-solar-cable": ["كابل", "سلك", "6 ملم", "شمسي", "solar cable"],
  "mc4-connector-10pairs": ["موصل", "كونكتور", "mc4", "وصلات"],
  "breakerbox-dc-63a": ["قاطع", "فيوز", "حماية", "63 أمبير", "breaker"],
  "surgeguard-spd": ["مانعة صواعق", "حماية من الصواعق", "surge", "spd"],
  "suntrack-60a-mppt": ["منظم شحن", "mppt", "شاحن شمسي", "charge controller"],
  "railmount-4panel-kit": ["قضبان", "هيكل تثبيت", "ألمنيوم", "mounting rails", "تثبيت ألواح"],
};

/** Lowercases and trims a piece of text for matching. */
function normalizeSearchText(text: string): string {
  return text.toLocaleLowerCase().trim();
}

/**
 * Token-based product search:
 *  - The query is split on spaces and EVERY token must appear somewhere
 *    in the product (name, description, category — English and Arabic —,
 *    keywords, highlights or spec values). So "solar panel" and "لوح شمسي"
 *    both work, and searching "550" matches the 550 W panel's specs.
 *  - English synonyms come from the product text itself; Arabic synonyms
 *    come from PRODUCT_KEYWORDS above.
 */
export function matchesSearch(product: Product, query: string): boolean {
  const tokens = normalizeSearchText(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  const haystack = [
    product.name,
    product.description,
    getCategoryName(product.category),
    ARABIC_CATEGORY_NAMES[product.category],
    ...(PRODUCT_KEYWORDS[product.slug] ?? []),
    ...product.highlights,
    ...product.specs.flatMap((spec) => [spec.label, spec.value]),
  ]
    .map(normalizeSearchText)
    .join(" ");

  return tokens.every((token) => haystack.includes(token));
}
