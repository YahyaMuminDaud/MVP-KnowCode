import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { problems } from "../data/problems";
import { CodeViewer } from "../components/CodeViewer";
import { DifficultyBadge } from "../components/DifficultyBadge";
import { RewritePanel } from "../components/RewritePanel";
import { useProgress } from "../lib/ProgressContext";

export function ProblemWorkspace() {
  const { problemId } = useParams<{ problemId: string }>();
  const problem = useMemo(() => problems.find((p) => p.id === problemId), [problemId]);
  const { isSolved, isFixed, recordAttempt, markSolved } = useProgress();

  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set());
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSelectedLines(new Set());
    setSelectedChoice(null);
    setSubmitted(false);
  }, [problemId]);

  if (!problem) {
    return (
      <div className="text-center">
        <p className="text-text-muted">That pull request doesn't exist.</p>
        <Link to="/" className="mt-3 inline-block text-accent hover:underline">
          Back to review queue
        </Link>
      </div>
    );
  }

  const buggyLineSet = new Set(problem.buggyLines);
  const linesMatch =
    selectedLines.size === buggyLineSet.size && [...buggyLineSet].every((l) => selectedLines.has(l));
  const choiceCorrect = selectedChoice === problem.correctChoiceId;
  const isCorrect = linesMatch && choiceCorrect;
  const canSubmit = selectedLines.size > 0 && selectedChoice !== null;

  const toggleLine = (line: number) => {
    if (submitted) return;
    setSelectedLines((prev) => {
      const next = new Set(prev);
      if (next.has(line)) next.delete(line);
      else next.add(line);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    recordAttempt(problem.id);
    if (linesMatch && choiceCorrect) {
      markSolved(problem.id);
    }
  };

  const handleTryAgain = () => {
    setSelectedLines(new Set());
    setSelectedChoice(null);
    setSubmitted(false);
  };

  const currentIndex = problems.findIndex((p) => p.id === problem.id);
  const nextProblem = problems[currentIndex + 1];

  return (
    <div>
      <Link to="/" className="text-sm text-text-muted hover:text-text">
        &larr; Back to review queue
      </Link>

      <p className="mt-3 font-mono text-xs text-text-muted">Reviewing {problem.filePath}</p>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">{problem.title}</h1>
        <DifficultyBadge difficulty={problem.difficulty} />
        {isSolved(problem.id) && (
          <span className="inline-flex items-center rounded-full border border-easy/30 bg-easy/10 px-2.5 py-0.5 text-xs font-medium text-easy">
            Reviewed
          </span>
        )}
        {isFixed(problem.id) && (
          <span className="inline-flex items-center rounded-full border border-easy/30 bg-easy/10 px-2.5 py-0.5 text-xs font-medium text-easy">
            Fix Shipped
          </span>
        )}
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-text-muted">
        What this change should do
      </p>
      <p className="mt-1 text-text-muted">{problem.prompt}</p>
      {problem.source && (
        <a
          href={problem.source.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs text-legendary hover:underline"
        >
          This PR is based on a real bug &mdash; view the GitHub issue &rarr;
        </a>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[3fr_2fr]">
        <div>
          <p className="mb-2 text-sm text-text-muted">Click the line(s) you'd flag in your review.</p>
          <CodeViewer
            code={problem.code}
            selectedLines={selectedLines}
            onToggleLine={toggleLine}
            buggyLines={buggyLineSet}
            showResult={submitted}
            interactive={!submitted}
          />
        </div>

        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Your review comment</p>
          <h2 className="mt-1 font-semibold">{problem.question}</h2>
          <fieldset className="mt-3 space-y-2" disabled={submitted}>
            <legend className="sr-only">Root cause options</legend>
            {problem.choices.map((choice) => {
              const isChosen = selectedChoice === choice.id;
              let optionClasses = "border-border bg-bg hover:border-text-muted";
              if (submitted) {
                if (choice.id === problem.correctChoiceId) {
                  optionClasses = "border-easy bg-easy/10";
                } else if (isChosen) {
                  optionClasses = "border-hard bg-hard/10";
                }
              } else if (isChosen) {
                optionClasses = "border-accent bg-accent/10";
              }

              return (
                <label
                  key={choice.id}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-md border px-3 py-2.5 text-sm transition-colors ${optionClasses}`}
                >
                  <input
                    type="radio"
                    name="root-cause"
                    className="mt-0.5"
                    checked={isChosen}
                    onChange={() => setSelectedChoice(choice.id)}
                  />
                  <span>{choice.text}</span>
                </label>
              );
            })}
          </fieldset>

          {!submitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="mt-4 w-full cursor-pointer rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit review
            </button>
          ) : (
            <div className="mt-4 space-y-3">
              <div
                className={`rounded-md border px-3 py-2.5 text-sm ${
                  isCorrect ? "border-easy/30 bg-easy/10 text-easy" : "border-hard/30 bg-hard/10 text-hard"
                }`}
              >
                {isCorrect
                  ? "Nice catch — that's exactly what a good reviewer would flag here."
                  : linesMatch
                    ? "You flagged the right line(s), but your review comment misses the actual root cause."
                    : choiceCorrect
                      ? "Good reasoning, but you didn't flag the exact line(s) this issue lives on."
                      : "Not quite the review comment this PR needs — check the highlighted lines and explanation below."}
              </div>
              <p className="text-sm text-text-muted">{problem.explanation}</p>
              {problem.source && (
                <a
                  href={problem.source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-md border border-legendary/30 bg-legendary/10 px-3 py-2 text-xs text-legendary hover:underline"
                >
                  <span className="font-semibold">Real-world source</span>
                  <span className="block">{problem.source.label} &rarr;</span>
                </a>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleTryAgain}
                  className="cursor-pointer rounded-md border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface-2/70"
                >
                  Redo review
                </button>
                {nextProblem && (
                  <Link
                    to={`/problems/${nextProblem.id}`}
                    className="cursor-pointer rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover"
                  >
                    Next PR &rarr;
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {submitted && problem.rewrite && (
        <div className="mt-6">
          <RewritePanel problemId={problem.id} rewrite={problem.rewrite} />
        </div>
      )}
    </div>
  );
}
