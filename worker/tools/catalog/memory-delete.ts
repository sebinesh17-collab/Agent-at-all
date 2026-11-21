import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'memory.delete',
  title: "Delete memory",
  description: "Deletes selected workspace memory after authorization.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('memory.delete', input);
}
