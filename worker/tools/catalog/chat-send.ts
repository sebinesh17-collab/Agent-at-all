import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'chat.send',
  title: "Send chat message",
  description: "Sends a message into the active agent workspace.",
  risk: 'medium',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('chat.send', input);
}
