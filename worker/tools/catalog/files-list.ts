import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'files.list',
  title: "List workspace files",
  description: "Lists files under the current workspace root.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('files.list', input);
}
