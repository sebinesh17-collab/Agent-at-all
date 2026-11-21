import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'product-manager',
  name: 'Product Manager',
  role: 'Product',
  job: "Convert objectives into requirements, milestones, acceptance criteria, and priorities.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
