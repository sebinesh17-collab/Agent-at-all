import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'workflow.pause',
  title: "Pause workflow",
  description: "Pauses a workflow between task steps.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('workflow.pause', input);
}
