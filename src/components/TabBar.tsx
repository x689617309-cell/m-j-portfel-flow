import { LayoutDashboard, ArrowLeftRight, PieChart, BarChart2 } from "lucide-react";
import type { TabKey } from "@/lib/tabs";

const TABS: { key: TabKey; label: string; Icon: typeof LayoutDashboard }[] = [
  { key: "overview",     label: "Przegląd",    Icon: LayoutDashboard },
  { key: "transactions", label: "Transakcje",  Icon: ArrowLeftRight },
  { key: "budget",       label: "Budżet",      Icon: PieChart },
  { key: "reports",      label: "Raporty",     Icon: BarChart2 },
];

export const TabBar = ({ active, onChange }: { active: TabKey; onChange: (k: TabKey) => void }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 ios-blur-bottom" style={{ height: 83, paddingBottom: "max(env(safe-area-inset-bottom), 20px)" }}>
      <div className="max-w-[480px] mx-auto h-full flex items-start pt-1.5">
        {TABS.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="flex-1 flex flex-col items-center gap-0.5 tap-scale"
              aria-label={label}
              aria-current={isActive}
            >
              <Icon
                size={26}
                strokeWidth={isActive ? 2.2 : 1.8}
                color={isActive ? "#007AFF" : "rgba(60,60,67,0.4)"}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? "#007AFF" : "rgba(60,60,67,0.5)" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
