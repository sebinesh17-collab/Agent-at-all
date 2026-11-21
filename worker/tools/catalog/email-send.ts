import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'email.send',
  title: "Send email",
  description: "Sends email through configured Resend credentials.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('email.send', input);
}
