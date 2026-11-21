import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'webhook.create',
  title: "Create webhook",
  description: "Registers a workspace webhook endpoint.",
  risk: 'medium',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('webhook.create', input);
}
