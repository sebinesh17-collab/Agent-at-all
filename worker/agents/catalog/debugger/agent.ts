import { systemPrompt } from './prompt';
import { allowedTools } from './tools';

export const agent = {
  id: 'debugger',
  name: 'Debugger',
  role: 'Quality',
  job: "Diagnose errors using logs, stack traces, reproduction steps, and minimal fixes.",
  systemPrompt,
  allowedTools: [...allowedTools],
  provider: 'deepseek',
  model: 'deepseek-chat',
  defaultEnabled: true,
  maxParallelTasks: 4,
  timeoutMs: 120000,
} as const;
