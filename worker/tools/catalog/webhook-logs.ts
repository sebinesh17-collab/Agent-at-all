import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'webhook.logs',
  title: "Webhook logs",
  description: "Reads webhook delivery logs.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('webhook.logs', input);
}
