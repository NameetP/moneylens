/**
 * Bank-agnostic merchant categorization for UAE market.
 * 250+ keyword rules covering all major UAE merchants.
 * Works on transaction descriptions from any bank.
 */

export const CATEGORY_COLORS: Record<string, string> = {
  Dining: "#f97316",
  Groceries: "#22c55e",
  Shopping: "#8b5cf6",
  Transport: "#3b82f6",
  Subscriptions: "#ec4899",
  Entertainment: "#eab308",
  Travel: "#06b6d4",
  Health: "#14b8a6",
  Utilities: "#6366f1",
  "Home & Services": "#a855f7",
  "Kids & Family": "#f472b6",
  Other: "#71717a",
};

const CATEGORY_RULES: { category: string; keywords: string[] }[] = [
  {
    category: "Groceries",
    keywords: [
      "carrefour", "spinneys", "lulu hypermarket", "luluhypermarket",
      "choithrams", "waitrose", "geant", "viva", "union coop",
      "al maya", "hypermarket", "supermarket", "grocery",
      "kibsons", "kibson", "amazon grocery", "amazongrocery",
      "noon minutes", "noonminutes",
      "unipex", "iffco", "pecann", "foodstuff",
      "carefour market", "carrefouruae",
      "grabmart", "oasis pure water", "smart seven",
      "dairy product",
    ],
  },
  {
    category: "Dining",
    keywords: [
      "restaurant", "cafe", "coffee", "starbucks", "costa",
      "mcdonald", "kfc", "pizza", "sushi", "burger",
      "deliveroo", "talabat", "zomato", "careem food",
      "shake shack", "tim hortons", "dunkin", "baskin", "jollibee",
      "nightjar", "boon coffee", "encounter coffee", "golden luna coffee",
      "illy cafe", "fresh juice", "juice point", "yogurtland",
      "brunch cake", "brunch  cake", "paul nakheel", "le pain quotidien",
      "commencement restau", "shvili", "izzy restaurant",
      "bhagirathi", "dhaba lane", "bikanervala",
      "rosas thai", "cassette restaurant", "massimo italian",
      "rang indian", "maiz tacos", "pizza express",
      "gazebo restaurant", "new covent garden", "big chill",
      "abu auf", "ushna restaurant", "ristorante loren",
      "kamat restaurant", "pipeline restaurant", "the hood",
      "ldc kitchen", "bait maryam", "simply the great",
      "dash hospitality", "train vibes", "bull and rood",
      "the farm", "home bakery", "subko coffee",
      "altannan coffee", "keeta", "tap*keeta",
      "fat*whatsin", "the grotto",
    ],
  },
  {
    category: "Transport",
    keywords: [
      "salik", "uber", "careem", "rta", "parking", "enoc",
      "adnoc", "emarat", "fuel", "petrol", "taxi", "metro",
      "nol", "valet", "car wash",
      "ubr*pending", "uber*trip", "careem ride", "careemride",
      "careem plus", "careemplus", "careem hala",
      "national taxi", "zofeur", "valtrans",
      "thrifty car rental", "cafu", "cafuapp",
      "arabian gulf mechanic", "al jafliyah gas",
      "mohammad ishaq car",
    ],
  },
  {
    category: "Subscriptions",
    keywords: [
      "netflix", "spotify", "apple.com/bill", "apple.com bill",
      "google", "amazon prime", "disney", "hbo",
      "youtube", "icloud", "adobe", "microsoft",
      "notion", "chatgpt", "openai",
      "expressvpn", "oura ring", "ouraring",
      "muzify", "bhindi labs", "lovable", "ratepunk",
      "nomadix", "name-cheap", "namesilo", "carrd",
      "rss.app", "ultrahuman",
      "e& digital", "e&digital", "du apple", "du quick pay",
      "etisalat telecom", "virgin mobile",
    ],
  },
  {
    category: "Shopping",
    keywords: [
      "amazon.ae", "amazon ae", "amazonufg", "amazon ufg",
      "namshi", "shein", "www.shein",
      "ikea", "alfuttaim", "al futtaim",
      "zara", "zara home", "h&m", "h and m", "hennes",
      "nike", "apple store", "next uae", "nextuae",
      "sharaf", "emax", "jumbo",
      "souq", "mumzworld", "ounass", "farfetch",
      "temu", "noon.com",
      "brands for less", "marks and spencer", "marksandspencer",
      "claires", "mumuso", "flying tiger",
      "daiso", "rituals",
      "grand stores", "sidra home", "home wide",
      "gdb furniture", "naseej",
      "early learning center", "virgin dubai", "virgin megastore",
      "sephora", "the body shop", "body shop", "yateem optician",
      "bath & body", "bath and body", "d805 h and m",
      "ups gulf", "thread stitches",
      "flowwow", "yougotagift", "katie jane",
      "saasa", "magrudy", "aliusie general",
      "biru general", "etsy",
    ],
  },
  {
    category: "Entertainment",
    keywords: [
      "cinema", "vox", "reel", "theme park", "wild wadi",
      "aquaventure", "ski dubai", "dubai parks", "louvre",
      "museum", "concert", "platinumlist", "platinum list",
      "emirates leisure", "hb leisure",
      "tickle right", "cca*tickle",
      "ripe exhibition", "ripe",
      "controle d model", "boo boo entertainment",
      "mini bounce", "minibounce", "three sixty play",
    ],
  },
  {
    category: "Travel",
    keywords: [
      "flydubai", "air arabia", "gulf air",
      "booking.com", "hotel", "airbnb", "agoda",
      "marriott", "hilton", "rotana",
      "travel visa", "travelvisaatly", "bls international",
      "paper planes rental", "desert island resort",
      "intercontinental", "taj dubai", "the edition hotel",
      "madinat jumeirah",
      "itc grand central", "itc hotels",
      "paper planes rental", "paperplanesrental",
    ],
  },
  {
    category: "Health",
    keywords: [
      "pharmacy", "hospital", "clinic", "doctor", "medical",
      "dental", "optician", "boots",
      "life pharmacy", "lifephy", "1240 life",
      "aster medical", "my aster", "myaster", "aster pharmacy",
      "mediclinic", "kings college hospital",
      "circle care clinic", "rxnow pharmacy", "medicina pharmacy",
      "zabeel veterinary", "amity veterinary",
      "animal care center", "the pet shop", "goofy groom",
      "super trim", "tito specialist", "chalk gents salon",
      "tips & toes", "tips and toes",
      "life group", "life phy",
      "igym", "gym", "fitness first", "gold gym", "sport academy",
      "amity veterinar", "geidea*amity",
    ],
  },
  {
    category: "Utilities",
    keywords: [
      "dewa", "dubai electricity",
      "du bill", "etisalat bill", "ejari",
      "municipality", "empower", "district cooling",
      "smart dubai government", "smart dubai gov",
      "alliance insurance", "pb orient insuran",
      "icp smart services", "noq*ejari",
      "al etihad credit bureau",
      "fazaa", "fazaa llc",
    ],
  },
  {
    category: "Home & Services",
    keywords: [
      "justlife", "just life", "urbanclap", "urban clap",
      "urban company", "urbancompany",
      "digiphoto", "primavera professional",
      "tipsy gipsy", "nadoosh soap",
      "fazaal",
    ],
  },
  {
    category: "Kids & Family",
    keywords: [
      "kids lab", "kidslab", "kids amusement",
      "lala land", "lalaland", "orange wheels", "orangewheels",
      "ready set go", "readysetgo",
      "playville", "peekaboo", "mirage recreational",
      "al barari kids", "albararikids",
      "katie jane", "katiejanedubai", "party world",
      "mini corni", "baby care",
    ],
  },
];

/**
 * Categorize a merchant description using UAE keyword rules.
 * Returns the category name (e.g., "Dining", "Groceries").
 */
export function categorize(description: string): string {
  const lower = description.toLowerCase().replace(/\s{2,}/g, " ");
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.category;
    }
  }
  return "Other";
}

/**
 * Build category aggregation from transactions.
 * Filters to debit transactions, groups by category, calculates percentages.
 */
export function buildCategories(
  transactions: { amount: number; category: string }[]
): {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  transactions: number;
}[] {
  const totalSpend = transactions.reduce((sum, t) => sum + t.amount, 0);
  const categoryMap = new Map<string, { amount: number; count: number }>();

  for (const txn of transactions) {
    const existing = categoryMap.get(txn.category) || { amount: 0, count: 0 };
    existing.amount += txn.amount;
    existing.count += 1;
    categoryMap.set(txn.category, existing);
  }

  return Array.from(categoryMap.entries())
    .map(([name, { amount, count }]) => ({
      name,
      amount: Math.round(amount),
      percentage: totalSpend > 0 ? Math.round((amount / totalSpend) * 1000) / 10 : 0,
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other,
      transactions: count,
    }))
    .sort((a, b) => b.amount - a.amount);
}
