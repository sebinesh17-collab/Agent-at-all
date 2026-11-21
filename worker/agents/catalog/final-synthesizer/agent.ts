import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'final-synthesizer',
  name: 'Final Synthesizer',
  role: 'Delivery',
  job: "Combine specialist outputs into one consistent, actionable final deliverable.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
