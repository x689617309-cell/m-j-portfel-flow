import { useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ProgressBar } from "@/components/ProgressBar";
import { IOSCard } from "@/components/IOSList";
import { BottomSheet } from "@/components/BottomSheet";
import { filterByMonth, type Transaction } from "@/lib/store";
import { formatAmountSimple } from "@/lib/format";

export const BudgetScreen = ({
  transactions,
  budgets,
  year,
  month,
  onSetBudget,
}: {
  transactions: Transaction[];
  budgets: Record<string, number>;
  year: number;
  month: number;
  onSetBudget: (categoryId: string, amount: number) => void;
}) => {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const used = useMemo(() => {
    const u: Record<string, number> = {};
    filterByMonth(transactions, year, month)
      .filter((t) => t.type === "expense")
      .forEach((t) => { u[t.categoryId] = (u[t.categoryId] ?? 0) + t.amount; });
    return u;
  }, [transactions, year, month]);

  const totalBudget = CATEGORIES.reduce((a, c) => a + (budgets[c.id] ?? 0), 0);
  const totalUsed = CATEGORIES.reduce((a, c) => a + (used[c.id] ?? 0), 0);
  const remaining = totalBudget - totalUsed;

  const startEdit = (id: string) => {
    setEditing(id);
    setDraft(String(budgets[id] ?? 0));
  };

  const saveEdit = () => {
    if (editing === null) return;
    const n = Number(draft.replace(",", "."));
    if (!Number.isNaN(n) && n >= 0) onSetBudget(editing, n);
    setEditing(null);
  };

  const editingCat = editing ? CATEGORIES.find((c) => c.id === editing) : null;

  return (
    <div className="px-4 pb-4 animate-fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="ios-card p-4">
          <div className="text-[13px] text-[rgba(60,60,67,0.6)]">Suma budżetów</div>
          <div className="text-[22px] font-bold tabular mt-1">{formatAmountSimple(totalBudget)}</div>
        </div>
        <div className="ios-card p-4">
          <div className="text-[13px] text-[rgba(60,60,67,0.6)]">Pozostało</div>
          <div className="text-[22px] font-bold tabular mt-1" style={{ color: remaining < 0 ? "#FF3B30" : "#34C759" }}>
            {formatAmountSimple(remaining)}
          </div>
        </div>
      </div>

      <div className="ios-group-header mt-6">Miesięczne limity</div>
      <IOSCard>
        {CATEGORIES.map((cat, i) => {
          const u = used[cat.id] ?? 0;
          const limit = budgets[cat.id] ?? 0;
          return (
            <div key={cat.id}>
              <button onClick={() => startEdit(cat.id)} className="w-full text-left tap-scale active:bg-[rgba(60,60,67,0.06)]">
                <div className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CategoryIcon categoryId={cat.id} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[17px] truncate">{cat.name}</div>
                    </div>
                    <div className="text-[15px] tabular text-[rgba(60,60,67,0.6)]">
                      <span className="text-foreground font-medium">{formatAmountSimple(u)}</span>{" / "}{formatAmountSimple(limit)}
                    </div>
                    <svg width="8" height="13" viewBox="0 0 8 13" className="text-[rgba(60,60,67,0.3)] ml-1" fill="none">
                      <path d="M1 1l6 5.5L1 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="mt-2 ml-[48px]">
                    <ProgressBar value={u} max={limit} color={cat.color} height={8} />
                  </div>
                </div>
              </button>
              {i < CATEGORIES.length - 1 && <div className="ios-separator ml-4" />}
            </div>
          );
        })}
      </IOSCard>

      <BottomSheet
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editingCat ? `Limit · ${editingCat.name}` : "Limit"}
        leftAction={{ label: "Anuluj", onClick: () => setEditing(null) }}
        rightAction={{ label: "Zapisz", onClick: saveEdit }}
      >
        <div className="px-4 pt-2 pb-6">
          <div className="ios-card overflow-hidden">
            <div className="flex items-center px-4 py-2.5 min-h-[56px]">
              <span className="text-[17px] w-32">Miesięczny limit</span>
              <input
                autoFocus
                inputMode="decimal"
                value={draft}
                onChange={(e) => setDraft(e.target.value.replace(/[^\d.,]/g, ""))}
                className="flex-1 text-right text-[22px] font-semibold tabular bg-transparent outline-none"
              />
              <span className="ml-2 text-[17px] text-[rgba(60,60,67,0.6)]">zł</span>
            </div>
          </div>
          <div className="text-[13px] text-[rgba(60,60,67,0.6)] mt-2 px-1">
            Ustaw 0, aby ukryć kategorię z listy budżetu w przeglądzie.
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
