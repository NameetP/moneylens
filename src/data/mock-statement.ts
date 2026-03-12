export interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: string;
}

export interface StatementData {
  bankName: string;
  cardType: string;
  cardLast4: string;
  statementPeriod: string;
  totalSpend: number;
  minimumDue: number;
  outstandingBalance: number;
  interestRate: number;
  categories: {
    name: string;
    amount: number;
    percentage: number;
    color: string;
    transactions: number;
  }[];
  transactions: Transaction[];
}

export const mockStatementData: StatementData = {
  bankName: "Emirates NBD",
  cardType: "Visa Platinum",
  cardLast4: "4829",
  statementPeriod: "Feb 1 – Feb 28, 2026",
  totalSpend: 14850,
  minimumDue: 742.5,
  outstandingBalance: 32400,
  interestRate: 3.49,
  categories: [
    {
      name: "Dining",
      amount: 4200,
      percentage: 28.3,
      color: "#f97316",
      transactions: 22,
    },
    {
      name: "Groceries",
      amount: 3100,
      percentage: 20.9,
      color: "#22c55e",
      transactions: 15,
    },
    {
      name: "Shopping",
      amount: 2800,
      percentage: 18.9,
      color: "#8b5cf6",
      transactions: 8,
    },
    {
      name: "Transport",
      amount: 1950,
      percentage: 13.1,
      color: "#3b82f6",
      transactions: 31,
    },
    {
      name: "Subscriptions",
      amount: 1450,
      percentage: 9.8,
      color: "#ec4899",
      transactions: 12,
    },
    {
      name: "Other",
      amount: 1350,
      percentage: 9.1,
      color: "#71717a",
      transactions: 9,
    },
  ],
  transactions: [
    { date: "2026-02-28", description: "Zuma Dubai DIFC", amount: 890, category: "Dining" },
    { date: "2026-02-27", description: "Carrefour City Centre", amount: 425, category: "Groceries" },
    { date: "2026-02-26", description: "Noon.com", amount: 650, category: "Shopping" },
    { date: "2026-02-25", description: "Salik Top-Up", amount: 200, category: "Transport" },
    { date: "2026-02-24", description: "Netflix Subscription", amount: 55, category: "Subscriptions" },
    { date: "2026-02-23", description: "Spinneys Al Wasl", amount: 310, category: "Groceries" },
    { date: "2026-02-22", description: "Uber Rides x4", amount: 180, category: "Transport" },
    { date: "2026-02-21", description: "SaltBae Steakhouse", amount: 1200, category: "Dining" },
    { date: "2026-02-20", description: "Amazon.ae", amount: 890, category: "Shopping" },
    { date: "2026-02-19", description: "Spotify Premium", amount: 33, category: "Subscriptions" },
    { date: "2026-02-18", description: "ENOC Fuel", amount: 250, category: "Transport" },
    { date: "2026-02-17", description: "Deliveroo Orders x6", amount: 480, category: "Dining" },
    { date: "2026-02-16", description: "Gym Plus Al Quoz", amount: 450, category: "Subscriptions" },
    { date: "2026-02-15", description: "Lulu Hypermarket", amount: 280, category: "Groceries" },
    { date: "2026-02-14", description: "Mall of Emirates", amount: 1260, category: "Shopping" },
    { date: "2026-02-13", description: "PF Chang's JBR", amount: 320, category: "Dining" },
    { date: "2026-02-12", description: "RTA Parking", amount: 120, category: "Transport" },
    { date: "2026-02-11", description: "Apple iCloud", amount: 15, category: "Subscriptions" },
    { date: "2026-02-10", description: "Talabat Orders x5", amount: 350, category: "Dining" },
    { date: "2026-02-09", description: "Choithrams JLT", amount: 195, category: "Groceries" },
  ],
};
