import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'terminal.files',
  title: "Linux filesystem operations",
  description: "Runs safe file and directory operations in the isolated container.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('terminal.files', input);
}
