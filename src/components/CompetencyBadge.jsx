import { cn } from "@/lib/utils";

const levelStyles = {
  "solide": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "correct": "bg-blue-100 text-blue-800 border-blue-200",
  "fragile": "bg-amber-100 text-amber-800 border-amber-200",
  "bloqué": "bg-rose-100 text-rose-800 border-rose-200",
  "non observé": "bg-gray-100 text-gray-500 border-gray-200",
};

const levelLabels = {
  "solide": "Solide",
  "correct": "Correct",
  "fragile": "Fragile",
  "bloqué": "Bloqué",
  "non observé": "—",
};

export default function CompetencyBadge({ level, size = "sm", onClick, className }) {
  const style = levelStyles[level] || levelStyles["non observé"];
  const label = levelLabels[level] || "—";

  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md border font-medium font-body transition-all",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        onClick && "cursor-pointer hover:opacity-80 active:scale-95",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}

export { levelStyles, levelLabels };