import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.rm',
  title: "Remove file",
  description: "Removes a file inside the isolated workspace.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.rm', input);
}
