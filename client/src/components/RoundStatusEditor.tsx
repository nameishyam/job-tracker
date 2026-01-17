import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus, X } from "lucide-react";
import { Badge } from "./ui/badge";
import type { RoundStatusEditorProps } from "@/lib/props";

export default function RoundStatusEditor({ field }: RoundStatusEditorProps) {
  const [newRoundName, setNewRoundName] = useState("");

  const addRound = () => {
    if (newRoundName.trim() && !field.value[newRoundName]) {
      field.onChange({
        ...field.value,
        [newRoundName.trim()]: "Pending",
      });
      setNewRoundName("");
    }
  };

  const removeRound = (key: string) => {
    const newValue = { ...field.value };
    delete newValue[key];
    field.onChange(newValue);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="e.g. Technical Interview"
          value={newRoundName}
          onChange={(e) => setNewRoundName(e.target.value)}
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
          disabled={!newRoundName.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 p-3 min-h-12.5">
        {Object.entries(field.value).length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            No rounds added yet.
          </p>
        ) : (
          Object.entries(field.value).map(([roundName, status]) => (
            <Badge
              key={roundName}
              variant="outline"
              className="pl-3 pr-1 py-1.5 flex items-center gap-2 bg-background shadow-sm border-primary/20"
            >
              <span className="font-medium text-sm">{roundName}</span>
              <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded uppercase font-bold tracking-tight">
                {status}
              </span>
              <button
                type="button"
                onClick={() => removeRound(roundName)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted transition-colors"
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
