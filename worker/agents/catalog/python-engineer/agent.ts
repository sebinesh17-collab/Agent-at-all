import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'python-engineer',
  name: 'Python Engineer',
  role: 'Engineering',
  job: "Implement Python automation, services, data workflows, and tests.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'deepseek',
  model: 'deepseek-chat',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
