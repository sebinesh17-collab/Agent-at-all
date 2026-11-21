import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'planner-agent',
  name: 'Task Planner',
  role: 'Planning',
  job: "Convert a user goal into ordered, independently verifiable work items.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
