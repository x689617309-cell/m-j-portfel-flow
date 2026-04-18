import { useMemo } from "react";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { filterByMonth, type Transaction } from "@/lib/store";
import { formatAmountSimple, formatCurrencyPLN, formatDatePL } from "@/lib/format";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ProgressBar } from "@/components/ProgressBar";
import { IOSCard } from "@/components/IOSList";
import { useCountUp } from "@/hooks/useCountUp";

export const OverviewScreen = ({
  transactions,
  budgets,
  year,
  month,
}: {
  transactions: Transaction[];
  budgets: Record<string, number>;
  year: number;
  month: number;
}) => {
  const inMonth = useMemo(() => filterByMonth(transactions, year, month), [transactions, year, month]);
  const income = inMonth.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const expense = inMonth.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
  const balance = income - expense;

  const balanceAnim = useCountUp(balance);

  const recent = useMemo(() => [...inMonth].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 5), [inMonth]);

  const categoryUsage = useMemo(() => {
    const used: Record<string, number> = {};
    inMonth.filter((t) => t.type === "expense").forEach((t) => {
      used[t.categoryId] = (used[t.categoryId] ?? 0) + t.amount;
    });
    return used;
  }, [inMonth]);

  const visibleBudgets = CATEGORIES.filter((c) => (budgets[c.id] ?? 0) > 0);

  return (
    <div className="px-4 pb-4 animate-fade-in">
      {/* Hero */}
      <div className="px-1 pt-2 pb-5">
        <div className="text-[13px] text-[rgba(60,60,67,0.6)]">Saldo</div>
        <div className="ios-amount mt-1" style={{ color: balance < 0 ? "#FF3B30" : "#000" }}>
          {formatCurrencyPLN(balanceAnim)}
        </div>
        <div className="mt-2 text-[15px] tabular flex items-center gap-3 flex-wrap">
          <span className="text-[hsl(var(--success))] font-medium">↑ Przychody {formatAmountSimple(income)}</span>
          <span className="text-[#FF3B30] font-medium">↓ Wydatki {formatAmountSimple(expense)}</span>
        </div>
      </div>

      {/* Budżet kategorii */}
      <div className="ios-group-header mt-2">Budżet kategorii</div>
      <IOSCard>
        {visibleBudgets.map((cat, i) => {
          const used = categoryUsage[cat.id] ?? 0;
          const limit = budgets[cat.id] ?? 0;
          return (
            <div key={cat.id}>
              <div className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <CategoryIcon categoryId={cat.id} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[17px] truncate">{cat.name}</div>
                  </div>
                  <div className="text-[15px] tabular text-[rgba(60,60,67,0.6)]">
                    <span className="text-foreground font-medium">{formatAmountSimple(used)}</span>
                    {" / "}{formatAmountSimple(limit)}
                  </div>
                </div>
                <div className="mt-2 ml-[48px]">
                  <ProgressBar value={used} max={limit} color={cat.color} />
                </div>
              </div>
              {i < visibleBudgets.length - 1 && <div className="ios-separator ml-4" />}
            </div>
          );
        })}
      </IOSCard>

      {/* Ostatnie transakcje */}
      <div className="ios-group-header mt-6">Ostatnie transakcje</div>
      <IOSCard>
        {recent.length === 0 && (
          <div className="px-4 py-6 text-center text-[15px] text-[rgba(60,60,67,0.6)]">Brak transakcji w tym miesiącu</div>
        )}
        {recent.map((t, i) => {
          const cat = getCategory(t.categoryId);
          return (
            <div key={t.id}>
              <div className="flex items-center gap-3 px-4 py-2.5">
                <CategoryIcon categoryId={t.categoryId} />
                <div className="flex-1 min-w-0">
                  <div className="text-[17px] truncate">{t.title}</div>
                  <div className="text-[13px] text-[rgba(60,60,67,0.6)] truncate">{cat.name} · {formatDatePL(new Date(t.date))}</div>
                </div>
                <div
                  className="text-[17px] font-semibold tabular shrink-0"
                  style={{ color: t.type === "income" ? "#34C759" : "#FF3B30" }}
                >
                  {t.type === "income" ? "+" : "−"} {formatAmountSimple(t.amount)}
                </div>
              </div>
              {i < recent.length - 1 && <div className="ios-separator ml-[64px]" />}
            </div>
          );
        })}
      </IOSCard>
    </div>
  );
};
