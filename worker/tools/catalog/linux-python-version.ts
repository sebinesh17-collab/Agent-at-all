import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.python.version',
  title: "Python version",
  description: "Returns the installed Python version.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.python.version', input);
}
