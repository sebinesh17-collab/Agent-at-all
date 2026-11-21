import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'auth.invite',
  title: "Invite member",
  description: "Creates an invitation for a workspace member.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('auth.invite', input);
}
