import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'localization-specialist',
  name: 'Localization Specialist',
  role: 'Writing',
  job: "Adapt product content across languages while preserving intent and terminology.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'google',
  model: 'gemini-2.5-flash',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
