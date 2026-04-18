import { useState } from "react";
import { BottomSheet } from "./BottomSheet";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { CategoryIcon } from "./CategoryIcon";
import { Check } from "lucide-react";
import type { Transaction } from "@/lib/store";

const todayInput = () => {
  const d = new Date();
  const tz = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tz * 60000);
  return local.toISOString().slice(0, 10);
};

export const TransactionFormSheet = ({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (t: Omit<Transaction, "id">) => void;
}) => {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>(CATEGORIES[0].id);
  const [date, setDate] = useState(todayInput());
  const [note, setNote] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const reset = () => {
    setType("expense"); setAmount(""); setTitle(""); setCategoryId(CATEGORIES[0].id);
    setDate(todayInput()); setNote("");
  };

  const num = Number(amount.replace(",", "."));
  const valid = num > 0 && title.trim().length > 0;

  const handleSave = () => {
    if (!valid) return;
    const finalCategory = type === "income" ? "income" : categoryId;
    onSave({
      type, amount: num, categoryId: finalCategory, title: title.trim(), date: new Date(date).toISOString(), note: note.trim() || undefined,
    });
    reset();
  };

  const cat = type === "income" ? getCategory("income") : getCategory(categoryId);

  return (
    <BottomSheet
      open={open}
      onClose={() => { onClose(); }}
      title="Nowa transakcja"
      leftAction={{ label: "Anuluj", onClick: () => { reset(); onClose(); } }}
      rightAction={{ label: "Dodaj", onClick: handleSave, disabled: !valid }}
    >
      <div className="px-4 pt-2 pb-6">
        {/* Segmented */}
        <div className="rounded-[9px] bg-[rgba(120,120,128,0.16)] p-[2px] flex">
          {(["expense", "income"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setType(k)}
              className={`flex-1 py-1.5 text-[15px] font-medium rounded-[7px] transition ${type === k ? "bg-white shadow-sm text-foreground" : "text-[rgba(60,60,67,0.7)]"}`}
            >
              {k === "expense" ? "Wydatek" : "Przychód"}
            </button>
          ))}
        </div>

        {/* Group 1: amount + title */}
        <div className="mt-5 ios-card overflow-hidden">
          <div className="flex items-center px-4 py-2.5 min-h-[56px]">
            <span className="text-[17px] w-24">Kwota</span>
            <input
              autoFocus
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ""))}
              className="flex-1 text-right text-[22px] font-semibold tabular bg-transparent outline-none"
              style={{ color: type === "income" ? "#34C759" : "#FF3B30" }}
            />
            <span className="ml-2 text-[17px] text-[rgba(60,60,67,0.6)]">zł</span>
          </div>
          <div className="ios-separator ml-4" />
          <div className="flex items-center px-4 py-2.5 min-h-[56px]">
            <span className="text-[17px] w-24">Tytuł</span>
            <input
              placeholder="Np. Zakupy spożywcze"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 text-right text-[17px] bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Group 2: category + date */}
        <div className="mt-5 ios-card overflow-hidden">
          {type === "expense" && (
            <>
              <button onClick={() => setPickerOpen(true)} className="w-full text-left tap-scale active:bg-[rgba(60,60,67,0.06)]">
                <div className="flex items-center gap-3 px-4 py-2.5 min-h-[56px]">
                  <span className="text-[17px] w-24">Kategoria</span>
                  <div className="flex-1 flex items-center justify-end gap-2">
                    <CategoryIcon categoryId={cat.id} size={28} />
                    <span className="text-[17px] text-[rgba(60,60,67,0.6)]">{cat.name}</span>
                  </div>
                  <svg width="8" height="13" viewBox="0 0 8 13" className="text-[rgba(60,60,67,0.3)] ml-1" fill="none">
                    <path d="M1 1l6 5.5L1 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
              <div className="ios-separator ml-4" />
            </>
          )}
          <div className="flex items-center px-4 py-2.5 min-h-[56px]">
            <span className="text-[17px] w-24">Data</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 text-right text-[17px] bg-transparent outline-none tabular"
            />
          </div>
        </div>

        {/* Group 3: note */}
        <div className="mt-5 ios-card overflow-hidden">
          <div className="px-4 py-2.5">
            <textarea
              rows={3}
              placeholder="Notatka (opcjonalnie)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-[17px] bg-transparent outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Category picker as nested sheet (simple) */}
      <BottomSheet
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Kategoria"
        leftAction={{ label: "Anuluj", onClick: () => setPickerOpen(false) }}
        rightAction={{ label: "Gotowe", onClick: () => setPickerOpen(false) }}
      >
        <div className="px-4 pb-4">
          <div className="ios-card overflow-hidden">
            {CATEGORIES.map((c, i) => (
              <div key={c.id}>
                <button
                  onClick={() => { setCategoryId(c.id); setPickerOpen(false); }}
                  className="w-full text-left tap-scale active:bg-[rgba(60,60,67,0.06)]"
                >
                  <div className="flex items-center gap-3 px-4 py-2.5 min-h-[56px]">
                    <CategoryIcon categoryId={c.id} />
                    <div className="flex-1 text-[17px]">{c.name}</div>
                    {categoryId === c.id && <Check size={20} className="text-primary" />}
                  </div>
                </button>
                {i < CATEGORIES.length - 1 && <div className="ios-separator ml-[64px]" />}
              </div>
            ))}
          </div>
        </div>
      </BottomSheet>
    </BottomSheet>
  );
};
