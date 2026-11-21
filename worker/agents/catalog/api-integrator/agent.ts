import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'api-integrator',
  name: 'API Integrator',
  role: 'Integrations',
  job: "Connect third-party APIs with secure credentials, retries, and typed contracts.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
