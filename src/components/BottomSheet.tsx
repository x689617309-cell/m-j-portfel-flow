import { ReactNode, useEffect, useState } from "react";

export const BottomSheet = ({
  open,
  onClose,
  children,
  title,
  leftAction,
  rightAction,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  leftAction?: { label: string; onClick: () => void };
  rightAction?: { label: string; onClick: () => void; disabled?: boolean };
}) => {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) { setMounted(true); setClosing(false); }
    else if (mounted) {
      setClosing(true);
      const t = setTimeout(() => { setMounted(false); setClosing(false); }, 250);
      return () => clearTimeout(t);
    }
  }, [open, mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/30 ${closing ? "animate-fade-in" : "animate-fade-in"}`}
        style={{ animationDirection: closing ? "reverse" : "normal" }}
      />
      <div
        className={`absolute left-0 right-0 bottom-0 bg-background rounded-t-[16px] overflow-hidden ${closing ? "animate-sheet-down" : "animate-sheet-up"}`}
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex justify-center pt-2.5 pb-1.5">
          <div className="w-9 h-1 rounded-full bg-[rgba(60,60,67,0.3)]" />
        </div>
        {(title || leftAction || rightAction) && (
          <div className="flex items-center justify-between px-4 h-11">
            <button
              onClick={leftAction?.onClick ?? onClose}
              className="text-[17px] text-primary tap-scale"
            >
              {leftAction?.label ?? "Anuluj"}
            </button>
            <div className="text-[17px] font-semibold">{title}</div>
            <button
              onClick={rightAction?.onClick}
              disabled={rightAction?.disabled}
              className={`text-[17px] font-semibold tap-scale ${rightAction?.disabled ? "text-[rgba(60,60,67,0.3)]" : "text-primary"}`}
            >
              {rightAction?.label ?? ""}
            </button>
          </div>
        )}
        <div className="overflow-y-auto no-scrollbar pb-[calc(env(safe-area-inset-bottom)+24px)]" style={{ maxHeight: "calc(90vh - 60px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
};
