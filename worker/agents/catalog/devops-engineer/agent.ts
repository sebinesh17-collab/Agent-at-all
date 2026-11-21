import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'devops-engineer',
  name: 'DevOps Engineer',
  role: 'Infrastructure',
  job: "Automate builds, deployment pipelines, observability, and rollback procedures.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'deepseek',
  model: 'deepseek-chat',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
