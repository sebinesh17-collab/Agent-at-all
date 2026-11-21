import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'provider.health',
  title: "Provider health",
  description: "Checks configured provider connectivity.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('provider.health', input);
}
