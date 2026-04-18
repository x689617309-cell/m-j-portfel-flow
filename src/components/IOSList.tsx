import { ReactNode } from "react";

export const IOSCard = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`ios-card overflow-hidden ${className}`}>{children}</div>
);

export const IOSListRow = ({
  left,
  title,
  subtitle,
  right,
  onClick,
  children,
  showChevron,
}: {
  left?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  onClick?: () => void;
  children?: ReactNode;
  showChevron?: boolean;
}) => {
  const content = (
    <div className="flex items-center gap-3 px-4 py-2.5 min-h-[56px]">
      {left}
      <div className="flex-1 min-w-0">
        {title && <div className="text-[17px] truncate">{title}</div>}
        {subtitle && <div className="text-[13px] text-[rgba(60,60,67,0.6)] truncate mt-0.5">{subtitle}</div>}
        {children}
      </div>
      {right}
      {showChevron && (
        <svg width="8" height="13" viewBox="0 0 8 13" className="text-[rgba(60,60,67,0.3)] shrink-0" fill="none">
          <path d="M1 1l6 5.5L1 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
  if (onClick) return <button onClick={onClick} className="w-full text-left tap-scale active:bg-[rgba(60,60,67,0.06)] transition-colors">{content}</button>;
  return content;
};

export const IOSList = ({ children }: { children: ReactNode[] | ReactNode }) => {
  const arr = Array.isArray(children) ? children.filter(Boolean) : [children];
  return (
    <IOSCard>
      {arr.map((child, i) => (
        <div key={i}>
          {child}
          {i < arr.length - 1 && <div className="ios-separator ml-[64px]" />}
        </div>
      ))}
    </IOSCard>
  );
};
