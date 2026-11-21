import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'provider.keys',
  title: "Manage API keys",
  description: "Manages encrypted provider key metadata.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('provider.keys', input);
}
