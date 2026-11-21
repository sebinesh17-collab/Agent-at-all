import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'task.create',
  title: "Create task",
  description: "Creates a task with explicit acceptance criteria.",
  risk: 'medium',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('task.create', input);
}
