import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'customer-support',
  name: 'Customer Support',
  role: 'Support',
  job: "Resolve user issues with clear, empathetic, policy-aligned responses.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
