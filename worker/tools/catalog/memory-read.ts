import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'memory.read',
  title: "Read memory",
  description: "Retrieves approved project memory.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('memory.read', input);
}
