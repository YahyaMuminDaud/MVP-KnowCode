import { useState } from "react";
import type { RewriteChallenge } from "../types";
import { useProgress } from "../lib/ProgressContext";

interface RewritePanelProps {
  problemId: string;
  rewrite: RewriteChallenge;
}

export function RewritePanel({ problemId, rewrite }: RewritePanelProps) {
  const { isFixed, markFixed } = useProgress();
  const [draft, setDraft] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const fixed = isFixed(problemId);

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold">Bonus: Push a Fix</h3>
        {fixed && (
          <span className="inline-flex items-center rounded-full border border-easy/30 bg-easy/10 px-2.5 py-0.5 text-xs font-medium text-easy">
            Fix Shipped
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-text-muted">{rewrite.instructions}</p>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        spellCheck={false}
        placeholder="Write the patch you'd actually commit..."
        className="mt-3 h-40 w-full resize-y rounded-md border border-border bg-bg p-3 font-mono text-sm text-text outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setShowSolution((v) => !v)}
          className="cursor-pointer rounded-md border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium text-text transition-colors hover:bg-surface-2/70"
        >
          {showSolution ? "Hide merged fix" : "Compare with merged fix"}
        </button>

        {!fixed && showSolution && (
          <button
            type="button"
            onClick={() => markFixed(problemId)}
            className="cursor-pointer rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover"
          >
            Mark as fixed
          </button>
        )}

        {!fixed && !showSolution && (
          <span className="text-xs text-text-muted">Self-checked — compare your patch, then mark it fixed.</span>
        )}
      </div>

      {showSolution && (
        <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-bg p-3 font-mono text-sm text-text">
          {rewrite.solutionCode}
        </pre>
      )}
    </div>
  );
}
