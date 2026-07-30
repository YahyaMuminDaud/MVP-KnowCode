import { Link } from "react-router-dom";
import { problems } from "../data/problems";
import { DifficultyBadge } from "../components/DifficultyBadge";
import { useProgress } from "../lib/ProgressContext";

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-easy" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42L8.5 12.08l6.79-6.79a1 1 0 011.42 0z"
      clipRule="evenodd"
    />
  </svg>
);

const WrenchIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-legendary" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M14.5 2a3.5 3.5 0 00-3.44 4.14L4.4 12.8a1.5 1.5 0 000 2.12l.68.68a1.5 1.5 0 002.12 0l6.66-6.66A3.5 3.5 0 1014.5 2zM5.4 13.86l6.28-6.28.74.74-6.28 6.28-.74-.74z"
      clipRule="evenodd"
    />
  </svg>
);

export function ProblemList() {
  const { isSolved, isFixed } = useProgress();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">Open for Review</h1>
        <p className="mt-2 max-w-2xl text-text-muted">
          Practice giving code review feedback like you would on a real pull request — read the
          change, flag what's wrong, and explain why. No judge, no runtime — just your eye for bad
          code.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-text-muted">
            <tr>
              <th className="w-16 px-4 py-3 font-medium"></th>
              <th className="px-4 py-3 font-medium">Pull Request</th>
              <th className="px-4 py-3 font-medium">Tags</th>
              <th className="px-4 py-3 font-medium">Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {problems.map((problem) => (
              <tr key={problem.id} className="bg-bg transition-colors hover:bg-surface/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {isSolved(problem.id) && <CheckIcon />}
                    {isFixed(problem.id) && <WrenchIcon />}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link to={`/problems/${problem.id}`} className="block">
                    <span className="font-medium text-text hover:text-accent">{problem.title}</span>
                    <span className="block font-mono text-xs text-text-muted">{problem.filePath}</span>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface-2/60 px-2 py-0.5 text-xs text-text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <DifficultyBadge difficulty={problem.difficulty} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
