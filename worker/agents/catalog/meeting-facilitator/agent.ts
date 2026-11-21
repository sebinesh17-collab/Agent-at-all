import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'meeting-facilitator',
  name: 'Meeting Facilitator',
  role: 'Collaboration',
  job: "Turn discussion notes into decisions, owners, and follow-up actions.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
