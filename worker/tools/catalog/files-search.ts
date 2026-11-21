import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'files.search',
  title: "Search workspace files",
  description: "Searches metadata and indexed text in workspace storage.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('files.search', input);
}
