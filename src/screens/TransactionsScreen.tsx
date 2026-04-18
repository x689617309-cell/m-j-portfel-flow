import { useEffect, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { IOSCard } from "@/components/IOSList";
import { filterByMonth, type Transaction } from "@/lib/store";
import { formatAmountSimple, formatDayHeaderPL } from "@/lib/format";
import { getCategory } from "@/lib/categories";
import { TransactionFormSheet } from "@/components/TransactionFormSheet";

const SwipeRow = ({ tx, onDelete }: { tx: Transaction; onDelete: () => void }) => {
  const [offset, setOffset] = useState(0);
  const startX = useRef<number | null>(null);
  const startOffset = useRef(0);
  const REVEAL = 84;

  const onStart = (clientX: number) => { startX.current = clientX; startOffset.current = offset; };
  const onMove = (clientX: number) => {
    if (startX.current === null) return;
    const delta = clientX - startX.current;
    const next = Math.min(0, Math.max(-REVEAL, startOffset.current + delta));
    setOffset(next);
  };
  const onEnd = () => {
    if (startX.current === null) return;
    setOffset(offset < -REVEAL / 2 ? -REVEAL : 0);
    startX.current = null;
  };

  const cat = getCategory(tx.categoryId);

  return (
    <div className="relative overflow-hidden bg-card">
      <button
        onClick={onDelete}
        className="absolute right-0 top-0 bottom-0 flex items-center justify-center bg-[#FF3B30] text-white tap-scale"
        style={{ width: REVEAL }}
        aria-label="Usuń"
      >
        <Trash2 size={20} />
        <span className="ml-1 text-[15px] font-medium">Usuń</span>
      </button>
      <div
        className="bg-card relative"
        style={{ transform: `translateX(${offset}px)`, transition: startX.current === null ? "transform 250ms cubic-bezier(0.32,0.72,0,1)" : "none", touchAction: "pan-y" }}
        onTouchStart={(e) => onStart(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onEnd}
        onMouseDown={(e) => { onStart(e.clientX); const mm = (ev: MouseEvent) => onMove(ev.clientX); const mu = () => { onEnd(); window.removeEventListener("mousemove", mm); window.removeEventListener("mouseup", mu); }; window.addEventListener("mousemove", mm); window.addEventListener("mouseup", mu); }}
      >
        <div className="flex items-center gap-3 px-4 py-2.5 min-h-[56px]">
          <CategoryIcon categoryId={tx.categoryId} />
          <div className="flex-1 min-w-0">
            <div className="text-[17px] truncate">{tx.title}</div>
            <div className="text-[13px] text-[rgba(60,60,67,0.6)] truncate">{cat.name}{tx.note ? ` · ${tx.note}` : ""}</div>
          </div>
          <div className="text-[17px] font-semibold tabular shrink-0" style={{ color: tx.type === "income" ? "#34C759" : "#FF3B30" }}>
            {tx.type === "income" ? "+" : "−"} {formatAmountSimple(tx.amount)}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TransactionsScreen = ({
  transactions,
  year,
  month,
  onAdd,
  onDelete,
}: {
  transactions: Transaction[];
  year: number;
  month: number;
  onAdd: (t: Omit<Transaction, "id">) => void;
  onDelete: (id: string) => void;
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const inMonth = filterByMonth(transactions, year, month).sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const groups = new Map<string, Transaction[]>();
  inMonth.forEach((t) => {
    const d = new Date(t.date); d.setHours(0,0,0,0);
    const key = d.toISOString();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  });

  // close swipes when scrolling? simple: nothing.
  useEffect(() => {}, []);

  return (
    <div className="px-4 pb-4 animate-fade-in">
      {inMonth.length === 0 && (
        <div className="mt-12 text-center text-[15px] text-[rgba(60,60,67,0.6)]">
          Brak transakcji w tym miesiącu.<br />Dotknij +, aby dodać pierwszą.
        </div>
      )}
      {[...groups.entries()].map(([key, list]) => (
        <div key={key} className="mt-4 first:mt-2">
          <div className="ios-group-header">{formatDayHeaderPL(new Date(key))}</div>
          <IOSCard>
            {list.map((tx, i) => (
              <div key={tx.id}>
                <SwipeRow tx={tx} onDelete={() => onDelete(tx.id)} />
                {i < list.length - 1 && <div className="ios-separator ml-[64px]" />}
              </div>
            ))}
          </IOSCard>
        </div>
      ))}

      {/* FAB */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed z-30 right-4 rounded-full bg-primary text-primary-foreground tap-scale flex items-center justify-center"
        style={{
          width: 56, height: 56,
          bottom: `calc(83px + env(safe-area-inset-bottom) + 16px)`,
          boxShadow: "0 6px 16px rgba(0,122,255,0.35), 0 2px 4px rgba(0,0,0,0.08)",
        }}
        aria-label="Dodaj transakcję"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <TransactionFormSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSave={(t) => { onAdd(t); setSheetOpen(false); }}
      />
    </div>
  );
};
