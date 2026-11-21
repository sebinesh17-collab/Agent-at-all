import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'editor',
  name: 'Editor',
  role: 'Writing',
  job: "Improve clarity, structure, consistency, and grammar without changing intent.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'google',
  model: 'gemini-2.5-flash',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
