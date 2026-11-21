import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'scheduler.list',
  title: "List schedules",
  description: "Lists scheduled tasks.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('scheduler.list', input);
}
