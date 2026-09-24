export type Question = {
  id: string;
  category: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const questions: Question[] = [
  {
    id: 'right-of-way',
    category: 'Rules of the road',
    prompt: 'When driving in a roundabout, who has the right of way?',
    options: [
      'Drivers entering the roundabout',
      'Drivers already in the roundabout',
      'The largest vehicle',
      'Drivers turning left',
    ],
    correctIndex: 1,
    explanation: 'Vehicles already circulating in the roundabout have the right of way. Slow down and yield before entering.',
  },
  {
    id: 'following-distance',
    category: 'Safe driving',
    prompt: 'What is the minimum following distance you should keep in normal conditions?',
    options: [
      'One second',
      'Two seconds',
      'Three seconds',
      'Ten car lengths',
    ],
    correctIndex: 2,
    explanation: 'The three-second rule gives you time to react. Add more space at night, in rain, or when roads are slippery.',
  },
  {
    id: 'yellow-line',
    category: 'Road markings',
    prompt: 'What does a solid double yellow line mean?',
    options: [
      'Passing is allowed in both directions',
      'Passing is not allowed in either direction',
      'Only trucks may pass',
      'The lane is about to end',
    ],
    correctIndex: 1,
    explanation: 'A solid double yellow line means no passing in either direction, except where a turn is permitted.',
  },
  {
    id: 'school-zone',
    category: 'Signs & signals',
    prompt: 'When should you slow down for a school zone?',
    options: [
      'Only when a crossing guard is present',
      'Whenever children are present or the sign indicates',
      'Only before 8 a.m.',
      'Only when the lights are flashing red',
    ],
    correctIndex: 1,
    explanation: 'Follow the posted school-zone times and always reduce speed when children are present near the roadway.',
  },
  {
    id: 'emergency-vehicle',
    category: 'Emergencies',
    prompt: 'An emergency vehicle approaches with lights and siren on. What should you do?',
    options: [
      'Speed up to get out of the way',
      'Stop immediately in your lane',
      'Pull safely to the right and stop',
      'Continue if you have a green light',
    ],
    correctIndex: 2,
    explanation: 'Signal, move to the right side of the road, and stop until the emergency vehicle has passed.',
  },
];

export const categories = [
  { label: 'Rules of road', count: 28, icon: 'compass' as const, color: 'lime' },
  { label: 'Signs & signals', count: 24, icon: 'triangle' as const, color: 'blue' },
  { label: 'Safe driving', count: 31, icon: 'shield' as const, color: 'mint' },
  { label: 'Your mistakes', count: 6, icon: 'rotate-ccw' as const, color: 'coral' },
];