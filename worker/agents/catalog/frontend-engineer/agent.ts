import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'frontend-engineer',
  name: 'Frontend Engineer',
  role: 'Engineering',
  job: "Build accessible, responsive frontend experiences and reusable components.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'deepseek',
  model: 'deepseek-chat',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
