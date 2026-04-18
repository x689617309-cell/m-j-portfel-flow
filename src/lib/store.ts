import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_BUDGETS } from "./categories";
import { seedTransactions } from "./seed";

export type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  categoryId: string;
  title: string;
  date: string; // ISO
  note?: string;
};

export type AppState = {
  transactions: Transaction[];
  categoryBudgets: Record<string, number>;
  user: { initials: string };
};

const STORAGE_KEY = "budzetflow_v1";

const initialState = (): AppState => ({
  transactions: seedTransactions(),
  categoryBudgets: { ...DEFAULT_BUDGETS },
  user: { initials: "AK" },
});

const load = (): AppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const s = initialState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      return s;
    }
    const parsed = JSON.parse(raw) as AppState;
    return {
      transactions: parsed.transactions ?? [],
      categoryBudgets: { ...DEFAULT_BUDGETS, ...(parsed.categoryBudgets ?? {}) },
      user: parsed.user ?? { initials: "AK" },
    };
  } catch {
    return initialState();
  }
};

export const useAppStore = () => {
  const [state, setState] = useState<AppState>(() =>
    typeof window === "undefined" ? initialState() : load()
  );

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    setState((s) => ({ ...s, transactions: [{ ...t, id: `tx-${Date.now()}-${Math.random().toString(36).slice(2,7)}` }, ...s.transactions] }));
  }, []);

  const removeTransaction = useCallback((id: string) => {
    setState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) }));
  }, []);

  const setBudget = useCallback((categoryId: string, amount: number) => {
    setState((s) => ({ ...s, categoryBudgets: { ...s.categoryBudgets, [categoryId]: amount } }));
  }, []);

  return { state, addTransaction, removeTransaction, setBudget };
};

export const filterByMonth = (txs: Transaction[], year: number, month: number) =>
  txs.filter((t) => {
    const d = new Date(t.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

export const useMonthSummary = (txs: Transaction[], year: number, month: number) =>
  useMemo(() => {
    const inMonth = filterByMonth(txs, year, month);
    const income = inMonth.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
    const expense = inMonth.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
    return { inMonth, income, expense, balance: income - expense };
  }, [txs, year, month]);
