import { ChevronLeft, ChevronRight } from "lucide-react";
import { monthLabel } from "@/lib/format";

export const NavigationBar = ({
  title,
  year,
  month,
  onPrev,
  onNext,
  initials,
  compact,
}: {
  title: string;
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  initials: string;
  compact: boolean;
}) => {
  return (
    <div className="sticky top-0 z-30 ios-blur-top">
      <div className="px-4 pt-[calc(env(safe-area-inset-top)+8px)] pb-2">
        <div className="flex items-center justify-between h-11">
          <button onClick={onPrev} className="text-primary flex items-center gap-0.5 tap-scale" aria-label="Poprzedni miesiąc">
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <div className="text-[17px] font-semibold tabular text-primary">
            {monthLabel(year, month)}
          </div>
          <button onClick={onNext} className="text-primary flex items-center gap-0.5 tap-scale" aria-label="Następny miesiąc">
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        </div>
        <div className="flex items-end justify-between">
          <h1
            className="ios-large-title transition-all duration-200"
            style={{
              fontSize: compact ? 17 : 34,
              fontWeight: compact ? 600 : 700,
              lineHeight: compact ? "22px" : "41px",
            }}
          >
            {title}
          </h1>
          <div className="w-8 h-8 rounded-full bg-[rgba(60,60,67,0.12)] flex items-center justify-center text-[13px] font-semibold text-[rgba(60,60,67,0.6)]">
            {initials}
          </div>
        </div>
      </div>
    </div>
  );
};
