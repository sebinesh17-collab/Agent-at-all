import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'files.delete',
  title: "Delete workspace file",
  description: "Deletes a workspace file after explicit confirmation.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('files.delete', input);
}
