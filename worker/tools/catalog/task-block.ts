import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'task.block',
  title: "Block task",
  description: "Marks a task blocked and records a reason.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('task.block', input);
}
