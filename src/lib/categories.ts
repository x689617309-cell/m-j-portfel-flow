export type Category = {
  id: string;
  name: string;
  emoji: string;
  color: string; // hex
};

export const CATEGORIES: Category[] = [
  { id: "food",      name: "Jedzenie",       emoji: "🍔", color: "#FF9500" },
  { id: "transport", name: "Transport",      emoji: "🚗", color: "#007AFF" },
  { id: "fun",       name: "Rozrywka",       emoji: "🎭", color: "#FF2D55" },
  { id: "home",      name: "Dom i rachunki", emoji: "🏠", color: "#5856D6" },
  { id: "health",    name: "Zdrowie",        emoji: "💊", color: "#34C759" },
  { id: "shopping",  name: "Zakupy",         emoji: "👕", color: "#AF52DE" },
  { id: "education", name: "Edukacja",       emoji: "📚", color: "#FF6B35" },
  { id: "savings",   name: "Oszczędności",   emoji: "💰", color: "#32ADE6" },
  { id: "other",     name: "Inne",           emoji: "🛒", color: "#8E8E93" },
];

export const INCOME_CATEGORY: Category = { id: "income", name: "Przychód", emoji: "💵", color: "#34C759" };

export const getCategory = (id: string): Category => {
  if (id === "income") return INCOME_CATEGORY;
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
};

export const DEFAULT_BUDGETS: Record<string, number> = {
  food: 800,
  transport: 400,
  fun: 300,
  home: 1500,
  health: 200,
  shopping: 500,
  education: 150,
  savings: 600,
  other: 200,
};
