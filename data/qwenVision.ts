import type { LocalSolutionProblem } from '@/data/solutionSession';

const QWEN_SPACE_URL = 'https://qwen-qwen3-vl-demo.hf.space';
const REQUEST_TIMEOUT_MS = 150_000;

export type QwenSolveResult = {
  problems: LocalSolutionProblem[];
  confidence?: number;
};

type FileData = {
  path: string;
  orig_name: string;
  mime_type: string;
  meta: { _type: 'gradio.FileData' };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNormalizedPair(value: unknown): value is [number, number] {
  return Array.isArray(value)
    && value.length >= 2
    && Number.isFinite(value[0])
    && Number.isFinite(value[1]);
}

function isNormalizedQuad(value: unknown): value is [number, number, number, number] {
  return Array.isArray(value)
    && value.length >= 4
    && Number.isFinite(value[0])
    && Number.isFinite(value[1])
    && Number.isFinite(value[2])
    && Number.isFinite(value[3]);
}

function clampNormalized(value: number) {
  return Math.max(0.04, Math.min(0.94, value));
}

function clampWorkingStart(value: number) {
  return Math.max(0.04, Math.min(0.84, value));
}

// Qwen3-VL sometimes returns pixel coordinates from its 1024px reference
// canvas even when the prompt requests normalized coordinates.
const QWEN_REFERENCE_CANVAS = 1024;

function normalizeCoordinate(value: number) {
  return Math.abs(value) <= 1.2 ? value : value / QWEN_REFERENCE_CANVAS;
}

function normalizePair(value: [number, number]): [number, number] {
  return [
    normalizeCoordinate(value[0]),
    normalizeCoordinate(value[1]),
  ];
}

function findAssistantText(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    for (let index = value.length - 1; index >= 0; index -= 1) {
      const found = findAssistantText(value[index]);
      if (found) return found;
    }
    return undefined;
  }

  if (!isRecord(value)) return undefined;

  if (value.role === 'assistant' && Array.isArray(value.content)) {
    for (let index = value.content.length - 1; index >= 0; index -= 1) {
      const item = value.content[index];
      if (isRecord(item) && item.type === 'text' && typeof item.content === 'string') {
        return item.content;
      }
    }
  }

  for (const child of Object.values(value)) {
    const found = findAssistantText(child);
    if (found) return found;
  }

  return undefined;
}

function parseAssistantJson(text: string): Record<string, unknown> {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced ?? text;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start < 0 || end <= start) {
    throw new Error('The vision model returned no structured homework result.');
  }
  const parsed: unknown = JSON.parse(candidate.slice(start, end + 1));
  if (!isRecord(parsed)) throw new Error('The vision model returned an invalid homework result.');
  return parsed;
}

