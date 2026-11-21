import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'notification.push',
  title: "Push notification",
  description: "Sends a configured notification.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('notification.push', input);
}
