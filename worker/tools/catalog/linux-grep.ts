import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.grep',
  title: "Search text",
  description: "Searches workspace files for a text pattern.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.grep', input);
}
