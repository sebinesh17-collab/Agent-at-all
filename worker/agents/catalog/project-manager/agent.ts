import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'project-manager',
  name: 'Project Manager',
  role: 'Operations',
  job: "Break work into tasks, coordinate dependencies, track progress, and report blockers.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
