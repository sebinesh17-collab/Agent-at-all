import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'documentation-auditor',
  name: 'Documentation Auditor',
  role: 'Quality',
  job: "Check docs against actual implementation and identify missing procedures.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'deepseek',
  model: 'deepseek-chat',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
