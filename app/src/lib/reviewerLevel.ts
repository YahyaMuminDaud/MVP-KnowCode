import type { Difficulty, Problem } from "../types";

const TIER_ORDER: Difficulty[] = ["easy", "medium", "hard"];

const TIER_TITLE: Record<Difficulty, string> = {
  easy: "Junior Reviewer",
  medium: "Mid-level Reviewer",
  hard: "Senior Reviewer",
};

export interface ReviewerLevel {
  title: string;
  tierSolved: number;
  tierTotal: number;
  allDone: boolean;
  isSecret: boolean;
}

export function computeReviewerLevel(
  problems: Problem[],
  isSolved: (id: string) => boolean,
  isFixed: (id: string) => boolean,
): ReviewerLevel {
  for (const tier of TIER_ORDER) {
    const tierProblems = problems.filter((p) => p.difficulty === tier);
    const tierSolved = tierProblems.filter((p) => isSolved(p.id)).length;
    if (tierSolved < tierProblems.length) {
      return {
        title: TIER_TITLE[tier],
        tierSolved,
        tierTotal: tierProblems.length,
        allDone: false,
        isSecret: false,
      };
    }
  }

  const bonusProblems = problems.filter((p) => p.rewrite);
  const allBonusesFixed = bonusProblems.length > 0 && bonusProblems.every((p) => isFixed(p.id));

  if (allBonusesFixed) {
    return { title: "Super Boss", tierSolved: problems.length, tierTotal: problems.length, allDone: true, isSecret: true };
  }

  return {
    title: "Principal Reviewer",
    tierSolved: problems.length,
    tierTotal: problems.length,
    allDone: true,
    isSecret: false,
  };
}
