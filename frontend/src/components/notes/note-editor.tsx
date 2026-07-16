"use client";

import { Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Textarea } from "@/components/ui/textarea";

type SaveStatus = "saved" | "saving";

/**
 * Lightweight note editor with a simulated auto-save indicator. Notes are held
 * in component state for now; persistence and markdown rendering arrive with
 * the dedicated Notes feature.
 */
export function NoteEditor() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<SaveStatus>("saved");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleChange(next: string) {
    setValue(next);
    setStatus("saving");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setStatus("saved"), 700);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Notes
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {status === "saving" ? (
            <>
              <Loader2 className="size-3.5 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Check className="size-3.5 text-success" /> Saved
            </>
          )}
        </span>
      </div>
      <Textarea
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Write notes for this paper… Markdown supported."
        className="min-h-48 resize-none"
      />
      <p className="text-xs text-muted-foreground">
        Tags, paper linking, and search arrive with the Notes workspace.
      </p>
    </div>
  );
}
