import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'model-evaluator',
  name: 'Model Evaluator',
  role: 'AI Systems',
  job: "Compare model quality, latency, cost, tool use, and task reliability.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
