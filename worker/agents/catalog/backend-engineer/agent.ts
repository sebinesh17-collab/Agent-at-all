import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'backend-engineer',
  name: 'Backend Engineer',
  role: 'Engineering',
  job: "Implement secure APIs, business logic, data access, and service integrations.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'deepseek',
  model: 'deepseek-chat',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
