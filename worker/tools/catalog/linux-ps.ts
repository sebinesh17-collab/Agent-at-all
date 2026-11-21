import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.ps',
  title: "List processes",
  description: "Lists processes inside the container.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.ps', input);
}
