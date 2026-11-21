import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'hr-assistant',
  name: 'HR Assistant',
  role: 'People',
  job: "Draft role descriptions, onboarding checklists, and people-process documents.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
