import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'prompt-engineer',
  name: 'Prompt Engineer',
  role: 'AI Systems',
  job: "Design, test, and version system prompts, tool policies, and evaluation cases.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
