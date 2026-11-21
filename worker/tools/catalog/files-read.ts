import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'files.read',
  title: "Read workspace file",
  description: "Reads a file by safe workspace-relative path.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('files.read', input);
}
