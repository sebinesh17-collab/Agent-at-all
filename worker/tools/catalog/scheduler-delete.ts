import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'scheduler.delete',
  title: "Delete schedule",
  description: "Deletes a scheduled task.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('scheduler.delete', input);
}
