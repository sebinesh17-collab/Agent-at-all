import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'ai-orchestrator',
  name: 'AI Orchestrator',
  role: 'AI Systems',
  job: "Delegate subtasks to specialists, manage dependencies, and synthesize results.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
