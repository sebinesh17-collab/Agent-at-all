import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'package.list',
  title: "List dependencies",
  description: "Lists installed project dependencies.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('package.list', input);
}
