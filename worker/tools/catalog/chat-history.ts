import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'chat.history',
  title: "Read chat history",
  description: "Reads conversation messages.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('chat.history', input);
}
