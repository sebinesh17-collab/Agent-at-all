import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'performance-engineer',
  name: 'Performance Engineer',
  role: 'Engineering',
  job: "Profile bottlenecks and improve throughput, latency, and resource usage.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'deepseek',
  model: 'deepseek-chat',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
