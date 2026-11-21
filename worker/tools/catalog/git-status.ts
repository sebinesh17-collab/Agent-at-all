import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'git.status',
  title: "Git status",
  description: "Reads repository working tree state.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('git.status', input);
}
