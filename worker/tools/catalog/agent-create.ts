import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'agent.create',
  title: "Create agent",
  description: "Creates a custom agent definition.",
  risk: 'medium',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('agent.create', input);
}
