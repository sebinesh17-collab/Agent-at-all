import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'agent.delete',
  title: "Delete agent",
  description: "Deletes a custom agent definition.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('agent.delete', input);
}
