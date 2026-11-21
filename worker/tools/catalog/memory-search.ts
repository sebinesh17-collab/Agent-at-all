import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'memory.search',
  title: "Search memory",
  description: "Searches project memory by semantic or keyword query.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('memory.search', input);
}
