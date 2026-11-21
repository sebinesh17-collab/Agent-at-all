import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'task.assign',
  title: "Assign task",
  description: "Assigns a task to one or more agents.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('task.assign', input);
}
