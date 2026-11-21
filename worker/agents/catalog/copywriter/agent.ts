import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'copywriter',
  name: 'Copywriter',
  role: 'Writing',
  job: "Write persuasive copy while preserving factual accuracy and brand voice.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'google',
  model: 'gemini-2.5-flash',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
