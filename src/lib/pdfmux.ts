/**
 * MoneyLens Statement Parser
 *
 * Uses pdf-parse v1 for text extraction + regex-based parsing
 * specifically tuned for UAE bank statement formats.
 *
 * Tested against real Emirates NBD statements:
 * - Marriott Bonvoy World Elite Mastercard
 * - Share Visa Infinite Credit Card
 */

// pdf-parse v1 tries to load a test PDF at require-time.
// We create a stub test file to prevent ENOENT during SSR/build.
import { writeFileSync, mkdirSync, existsSync } from "fs";
const testDir = "./test/data";
const testFile = `${testDir}/05-versions-space.pdf`;
if (!existsSync(testFile)) {
  mkdirSync(testDir, { recursive: true });
  writeFileSync(testFile, Buffer.from("%PDF-1.0\nstub"));
}
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse");

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  type: "debit" | "credit" | "payment" | "fee" | "interest";
  category: string;
}

export interface ParsedStatement {
  bankName: string;
  cardType: string;
  cardLast4: string;
  statementPeriod: string;
  totalSpend: number;
  minimumDue: number;
  outstandingBalance: number;
  interestRate: number;
  creditLimit: number;
  totalPayments: number;
  categories: {
    name: string;
    amount: number;
    percentage: number;
    color: string;
    transactions: number;
  }[];
  transactions: ParsedTransaction[];
}

// ─── Category mapping ────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
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

/**
 * Keyword-based merchant categorization for UAE market.
 * Handles both spaced and concatenated merchant names.
 * Ordered by specificity — first match wins.
 */
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

function categorize(description: string): string {
  // Normalize multiple spaces and lowercase for matching
  const lower = description.toLowerCase().replace(/\s{2,}/g, " ");
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.category;
    }
  }
  return "Other";
}

// ─── Text extraction helpers ─────────────────────────────────────────────────

function detectBank(text: string): string {
  const lower = text.toLowerCase();
  const banks = [
    { name: "Emirates NBD", keywords: ["emirates nbd"] },
    { name: "ADCB", keywords: ["adcb", "abu dhabi commercial"] },
    { name: "FAB", keywords: ["fab", "first abu dhabi"] },
    { name: "HSBC", keywords: ["hsbc"] },
    { name: "Mashreq", keywords: ["mashreq"] },
    { name: "DIB", keywords: ["dib", "dubai islamic"] },
    { name: "RAK Bank", keywords: ["rak bank", "rakbank"] },
    { name: "CBD", keywords: ["cbd", "commercial bank of dubai"] },
    { name: "Standard Chartered", keywords: ["standard chartered"] },
    { name: "Citibank", keywords: ["citibank", "citi"] },
  ];
  for (const bank of banks) {
    if (bank.keywords.some((kw) => lower.includes(kw))) return bank.name;
  }
  return "Unknown Bank";
}

function detectCardType(text: string): string {
  const lower = text.toLowerCase();
  const types = [
    { name: "Marriott Bonvoy World Elite Mastercard", kw: ["marriott bonvoy world elite"] },
    { name: "Marriott Bonvoy Mastercard", kw: ["marriott bonvoy"] },
    { name: "Share Visa Infinite", kw: ["share visa infinite"] },
    { name: "Share Visa Signature", kw: ["share visa signature"] },
    { name: "Beyond Visa Infinite", kw: ["beyond visa infinite"] },
    { name: "Lulu Visa Platinum", kw: ["lulu visa"] },
    { name: "Visa Platinum", kw: ["visa platinum"] },
    { name: "Visa Infinite", kw: ["visa infinite"] },
    { name: "Visa Signature", kw: ["visa signature"] },
    { name: "World Elite Mastercard", kw: ["world elite mastercard"] },
    { name: "World Mastercard", kw: ["world mastercard"] },
  ];
  for (const t of types) {
    if (t.kw.some((k) => lower.includes(k))) return t.name;
  }
  return "Credit Card";
}

function extractCardLast4(text: string): string {
  const match = text.match(/(\d{4})\s*X{4}\s*X{4}\s*(\d{4})/);
  if (match) return match[2];
  const match2 = text.match(/\*{4}(\d{4})/);
  if (match2) return match2[1];
  return "0000";
}

function extractStatementPeriod(text: string): string {
  const match = text.match(/(\d{1,2}-\w{3}-\d{2,4})\s+to\s+(\d{1,2}-\w{3}-\d{2,4})/i);
  if (match) return `${match[1]} to ${match[2]}`;
  return "Statement Period";
}

// ─── Transaction parser ──────────────────────────────────────────────────────

/**
 * Parse transactions from Emirates NBD PDF text.
 *
 * Format (from pdf-parse v1):
 *   DD/MM/YYYYDD/MM/YYYYDESCRIPTION                     AMOUNT
 *
 * Credits have the amount on the next line with CR suffix.
 * Foreign currency has the original amount on same line, then exchange rate,
 * then AED amount on the next line.
 */
