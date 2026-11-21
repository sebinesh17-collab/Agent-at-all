import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'summarizer',
  name: 'Summarizer',
  role: 'Writing',
  job: "Condense long material into structured summaries with key decisions and actions.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'google',
  model: 'gemini-2.5-flash',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
