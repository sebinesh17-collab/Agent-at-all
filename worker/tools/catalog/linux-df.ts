import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.df',
  title: "Disk usage",
  description: "Reports container disk usage.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.df', input);
}
