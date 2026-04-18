import { useEffect, useState } from "react";
import { NavigationBar } from "@/components/NavigationBar";
import { TabBar } from "@/components/TabBar";
import { TAB_TITLES, type TabKey } from "@/lib/tabs";
import { useAppStore } from "@/lib/store";
import { OverviewScreen } from "@/screens/OverviewScreen";
import { TransactionsScreen } from "@/screens/TransactionsScreen";
import { BudgetScreen } from "@/screens/BudgetScreen";
import { ReportsScreen } from "@/screens/ReportsScreen";

const Index = () => {
  const { state, addTransaction, removeTransaction, setBudget } = useAppStore();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [tab, setTab] = useState<TabKey>("overview");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goPrev = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1);
  };
  const goNext = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[480px] mx-auto relative">
        <NavigationBar
          title={TAB_TITLES[tab]}
          year={year}
          month={month}
          onPrev={goPrev}
          onNext={goNext}
          initials={state.user.initials}
          compact={scrolled}
        />

        <main key={tab} className="pb-[120px] animate-fade-in">
          {tab === "overview" && (
            <OverviewScreen
              transactions={state.transactions}
              budgets={state.categoryBudgets}
              year={year}
              month={month}
            />
          )}
          {tab === "transactions" && (
            <TransactionsScreen
              transactions={state.transactions}
              year={year}
              month={month}
              onAdd={addTransaction}
              onDelete={removeTransaction}
            />
          )}
          {tab === "budget" && (
            <BudgetScreen
              transactions={state.transactions}
              budgets={state.categoryBudgets}
              year={year}
              month={month}
              onSetBudget={setBudget}
            />
          )}
          {tab === "reports" && (
            <ReportsScreen
              transactions={state.transactions}
              year={year}
              month={month}
            />
          )}
        </main>

        <TabBar active={tab} onChange={setTab} />
      </div>
    </div>
  );
};

export default Index;
