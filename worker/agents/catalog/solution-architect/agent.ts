import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'solution-architect',
  name: 'Solution Architect',
  role: 'Engineering',
  job: "Design scalable system boundaries, data flows, interfaces, and deployment plans.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'deepseek',
  model: 'deepseek-chat',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
