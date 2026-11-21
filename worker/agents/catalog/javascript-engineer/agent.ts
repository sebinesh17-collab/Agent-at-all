import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'javascript-engineer',
  name: 'JavaScript Engineer',
  role: 'Engineering',
  job: "Implement JavaScript and TypeScript applications and tooling.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'deepseek',
  model: 'deepseek-chat',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
