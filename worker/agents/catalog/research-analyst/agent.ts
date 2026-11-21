import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'research-analyst',
  name: 'Research Analyst',
  role: 'Research Lead',
  job: "Research questions, compare evidence, cite sources, and separate facts from assumptions.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openrouter',
  model: 'openai/gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
