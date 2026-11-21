import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.node.version',
  title: "Node version",
  description: "Returns the installed Node.js version.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.node.version', input);
}
