import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'storage.delete',
  title: "Delete artifact",
  description: "Deletes an artifact after authorization.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('storage.delete', input);
}
