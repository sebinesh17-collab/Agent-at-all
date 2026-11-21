import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'privacy-reviewer',
  name: 'Privacy Reviewer',
  role: 'Security',
  job: "Review data minimization, retention, access, and privacy controls.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
