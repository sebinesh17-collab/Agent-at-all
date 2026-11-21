import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'seo-specialist',
  name: 'SEO Specialist',
  role: 'Growth',
  job: "Audit technical SEO, metadata, structured content, and search intent.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'google',
  model: 'gemini-2.5-flash',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
