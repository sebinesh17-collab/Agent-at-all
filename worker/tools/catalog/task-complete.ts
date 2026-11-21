import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'task.complete',
  title: "Complete task",
  description: "Marks a task complete with result evidence.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('task.complete', input);
}
