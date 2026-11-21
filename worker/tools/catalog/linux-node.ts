import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.node',
  title: "Run Node.js",
  description: "Executes Node.js scripts in the isolated container.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.node', input);
}
