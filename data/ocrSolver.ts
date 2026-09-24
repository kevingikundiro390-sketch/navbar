import { Platform } from 'react-native';
import type { LocalSolutionProblem, SolutionStatus } from '@/data/solutionSession';

type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type RecognizedLine = {
  text: string;
  boundingBox?: Bounds;
};

type RecognizedText = {
  text?: string;
  blocks?: Array<{
    text?: string;
    boundingBox?: Bounds;
    lines?: Array<{
      text?: string;
      boundingBox?: Bounds;
    }>;
  }>;
};

export type HomeworkScanResult = {
  status: SolutionStatus;
  message: string;
  ocrText: string;
  problems: LocalSolutionProblem[];
};

type Polynomial = {
  constant: number;
  linear: number;
  quadratic: number;
};

type Token = {
  kind: 'number' | 'variable' | 'operator' | 'leftParen' | 'rightParen';
  value?: number | string;
};

const EPSILON = 0.000001;

const zeroPolynomial = (): Polynomial => ({ constant: 0, linear: 0, quadratic: 0 });

const addPolynomial = (left: Polynomial, right: Polynomial): Polynomial => ({
  constant: left.constant + right.constant,
  linear: left.linear + right.linear,
  quadratic: left.quadratic + right.quadratic,
});

const subtractPolynomial = (left: Polynomial, right: Polynomial): Polynomial => ({
  constant: left.constant - right.constant,
  linear: left.linear - right.linear,
  quadratic: left.quadratic - right.quadratic,
});

const scalePolynomial = (polynomial: Polynomial, factor: number): Polynomial => ({
  constant: polynomial.constant * factor,
  linear: polynomial.linear * factor,
  quadratic: polynomial.quadratic * factor,
});

const multiplyPolynomial = (left: Polynomial, right: Polynomial): Polynomial | undefined => {
  const degree = (left.quadratic ? 2 : left.linear ? 1 : 0) + (right.quadratic ? 2 : right.linear ? 1 : 0);
  if (degree > 2) return undefined;

  return {
    constant: left.constant * right.constant,
    linear: left.constant * right.linear + left.linear * right.constant,
    quadratic: left.constant * right.quadratic + left.linear * right.linear + left.quadratic * right.constant,
  };
};

const isCloseToInteger = (value: number) => Math.abs(value - Math.round(value)) < EPSILON;

const formatNumber = (value: number) => {
  const rounded = Math.abs(value) < EPSILON ? 0 : isCloseToInteger(value) ? Math.round(value) : Number(value.toFixed(4));
  return String(rounded);
};

const formatSignedTerm = (coefficient: number, variable: string) => {
  if (Math.abs(coefficient) < EPSILON) return '';
  const magnitude = Math.abs(coefficient);
  const value = `${Math.abs(magnitude - 1) < EPSILON ? '' : formatNumber(magnitude)}${variable}`;
  return coefficient < 0 ? `− ${value}` : value;
};

const formatPolynomial = (polynomial: Polynomial, includeZero = false) => {
  const terms = [
    formatSignedTerm(polynomial.quadratic, 'x²'),
    formatSignedTerm(polynomial.linear, 'x'),
    Math.abs(polynomial.constant) >= EPSILON ? (polynomial.constant < 0 ? `− ${formatNumber(Math.abs(polynomial.constant))}` : formatNumber(polynomial.constant)) : '',
  ].filter(Boolean);

  if (terms.length === 0) return includeZero ? '0' : '';
  return terms.reduce((result, term, index) => {
    if (index === 0) return term;
    return term.startsWith('−') ? `${result} ${term}` : `${result} + ${term}`;
  }, '');
};

const normalizeEquation = (value: string) =>
  value
    .replace(/[−–—]/g, '-')
    .replace(/[×·]/g, '*')
    .replace(/[÷:]/g, '/')
    .replace(/[²]/g, '^2')
    .replace(/[³]/g, '^3')
    .replace(/[−]/g, '-')
    .replace(/\b[Il]\b/g, '1')
    .replace(/\s+/g, ' ')
    .trim();

const stripQuestionNumber = (value: string) => value.replace(/^\s*(?:\d+\s*[\].):-]\s*|[a-z]\s*[\].):-]\s*)/i, '').trim();

