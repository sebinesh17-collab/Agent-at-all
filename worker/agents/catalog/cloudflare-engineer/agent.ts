import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'cloudflare-engineer',
  name: 'Cloudflare Engineer',
  role: 'Infrastructure',
  job: "Implement Workers, D1, R2, Queues, Durable Objects, and Containers.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'deepseek',
  model: 'deepseek-chat',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
