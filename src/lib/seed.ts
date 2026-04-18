import type { Transaction } from "./store";

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export const seedTransactions = (): Transaction[] => {
  const now = new Date();
  const samples: Array<Omit<Transaction, "id" | "date">> = [
    { type: "expense", amount: 24.50, categoryId: "food", title: "Lunch w pracy" },
    { type: "expense", amount: 187.30, categoryId: "food", title: "Zakupy spożywcze" },
    { type: "expense", amount: 12.00, categoryId: "transport", title: "Bilet komunikacja" },
    { type: "expense", amount: 220.00, categoryId: "transport", title: "Tankowanie" },
    { type: "expense", amount: 45.00, categoryId: "fun", title: "Kino z przyjaciółmi" },
    { type: "expense", amount: 89.99, categoryId: "fun", title: "Spotify Family" },
    { type: "expense", amount: 1340.00, categoryId: "home", title: "Czynsz" },
    { type: "expense", amount: 178.50, categoryId: "home", title: "Prąd i gaz" },
    { type: "expense", amount: 64.20, categoryId: "health", title: "Apteka" },
    { type: "expense", amount: 259.00, categoryId: "shopping", title: "Nowe buty" },
    { type: "expense", amount: 39.90, categoryId: "shopping", title: "Drogeria" },
    { type: "expense", amount: 120.00, categoryId: "education", title: "Książki" },
    { type: "income",  amount: 6500.00, categoryId: "income", title: "Wynagrodzenie" },
    { type: "income",  amount: 450.00, categoryId: "income", title: "Zlecenie freelance" },
    { type: "expense", amount: 500.00, categoryId: "savings", title: "Wpłata oszczędnościowa" },
  ];

  return samples.map((s, i) => {
    const daysAgo = Math.floor(rand(0, 30));
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(Math.floor(rand(8, 21)), Math.floor(rand(0, 59)), 0, 0);
    return {
      id: `seed-${i}-${Date.now()}`,
      date: d.toISOString(),
      ...s,
    };
  });
};

void pick;
