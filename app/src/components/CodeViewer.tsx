interface CodeViewerProps {
  code: string[];
  selectedLines: Set<number>;
  onToggleLine?: (line: number) => void;
  buggyLines?: Set<number>;
  showResult?: boolean;
  interactive?: boolean;
}

export function CodeViewer({
  code,
  selectedLines,
  onToggleLine,
  buggyLines,
  showResult = false,
  interactive = true,
}: CodeViewerProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <div className="min-w-full font-mono text-sm leading-6">
        {code.map((line, idx) => {
          const lineNumber = idx + 1;
          const isSelected = selectedLines.has(lineNumber);
          const isBuggy = buggyLines?.has(lineNumber) ?? false;

          let rowClasses = "flex border-l-2 border-transparent";
          let stateLabel = "";

          if (showResult) {
            if (isBuggy && isSelected) {
              rowClasses += " bg-easy/15 border-l-easy";
              stateLabel = "Correctly flagged";
            } else if (isBuggy && !isSelected) {
              rowClasses += " bg-medium/15 border-l-medium";
              stateLabel = "Missed — this line is buggy";
            } else if (!isBuggy && isSelected) {
              rowClasses += " bg-hard/15 border-l-hard";
              stateLabel = "Not actually buggy";
            }
          } else if (isSelected) {
            rowClasses += " bg-accent/15 border-l-accent";
          } else if (interactive) {
            rowClasses += " hover:bg-surface-2/60";
          }

          return (
            <div
              key={lineNumber}
              role={interactive ? "button" : undefined}
              tabIndex={interactive ? 0 : undefined}
              aria-pressed={interactive ? isSelected : undefined}
              aria-label={interactive ? `Line ${lineNumber}${stateLabel ? `, ${stateLabel}` : ""}` : undefined}
              onClick={interactive ? () => onToggleLine?.(lineNumber) : undefined}
              onKeyDown={
                interactive
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onToggleLine?.(lineNumber);
                      }
                    }
                  : undefined
              }
              className={`${rowClasses} ${interactive ? "cursor-pointer" : ""}`}
            >
              <span className="select-none px-3 py-0.5 text-right text-text-muted" style={{ minWidth: "3.25rem" }}>
                {lineNumber}
              </span>
              <span className="flex-1 whitespace-pre px-2 py-0.5 text-text">{line || " "}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
