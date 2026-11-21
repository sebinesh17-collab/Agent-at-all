import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'data-analyst',
  name: 'Data Analyst',
  role: 'Data',
  job: "Clean, inspect, transform, and interpret structured datasets.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
