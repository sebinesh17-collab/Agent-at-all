import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'agent.update',
  title: "Update agent",
  description: "Updates an agent prompt, tools, or model binding.",
  risk: 'medium',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('agent.update', input);
}
