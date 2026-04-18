import { useMemo } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { filterByMonth, type Transaction } from "@/lib/store";
import { formatAmountSimple, monthShort } from "@/lib/format";
import { IOSCard } from "@/components/IOSList";

const TooltipCard = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ios-card px-3 py-2 text-[13px]" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
      {label && <div className="font-semibold mb-1">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 tabular">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.payload?.fill }} />
          <span>{p.name}: {formatAmountSimple(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export const ReportsScreen = ({
  transactions,
  year,
  month,
}: {
  transactions: Transaction[];
  year: number;
  month: number;
}) => {
  const last6 = useMemo(() => {
    const arr: { name: string; income: number; expense: number; year: number; month: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - i, 1);
      const y = d.getFullYear(); const m = d.getMonth();
      const inM = filterByMonth(transactions, y, m);
      arr.push({
        name: monthShort(m),
        year: y, month: m,
        income: inM.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0),
        expense: inM.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0),
      });
    }
    return arr;
  }, [transactions, year, month]);

  const inMonth = useMemo(() => filterByMonth(transactions, year, month), [transactions, year, month]);

  const pieData = useMemo(() => {
    const map: Record<string, number> = {};
    inMonth.filter((t) => t.type === "expense").forEach((t) => {
      map[t.categoryId] = (map[t.categoryId] ?? 0) + t.amount;
    });
    return CATEGORIES
      .map((c) => ({ name: c.name, value: map[c.id] ?? 0, color: c.color, id: c.id }))
      .filter((d) => d.value > 0);
  }, [inMonth]);

  const totalExpense = pieData.reduce((a, d) => a + d.value, 0);

  const stats = useMemo(() => {
    const avgExpense = last6.reduce((a, m) => a + m.expense, 0) / 6;
    const topCat = [...pieData].sort((a, b) => b.value - a.value)[0];
    const monthIncome = last6[5].income;
    const monthExpense = last6[5].expense;
    const savingsPct = monthIncome > 0 ? Math.max(0, ((monthIncome - monthExpense) / monthIncome) * 100) : 0;
    return {
      avg: avgExpense,
      topCat: topCat ? getCategory(topCat.id) : null,
      savingsPct,
      txCount: inMonth.length,
    };
  }, [last6, pieData, inMonth]);

  return (
    <div className="px-4 pb-4 animate-fade-in">
      <div className="ios-group-header mt-2">Przychody vs Wydatki · 6 miesięcy</div>
      <IOSCard>
        <div className="px-2 pt-3 pb-2" style={{ height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={last6} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "rgba(60,60,67,0.6)", fontSize: 12 }} />
              <YAxis hide />
              <Tooltip content={<TooltipCard />} cursor={{ fill: "rgba(60,60,67,0.06)" }} />
              <Bar dataKey="income" name="Przychody" fill="#34C759" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" name="Wydatki" fill="#FF3B30" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </IOSCard>

      <div className="ios-group-header mt-6">Wydatki według kategorii</div>
      <IOSCard>
        {pieData.length === 0 ? (
          <div className="px-4 py-8 text-center text-[15px] text-[rgba(60,60,67,0.6)]">Brak wydatków w tym miesiącu</div>
        ) : (
          <div className="px-3 pt-3 pb-3">
            <div style={{ height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2} stroke="none">
                    {pieData.map((entry) => <Cell key={entry.id} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<TooltipCard />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-2">
              {pieData.map((d) => (
                <div key={d.id} className="flex items-center gap-2 text-[13px]">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
                  <span className="truncate flex-1">{d.name}</span>
                  <span className="tabular text-[rgba(60,60,67,0.6)]">{Math.round((d.value / totalExpense) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </IOSCard>

      <div className="ios-group-header mt-6">Statystyki</div>
      <div className="grid grid-cols-2 gap-3">
        <StatTile label="Średnie wydatki / mies." value={formatAmountSimple(stats.avg)} />
        <StatTile label="Najdroższa kategoria" value={stats.topCat?.name ?? "—"} icon={stats.topCat?.emoji} />
        <StatTile label="% oszczędności" value={`${stats.savingsPct.toFixed(0)}%`} valueColor={stats.savingsPct > 0 ? "#34C759" : "#FF3B30"} />
        <StatTile label="Łącznie transakcji" value={String(stats.txCount)} />
      </div>
    </div>
  );
};

const StatTile = ({ label, value, valueColor, icon }: { label: string; value: string; valueColor?: string; icon?: string }) => (
  <div className="ios-card p-4">
    <div className="text-[13px] text-[rgba(60,60,67,0.6)]">{label}</div>
    <div className="text-[20px] font-bold mt-1 tabular flex items-center gap-1.5" style={{ color: valueColor }}>
      {icon && <span className="text-[18px]">{icon}</span>}
      <span className="truncate">{value}</span>
    </div>
  </div>
);
