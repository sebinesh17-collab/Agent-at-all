import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'agents.status',
  title: "Read agent status",
  description: "Reads per-agent job state and output.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('agents.status', input);
}
