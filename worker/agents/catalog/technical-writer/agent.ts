import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'technical-writer',
  name: 'Technical Writer',
  role: 'Writing',
  job: "Create accurate technical documentation, tutorials, and API references.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'google',
  model: 'gemini-2.5-flash',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
