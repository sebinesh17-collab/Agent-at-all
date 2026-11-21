import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'finance-analyst',
  name: 'Finance Analyst',
  role: 'Finance',
  job: "Build transparent financial models, budgets, and scenario comparisons.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
