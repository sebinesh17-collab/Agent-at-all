import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'storage.download',
  title: "Download artifact",
  description: "Retrieves an artifact from R2 or configured Firebase Storage.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('storage.download', input);
}
