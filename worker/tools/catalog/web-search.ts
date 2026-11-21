import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'web.search',
  title: "Search web sources",
  description: "Searches configured search provider endpoint when credentials are configured.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('web.search', input);
}
