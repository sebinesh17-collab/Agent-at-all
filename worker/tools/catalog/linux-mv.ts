import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.mv',
  title: "Move file",
  description: "Moves a workspace file.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.mv', input);
}
