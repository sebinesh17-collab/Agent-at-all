import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.cat',
  title: "Read file",
  description: "Reads a text file from the workspace.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.cat', input);
}
