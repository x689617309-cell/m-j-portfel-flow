import { getCategory } from "@/lib/categories";

export const CategoryIcon = ({ categoryId, size = 36 }: { categoryId: string; size?: number }) => {
  const cat = getCategory(categoryId);
  return (
    <div
      className="flex items-center justify-center rounded-[10px] shrink-0"
      style={{ width: size, height: size, background: cat.color }}
      aria-label={cat.name}
    >
      <span style={{ fontSize: size * 0.5 }}>{cat.emoji}</span>
    </div>
  );
};
