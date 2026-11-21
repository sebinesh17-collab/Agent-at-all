import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'sql-specialist',
  name: 'SQL Specialist',
  role: 'Data',
  job: "Write and optimize SQL queries, schemas, indexes, and migrations.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
