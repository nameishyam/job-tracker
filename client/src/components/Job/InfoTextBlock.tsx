import type { InfoTextBlockProps } from "@/lib/props";

export default function InfoTextBlock({ value }: InfoTextBlockProps) {
  return (
    <div className="space-y-1.5">
      <div className="min-h-20 rounded-md border px-3 py-2 text-sm bg-muted/30 whitespace-pre-wrap">
        {value || "—"}
      </div>
    </div>
  );
}
