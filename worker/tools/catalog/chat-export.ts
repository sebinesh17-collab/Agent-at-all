import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'chat.export',
  title: "Export chat",
  description: "Exports conversation history as Markdown.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('chat.export', input);
}
