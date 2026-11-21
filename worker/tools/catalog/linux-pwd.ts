import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.pwd',
  title: "Print working directory",
  description: "Returns the Linux working directory.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.pwd', input);
}
