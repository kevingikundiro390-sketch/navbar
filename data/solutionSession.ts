import type { HomeworkProblem } from '@/data/homework';

export type LocalSolutionProblem = HomeworkProblem & {
  placement: {
    x: number;
    y: number;
    width: number;
    rotation: number;
  };
};

export type SolutionStatus = 'solved' | 'unsupported' | 'unreadable';

export type SolutionSession = {
  title: string;
  problems: LocalSolutionProblem[];
  imageUri?: string;
  imageWidth?: number;
  imageHeight?: number;
  status: SolutionStatus;
  message?: string;
  ocrText?: string;
  confidence?: number;
};

let latestSolution: SolutionSession | undefined;

export function setLatestSolution(solution: SolutionSession) {
  latestSolution = solution;
}

export function getLatestSolution() {
  return latestSolution;
}