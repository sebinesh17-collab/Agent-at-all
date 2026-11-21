import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'scheduler.create',
  title: "Schedule task",
  description: "Creates a scheduled task.",
  risk: 'medium',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('scheduler.create', input);
}
