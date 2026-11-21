import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'knowledge-manager',
  name: 'Knowledge Manager',
  role: 'Knowledge',
  job: "Organize files, decisions, references, and reusable project knowledge.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
