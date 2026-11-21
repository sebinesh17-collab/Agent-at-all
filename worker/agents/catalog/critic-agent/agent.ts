import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'critic-agent',
  name: 'Critical Reviewer',
  role: 'Verification',
  job: "Challenge assumptions, detect gaps, and propose concrete improvements.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openrouter',
  model: 'openai/gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
