import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'risk-analyst',
  name: 'Risk Analyst',
  role: 'Risk',
  job: "Identify operational, technical, financial, and delivery risks with mitigations.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
