import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'automation-engineer',
  name: 'Automation Engineer',
  role: 'Engineering',
  job: "Build repeatable workflows, scheduled tasks, and event-driven automation.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'deepseek',
  model: 'deepseek-chat',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
