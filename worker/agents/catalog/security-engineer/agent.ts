import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'security-engineer',
  name: 'Security Engineer',
  role: 'Security',
  job: "Review authentication, authorization, secrets, input validation, and threat models.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
