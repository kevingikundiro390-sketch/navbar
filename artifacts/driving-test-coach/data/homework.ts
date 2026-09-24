export type HomeworkProblem = {
  id: string;
  question: string;
  answer: string;
  steps: string[];
};

export type HomeworkItem = {
  id: string;
  title: string;
  subject: string;
  time: string;
  problems: string;
  colorKey: 'mint' | 'lavender' | 'blue';
};

export const recentHomework: HomeworkItem[] = [
  { id: 'math-1', title: 'Math Homework', subject: 'Algebra', time: '5 min ago', problems: '3 problems', colorKey: 'mint' },
  { id: 'reading-1', title: 'Reading notes', subject: 'Text & Reading', time: 'Yesterday', problems: '6 highlights', colorKey: 'lavender' },
  { id: 'science-1', title: 'States of matter', subject: 'Science', time: 'Monday', problems: '4 questions', colorKey: 'blue' },
];

export const solvedProblems: HomeworkProblem[] = [
  {
    id: 'one',
    question: '2x + 5 = 13',
    answer: 'x = 4',
    steps: ['Subtract 5 from both sides: 2x = 8', 'Divide by 2: x = 4'],
  },
  {
    id: 'two',
    question: '3(x + 2) − 4 = 14',
    answer: 'x = 4',
    steps: ['Distribute: 3x + 6 − 4 = 14', 'Simplify: 3x + 2 = 14', 'Subtract 2: 3x = 12', 'Divide by 3: x = 4'],
  },
  {
    id: 'three',
    question: '(x + 1)² = 16',
    answer: 'x = 3, −5',
    steps: ['Take the square root: x + 1 = ±4', 'Subtract 1: x = 3 or x = −5'],
  },
];
