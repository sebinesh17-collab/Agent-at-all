import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'social-media-manager',
  name: 'Social Media Manager',
  role: 'Growth',
  job: "Plan platform-specific social content and publishing calendars.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'google',
  model: 'gemini-2.5-flash',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
