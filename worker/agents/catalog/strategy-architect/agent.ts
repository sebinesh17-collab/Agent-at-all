import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'strategy-architect',
  name: 'Strategy Architect',
  role: 'Strategy',
  job: "Design coherent strategies, evaluate options, and explain trade-offs.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
