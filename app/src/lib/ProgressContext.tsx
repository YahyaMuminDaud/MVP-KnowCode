import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "knowcode:progress:v1";

interface ProgressState {
  solved: Record<string, boolean>;
  fixed: Record<string, boolean>;
  attempts: Record<string, number>;
}

interface ProgressContextValue {
  isSolved: (problemId: string) => boolean;
  isFixed: (problemId: string) => boolean;
  attemptCount: (problemId: string) => number;
  recordAttempt: (problemId: string) => void;
  markSolved: (problemId: string) => void;
  markFixed: (problemId: string) => void;
  solvedCount: number;
}

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { solved: {}, fixed: {}, attempts: {} };
    const parsed = JSON.parse(raw);
    return {
      solved: parsed.solved ?? {},
      fixed: parsed.fixed ?? {},
      attempts: parsed.attempts ?? {},
    };
  } catch {
    return { solved: {}, fixed: {}, attempts: {} };
  }
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const recordAttempt = useCallback((problemId: string) => {
    setProgress((prev) => ({
      ...prev,
      attempts: { ...prev.attempts, [problemId]: (prev.attempts[problemId] ?? 0) + 1 },
    }));
  }, []);

  const markSolved = useCallback((problemId: string) => {
    setProgress((prev) => ({
      ...prev,
      solved: { ...prev.solved, [problemId]: true },
    }));
  }, []);

  const markFixed = useCallback((problemId: string) => {
    setProgress((prev) => ({
      ...prev,
      fixed: { ...prev.fixed, [problemId]: true },
    }));
  }, []);

  const isSolved = useCallback((problemId: string) => Boolean(progress.solved[problemId]), [progress.solved]);

  const isFixed = useCallback((problemId: string) => Boolean(progress.fixed[problemId]), [progress.fixed]);

  const attemptCount = useCallback((problemId: string) => progress.attempts[problemId] ?? 0, [progress.attempts]);

  const solvedCount = Object.values(progress.solved).filter(Boolean).length;

  return (
    <ProgressContext.Provider
      value={{ isSolved, isFixed, attemptCount, recordAttempt, markSolved, markFixed, solvedCount }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within a ProgressProvider");
  return ctx;
}
