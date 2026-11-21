import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'procurement-analyst',
  name: 'Procurement Analyst',
  role: 'Business',
  job: "Compare vendor capabilities, pricing, risks, and integration requirements.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
