import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'legal-researcher',
  name: 'Legal Researcher',
  role: 'Research',
  job: "Locate legal sources and summarize issues without presenting legal advice.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openrouter',
  model: 'openai/gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
