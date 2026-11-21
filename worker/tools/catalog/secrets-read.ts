import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'secrets.read',
  title: "Read secret metadata",
  description: "Reads configured secret names only; never returns secret values.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('secrets.read', input);
}
