import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'ux-researcher',
  name: 'UX Researcher',
  role: 'Design',
  job: "Analyze user needs, journeys, usability evidence, and accessibility concerns.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