function parseTransactions(text: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];
  const lines = text.split("\n");

  // Regex for transaction lines:
  // DD/MM/YYYYDD/MM/YYYYDESCRIPTION                     AMOUNT
  const txnRegex = /^(\d{2}\/\d{2}\/\d{4})(\d{2}\/\d{2}\/\d{4})(.+?)(?:\s{2,})([\d,]+\.\d{2})\s*$/;
  const txnRegexCR = /^(\d{2}\/\d{2}\/\d{4})(\d{2}\/\d{2}\/\d{4})(.+?)$/;
  // Foreign currency line with original amount embedded
  const foreignRegex = /^(\d{2}\/\d{2}\/\d{4})(\d{2}\/\d{2}\/\d{4})(.+?)\s+([\d,.]+)\s+(USD|INR|GBP|EUR|SGP|CHF|IRL|FIN)\s*$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Try foreign currency match first
    const foreignMatch = line.match(foreignRegex);
    if (foreignMatch) {
      // Next line(s) have exchange rate and AED amount
      // "(1 AED = USD 0.2639)" then AED amount
      let aedAmount = 0;
      for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
        const nextLine = lines[j].trim();
        const aedMatch = nextLine.match(/^([\d,]+\.\d{2})\s*$/);
        if (aedMatch) {
          aedAmount = parseFloat(aedMatch[1].replace(/,/g, ""));
          break;
        }
      }
      if (aedAmount > 0) {
        const txnDate = foreignMatch[1];
        const desc = foreignMatch[3].trim();
        transactions.push(makeTxn(txnDate, desc, aedAmount, false));
      }
      continue;
    }

    // Try standard transaction match
    const match = line.match(txnRegex);
    if (match) {
      const txnDate = match[1];
      const desc = match[3].trim();
      const amount = parseFloat(match[4].replace(/,/g, ""));
      if (amount > 0) {
        transactions.push(makeTxn(txnDate, desc, amount, false));
      }
      continue;
    }

    // Check for credit transactions (amount on next line with CR)
    const crMatch = line.match(txnRegexCR);
    if (crMatch) {
      const nextLine = (lines[i + 1] || "").trim();
      const crAmountMatch = nextLine.match(/^([\d,]+\.\d{2})\s*CR\s*$/i);
      if (crAmountMatch) {
        const txnDate = crMatch[1];
        const desc = crMatch[3].trim();
        const amount = parseFloat(crAmountMatch[1].replace(/,/g, ""));
        if (amount > 0) {
          transactions.push(makeTxn(txnDate, desc, amount, true));
        }
      }
    }
  }

  return transactions;
}

function makeTxn(
  dateStr: string,
  description: string,
  amount: number,
  isCredit: boolean,
): ParsedTransaction {
  const descLower = description.toLowerCase();

  // Classify transaction type
  let type: ParsedTransaction["type"] = isCredit ? "credit" : "debit";

  if (descLower.includes("payment") || descLower.includes("thank you")) {
    type = "payment";
  } else if (descLower.includes("interest") || descLower.includes("finance charge")) {
    type = "interest";
  } else if (
    descLower.includes("overlimit fee") ||
    descLower.includes("vat on overlimit") ||
    descLower.includes("monthly fee") ||
    descLower.includes("vat on monthly") ||
    descLower.includes("processing fee") ||
    descLower.includes("vat on processing") ||
    descLower.includes("installment plan emi") ||
    descLower.includes("conversion to installment")
  ) {
    type = "fee";
  }

  // Clean description
  const cleanDesc = description
    .replace(/\s*(DUBAI|ABU DHABI|SHARJAH|RAS AL KH|AJMAN)\s*ARE\s*$/i, "")
    .replace(/\s*(AMSTERDAM|DUBLIN|SINGAPORE|PHOENIX|MOUNTAIN VIEW|MIAMI|DOVER|BROOKLYN|MIDDLETOWN|HOUSTON|LEWES|OULU|GIBRALTAR|FRANKLIN)\s*(NLD|IRL|SGP|USA|US|GIB|FIN|CHF|IND)\s*$/i, "")
    .replace(/\s*DXB\s*ARE\s*$/i, "")
    .replace(/\s*MUMBAI\s*IND\s*$/i, "")
    .replace(/\s*BENGALURU\s*IND\s*$/i, "")
    .replace(/\s*FARIDABAD\s*IND\s*$/i, "")
    .replace(/\s*CORK\s*IRL\s*$/i, "")
    .trim();

  // Parse date DD/MM/YYYY → YYYY-MM-DD
  const dm = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  const isoDate = dm ? `${dm[3]}-${dm[2]}-${dm[1]}` : dateStr;

  return {
    date: isoDate,
    description: cleanDesc,
    amount,
    type,
    category: type === "debit" ? categorize(description) : "Other",
  };
}

// ─── Statement Summary Parser ────────────────────────────────────────────────