function normalizeProblems(payload: Record<string, unknown>, imageWidth: number, imageHeight: number): QwenSolveResult {
  if (!Array.isArray(payload.problems) || payload.problems.length === 0) {
    throw new Error('The vision model could not find any homework problems.');
  }

  const problems: LocalSolutionProblem[] = payload.problems.map((rawProblem, index) => {
    if (!isRecord(rawProblem)) throw new Error('The vision model returned an invalid problem.');

    const question = typeof rawProblem.question === 'string' ? rawProblem.question.trim() : '';
    const answer = typeof rawProblem.answer === 'string' ? rawProblem.answer.trim() : '';
    const steps = Array.isArray(rawProblem.steps)
      ? rawProblem.steps.filter((step): step is string => typeof step === 'string' && step.trim().length > 0)
      : [];

    if (!question || !answer || steps.length === 0) {
      throw new Error('The vision model returned an incomplete problem.');
    }

    const answerPosition = isNormalizedPair(rawProblem.answer_position)
      ? normalizePair(rawProblem.answer_position)
      : isNormalizedQuad(rawProblem.bbox)
        ? normalizePair([Number(rawProblem.bbox[2]), Number(rawProblem.bbox[3])])
        : [0.56, [0.18, 0.45, 0.72][index] ?? 0.72];
    const bbox = isNormalizedQuad(rawProblem.bbox) ? rawProblem.bbox : undefined;
    const workingPosition = bbox
      ? [
          normalizeCoordinate(Number(bbox[0])) + 0.02,
          normalizeCoordinate(Number(bbox[3])) + 0.025,
        ]
      : isNormalizedPair(rawProblem.working_position)
        ? normalizePair(rawProblem.working_position)
        : [answerPosition[0] - 0.12, answerPosition[1] - Math.min(0.12, (steps.length + 1) * 0.028)];
    const workingWidth = typeof rawProblem.working_width === 'number' && Number.isFinite(rawProblem.working_width)
      ? Math.max(0.2, Math.min(0.56, normalizeCoordinate(rawProblem.working_width)))
      : bbox
        ? Math.max(
            0.28,
            Math.min(
              0.48,
              normalizeCoordinate(Number(bbox[2]) - Number(bbox[0])),
            ),
          )
        : 0.38;

    return {
      id: `ai-problem-${index + 1}`,
      question,
      answer,
      steps,
      placement: {
        x: clampNormalized(workingPosition[0]),
        y: clampWorkingStart(workingPosition[1]),
        width: workingWidth,
        rotation: [-2, 1, -1, 2, -1][index % 5],
      },
    };
  });

  const confidence = typeof payload.confidence === 'number'
    ? Math.max(0, Math.min(1, payload.confidence))
    : undefined;

  return { problems, confidence };
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs = REQUEST_TIMEOUT_MS,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function uploadImage(uri: string, mimeType: string): Promise<FileData> {
  const formData = new FormData();

  if (typeof window !== 'undefined' || uri.startsWith('blob:') || uri.startsWith('data:')) {
    const imageResponse = await fetch(uri);
    if (!imageResponse.ok) throw new Error('The selected scan could not be read.');
    const blob = await imageResponse.blob();
    formData.append('files', blob, 'homework-scan.jpg');
  } else {
    formData.append('files', {
      uri,
      name: 'homework-scan.jpg',
      type: mimeType || 'image/jpeg',
    } as unknown as Blob);
  }

  const response = await fetchWithTimeout(`${QWEN_SPACE_URL}/gradio_api/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error(`The free vision service rejected the scan (${response.status}).`);

  const uploaded: unknown = await response.json();
  if (!Array.isArray(uploaded) || typeof uploaded[0] !== 'string') {
    throw new Error('The free vision service returned no uploaded file.');
  }

  return {
    path: uploaded[0],
    orig_name: 'homework-scan.jpg',
    mime_type: mimeType || 'image/jpeg',
    meta: { _type: 'gradio.FileData' },
  };
}

function extractCompletedPayload(streamText: string): unknown {
  const blocks = streamText.split(/\r?\n\r?\n/);
  for (let index = blocks.length - 1; index >= 0; index -= 1) {
    const block = blocks[index];
    if (!block.includes('event: complete')) continue;
    const dataLine = block.split(/\r?\n/).find((line) => line.startsWith('data: '));
    if (dataLine) return JSON.parse(dataLine.slice(6));
  }
  throw new Error('The free vision service did not complete the scan.');
}

export async function solveHomeworkImage(
  uri: string,
  mimeType = 'image/jpeg',
  imageWidth = 1000,
  imageHeight = 1400,
): Promise<QwenSolveResult> {
  const uploaded = await uploadImage(uri, mimeType);
  const prompt = [
    'Inspect the homework paper itself, not surrounding app or phone UI.',
    'Read and solve every visible problem.',
    'Return ONLY valid JSON, with this exact shape:',
    '{"problems":[{"question":"...","answer":"...","steps":["..."],"bbox":[left,top,right,bottom],"answer_position":[x,y],"working_position":[x,y],"working_width":0.0}],"confidence":0.0}.',
    'bbox, answer_position, and working_position must be normalized numbers from 0 to 1 relative to the full uploaded image.',
    'bbox must tightly bound the printed question only, not any existing student writing. working_position is where the first handwritten working line should start in blank space beneath or beside that question.',
    'working_width is the normalized width available for the handwritten working block; keep it compact and inside the paper.',
    'steps must be concise lines a student would write by hand, preferably equations rather than explanations.',
    'Include every meaningful working step. The app will box the final answer separately, so steps may end at the final equation.',
    'Do not include markdown.',
  ].join(' ');

  const callResponse = await fetchWithTimeout(`${QWEN_SPACE_URL}/gradio_api/call/add_message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [
        {
          files: [uploaded],
          text: prompt,
        },
        null,
        null,
      ],
    }),
  });
  if (!callResponse.ok) throw new Error(`The free vision service could not start (${callResponse.status}).`);

  const callData: unknown = await callResponse.json();
  if (!isRecord(callData) || typeof callData.event_id !== 'string') {
    throw new Error('The free vision service returned no solve job.');
  }

  const resultResponse = await fetchWithTimeout(
    `${QWEN_SPACE_URL}/gradio_api/call/add_message/${callData.event_id}`,
    { headers: { Accept: 'text/event-stream' } },
  );
  if (!resultResponse.ok) throw new Error(`The free vision service could not finish (${resultResponse.status}).`);

  const streamText = await resultResponse.text();
  const completedPayload = extractCompletedPayload(streamText);
  const assistantText = findAssistantText(completedPayload);
  if (!assistantText) throw new Error('The vision model returned no answer.');

  return normalizeProblems(parseAssistantJson(assistantText), imageWidth, imageHeight);
}