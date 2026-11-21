import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'visual-designer',
  name: 'Visual Designer',
  role: 'Design',
  job: "Define visual systems, layouts, typography, spacing, and interaction states.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'openai',
  model: 'gpt-4.1-mini',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