function parseStatementSummary(text: string): {
  previousDue: number;
  purchases: number;
  interestCharges: number;
  payments: number;
  totalDue: number;
  currentBalance: number;
} {
  const defaults = { previousDue: 0, purchases: 0, interestCharges: 0, payments: 0, totalDue: 0, currentBalance: 0 };

  // Find "STATEMENT SUMMARY" section
  const idx = text.indexOf("STATEMENT SUMMARY");
  if (idx < 0) return defaults;

  // The numbers appear after the header labels, all on one line
  // "21,410.1018,398.950.0021,411.0018,398.0518,398.05"
  const block = text.slice(idx, idx + 1500);

  // Find the line with concatenated numbers (6 monetary values in a row)
  const lines = block.split("\n");
  for (const line of lines) {
    // Look for at least 3 monetary values concatenated
    const amounts = [...line.matchAll(/([\d,]+\.\d{2})/g)].map((m) =>
      parseFloat(m[1].replace(/,/g, ""))
    );
    if (amounts.length >= 5) {
      return {
        previousDue: amounts[0],
        purchases: amounts[1],
        interestCharges: amounts[2],
        payments: amounts[3],
        totalDue: amounts[4],
        currentBalance: amounts[5] || amounts[4],
      };
    }
  }

  return defaults;
}

// ─── Header extraction ──────────────────────────────────────────────────────

function extractHeaderNumbers(text: string): {
  creditLimit: number;
  availableCredit: number;
  minimumDue: number;
} {
  // The header section has these values concatenated on one line:
  // "5200033,601.9523/12/202517/01/2026919.90" (credit limit, available, date, date, min due)
  // Or "7700040,516.5025/11/202520/12/20252,016.53"

  const lines = text.split("\n");
  for (const line of lines) {
    // Look for a line with credit limit pattern: large number followed by available credit
    const match = line.match(/^(\d{4,6})([\d,]+\.\d{2})(\d{2}\/\d{2}\/\d{4})(\d{2}\/\d{2}\/\d{4})([\d,]+\.\d{2})$/);
    if (match) {
      return {
        creditLimit: parseFloat(match[1]),
        availableCredit: parseFloat(match[2].replace(/,/g, "")),
        minimumDue: parseFloat(match[5].replace(/,/g, "")),
      };
    }
  }

  // Fallback: try to find "Minimum Payment Due" label nearby
  let minimumDue = 0;
  let creditLimit = 0;
  const minDueMatch = text.match(/Minimum Payment Due[\s\S]{0,200}?([\d,]+\.\d{2})/);
  if (minDueMatch) minimumDue = parseFloat(minDueMatch[1].replace(/,/g, ""));

  const creditMatch = text.match(/Credit Limit[\s\S]{0,100}?(\d{4,6})/);
  if (creditMatch) creditLimit = parseFloat(creditMatch[1]);

  return { creditLimit, availableCredit: 0, minimumDue };
}

// ─── Main parse function ─────────────────────────────────────────────────────

export async function parseStatement(fileBuffer: Buffer): Promise<ParsedStatement> {
  const pdfData = await pdfParse(fileBuffer);
  const text = pdfData.text;

  // Detect bank and card
  const bankName = detectBank(text);
  const cardType = detectCardType(text);
  const cardLast4 = extractCardLast4(text);
  const statementPeriod = extractStatementPeriod(text);

  // Extract financial header
  const header = extractHeaderNumbers(text);
  const summary = parseStatementSummary(text);

  // Parse all transactions
  const allTransactions = parseTransactions(text);

  // Filter to spending transactions for categories
  const spending = allTransactions.filter((t) => t.type === "debit");
  const totalSpend = spending.reduce((sum, t) => sum + t.amount, 0);

  // Aggregate into categories
  const categoryMap = new Map<string, { amount: number; count: number }>();
  for (const txn of spending) {
    const existing = categoryMap.get(txn.category) || { amount: 0, count: 0 };
    existing.amount += txn.amount;
    existing.count += 1;
    categoryMap.set(txn.category, existing);
  }

  const categories = Array.from(categoryMap.entries())
    .map(([name, { amount, count }]) => ({
      name,
      amount: Math.round(amount),
      percentage: totalSpend > 0 ? Math.round((amount / totalSpend) * 1000) / 10 : 0,
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other,
      transactions: count,
    }))
    .sort((a, b) => b.amount - a.amount);

  const outstandingBalance = summary.currentBalance || summary.totalDue;
  const interestRate = summary.interestCharges > 0 ? 3.25 : 0;

  return {
    bankName,
    cardType,
    cardLast4,
    statementPeriod,
    totalSpend: Math.round(totalSpend || summary.purchases),
    minimumDue: header.minimumDue || Math.round(totalSpend * 0.05),
    outstandingBalance,
    interestRate,
    creditLimit: header.creditLimit,
    totalPayments: summary.payments,
    categories,
    transactions: spending
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 100),
  };
}