function tokenize(expression: string): Token[] | undefined {
  const tokens: Token[] = [];
  let index = 0;

  while (index < expression.length) {
    const character = expression[index];
    if (character === ' ') {
      index += 1;
      continue;
    }

    if (/[0-9.]/.test(character)) {
      const match = expression.slice(index).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
      if (!match) return undefined;
      tokens.push({ kind: 'number', value: Number(match[0]) });
      index += match[0].length;
      continue;
    }

    if (character === 'x' || character === 'X') {
      tokens.push({ kind: 'variable', value: 'x' });
      index += 1;
      continue;
    }

    if ('+-*/^'.includes(character)) {
      tokens.push({ kind: 'operator', value: character });
      index += 1;
      continue;
    }
    if (character === '(') {
      tokens.push({ kind: 'leftParen' });
      index += 1;
      continue;
    }
    if (character === ')') {
      tokens.push({ kind: 'rightParen' });
      index += 1;
      continue;
    }
    return undefined;
  }

  return tokens.length > 0 ? tokens : undefined;
}

function parsePolynomial(expression: string): Polynomial | undefined {
  const tokens = tokenize(expression);
  if (!tokens) return undefined;
  let position = 0;

  const peek = () => tokens[position];
  const consume = () => tokens[position++];

  const parseExpression = (): Polynomial | undefined => {
    let result = parseTerm();
    if (!result) return undefined;
    while (peek()?.kind === 'operator' && (peek()?.value === '+' || peek()?.value === '-')) {
      const operator = consume()?.value;
      const right = parseTerm();
      if (!right) return undefined;
      result = operator === '+' ? addPolynomial(result, right) : subtractPolynomial(result, right);
    }
    return result;
  };

  const parseTerm = (): Polynomial | undefined => {
    let result = parseFactor();
    if (!result) return undefined;

    while (true) {
      const next = peek();
      const hasExplicitOperator = next?.kind === 'operator' && (next.value === '*' || next.value === '/');
      const hasImplicitOperator = next?.kind === 'number' || next?.kind === 'variable' || next?.kind === 'leftParen';
      if (!hasExplicitOperator && !hasImplicitOperator) break;

      const operator = hasExplicitOperator ? consume()?.value : '*';
      const right = parseFactor();
      if (!right) return undefined;
      if (operator === '/') {
        if (Math.abs(right.linear) > EPSILON || Math.abs(right.quadratic) > EPSILON || Math.abs(right.constant) < EPSILON) return undefined;
        result = scalePolynomial(result, 1 / right.constant);
      } else {
        const product = multiplyPolynomial(result, right);
        if (!product) return undefined;
        result = product;
      }
    }
    return result;
  };

  const parseFactor = (): Polynomial | undefined => {
    let sign = 1;
    if (peek()?.kind === 'operator' && (peek()?.value === '+' || peek()?.value === '-')) {
      sign = consume()?.value === '-' ? -1 : 1;
    }

    const token = peek();
    let result: Polynomial | undefined;
    if (token?.kind === 'number') {
      consume();
      result = { constant: Number(token.value), linear: 0, quadratic: 0 };
    } else if (token?.kind === 'variable') {
      consume();
      result = { constant: 0, linear: 1, quadratic: 0 };
    } else if (token?.kind === 'leftParen') {
      consume();
      result = parseExpression();
      if (peek()?.kind !== 'rightParen') return undefined;
      consume();
    } else {
      return undefined;
    }

    if (!result) return undefined;
    if (peek()?.kind === 'operator' && peek()?.value === '^') {
      consume();
      const exponent = peek();
      if (exponent?.kind !== 'number' || !Number.isInteger(exponent.value)) return undefined;
      consume();
      if (exponent.value === 0) result = { constant: 1, linear: 0, quadratic: 0 };
      else if (exponent.value === 1) {
        // Keep the parsed value as-is.
      } else if (exponent.value === 2) {
        const squared = multiplyPolynomial(result, result);
        if (!squared) return undefined;
        result = squared;
      } else {
        return undefined;
      }
    }

    return scalePolynomial(result, sign);
  };

  const result = parseExpression();
  return result && position === tokens.length ? result : undefined;
}

const formatRoot = (value: number) => `x = ${formatNumber(value)}`;

