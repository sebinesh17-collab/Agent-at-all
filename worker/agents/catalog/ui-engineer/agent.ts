import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'ui-engineer',
  name: 'UI Engineer',
  role: 'Design',
  job: "Translate design systems into polished, reusable interface components.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
