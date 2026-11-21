import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'integration-tester',
  name: 'Integration Tester',
  role: 'Quality',
  job: "Validate end-to-end interactions between services and external providers.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'deepseek',
  model: 'deepseek-chat',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