export function solveEquation(equation: string): { answer: string; steps: string[] } | undefined {
  const sides = equation.split('=');
  if (sides.length !== 2) return undefined;
  const left = parsePolynomial(sides[0]);
  const right = parsePolynomial(sides[1]);
  if (!left || !right) return undefined;

  const polynomial = subtractPolynomial(left, right);
  if (Math.abs(polynomial.quadratic) < EPSILON && Math.abs(polynomial.linear) < EPSILON) return undefined;

  if (Math.abs(polynomial.quadratic) < EPSILON) {
    const x = -polynomial.constant / polynomial.linear;
    const movedConstant = -polynomial.constant;
    const coefficient = polynomial.linear;
    const steps = [
      `Move the constant term: ${formatNumber(coefficient)}x = ${formatNumber(movedConstant)}`,
      `Divide both sides by ${formatNumber(coefficient)}: ${formatRoot(x)}`,
    ];
    return { answer: formatRoot(x), steps };
  }

  const discriminant = polynomial.linear ** 2 - 4 * polynomial.quadratic * polynomial.constant;
  if (discriminant < -EPSILON) {
    return {
      answer: 'No real solution',
      steps: [`Rewrite in standard form: ${formatPolynomial(polynomial, true)} = 0`, 'The discriminant is negative, so there are no real x-values.'],
    };
  }

  const safeDiscriminant = Math.max(0, discriminant);
  const rootA = (-polynomial.linear + Math.sqrt(safeDiscriminant)) / (2 * polynomial.quadratic);
  const rootB = (-polynomial.linear - Math.sqrt(safeDiscriminant)) / (2 * polynomial.quadratic);
  const roots = isCloseToInteger(rootA) && isCloseToInteger(rootB) && Math.abs(rootA - rootB) > EPSILON
    ? `${formatRoot(rootA)}, ${formatNumber(rootB)}`
    : Math.abs(rootA - rootB) < EPSILON
      ? formatRoot(rootA)
      : `x = ${formatNumber(rootA)}, ${formatNumber(rootB)}`;

  return {
    answer: roots,
    steps: [
      `Rewrite in standard form: ${formatPolynomial(polynomial, true)} = 0`,
      'Use the quadratic formula: x = (−b ± √(b² − 4ac)) ÷ 2a',
      `Evaluate both roots: ${roots}`,
    ],
  };
}

const getRecognizedLines = (result: RecognizedText): RecognizedLine[] => {
  const lines = result.blocks?.flatMap((block) =>
    block.lines?.map((line) => ({ text: line.text ?? '', boundingBox: line.boundingBox ?? block.boundingBox })) ?? [],
  ) ?? [];
  if (lines.length > 0) return lines;
  return (result.text ?? '').split(/\r?\n/).map((text) => ({ text }));
};

const fallbackBounds = (index: number, count: number, imageWidth: number, imageHeight: number): Bounds => ({
  x: imageWidth * 0.12,
  y: imageHeight * ((index + 0.5) / Math.max(count, 1)),
  width: imageWidth * 0.7,
  height: Math.max(imageHeight * 0.04, 28),
});

const placementFromBounds = (bounds: Bounds | undefined, index: number, count: number, imageWidth: number, imageHeight: number) => {
  const safeBounds = bounds ?? fallbackBounds(index, count, imageWidth, imageHeight);
  return {
    // Start the worked solution below the detected question line.
    x: Math.min(0.56, Math.max(0.08, safeBounds.x / imageWidth)),
    y: Math.min(0.82, Math.max(0.04, (safeBounds.y + safeBounds.height * 1.15) / imageHeight)),
    width: Math.max(0.28, Math.min(0.56, safeBounds.width / imageWidth)),
    // ML Kit returns image-space boxes. Keeping the answer in that coordinate
    // system means the overlay follows the source image's perspective/crop.
    rotation: 0,
  };
};

export async function recognizeHomeworkScan({
  uri,
  imageWidth = 1000,
  imageHeight = 1400,
}: {
  uri: string;
  imageWidth?: number;
  imageHeight?: number;
}): Promise<HomeworkScanResult> {
  if (Platform.OS === 'web') {
    return {
      status: 'unsupported',
      message: 'On-device OCR is not available in the browser preview. Open this scan in an iOS or Android development build to read it locally.',
      ocrText: '',
      problems: [],
    };
  }

  return {
    status: 'unsupported',
    message: 'On-device OCR is not included in Expo Go. Use the Scan screen to read this page with the free vision service instead.',
    ocrText: '',
    problems: [],
  };

}