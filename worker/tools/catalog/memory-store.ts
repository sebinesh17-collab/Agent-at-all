import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'memory.store',
  title: "Store memory",
  description: "Stores approved project facts in workspace memory.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('memory.store', input);
}
