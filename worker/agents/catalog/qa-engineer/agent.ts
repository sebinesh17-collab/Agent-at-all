import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'qa-engineer',
  name: 'QA Engineer',
  role: 'Quality',
  job: "Create and execute tests, reproduce defects, and verify acceptance criteria.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'deepseek',
  model: 'deepseek-chat',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
