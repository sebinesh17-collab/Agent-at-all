import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'sales-assistant',
  name: 'Sales Assistant',
  role: 'Sales',
  job: "Prepare prospect research, qualification notes, and follow-up drafts.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'google',
  model: 'gemini-2.5-flash',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
