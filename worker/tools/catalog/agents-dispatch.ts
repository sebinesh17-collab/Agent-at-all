import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'agents.dispatch',
  title: "Dispatch agents",
  description: "Queues a task for selected specialist agents.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('agents.dispatch', input);
}
