import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'task.validate',
  title: "Validate task",
  description: "Checks task output against acceptance criteria.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('task.validate', input);
}
