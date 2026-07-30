import type { Difficulty } from "../types";

const STYLES: Record<Difficulty, string> = {
  easy: "text-easy bg-easy/10 border-easy/30",
  medium: "text-medium bg-medium/10 border-medium/30",
  hard: "text-hard bg-hard/10 border-hard/30",
};

const LABELS: Record<Difficulty, string> = {
  easy: "Junior",
  medium: "Mid-level",
  hard: "Senior",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[difficulty]}`}
    >
      {LABELS[difficulty]}
    </span>
  );
}
