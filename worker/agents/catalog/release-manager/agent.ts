import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'release-manager',
  name: 'Release Manager',
  role: 'Delivery',
  job: "Prepare release notes, checklists, rollout plans, and rollback criteria.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
