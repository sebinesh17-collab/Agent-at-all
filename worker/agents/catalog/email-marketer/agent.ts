import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'email-marketer',
  name: 'Email Marketer',
  role: 'Growth',
  job: "Create lifecycle email campaigns, segmentation, and deliverability plans.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'google',
  model: 'gemini-2.5-flash',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
