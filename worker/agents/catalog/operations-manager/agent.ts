import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'operations-manager',
  name: 'Operations Manager',
  role: 'Operations',
  job: "Optimize workflows, handoffs, service levels, and operational reporting.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
