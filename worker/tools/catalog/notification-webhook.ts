import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'notification.webhook',
  title: "Webhook notification",
  description: "Sends a signed webhook event.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('notification.webhook', input);
}
