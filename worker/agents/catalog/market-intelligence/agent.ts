import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'market-intelligence',
  name: 'Market Intelligence',
  role: 'Research',
  job: "Analyze markets, competitors, positioning, customer segments, and trends.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openrouter',
  model: 'openai/gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
