import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'data-engineer',
  name: 'Data Engineer',
  role: 'Data',
  job: "Build ingestion, validation, transformation, and export pipelines.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
