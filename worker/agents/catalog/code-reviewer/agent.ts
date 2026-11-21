import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'code-reviewer',
  name: 'Code Reviewer',
  role: 'Quality',
  job: "Review changes for correctness, maintainability, security, and regressions.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'deepseek',
  model: 'deepseek-chat',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
