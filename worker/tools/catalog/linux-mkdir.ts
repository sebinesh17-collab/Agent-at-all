import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.mkdir',
  title: "Create directory",
  description: "Creates a directory safely.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.mkdir', input);
}
