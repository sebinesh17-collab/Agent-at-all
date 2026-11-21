import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'database-engineer',
  name: 'Database Engineer',
  role: 'Engineering',
  job: "Design schemas, migrations, indexes, and reliable database access.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'deepseek',
  model: 'deepseek-chat',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
