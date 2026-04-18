import { useEffect, useState } from "react";

export const ProgressBar = ({
  value,
  max,
  color,
  height = 4,
  warnAt = 0.8,
}: {
  value: number;
  max: number;
  color: string;
  height?: number;
  warnAt?: number;
}) => {
  const ratio = max > 0 ? Math.min(value / max, 1) : 0;
  const isWarn = max > 0 && value / max > warnAt;
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(ratio * 100), 30);
    return () => clearTimeout(t);
  }, [ratio]);
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height, background: "rgba(60,60,67,0.12)" }}>
      <div
        className="h-full rounded-full"
        style={{
          width: `${w}%`,
          background: isWarn ? "#FF3B30" : color,
          transition: "width 600ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      />
    </div>
  );
};
