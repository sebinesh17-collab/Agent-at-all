import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'notification.email',
  title: "Email notification",
  description: "Sends a transactional notification email.",
  risk: 'high',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('notification.email', input);
}
