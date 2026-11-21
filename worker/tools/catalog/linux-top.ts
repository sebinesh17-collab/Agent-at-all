import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.top',
  title: "Resource snapshot",
  description: "Returns a process and resource snapshot.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.top', input);
}
