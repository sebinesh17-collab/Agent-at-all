import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'provider.models',
  title: "List models",
  description: "Lists models configured for a provider.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('provider.models', input);
}
