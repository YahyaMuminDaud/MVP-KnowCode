import { Link, Outlet } from "react-router-dom";
import { problems } from "../data/problems";
import { useProgress } from "../lib/ProgressContext";
import { computeReviewerLevel } from "../lib/reviewerLevel";

const CrownIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-legendary" aria-hidden="true">
    <path d="M3 15.5l-1.5-8L6 10l4-6 4 6 4.5-2.5-1.5 8h-14z" />
  </svg>
);

export function Layout() {
  const { isSolved, isFixed } = useProgress();
  const level = computeReviewerLevel(problems, isSolved, isFixed);

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 font-mono text-accent">
              {"</>"}
            </span>
            <span>KnowCode</span>
          </Link>
          <div className="flex items-center gap-2 font-mono text-sm text-text-muted">
            {level.isSecret && <CrownIcon />}
            <span className={level.isSecret ? "font-semibold text-legendary" : "text-text"}>{level.title}</span>
            {!level.allDone && (
              <>
                <span className="text-text-muted">·</span>
                <span className="text-easy">{level.tierSolved}</span>
                <span>/</span>
                <span>{level.tierTotal}</span>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
