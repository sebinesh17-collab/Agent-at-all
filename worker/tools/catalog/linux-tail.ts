import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.tail',
  title: "Tail log",
  description: "Reads the end of a log file.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.tail', input);
}
