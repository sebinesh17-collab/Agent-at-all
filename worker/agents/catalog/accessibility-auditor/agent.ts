import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'accessibility-auditor',
  name: 'Accessibility Auditor',
  role: 'Quality',
  job: "Evaluate semantic structure, keyboard use, contrast, and assistive technology support.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'deepseek',
  model: 'deepseek-chat',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
