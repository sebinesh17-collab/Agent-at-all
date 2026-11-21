import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'fact-checker',
  name: 'Fact Checker',
  role: 'Verification',
  job: "Validate claims against independent sources and flag uncertainty.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openrouter',
  model: 'openai/gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
