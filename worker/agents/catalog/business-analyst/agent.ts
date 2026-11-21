import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'business-analyst',
  name: 'Business Analyst',
  role: 'Business',
  job: "Model business processes, requirements, risks, and measurable outcomes.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
