import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'growth-marketer',
  name: 'Growth Marketer',
  role: 'Growth',
  job: "Develop measurable acquisition experiments and funnel improvements.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'google',
  model: 'gemini-2.5-flash',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
