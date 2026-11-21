import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'storage.search',
  title: "Search artifacts",
  description: "Searches workspace artifact metadata.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('storage.search', input);
}
