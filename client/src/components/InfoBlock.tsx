import type { InfoBlockProps } from "@/lib/props";

export default function InfoBlock({
  label,
  value,
  icon,
  capitalize,
}: InfoBlockProps) {
  return (
    <div className="space-y-1.5">
      <div className="text-sm font-medium">{label}</div>
      <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm bg-muted/30">
        <span className={capitalize ? "capitalize" : ""}>{value || "—"}</span>
        {icon}
      </div>
    </div>
  );
}
