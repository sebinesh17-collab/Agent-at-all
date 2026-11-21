import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'workflow.cancel',
  title: "Cancel workflow",
  description: "Cancels a queued workflow.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('workflow.cancel', input);
}
