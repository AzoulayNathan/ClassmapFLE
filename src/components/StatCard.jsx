import { cn } from "@/lib/utils";

export default function StatCard({ icon: Icon, label, value, sublabel, className, onClick }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card border border-border rounded-xl p-5 flex flex-col gap-1 transition-all",
        onClick && "cursor-pointer hover:shadow-md hover:border-primary/20",
        className
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {Icon && <Icon className="h-4 w-4" />}
        <span className="text-xs font-medium font-body uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-2xl font-heading font-semibold text-foreground">{value}</div>
      {sublabel && <span className="text-xs text-muted-foreground font-body">{sublabel}</span>}
    </div>
  );
}