import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.awk',
  title: "Process text",
  description: "Processes line-oriented text in the workspace.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.awk', input);
}
