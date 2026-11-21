import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'provider.list',
  title: "List providers",
  description: "Lists configured AI provider adapters.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('provider.list', input);
}
