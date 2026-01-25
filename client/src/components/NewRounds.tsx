import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus, X } from "lucide-react";
import { Badge } from "./ui/badge";
import type { NewRoundProps } from "@/lib/props";

export default function NewRounds({ field }: NewRoundProps) {
  const [newRound, setNewRound] = useState("");

  const addRound = () => {
    const value = newRound.trim();
    if (!value) return;
    if (field.value?.includes(value)) return;

    field.onChange([...(field.value ?? []), value]);
    setNewRound("");
  };

  const removeRound = (round: string) => {
    field.onChange(field.value.filter((r: string) => r !== round));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="e.g. Technical Interview"
          value={newRound}
          onChange={(e) => setNewRound(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addRound();
            }
          }}
          className="flex-1"
        />
        <Button
          type="button"
          size="icon"
          variant="secondary"
          onClick={addRound}
          disabled={!newRound.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 p-3 min-h-12">
        {!field.value || field.value.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            No interview rounds added.
          </p>
        ) : (
          field.value.map((round: string) => (
            <Badge
              key={round}
              variant="outline"
              className="pl-3 pr-1 py-1.5 flex items-center gap-2 bg-background shadow-sm border-primary/20"
            >
              <span className="font-medium text-sm">{round}</span>
              <button
                type="button"
                onClick={() => removeRound(round)}
                className="rounded-full p-0.5 hover:bg-muted transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}
