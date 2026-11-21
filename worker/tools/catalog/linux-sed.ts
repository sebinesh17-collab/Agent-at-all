import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.sed',
  title: "Edit text",
  description: "Performs bounded text replacement in a workspace file.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.sed', input);
}
