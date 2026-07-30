export type Difficulty = "easy" | "medium" | "hard";

export interface Choice {
  id: string;
  text: string;
}

export interface RewriteChallenge {
  instructions: string;
  solutionCode: string;
}

export interface RealWorldSource {
  label: string;
  url: string;
}

export interface Problem {
  id: string;
  title: string;
  filePath: string;
  difficulty: Difficulty;
  tags: string[];
  language: string;
  prompt: string;
  code: string[];
  buggyLines: number[];
  question: string;
  choices: Choice[];
  correctChoiceId: string;
  explanation: string;
  rewrite?: RewriteChallenge;
  source?: RealWorldSource;
}
