import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'webhook.test',
  title: "Test webhook",
  description: "Sends a test event to a registered webhook.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('webhook.test', input);
}
