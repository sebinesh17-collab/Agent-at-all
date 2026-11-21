import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'storage.upload',
  title: "Upload artifact",
  description: "Stores an artifact in R2 or configured Firebase Storage.",
  risk: 'medium',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('storage.upload', input);
}
