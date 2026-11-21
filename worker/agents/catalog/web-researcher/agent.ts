import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'web-researcher',
  name: 'Web Researcher',
  role: 'Research',
  job: "Find current web information, verify sources, and return concise evidence.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openrouter',
  model: 'openai/gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
